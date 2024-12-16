const reqKeys=["body","params","query","headers"];
import { errorHandlerClass } from "../utils/error-class.utils.js";

export const validationMiddleware = (schema) => {
    return (req,res,next) => {
        let validationErrors=[];
        for (const key of reqKeys) {
            const validationResult = schema[key]?.validate(req[key],{abortEarly:false}); // value , error
            console.log({validationResult});
            if (validationResult?.error){
                validationErrors.push(validationResult.error.details)
            }      
    }
     validationErrors.length ?
      next  (new errorHandlerClass("validation error",400,validationErrors))
      : next();
}
}
