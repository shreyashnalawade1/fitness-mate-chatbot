const nodemailer=require('nodemailer')
const promisify=require('node:util')
class EmailNotifier{
    constructor(){
        if(EmailNotifier.instance){
            return EmailNotifier.instance;
        }
        
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
              clientId: process.env.OAUTH_CLIENTID,
              clientSecret: process.env.OAUTH_CLIENT_SECRET,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
          });
    }

    static getInstance(){
        if(EmailNotifier.instance){
            return EmailNotifier.instance;
        }
        return EmailNotifier.instance=new EmailNotifier();
    }

    async sendTextEmail(mailOptions){
       try{
        this.transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                console.log(err);
                throw err;                
            } else {
              console.log("Email sent successfully");
                return true;
            }
          });
       }catch(error){
            console.log(err);
       }
       
    }
}

module.exports=EmailNotifier;