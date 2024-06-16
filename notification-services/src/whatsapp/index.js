class WhatsappNotifier{
    constructor(){
        if(WhatsappNotifier.instance){
            return WhatsappNotifier.instance;
        }
        this.accountSid = 'AC50a935431c10f8d7dc540f21f7905576';
        this.authToken = process.env.WHATSAPP_AUTH_TOKEN;
    }
    static  getInstance(){
        if(!WhatsappNotifier.instance){
            WhatsappNotifier.instance=new WhatsappNotifier();   
        }
        return WhatsappNotifier.instance;
    }

    async sendTextMessage(msg){
            try{
                const client = require('twilio')(this.accountSid, this.authToken);
                const res=await client.messages.create(msg);
                return true;
            }catch(error){
                console.log(error);
                return false;
            }
        }


}
module.exports=WhatsappNotifier;
