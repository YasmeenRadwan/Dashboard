import { Router } from "express";
import {multerHost} from "../../Middleware/multer.middleware.js"
import { extensions } from "../../utils/file-extensions.utils.js";
import {errorHandle} from "../../Middleware/error-handle.middleware.js"
import * as controller from "./category.controller.js"
const categoryRouter = Router();


categoryRouter.post('/',errorHandle(controller.createCategory));
categoryRouter.get('/all' , errorHandle(controller.getallCategories));
categoryRouter.get('/:_id' , errorHandle(controller.getCategory));
categoryRouter.patch('/:_id', errorHandle(controller.updateCategory));
categoryRouter.delete('/:_id' , errorHandle(controller.deleteCategory));

export {categoryRouter};