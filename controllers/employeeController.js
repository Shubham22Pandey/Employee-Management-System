const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const passport = require('passport');
const User = mongoose.model('user');


router.get('/',isAuthenticated, (req,res) => {
    res.render("employee/addOrEdit",{
        viewTitle : "Insert Employee"
    });
});

router.post('/',isAuthenticated,(req,res) => {
    if(req.body._id == '')
        insertRecord(req,res);
        else{
            
                updateRecord(req,res);
        }
});

function insertRecord(req,res){
    var employee = new Employee();
    employee.idno = req.user.email;
    employee.createid = req.user.email;
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        if(!err)
            res.redirect('employee/list');
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("employee/addOrEdit",{
                    viewTitle : "Insert Employee",
                    employee: req.body
            });
            }
            else
                console.log('Error during record insertion:'+ err);
        }
    });

}

function updateRecord(req,res){
    Employee.findOneAndUpdate({_id:req.body._id}, req.body, { new: true},(err, doc ) => {
        if(!err){res.redirect('employee/list');}
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit",{
                    viewTitle: 'update Employee',
                    employee: req.body,

                });
            }
            else
                console.log('Error during record update:' + err);
        }
    });

    Employee.findOneAndUpdate({_id:req.body._id}, {$set:{idno:req.user.email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
}

router.get('/list',isAuthenticated,(req,res) => {
    Employee.find((err, docs) => {
        if(!err){
            res.render("employee/list",{
                
                list: docs

            });
        }
        else{
            console.log('Error in retrieving employee list :' + err);
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
    Employee.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render("employee/addOrEdit",{
                viewTitle: "Update Employee",
                employee: doc
            })
        }
    });
});
router.get('/delete/:id',isAuthenticated,(req,res) => {
    Employee.findByIdAndRemove(req.params.id,(err, doc) =>{
        if(!err){
            res.redirect('/employee/list');
        }
        else {console.log('Error in employee delete:' + err);}
    });
});

module.exports = router;





