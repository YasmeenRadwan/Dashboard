import { errorHandlerClass } from "../../utils/error-class.utils.js";
import {cloudinaryConfig} from "../../utils/cloudinary.utils.js"
import {nanoid} from "nanoid";
import {About} from "../../../DB/Models/about.model.js"

export const createAbout = async(req, res, next) => {
    const { desc } = req.body;
    const duplicate = await About.findOne({ desc });
    if (duplicate) {
      return next(new errorHandlerClass('Description already exists.', 400));
    }

    if (!req.file) {
        return next(new errorHandlerClass('Please upload an Image.',400,'Please upload an Image.'));
    }

    const customId=nanoid(4);
    
    //prepare about object
    const newAbout = new About({
      desc,
      image: { secure_url: ' ', public_id: ' ' }, // Temporary
      customId,
    });

    // Validate the instance
    await newAbout.validate();

    // If validation passes, upload the image to Cloudinary
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
      folder: `${process.env.UPLOADS_FOLDER}/About/${customId}`,
    });

    // Update the image field and save to the database
    newAbout.image = { secure_url, public_id };

    // Save to the database
    await newAbout.save();
  
    res.status(200).json({
        status : "success",
        message : "about created successfully",
        date: newAbout._id});
}

////////////////////////////// get about///////////////////////////////////////
export const getAbout = async(req, res, next) => {
    const {_id} = req.params;
    const about = await About.findById(_id);
    if(!about){
        return next(new errorHandlerClass('about not found',404,'about not found'));
    }
    res.status(200).json({
        status: "success",
        data: about
    })
}
//////////////////////////// update about/////////////////////////////////
export const updateAbout = async(req, res , next) => { 
    //console.log(req.file);
    const {_id}= req.params ;
    const about = await About.findById(_id);
    console.log("about",about);
    
    if(!about){
        return next(new errorHandlerClass('about not found',404,'about not found'));
    }
    const {desc , public_id} = req.body ;
    if(desc){
        about.desc = desc;
    }
    if (req.file) {
      console.log("img",about.image);
      
        const splitedPublicId = about.image.public_id.split(
          `${about.customId}/`
        )[1];
    
        const { secure_url } = await cloudinaryConfig().uploader.upload(
          req.file.path,
          {
            folder: `${process.env.UPLOADS_FOLDER}/About/${about.customId}`,
            public_id: splitedPublicId,
          }
        );
        console.log("imag",about.image);
        about.image.secure_url = secure_url;
      }
      // save the about with the new changes
      await about.save();
    
      res.status(200).json({
        status: "success",
        message: "about updated successfully",
        data: about,
      });
    };

////////////////////////////delete about//////////////////////////
export const deleteAbout = async(req,res,next) =>{
  const {_id} = req.params;
  const about = await About.findByIdAndDelete(_id);
  if(!about){
    return next(new errorHandlerClass(`about not found`,404,`about not found`));
  }

  const aboutPath=`${process.env.UPLOADS_FOLDER}/About/${about.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(aboutPath);
  await cloudinaryConfig().api.delete_folder(aboutPath);

  res.status(200).json({
    status: "success",
    message: "about deleted successfully",
    data: about
  })
}