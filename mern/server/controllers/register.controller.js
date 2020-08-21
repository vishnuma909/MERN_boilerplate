const bcrypt = require('../../node_modules/bcryptjs');
const Users = require('../models/register.model');
const jwtToken = require('../../node_modules/jsonwebtoken');

module.exports = {
    create,
    generateToken,
    userlogin,
    cryptCompare,
    getUserData
}
//create a jwt token and return
function generateToken(user) {
    const payload = JSON.stringify(user);
    return jwtToken.sign(payload, 'JWT-TOKEN')
}
//user login, if user then compare hashedpassword with user loggedin password
async function userlogin(req) {
    try {
        var iscompare = false;
        const users = await Users.findOne({"email":req.email},(err, dbuser) =>{
            if(err) {
                console.log(err);
            }
        });
        if(users !== null) {
            iscompare = await cryptCompare(req,users);
            if(iscompare) {
                users.hashedPassword = '';
                return users;
            }else {
                return { error: 'Incorrect Credentials' }
            }
        }else {
            return {error: 'User Not Found'}
        }
    } catch (error) {
        return ({error: error})
    }
}
//comparing loggedin password with hashedpassword
async function cryptCompare (req,dbuser) {
    try {
        const isuser = await bcrypt.compare(req.password, dbuser.hashedPassword);
        if(isuser) {
            return true
        }else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}
//create user with hashedpassword and delete user password then save in db
async function create (user) {
    try {
        user.hashedPassword = await bcrypt.hashSync(user.password, 10);
        delete user.password;
        return await new Users(user).save();
    } catch (error) {
        return error;
    }
}
//return user data with id search
async function getUserData (id) {
    try{
        if(id) {
            let user = await Users.find({_id: id},(error, item)=>{
                if(error) {
                    return new Error(error)
                }else {
                    return item;
                }
            })
            return user;
        }
    }catch (err) {
        new Error(err)
    }
}