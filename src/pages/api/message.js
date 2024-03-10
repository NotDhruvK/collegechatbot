import dbconnect from '@/lib/dbconnect'
import Message from '@/models/Message'
import { getSession } from "next-auth/react";


export default async function handler(req, res) {
    
    const session = await getSession({ req });
    console.log(req.body);
    switch (req.method) {
        case "GET":
            try {
                await dbconnect();
                // await Message.create({ keywords: ["good morning"], message: "Welcome to KJ Somaiya College of Engineering", button: ['Time Table'] });
                const messages = await Message.find({});
                res.status(200).json(messages);
            } catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
            break;
        
        case "POST":
            try {
                await dbconnect();
                const { message, keywords, button, id, del, update, files, auth } = req.body;
                var msg
                if(del){
                    await Message.findByIdAndDelete(id);
                    msg = "Message Deleted";
                }
                else if (update){
                    await Message.findByIdAndUpdate(id, { message, keywords, button, files, auth });
                    msg = "Message Updated";
                }
                else{
                    
                const newMessage = await Message.create({ message, keywords, button, files, auth });
                msg = "Message Added";
                }
                const allMessages = await Message.find({});
                res.status(201).json({ message: msg, messages: allMessages});
                
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