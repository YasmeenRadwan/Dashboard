import joi from 'joi';
///////////////// forget Password Schema ///////////////
export const forgetPasswordSchema= {
    body : joi.object( {
        newPassword : joi.string().min(6).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/),
        email : joi.string().email().required().lowercase().messages({"any.required" : " You must enter Email "}),
        otp : joi.string().required()
        })
}

//////////////////// update account schema ////////////////

export const resetPasswordSchema= {
    body : joi.object( {
        newPassword : joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/),
        currentPassword : joi.string().min(6).required()
    })
}
