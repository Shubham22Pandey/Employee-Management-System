const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
// const EmployeeWithSalary = require('../models/employeeSalary');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({'email': email})
  console.log(user)
  if(user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
  console.log(newUser)
    await newUser.save();
    done(null, newUser);
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({email: email});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, user);
}));


//Pratik

// passport.serializeUser((userEmployee, done) => {
//   done(null, userEmployee.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const userEmployee = await EmployeeWithSalary.findById(id);
//   done(null, userEmployee);
// });


// passport.use('local-employee-signin', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, email, password, done) => {
//   const user = await EmployeeWithSalary.findOne({email: email});
//   if(!user) {
//     return done(null, false, req.flash('signinMessage', 'No User Found'));
//   }
//   if(!user.comparePassword(password)) {
//     return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
//   }
//   return done(null, user);
// }));
