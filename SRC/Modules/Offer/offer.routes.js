import { Router } from "express";
import {multerHost} from "../../Middleware/multer.middleware.js"
import { extensions } from "../../utils/file-extensions.utils.js";
import {errorHandle} from "../../Middleware/error-handle.middleware.js"
import * as controller from "./offer.controller.js"
const offerRouter = Router();


offerRouter.post('/:categoryId',multerHost({allowedExtensions : extensions.images}).single('image'),
errorHandle(controller.createOffer));

offerRouter.get('/all' , errorHandle(controller.getAllOffers));
offerRouter.get('/:categoryId' , errorHandle(controller.getCategoryOffers));

offerRouter.patch('/:_id',multerHost({allowedExtensions : extensions.images}).single('image'), errorHandle(controller.updateOffer));
offerRouter.delete('/:_id' , errorHandle(controller.deleteOffer));

export {offerRouter};