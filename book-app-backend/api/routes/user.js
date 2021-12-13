const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


router.post('/sign-up', (req, res, next) => {
    //checking is users exists
    console.log(req.body.email);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    "message": "email already exist"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        //creating a user
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            user_type: 'user'
                        })
                        user.save()
                            .then(result => {
                                console.log("Save Response", result);
                                res.status(201).json({
                                    message: "User Added Successfully!"
                                });
                            })
                            .catch(err => {
                                console.log("Error in Adding User", err);
                                res.status(500).json({
                                    message: "Failed to Create User",
                                    error: err
                                });
                            });
                    }

                })

            }
        });
});

router.post('/admin-signup', (req, res, next) => {
    console.log("Email: ", req.body.email);
    User.find({ email: req.body.email })
        .exec().then(user => {
            if (user.length > 1) {
                return res.status(409).json({
                    message: "Email Already Exist"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Internal server Error",
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            user_type: 'admin'
                        })
                        user.save()
                            .then(result => {
                                console.log("Save Response", result);
                                res.status(201).json({
                                    message: "Admin Added Successfully!"
                                });
                            })
                            .catch(err => {
                                console.log("Error in Adding User", err);
                                res.status(500).json({
                                    message: "Failed to Create User",
                                    error: err
                                });
                            });
                    }
                })
            }
        })


})

router.post('/login', (req, res, next) => {
    console.log("Email: ", req.body.email);
    console.log("Password: ", req.body.password);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth Failure as user does not exist"
                });
            }
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth Failure"
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                            password: user[0].password

                        },
                            'secret',
                            {
                                expiresIn: "1h"
                            }
                        )
                         return res.status(200).json({
                             message:"Login Successful",
                             user_type:user[0].user_type,
                             token: token
                         });
                    }
                    res.status(401).json({
                        message:"Failed to Login"
                    });
                }).catch(err =>{
                    console.log("Fail Error: ",err)
                    res.status(500).json({
                        message:"Internal Serve Error",
                        error:err
                    });
                });
            
        });
});

module.exports = router;