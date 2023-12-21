const express = require("express");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'HomeLyf API Testing',
        version: '1.0.0',
      },
      servers:[
        {
            url: 'http://192.168.43.78:3000'
        }
      ]
    },
    apis: ['./auth.js'], // files containing annotations as above
  };

const swaggerSpec = swaggerJSDoc(options);
authRouter.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user with the provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful registration. Returns the created user.
 *       400:
 *         description: User with the same email already exists.
 *       500:
 *         description: Internal server error.
 */
authRouter.post('/api/signup', async (req,res)=>{
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg: "User with same email already exist!"});
        }
        
        let user = new User({
            email,
            password,
            name,
        })
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Authenticate user.
 *     description: Authenticate a user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful authentication. Returns a JWT token and user data.
 *       400:
 *         description: User with this email does not exist or incorrect password.
 *       500:
 *         description: Internal server error.
 */
authRouter.post('/api/signin', async (req,res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: "User with this email does not exist!"});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Incorrect password."});
        }

        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


authRouter.post('/tokenIsValid', async (req,res)=>{
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.json(false);
        const verified = jwt.verify(token, 'passwordKey');
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        res.json(true);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
})

module.exports=authRouter;
