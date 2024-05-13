import dbconnect from '@/lib/dbconnect'
import Message from '@/models/Message'
import { getSession } from "next-auth/react";


export default async function handler(req, res) {

    const session = await getSession({ req });
    switch (req.method) {
        
        case "POST":
            try {
                await dbconnect();
                let botMessage = {text: "I am sorry, I don't understand that", sender: "bot"};
                let error = null;
                const {userMessage} = req.body;
                console.log(userMessage);
                let tokens = userMessage.toLowerCase().split(" ");
                
                let message = await Message.findOne({keywords: {$in: tokens}});
                
                if(message){
                    botMessage = {text: message.message, sender: "bot", buttons: message?.button, files: message?.files};
                }else{
                    error = "Message not found";
                }
                if(!session && message?.auth){
                    botMessage = {text: "Please login to view this message", sender: "bot"};
                    error = "Unauthenticated";
                }
                console.log(botMessage, error);
                res.status(200).json({botMessage: botMessage, error});

            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
            break;

        default:
            res.status(405).json({ message: "Method Not Allowed" });
            break;

    }


}