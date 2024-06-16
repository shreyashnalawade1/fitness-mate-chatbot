const pool = require("../config/dbconnect");
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const {promisify}=require('util');
const moment=require('moment-timezone');

const customError = require("../utils/customError");
const tryCatch = require("../utils/tryCatch");
const jwt=require('jsonwebtoken');

// siging token 
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
// creating jwt token and sending cookie 
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user.id);
  
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    //   cookie cannot be accessed by client side js 
      httpOnly: true,
    //  send cookie over http connection only  
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
      secure: false
    });
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
//   signup
module.exports.signup=tryCatch(async(req,res,next)=>{
    const {email,name,password,confirmPassword}=req.body;
    if(password!==confirmPassword){
        return next(new customError("Confirm Password and Password do not match!",400));
    }
   const result=await  pool.query("SELECT * FROM users WHERE email=$1",[email]);
  if(result.rowCount>0){
    return next(new customError("Email already exits in the database",400));
  }

  const salt=await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(password,salt);
  const createdResult=await pool.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email,createdat',[name,email,hashedPassword]);

  return createSendToken(createdResult.rows[0],201,req,res);
})
// sigin
module.exports.signin=tryCatch(async(req,res,next)=>{
    const {email,password}=req.body;
    const result=await pool.query('SELECT id,name,email AS emailDB,password AS passwordDB FROM users WHERE email=$1',[email]);
    if(result.rowCount<=0){
        return next(new customError('No user find with provided email!',400));
    }

    const {id,emaildb,name,passworddb}=result.rows[0];
    const passwordCorrect=await bcrypt.compare(password,passworddb);
    
    if(!passwordCorrect){
        return next(new customError('No password do not match!',400));
    }
    return createSendToken({id,emaildb,name},200,req,res);
});

// function to check if password was changed after the users 
const changedPasswordAfter=(iat,changedPasswordAfter)=>{
    return new Date((iat+10)*1000)<changedPasswordAfter;
}
exports.protect = tryCatch(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return next(
        new customError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    // 3) Check if user still exists
    const currentUser = await pool.query('SELECT id,name,email,password_changed_at FROM users WHERE id=$1',[decoded.id]);

    if (currentUser.rowCount<=0) {
      return next(
        new customError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
    // 4) Check if user changed password after the token was issued
    if (changedPasswordAfter(decoded.iat,currentUser.rows[0].password_changed_at)) {
      return next(
        new customError('User recently changed password! Please log in again.', 401)
      );
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser.rows[0];
    next();
  });


  exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  };

  const createPasswordResetToken =  function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
  
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return {passwordResetToken,resetToken,passwordResetExpires};
  };


  
exports.resetPassword = tryCatch(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user =await pool.query('SELECT * FROM users WHERE passwordresettoken=$1 AND passwordresetexpires>CURRENT_TIMESTAMP',[hashedToken]) 
    // 2) If token has not expired, and there is user, set the new password
    if (user.rowCount<=0) {
      return next(new customError('Token is invalid or has expired', 400));
    }
    const {password,confirmPassword}=req.body;
    if(password!=confirmPassword){
        return next(new customError("Confirm Password and Password do not match!",400));
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const createdResult=await pool.query('UPDATE users  SET password=$1,passwordresettoken=NULL   WHERE email=$2 RETURNING id,name,email,createdat',[hashedPassword,user.rows[0].email]);
    return createSendToken(createdResult.rows[0],201,req,res);
  });
  

  
exports.forgotPassword = tryCatch(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await pool.query('SELECT * FROM users WHERE email=$1',[req.body.email]);
    console.log(user)
    if (user.rowCount<=0) {
      return next(new customError('There is no user with email address.', 404));
    }
  
    // 2) Generate the random reset token
    const {passwordResetToken,resetToken,passwordResetExpires} = createPasswordResetToken();
    // 3) Set this params to db 
    const result=await pool.query('UPDATE users SET passwordResetToken=$1, passwordResetExpires=$2 WHERE email=$3',[passwordResetToken,new Date(passwordResetExpires),req.body.email]);

    // 4) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/resetPassword/${resetToken}`;
  
      res.status(200).json({
        resetURL,
        status: 'success',
        message: 'Token sent to email!'
      });
  });



  exports.updatePassword = tryCatch(async (req, res, next) => {
    // 1) Get user from collection
    const {email,password,updatePassword,updatePasswordConfirm}=req.body;
    const result=await pool.query('SELECT id,name,email AS emailDB,password AS passwordDB FROM users WHERE email=$1',[email]);
    if(result.rowCount<=0){
        return next(new customError('No user find with provided email!',400));
    }

    const {id,emaildb,name,passworddb}=result.rows[0];
    
    const passwordCorrect=await bcrypt.compare(password,passworddb);
    
    if(!passwordCorrect){
        return next(new customError('No password do not match!',400));
    }



    // 3) If so, update password
    if(updatePassword!==updatePasswordConfirm){
        return next(new customError("password and confirm password do not match",401));
    }
    // User.findByIdAndUpdate will NOT work as intended!
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(updatePassword,salt);
    const createdResult=await pool.query('UPDATE users  SET password=$1,passwordresettoken=NULL   WHERE email=$2 RETURNING id,name,email,createdat',[hashedPassword,emaildb]);
    // 4) Log user in, send JWT
    return createSendToken(createdResult.rows[0],201,req,res);
  });