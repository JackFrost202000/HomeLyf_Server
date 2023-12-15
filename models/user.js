const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        required: true,
        type:String,
        trim:true,
        validate:{
            validator: (value)=>{
                const re =  /^[a-zA-Z\ ]+[a-zA-Z\ ]+[a-zA-Z]+$/;
                return value.match(re);
            },
            message:'Please enter a valid name'
        },
    },
    email:{
        required:true,
        type:String,
        trim:true,
        validate:{
            validator: (value)=>{
                const re = /^[a-z0-9\.]+@([a-z0-9]+\.)+[a-z0-9]{2,4}$/;
                return value.match(re);
            },
            message:'Please enter a valid email address'
        },
    },
    password:{
        required:true,
        type:String,
    },
    address:{
        type:String,
        default:'',
    },
    type:{
        type:String,
        default:'user',
    },
    //cart
});

const User = mongoose.model("User", userSchema);
module.exports = User;
