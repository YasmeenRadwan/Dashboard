import mongoose from "mongoose";
const {Schema , model} = mongoose;

const categorySchema = new Schema ({
    name : {
        type : String,
        required : [true, "name is required"],
        unique : true,
        lowercase : true,
        minlength : [3, "must be at least 3 characters long"],
        maxlength : [30, "must not be more than 30 characters long"]
    },
},
{timeStamps : true})

export const Category = mongoose.model.Category || model("Category" ,categorySchema);