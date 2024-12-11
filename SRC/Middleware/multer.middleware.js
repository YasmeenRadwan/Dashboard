//disk storage///

import multer from "multer";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { errorHandlerClass } from "../utils/error-class.utils.js";
import { extensions } from "../utils/file-extensions.utils.js";
import { nanoid } from "nanoid";


export const multerMiddleware = ({filePath = 'general', allowedExtensions = extensions.images}) => {
    const destinationPath= path.resolve(`SRC/uploads/${filePath}`)
    if (!fs.existsSync(destinationPath)){
        fs.mkdirSync(destinationPath,{recursive:true})
    }

    const storage= multer.diskStorage({
        destination : (req,file,cb) =>{
            cb(null,destinationPath)
        },
        filename : (req,file,cb) => {
            const now = DateTime.now().toFormat("yyyy-MM-dd");
            const uniqueString= nanoid(4);
            const uniqueFileName= `${now}_${uniqueString}_${file.originalname}`;
            cb(null,uniqueFileName)
        }
    })

    const fileFilter = (req,file,cb) => {
        if (allowedExtensions?.includes(file.mimetype)){
            console.log(file.mimetype);
            return cb (null , true)
        }
        console.log(file.mimetype);
        return cb(new errorHandlerClass (`invalid file type only allowed ${allowedExtensions}`,400),false)
    }

return multer({fileFilter,storage,
    //limits:{fields:3 , files : 2}
    });
}

export const multerHost = ({allowedExtensions = extensions.images}) =>{
    const storage = multer.diskStorage({});
    const fileFilter = (req,file,cb) => {
        if (allowedExtensions?.includes(file.mimetype)){
            return cb (null , true)
        }
        cb(new errorHandlerClass (`invalid file type only allowed ${allowedExtensions}`,400),false) 
}

  return multer({fileFilter,storage});

}