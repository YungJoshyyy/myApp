const nedb = require('nedb');

class Goals {

    constructor(dbFilePath, name){
        if(dbFilePath){
            this.db = new nedb({ filename: 'goal.db', autoload: true });
            console.log(name, 'connected to ' + dbFilePath); 
        } else {
            this.db = new nedb();
        }
    } 

    init(){
        this.db.insert({
            Goal: 'Eat Healthier',
            Description: 'toor',
        });

        console.log('root inserted');
    }

    getAllEntries(user) {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
        //use the find() function of the database to get the data,
        //error first callback function, err for error, entries for data
        this.db.find({'userID':user}, function(err, entries) {
        //if error occurs reject Promise
        if (err) {
        reject(err);
        //if no error resolve the promise & return the data
        } else {
        resolve(entries);
        //to see what the returned data looks like
        console.log('function all() returns: ', entries);
        }
        })
        })
        }


    completeGoal(goalID) {
        const that = this;
        that.db.update({ _id: goalID }, { $set: { Achieved:true } }, {}, (req,res) => {
            console.log(`Updated, `,goalID)
        });
    }

    newGoal(goalName, goalDesc, userID){
            var entry = {
                Goal: goalName,
                Description: goalDesc,
                Achieved: false,
                userID: userID,
                dateAchieved: null,
                dateCreated: new Date().toISOString().split('T')[0]
            };

            this.db.insert(entry, (err) => {
                if(err){
                    console.log("Can't insert goal for :", goalName);
                }
            });
    }

    getGoalsByUser(user) {
        return new Promise((resolve, reject) => {
            this.db.loadDatabase()
            this.db.find({ 'userID': user }, function(err, entries) {
            if (err) {
                reject(err);
            } else {                
                resolve(entries);
                }
            });
        });
    }   

    getUserAchievements(entities) {
        return new Promise((resolve, reject) => {
            const achievements = entities.filter((entry) => {
                return entry.Achieved === true;
            });
            resolve(achievements);
        });
    }   


}

module.exports = Goals;