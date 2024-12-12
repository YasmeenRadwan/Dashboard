import mongoose from "mongoose";
const {Schema , model} = mongoose;

const offerSchema = new Schema ({
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
    categoryId:{
        type : Schema.Types.ObjectId,
        ref : 'Category'
    }
},
{timeStamps : true})

export const Offer = mongoose.model.Offer || model("Offer" ,offerSchema);