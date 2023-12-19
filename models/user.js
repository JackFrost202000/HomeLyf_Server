const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

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
                const re = /^[a-z0-9\.]+@([a-z0-9]+\.)+[a-z0-9]{2,}$/;
                return value.match(re);
            },
            message:'Please enter a valid email address, only contain letters(a-z), number(0-9), and periods(.) are allowed.'
        },
    },
    password: {
        required: true,
        type: String,
        validate: {
            validator: (value) => {
                const validationConditions = [
                    {
                        condition: /[A-Z]/.test(value),
                        message: 'include at least one uppercase letter'
                    },
                    {
                        condition: /[a-z]/.test(value),
                        message: 'include at least one lowercase letter'
                    },
                    {
                        condition: /\d/.test(value),
                        message: 'include at least one digit'
                    },
                    {
                        condition: /[!@#$%^&*()_+={};':"<>?~]/.test(value),
                        message: 'include at least one special character'
                    },
                    {
                        condition: /^\S*$/.test(value),
                        message: 'remove spaces'
                    },
                    {
                        condition: value.length >= 8,
                        message: 'make it at least 8 characters long'
                    },
                    // Add additional conditions if needed...
                ];

                const failedConditions = validationConditions.filter((condition) => !condition.condition);

                if (failedConditions.length > 0) {
                    const errorMessages = failedConditions.map((condition) => `Please ${condition.message}`).join(' and ');
                    throw new Error(errorMessages);
                }

                return true;
            },
        },
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const hashedPassword = await bcryptjs.hash(this.password, 8);
            this.password = hashedPassword;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;