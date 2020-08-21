const express = require('../../node_modules/express');
const passport = require('../../node_modules/passport');
const asyncHandler = require('../../node_modules/express-async-handler');
const registerctrl = require('../controllers/register.controller')
const router = express.Router();

module.exports = router;

//router.<method>('<api url>',<middleware>, <function>);
router.post('/register',asyncHandler(create), login);
router.post('/login', asyncHandler(userlogin));
router.get('/me',passport.authenticate('jwt',{session: false}), login);
router.get('/me/:id',getUser)
//register user and login
async function login(req, res) {
    try {
        let user = req.user;
        let token = await registerctrl.generateToken(user)
        res.json({user, token})
    } catch (error) {
        console.log(error)
    }
}
//user login
async function userlogin(req, res) {
    try {
        const user = await registerctrl.userlogin(req.body);
        if(user.email) {
            delete user.hashedPassword;
            let token = await registerctrl.generateToken(user);
            res.json({user, token});
        }else if(user.error) {
            res.json({success: false, message: user.error});
        }else {
            res.json({success: false, message: user.error});
        }
    } catch (error) {
        console.log(error)
    }
}
//middleware for creating user
async function create(req, res, next) {
    try {
        let user = await registerctrl.create(req.body);
        if(user) {
            user.hashedPassword = '';
            req.user = user;
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
//get user details
async function getUser(req, res, next) {
    try{
        let user = await registerctrl.getUserData(req.params.id);
        if(user) {
            if(user.length) {
                user[0].hashedPassword = ''
            }
            res.json({success: true, user: user})
        }
    }catch (error) {
        new Error(error);
    }
}