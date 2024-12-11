
import {errorHandlerClass} from '../utils/error-class.utils.js';

export const errorHandle = (API) => {
    return (req, res, next) => {
        API(req,res,next).catch((err) => {
            console.log("error in Handle Middleware",err);
            const data="API DATA"
         next (new errorHandlerClass("Internal Server Error" ,500, err.stack,data));
    })
    }
}

///////////////global middleware /////////////////////
export const globalResponse = (err,req,res,next) => {
    if(err){
        res.status(err["statusCode"]|| 500 ).
        json({message: "Internal Server Error",error:err.message,stack:err.stack,data:err.data})
    }
    
}