import User from "../../../DB/Models/user.model.js";
import Session from "../../../DB/Models/session.model.js";
import { sendEmailService } from "../../Services/send-email.service.js";
import { v4 as uuidv4 } from "uuid";
import { errorHandlerClass,generateJWT } from "../../utils/index.js";

/////////////////////// signIn with userName and password //////////////////////////
export const signIn=async(req,res,next)=>{
   
        const{userName,password}=req.body;
        const user =await User.findOne({userName});
        
        if (!user){
            return next(new errorHandlerClass("Invalid Credentials",401,"Invalid Credentials",{userName}))
        }
        if (password !== user.password) {
            return next(new errorHandlerClass("Invalid Credentials", 401, "Invalid Credentials", { userName }));
          }

        const sessionId = uuidv4();

        const session = new Session({
          sessionId,
          userId: user._id,
        });

        await session.save();

        user.sessionId[0]
          ? user.sessionId.push(session._id)
          : (user.sessionId = [session._id]);
          console.log(user);

        await user.save();
        // Generate a JWT token for the user with their ID and secret signature
        const token = generateJWT(user._id, sessionId);

        res.status(200).json({ message: "Logged In Successfully", token, user: user });
};

//////////////////////////////////  Update password   ////////////////////////////////////

export const resetPassword = async (req,res,next) => {
    const { _id } = req.authUser;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(_id);
    if (!user) {
        return next(new errorHandlerClass("User not found", 404, "User not found"));
    }

    if (currentPassword !== user.password) {
        return next(new errorHandlerClass("Incorrect current password", 401, "Incorrect current password"));
          
    }
    const updatedUser = await User.findByIdAndUpdate(_id, { password: newPassword }, { new: true });

    if (!updatedUser) {
        return next(new errorHandlerClass("Error in updating password", 500,"Error in updating password",user.firstName))
    }
    res.status(200).json({ message: "Password updated successfully", user:updatedUser.firstName});
}

//////////////////////////////////  OTP password   ////////////////////////////////////
export const otpPassword = async (req,res,next) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        return next(new errorHandlerClass("Email not found", 404, "Email not found"))
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = Date.now() + 3600000; // 1 hour (1 hour = 60 minutes = 3,600,000 milliseconds)

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // send OTP via email
    const isEmailSent= await sendEmailService({
        to:email,
        subject:'Password Reset OTP',
        textMessage:`Your OTP is ${otp}`
    })

    if(isEmailSent.rejected.length) {
        return res.json("Verification Failed")
    }
     res.status(200).json({message:"OTP sent successfully"})
    }

/////////////////////////////////////forgetPassword////////////////////////////////////
    export const forgetPassword = async (req, res, next) => {
    const { email, otp,newPassword } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    
        if (!user) {
        return next(new errorHandlerClass("Invalid or expired OTP", 404, "Invalid or expired OTP"))
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();
    
        res.status(200).json({message:'Password reset successfully'});
    }

