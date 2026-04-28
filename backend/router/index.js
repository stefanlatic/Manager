const express = require('express');
const User = require('../models/User');

const router = express.Router();

// register route
router.post('/register',async (req,res) => {
    try {
        const {username,email,password} = req.body;
        const user = await User.create({username,email,password})
        console.log(user)
        res.json(user);
    }catch (e) {
        res.status(400).json({message: e.message});
    }
});

// login route
router.post('/login',async (req,res) => {
    try {
        const {email,password} = req.body;
        console.log(email, password);
        const user = await User.findOne({email, password});
        if(user){
    console.log('Radi backend');
            req.session.user = user;
            res.json({user});
        }else {
            res.status(400).json({message: 'Invalid credentials'});
        }
    }catch (e) {
        res.status(400).json({message: e.message});
    }
});

router.get('/me', (req,res) => {
    if(req.session.user){
        res.json({user: req.session.user});
    }else {
        res.status(401).json({message: 'Not authenticated'});
    }
})

router.post('/logout', (req,res) => {
    req.session.destroy((err) => {
        if(err){
            res.status(500).json({message: 'Logout failed'});
        }else {
            res.json({message: 'Logged out successfully'});
        }
    });
});


module.exports = router;