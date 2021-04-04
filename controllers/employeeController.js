const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
//const employeeController = require('./utils.js')
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

router.post('/', (req, res,next) => {
    



     if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});
    


function insertRecord(req, res) {
    const employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.password = req.body.password;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
   // employee.encryptedPassword(employeeController);
    //hash
   // const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    //employee: hashedPassword =hashedPassword
    const securePassword = async (password) =>{
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        console.log(passwordHash);
    }
    securePassword('ya');
    
    

    
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body,
                    
                    //hash
                 //  employee: hashedPassword =hashedPassword
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}
//hash password code



function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                    
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
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

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;