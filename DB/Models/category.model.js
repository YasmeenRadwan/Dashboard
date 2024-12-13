import mongoose from "mongoose";
const {Schema , model} = mongoose;
import {Offer} from './index.js';

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

// delete related offers when a category is deleted
categorySchema.pre("findOneAndDelete", async function (next) {
const categoryId = this.getQuery()._id; // Extract the _id of the category being deleted

// Delete all offers associated with this category
await Offer.deleteMany({ categoryId });

next();
});

export const Category = mongoose.model.Category || model("Category" ,categorySchema);