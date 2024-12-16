import nodemailer from 'nodemailer';

export const sendEmailService = async ({
    to = '',subject = '', textMessage ='',htmlMessage='',attachments=[]}={}) => {
    try {
        // transporter configuration
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 587, // 465 , 25
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'Engyradwan93@gmail.com',
                pass: 'qpeuhdzycqinjghe',
            },
            service:'gmail',
           tls:{
            rejectUnauthorized:false,
 
           }
        });

    // message configuration
    const emailINfo =await transporter.sendMail({
        from: 'yasmeen radwan <engyradwan93@gmail.com>',
        to: to ? to :'',
        subject: 'Test Email',
        text: textMessage,
        html: htmlMessage,
        attachments,
    })
    return emailINfo;
    } catch (error) {
        console.log('Error sending email', error);
    }
}