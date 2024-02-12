import dbconnect from '@/lib/dbconnect'
import Message from '@/models/Message'
import { getSession } from "next-auth/react";


export default async function handler(req, res) {
    
    const session = await getSession({ req });
    
    switch (req.method) {
        case "GET":
            try {
                await dbconnect();
                const messages = await Message.find({});
                res.status(200).json(messages);
            } catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
            break;
            
        default:
            res.status(405).json({ message: "Method Not Allowed" });
            break;
        
    }
    
    
}