const nedb = require('nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Users {

    constructor(dbFilePath, name) {
        if(dbFilePath){
            this.db = new nedb({ filename: 'user.db', autoload: true });
            console.log(name, 'connected to ' + dbFilePath); 
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

    update(userID, newName){
        const that = this 
        const id=userID._id

        that.db.update( {_id:id }, { $set: { "user":newName } }, {}, (req,res) => {
            that.db.loadDatabase()
            console.log(`User id: ` + id + ` updated to ` + newName);
        });
    
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

    newUser(username, password){
        bcrypt.hash(password, saltRounds).then((hash) => {
            var entry = {
                user: username,
                password: hash,
                dateCreated: new Date().toISOString().split('T')[0]
            };
            this.db.insert(entry, (err) => {
                if(err){
                    console.log("Can't insert user: ", username);
                }
            });
        });
    }
    
    lookup(user, cb) {
        const that = this;
        that.db.loadDatabase();
        that.db.find({'user':user}, (err, entries) => {
            if(err){
                return cb(null, null);
            } else {
                if(entries.length == 0){
                    return cb(null, null);
                } return cb (null, entries[0]);
            }
        });
    }


}

module.exports = Users;