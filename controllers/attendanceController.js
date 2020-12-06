const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Attendance = mongoose.model('Attendance');
const Employee = mongoose.model('Employee');
const passport = require('passport');
const User = mongoose.model('user');


router.get('/',isAuthenticated, (req,res) => {
    console.log(Employee.find({}, {"fullName": 1, "_id": 0}));
    Employee.find({}, {"fullName": 1, "_id": 0}, (err, doc)=> {
        if(!err){
            res.render("attendance/addOrEditattendance",{
                viewTitle : "Insert Attendance",
                attendance: doc
            })
        }
    });
    // ({}, {"fullname":1});
});          

router.post('/',isAuthenticated,(req,res) => {
    if(req.body._id == '')
        insertRecord(req,res);
        else{
            
                updateRecord(req,res);
        }
});

function insertRecord(req,res){
    var attendance = new Attendance();
    attendance.idno = req.user.email;
    attendance.createid = req.user.email;
    attendance.fullName = req.body.fullName;
    attendance.email = req.body.email;
    attendance.date = req.body.date;
    attendance.attendance = req.body.attendance;
    attendance.save((err, doc) => {
        if(!err)
            res.redirect('attendance/listattendance');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                
                // console.log(temp);
                res.render("attendance/addOrEditattendance",{
                    viewTitle : "Insert attendance",
                    attendance: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

function updateRecord(req,res){
    Attendance.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('attendance/listattendance');}
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("attendance/addOrEditattendance",{
                    viewTitle: 'update Attendance',
                    attendance: req.body,

                });
            }
            else
                console.log('Error during record update:' + err);
        }
    });

    Attendance.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
}

router.get('/listattendance',isAuthenticated,(req,res) => {
    Attendance.find((err, docs) => {
        if(!err){
            res.render("attendance/listattendance",{
                
                listattendance: docs

            });
        }
        else{
            console.log('Error in retrieving attendance list :' + err);
        }
    });
});

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;

        }
    }
}


function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/')
  }
  


router.get('/:id',isAuthenticated, (req,res) => {
    Attendance.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("attendance/addOrEditattendance",{
                viewTitle: "Update Attendance",
                attendance: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Attendance.findByIdAndRemove(req.params.id,(err, doc) =>{
        if(!err){
            res.redirect('/attendance/listattendance');
        }
        else {console.log('Error in attendance delete:' + err);}
    });
});

module.exports = router;






