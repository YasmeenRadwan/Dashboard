import { Router } from "express";
import { errorHandle,auth,validationMiddleware } from "../../Middleware/index.js";
const userRouter= Router();

import * as userController from './user.controller.js'
import { resetPasswordSchema ,forgetPasswordSchema } from "./user.schema.js";

userRouter.post('/signIn',errorHandle(userController.signIn));
userRouter.put('/resetPassword',auth(),validationMiddleware(resetPasswordSchema), errorHandle(userController.resetPassword))
userRouter.post('/otpPassword', errorHandle(userController.otpPassword))
userRouter.post('/verifyOtp', errorHandle(userController.verifyOtp))
userRouter.post('/forgetPassword', validationMiddleware(forgetPasswordSchema),errorHandle(userController.forgetPassword))

export {userRouter}


