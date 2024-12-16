import mongoose from "mongoose";
//import { hashSync} from "bcrypt";
const {Schema , model} =mongoose;

const userSchema=new Schema(
    {
        userName:{
            type:String,
            required:true,
            lowercase : true 
        },
        email:{
            type:String,
            lowercase: true,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            min:6
        },
        sessionId: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
          },
        ],
        otp: { type: String },
        otpExpires: { type: Date }
    },
    {
        Timestamp:true
    }
)

userSchema.pre('save', async function (next) {
  
  // Convert email to lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }

  next();
});
/*
userSchema.pre('save', async function (next) {
 
    if(this.isModified('password')){
      this.password=hashSync(this.password,+process.env.SALT_ROUNDS);
    }
    next();
  });

*/


export default mongoose.models.User || model("User", userSchema)