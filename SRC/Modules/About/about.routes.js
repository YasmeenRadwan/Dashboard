import { Router } from "express";
import {multerHost} from "../../Middleware/multer.middleware.js"
import { extensions } from "../../utils/file-extensions.utils.js";
import {errorHandle} from "../../Middleware/error-handle.middleware.js"
import * as controller from "./about.controller.js"
import { About } from "../../../DB/Models/about.model.js";
const aboutRouter = Router();


aboutRouter.post('/',multerHost({allowedExtensions : extensions.images}).single('image'),
errorHandle(controller.createAbout));

aboutRouter.get('/:_id' , errorHandle(controller.getAbout));
aboutRouter.patch('/:_id',multerHost({allowedExtensions : extensions.images}).single('image'), errorHandle(controller.updateAbout));
aboutRouter.delete('/:_id' , errorHandle(controller.deleteAbout));

export {aboutRouter};