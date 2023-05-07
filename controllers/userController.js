const users = require('../models/userModel');
const userdb = new users('user.db', "UserController.js");
const goals = require('../models/goalsModel');
const goaldb = new goals('goals.db', "UserController.js");

exports.homepage = (req,res) => {

    res.render('home', {
        title: 'Home',
    });
}

exports.registerpage = (req,res) => {
    res.render('user/register', {
        title: 'Register'
    })
}

exports.loginpage = (req,res) => {
    res.render('user/login', {
        title: 'Login'
    });
    
}

exports.aboutpage = (req, res) => {

    res.render('about', {
        title: 'About Us'
    });
}

exports.post_goal = (req, res) => {

    let gn = req.body.goalName
    var gd = req.body.goalDesc
    var achieveDefault = false;
    let usrnme = req.cookies.username
    let dateCookie = req.cookies.accountDate
    

    goaldb.newGoal(gn, gd, usrnme);
    res.cookie('rg', gn);

    console.log("Goal '" + gd + "' sucessfully added for user ", usrnme);

    res.redirect('/account');

}
exports.cgp = (req, res) => {
    res.render('goal', {
        title: 'New Goal'
    });
}

exports.completeGoal = (req,res)=>{
    let goalID = req.body.goalID
    let delID = req.body.deleteID 
    let goalTitle = req.body.goalTitle

    if(delID){
        goaldb.delGoal(delID);
        res.redirect('/account');
    } else if(goalID){
        if(req.cookies.rg === goalTitle){
            res.clearCookie('rg');
        }
        goaldb.completeGoal(goalID);
        res.cookie("recAch", goalTitle)
        res.redirect('/account');
    }


}

exports.removeGoalRC = (req,res)=>{
    const delID = req.body.deleteID 
    const goalID = req.body.achievementID 
    const achievementTitle = req.body.achievementTitle
    if(delID){
        goaldb.delGoal(delID)
        res.redirect('/account');
    } else if(goalID){
        //res.cookie("rg", achievementTitle);
        goaldb.removeGoalComplete(goalID);
        res.clearCookie("recAch")
        res.redirect('/account');
    }
}

exports.updateProfile = (req,res)=>{


        const usrID = req.cookies.username
        const newUsrnme = req.body.newUsername

    // userdb.update(currName,newUsrnme )

    userdb.lookup(usrID, (err, u) => {
        userdb.update(u, newUsrnme);
        res.cookie("username", newUsrnme)
        res.redirect('/account');
        

    })
}



exports.accountpage = function (req, res) {
    let usrnme = req.cookies.username
    let dateCookie = req.cookies.accountDate
    let recentGoal = req.cookies.rg
    let recAch = req.cookies.recAch

    goaldb.getGoalsByUser(usrnme).then((entries) => {
        return goaldb.getUserAchievements(entries).then((achievements) => {
            return {
                entries: entries,
                achievements: achievements
            };
        });
        }).then((data) => {

            //console.log(`entries-`, data.entries);
            //console.log(`achievments-`, data.achievements);
            const notAchieved = data.entries.filter((entry) => entry.Achieved === false);
            const ac = data.achievements

            res.render("user/account", {
                title: 'Account',
                cardusername: usrnme,
                accCreated: dateCookie,
                goals: notAchieved,
                achievements: data.achievements,
                GoalSet: notAchieved.length,
                newestAch: recAch,
                newestGoal: recentGoal,
                GoalsAchieved: data.goalsAchieved,
                GoalsCompleted: ac.length
            })
        })
}


exports.handle_login = (req, res) => {
    res.redirect('/account');
}

exports.post_reg = (req, res) => {

    const user = req.body.username;
    const pass = req.body.pass;

    if(!user || !pass){
        res.send(500);
        //res.render('500');
        return;
    }

    userdb.lookup(user, (err, u) => {

        if(u) {
            res.send(500)
            return;
        }

        userdb.newUser(user, pass);
        console.log("User:", user, "Registered! \npassword", pass);
        res.redirect('/login');
    });
}

exports.logout = function (req, res) {
    const cookies = ["jwt", "username", "recAch", "accountDate", "rg"];

    cookies.forEach(cookie => {
        console.log(cookie);
        res.clearCookie(cookie);
        console.log()
    })
    res.status(200).redirect("/");
};
