export class errorHandlerClass {
    constructor(message,statusCode,stack,data){
        this.message = message;
        this.statusCode = statusCode;
        this.stack = stack ? stack : null;
        this.data = data ? data : "Error";
    }
}