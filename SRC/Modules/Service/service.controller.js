import { errorHandlerClass } from "../../utils/error-class.utils.js";
import {cloudinaryConfig} from "../../utils/cloudinary.utils.js"
import {nanoid} from "nanoid";
import {Service} from "../../../DB/Models/service.model.js"

export const createService = async(req, res, next) => {
    const { name,desc } = req.body;
    const duplicate = await Service.findOne({ name });
    if (duplicate) {
      return next(new errorHandlerClass('service name already exists.', 400));
    }

    if (!req.file) {
        return next(new errorHandlerClass('Please upload an Image.',400,'Please upload an Image.'));
    }

    const customId=nanoid(4);
    
    //prepare service object
    const newService = new Service({
      name,
      desc,
      image: { secure_url: ' ', public_id: ' ' }, // Temporary
      customId,
    });

    // Validate the instance
    await newService.validate();

    // If validation passes, upload the image to Cloudinary
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
      folder: `${process.env.UPLOADS_FOLDER}/Service/${customId}`,
    });

    // Update the image field and save to the database
    newService.image = { secure_url, public_id };

    // Save to the database
    await newService.save();
  
    res.status(201).json({
        status : "success",
        message : "service created successfully",
        date: newService.created});
}

////////////////////////////// get service///////////////////////////////////////
export const getService = async(req, res, next) => {
    const {id,name} = req.query;
    const queryFilter = {};
    if(id) queryFilter._id=id;
    if(name) queryFilter.name=name;
    const service = await Service.findOne(queryFilter);
    if(!service){
        return next(new errorHandlerClass('service not found',404,'service not found'));
    }
    res.json({
        status: "success",
        data: service
    })
}
////////////////////////////// get service///////////////////////////////////////
export const getServices = async(req, res, next) => {
 
  const services = await Service.find();
  if(services.length === 0){
      return next(new errorHandlerClass('No services found',404,'No services found'));
  }
  res.json({
      status: "success",
      data: services
  })
}
//////////////////////////// update service/////////////////////////////////
export const updateService = async(req, res , next) => { 
    //console.log(req.file);
    const {_id}= req.params ;
    const service = await Service.findById(_id);
    console.log("service",service);
    
    if(!service){
        return next(new errorHandlerClass('service not found',404,'service not found'));
    }
    const {name,desc, public_id} = req.body ;
    if(name){
      service.name = name;
  }
    if(desc){
        service.desc = desc;
    }
    if (req.file) {
      console.log("img",service.image);
      
        const splitedPublicId = service.image.public_id.split(
          `${service.customId}/`
        )[1];
    
        const { secure_url } = await cloudinaryConfig().uploader.upload(
          req.file.path,
          {
            folder: `${process.env.UPLOADS_FOLDER}/Service/${service.customId}`,
            public_id: splitedPublicId,
          }
        );
        console.log("imag",service.image);
        service.image.secure_url = secure_url;
      }
      // save the service with the new changes
      await service.save();
    
      res.status(200).json({
        status: "success",
        message: "service updated successfully",
        data: service,
      });
    };

////////////////////////////delete service//////////////////////////
export const deleteService = async(req,res,next) =>{
  const {_id} = req.params;
  const service = await Service.findByIdAndDelete(_id);
  if(!service){
    return next(new errorHandlerClass('service not found',404,'service not found'));
  }

  const servicePath=`${process.env.UPLOADS_FOLDER}/Service/${service.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(servicePath);
  await cloudinaryConfig().api.delete_folder(servicePath);

  res.json({
    status: "success",
    message: "service deleted successfully",
    data: service
  })
}