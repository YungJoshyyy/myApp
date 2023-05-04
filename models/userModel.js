const nedb = require('nedb');

class Users {

    constructor(dbFilePath) {
        if(dbFilePath){
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath); 
        } else {
            this.db = new nedb();
        }
    } 

    init(){
        this.db.insert({
            username: 'root',
            password: 'toor'
        });

        console.log('root inserted');
    }

    getAllEntries(){
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, entries for data
            this.db.find({}, function(err, entries) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                //if no error resolve the promise & return the data
                } else {
                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', entries);
                }
            });
        });
    }

    newUser(){
        
    }


}

module.exports = Users;