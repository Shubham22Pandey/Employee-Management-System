const mongoose = require('mongoose');

var workSchema = new mongoose.Schema({
    date: {
        type: {Date: String}
    },
    // task: {
    //     type: String
    // }
});

var employeeSchema = new mongoose.Schema({
    idno: {
        type:String
    },
    createid:{
        type:String
    },
    fullName: {
        type:String,
        required: 'This field is required.'
    },
    email:{
        type:String
    },
    mobile: {
        type:String
    },
    city: {
        type:String
    },
    salary: {
        type: Number
    },
    work: [{date: Date, task: String}]
});
//custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
},'Invalid e-mail.');


mongoose.model('Employee',employeeSchema);