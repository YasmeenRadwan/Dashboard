import mongoose from "mongoose";
const {Schema , model} = mongoose;

const aboutSchema = new Schema ({
    desc : {
        type : String,
        required : [true, "Desc is required"],
        unique : true,
        lowercase : true,
        minlength : [10, "must be at least 10 characters long"],
        maxlength : [600, "must not be more than 50 characters long"]
    },
    image : {
        secure_url : {
            type : String,
            required : true
        },
        public_id : {
            type : String,
            required : true,
            unique : true
        }
    },
    customId :{
        type : String,
        required : true,
        unique : true
    }

},
{timeStamps : true})

export const About = mongoose.model.About || model("About" ,aboutSchema);