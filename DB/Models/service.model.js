import mongoose from "mongoose";
const {Schema , model} = mongoose;

const serviceSchema = new Schema ({
    name : {
        type : String,
        required : [true, "service name is required"],
        unique : true,
        lowercase : true,
        minlength : [2, "must be at least 2 characters long"],
        maxlength : [15, "must not be more than 15 characters long"]
    },
    desc : {
        type : String,
        minlength : [10, "must be at least 10 characters long"],
        maxlength : [600, "must not be more than 600 characters long"]
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

export const Service = mongoose.model.Service || model("Service" ,serviceSchema);