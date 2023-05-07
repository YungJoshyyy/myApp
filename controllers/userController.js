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

    console.log(gd, "sucessfully added for user ", usrnme);

    res.redirect('/account');

}
exports.cgp = (req, res) => {
    res.render('goal', {
        title: 'New Goal'
    });
}

exports.completeGoal = (req,res)=>{
    const goalID = req.body.goalID

    console.log(`GOALID IS `, goalID)

    goaldb.completeGoal(goalID);
    res.redirect('/account');
}



exports.accountpage = function (req, res) {
    let usrnme = req.cookies.username
    let dateCookie = req.cookies.accountDate
    let recentGoal = req.cookies.rg

    goaldb.getGoalsByUser(usrnme).then((entries, filteredGoal) => {
        return goaldb.getUserAchievements(entries).then((achievements) => {
            return {
                entries: entries,
                achievements: achievements
            };
        });
        }).then((data) => {

            console.log(`entries-`, data.entries);
            console.log(`achievments-`, data.achievements);
            const notAchieved = data.entries.filter((entry) => entry.Achieved === false);
            const Achieved = data.achievements.filter((entry) => entry.Achieved);

            res.render("user/account", {
                title: 'Account',
                cardusername: usrnme,
                accCreated: dateCookie,
                goals: notAchieved,
                achievements: data.achievements,
                GoalSet: notAchieved.length,
                GoalsAchieved: data.goalsAchieved,
                latestGoal: recentGoal,
                GoalsCompleted: Achieved.length
            })
        })
}

/*
res.send(entries)

res.render("user/account", {
    title: 'Account',
    cardusername: usrnme,
    accCreated: dateCookie,
    goals: entries,
    GoalSet: entries.length,
    latestGoal: recentGoal,
    GoalsCompleted: achievements.length

/* Trying to get achieved goals
exports.accountpage = function (req, res) {
    let usrnme = req.cookies.username
    let dateCookie = req.cookies.accountDate
    let recentGoal = req.cookies.rg

    goaldb.getGoalsByUser(usrnme).then((entries) => {

        let entryLength = entries.length

        goaldb.getAchievementsByUser(entries).then((achievements) => {
            console.log("ENTRIES+", entries)
            res.render("user/account", {
                title: 'Account',
                cardusername: usrnme,
                accCreated: dateCookie,
                goals: entries,
                GoalsAchieved: entries.length,
                latestGoal: recentGoal,
                GoalsCompleted: '10',
            })

        })

    });
*/



exports.handle_login = (req, res) => {
    res.redirect('/account');
}

exports.post_reg = (req, res) => {

    const user = req.body.username;
    const pass = req.body.pass;

    if(!user || !pass){
        res.send(401, 'No Username OR Password');
        return;
    }

    userdb.lookup(user, (err, u) => {

        if(u) {
            res.send(401, "User Exists", user);
            return;
        }

        userdb.newUser(user, pass);
        console.log("User:", user, "Registered! \npassword", pass);
        res.redirect('/login');
    });
}

exports.logout = function (req, res) {
    res.clearCookie("jwt").clearCookie("username").clearCookie("accountDate").clearCookie("rg").status(200).redirect("/");
};



// exports.allUsers = (req, res) => {
//     db.getAllEntries().then((list) => {

//     })
// }
