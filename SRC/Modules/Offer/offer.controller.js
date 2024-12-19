import { errorHandlerClass } from "../../utils/error-class.utils.js";
import {cloudinaryConfig} from "../../utils/cloudinary.utils.js"
import {Offer} from "../../../DB/Models/offer.model.js";
import {Category} from "../../../DB/Models/category.model.js";

export const createOffer = async(req, res, next) => {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(new errorHandlerClass("Category not found.", 404, "Category not found."));
    }
    if (!req.file) {
        return next(new errorHandlerClass('Please upload an Image.',400,'Please upload an Image.'));
    }

    const originalName = req.file.originalname.split('.').slice(0, -1).join('.');
    const uniqueName = `${originalName}-${Date.now()}`;

    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
      folder: `${process.env.UPLOADS_FOLDER}/Offers`,
      public_id: uniqueName,
    });

    //prepare offer object
    const newOffer = new Offer({
      image: { secure_url, public_id},
      categoryId :category._id,
    });

    // Save to the database
    await newOffer.save();
  
    res.status(200).json({
        status : "success",
        message : "offer created successfully",
        data: {
          id: newOffer._id,
          secure_url: newOffer.image.secure_url,
      },});
}

////////////////////////////// get offer///////////////////////////////////////
export const getAllOffers = async(req, res, next) => {
    const offers = await Offer.find();
    if(offers.length === 0){
        return next(new errorHandlerClass('offer not found',404,'offer not found'));
    }
    res.status(200).json({
        status: "success",
        data: offers
    })
}
////////////////////////////// get Category Offers///////////////////////////////////////
export const getCategoryOffers = async(req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return next(new errorHandlerClass('Category ID is required', 400, 'Invalid input'));
  }
  const offers = await Offer.find({categoryId});
  if(offers.length === 0){
      return next(new errorHandlerClass('No offers for this Category',404,'No offers for this Category'));
  }
  res.status(200).json({
      status: "success",
      data: offers
  })
}
//////////////////////////// update offer/////////////////////////////////
export const updateOffer = async(req, res , next) => { 
    const {_id}= req.params ;
    const offer = await Offer.findById(_id);
    console.log("offer",offer);
    
    if(!offer){
        return next(new errorHandlerClass('offer not found',404,'offer not found'));
    }

    if (req.file) {
      // Extract the current public_id 
      const currentPublicId = offer.image.public_id;

      // Delete the existing image from Cloudinary
      if (currentPublicId) {
          await cloudinaryConfig().uploader.destroy(currentPublicId);
      }

      const originalName = req.file.originalname.split('.').slice(0, -1).join('.');
      const uniqueName = `${originalName}-${Date.now()}`;
  
      const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder: `${process.env.UPLOADS_FOLDER}/Offers`,
        public_id: uniqueName,
      });
  
      // Update the image properties 
      offer.image.secure_url = secure_url;
      offer.image.public_id = public_id;
  }
      // save the offer 
      await offer.save();
    
      res.status(200).json({
        status: "success",
        message: "offer updated successfully",
        data: {
          id: offer._id,
          secure_url: offer.image.secure_url,
      },});
    };

////////////////////////////delete offer//////////////////////////
export const deleteOffer = async(req,res,next) =>{
  const {_id} = req.params;
  const offer = await Offer.findByIdAndDelete(_id);
  if(!offer){
    return next(new errorHandlerClass(`offer not found`,404,`offer not found`));
  }

  // Delete the specific image from Cloudinary
  if (offer.image && offer.image.public_id) {
  await cloudinaryConfig().uploader.destroy(offer.image.public_id);
 }

  res.status(200).json({
    status: "success",
    message: "offer deleted successfully",
    data: offer
  })
}