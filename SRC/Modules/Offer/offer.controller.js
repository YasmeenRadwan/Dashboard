import { errorHandlerClass } from "../../utils/error-class.utils.js";
import {cloudinaryConfig} from "../../utils/cloudinary.utils.js"
import {nanoid} from "nanoid";
import {Offer} from "../../../DB/Models/offer.model.js";
import {Category} from "../../../DB/Models/category.model.js";

export const createOffer = async(req, res, next) => {

    const category = await Category.findById(req.query.categoryId);
    if (!category) {
        return next(new errorHandlerClass("Category not found.", 404, "Category not found."));
    }
    if (!req.file) {
        return next(new errorHandlerClass('Please upload an Image.',400,'Please upload an Image.'));
    }
    const customId=nanoid(4);
    
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
      folder: `${process.env.UPLOADS_FOLDER}/Offer/${customId}`,
    });

    //prepare offer object
    const newOffer = new Offer({
      image: { secure_url, public_id},
      customId,
      categoryId :category._id,
    });

    // Save to the database
    await newOffer.save();
  
    res.status(200).json({
        status : "success",
        message : "offer created successfully",
        data: newOffer._id});
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

  const offers = await Offer.find({categoryId});
  if(offers.length === 0){
      return next(new errorHandlerClass('No category for this offer',404,'No category for this offer'));
  }
  res.status(200).json({
      status: "success",
      data: offers
  })
}
//////////////////////////// update offer/////////////////////////////////
export const updateOffer = async(req, res , next) => { 
    //console.log(req.file);
    const {_id}= req.params ;
    const offer = await Offer.findById(_id);
    console.log("offer",offer);
    
    if(!offer){
        return next(new errorHandlerClass('offer not found',404,'offer not found'));
    }
    const {public_id} = req.body ;

    if (req.file) {
      console.log("img",offer.image);
      
        const splitedPublicId = offer.image.public_id.split(
          `${offer.customId}/`
        )[1];
    
        const { secure_url } = await cloudinaryConfig().uploader.upload(
          req.file.path,
          {
            folder: `${process.env.UPLOADS_FOLDER}/Offer/${offer.customId}`,
            public_id: splitedPublicId,
          }
        );
        console.log("imag",offer.image);
        offer.image.secure_url = secure_url;
      }
      // save the offer with the new changes
      await offer.save();
    
      res.status(200).json({
        status: "success",
        message: "offer updated successfully",
        data: offer,
      });
    };

////////////////////////////delete offer//////////////////////////
export const deleteOffer = async(req,res,next) =>{
  const {_id} = req.params;
  const offer = await Offer.findByIdAndDelete(_id);
  if(!offer){
    return next(new errorHandlerClass(`offer not found`,404,`offer not found`));
  }

  const offerPath=`${process.env.UPLOADS_FOLDER}/Offer/${offer.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(offerPath);
  await cloudinaryConfig().api.delete_folder(offerPath);

  res.status(200).json({
    status: "success",
    message: "offer deleted successfully",
    data: offer
  })
}