import { Router } from "express";
import {multerHost} from "../../Middleware/multer.middleware.js"
import { extensions } from "../../utils/file-extensions.utils.js";
import {errorHandle} from "../../Middleware/error-handle.middleware.js"
import * as controller from "./service.controller.js"
import { Service } from "../../../DB/Models/service.model.js";
const serviceRouter = Router();


serviceRouter.post('/',multerHost({allowedExtensions : extensions.images}).single('image'),
errorHandle(controller.createService));

serviceRouter.get('/' , errorHandle(controller.getService));
serviceRouter.get('/all' , errorHandle(controller.getServices));
serviceRouter.patch('/:_id',multerHost({allowedExtensions : extensions.images}).single('image'), errorHandle(controller.updateService));
serviceRouter.delete('/:_id' , errorHandle(controller.deleteService));

export {serviceRouter};