import React, {useState} from 'react'
import Style from '@/styles/styles.module.css'
import { useSession } from "next-auth/react"
import {  signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function Home() {
    
    const { data: session, status } = useSession()
    
    const [messages, setMessages] = useState([{ text: "Welcome to KJ Somaiya College of Engineering", sender: "bot" },
        { text: "Send us a hi!!", sender: "bot" }]);
    const [userInput, setUserInput] = useState("");
    

    function sendMessage() {
        
        var userMessage = { text: `${userInput}`, sender: "user" }
        var msg = "Thank you for your message!";
        // Calculate Bot message
        if(!session){
            msg = "Please login to continue"
        }
        
        var botMessage = { text: `${msg}`, sender: "bot" }

        
        setMessages([...messages, userMessage, botMessage]);
    }
    
    
    return (
        <>
            
            
            <div className={`${Style.chat_container}`}>
                
                <div className={`${Style.chat_header}`}>
                    <img src="/images/KJSCE-Somaiya-Logo.jpg" alt="Chatbot" />
                    <h2>KJSCE</h2>
                </div>
                
                <div className={`${Style.chat_messages}`} id="chat-messages">
                
                    {
                        messages.map((message, index) => (
                        <div className={`${Style.message} ${Style[message.sender]}`} key={index}>
                            <div>{message.text}</div>
                        </div>
                    ))
                        }
                </div>

                {/* <div className="g-signin2" data-onsuccess="onSignIn" style="display: block;"></div> */}
                {session ? <></> : <button
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="h-10 w-full items-center justify-center rounded-sm border-2 border-gray-50 text-center shadow-lg"
                >
                    <FcGoogle className="mx-2 my-2 inline h-auto w-5 " />
                    <div className="inline font-bold text-slate-600">
                        Continue with Google
                    </div>
                </button>}
                
                <div className={`${Style.chat_input}`}>
                    <input type="text" className={`${Style.user_input}`} placeholder="Type a message..." value={userInput} onChange={(e)=> setUserInput(e.target.value)} onKeyDown={(e) => {if(e.key === "Enter") sendMessage()}} />
                    
                    <button className={`${Style.send_btn}`} onClick={sendMessage}>Send</button>
                </div>
            </div>

        </>
    )
}

