import React, { useState, useEffect, useRef } from 'react'
import Style from '@/styles/styles.module.css'
import { useSession } from "next-auth/react"
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
const responses = {
    "initial": [{ text: "Welcome to KJ Somaiya College of Engineering", sender: "bot" },
    { text: "Send us a hi!!", sender: "bot" }, { text: "How can I help you?", sender: "bot", buttons: ["About", "Admissions", "Departments", "Placements", "Contact Us"] }],
    "about": "KJ Somaiya College of Engineering is a college in Mumbai, India. It is part of the Somaiya Vidyavihar. It was established in 1983 and is affiliated to the University of Mumbai. It offers a degree in Computer Engineering, Electronics Engineering, Information Technology, Electronics and Telecommunication Engineering, and Mechanical Engineering.",
    "admission": "Admissions are based on the MHT-CET exam. The college also has a quota for NRI students.",
    "department": "The college has 5 departments: Computer Engineering, Electronics Engineering, Information Technology, Electronics and Telecommunication Engineering, and Mechanical Engineering.",
    "placement": "The college has a placement cell that helps students get placed in companies.",
    "contact": "You can contact us at KJ Somaiya College of Engineering, Vidyanagar, Vidyavihar, Mumbai, Maharashtra 400077"

}
export default function Home() {

    const { data: session, status } = useSession()

    const [messages, setMessages] = useState(responses["initial"]);
    const [userInput, setUserInput] = useState("");
    const [firstLoginMessage, setFLM] = useState(false);

    function selectMessage(inp) {
        let lower = inp.toLowerCase()
        let msg = "I am sorry, I don't understand that"
        if (lower.includes("about")) {
            msg = responses["about"]
        }
        if (lower.includes("admission")) {
            msg = responses["admission"]
        }
        if (lower.includes("department")) {
            msg = responses["department"]
        }
        if (lower.includes("placement")) {
            msg = responses["placement"]
        }
        if (lower.includes("contact")) {
            msg = responses["contact"]
        }
        return msg
    }

    function sendMessage(botMessage = "") {
        console.log(userMessage, userInput);
        var userMessage = { text: `${userInput}`, sender: "user" }

        if (botMessage !== "") {
            userMessage = { text: `${botMessage}`, sender: "user" }
        }
        let msg = selectMessage(userInput ? userInput : botMessage)
        let allMessage = [...messages, userMessage, { text: `${msg}`, sender: "bot" }]

        if (!session)
        {
            allMessage.push({ text: "For further Information please login", sender: "bot" })
            if(!firstLoginMessage)
            {
                setFLM(true)
            }
        }
            
        setUserInput("")
        setMessages(allMessage);
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);


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
                            <>
                                <div className={`${Style.message} ${Style[message.sender]}`} key={index}>
                                    <div>{message.text}</div>
                                </div>
                                <div className={`${Style.btn_grp}`}>
                                    {
                                        message.buttons ? message.buttons.map((text, index) => (

                                            <button key={index} className={` ${Style.chat_buttons} `} onClick={() => { setUserInput(text); sendMessage(text) }}>{text}</button>

                                        )) : <></>
                                    }
                                </div>
                            </>
                        ))
                    }
                    <div ref={messagesEndRef} />
                </div>

                {/* <div className="g-signin2" data-onsuccess="onSignIn" style="display: block;"></div> */}
                {firstLoginMessage ?
                    <>{session ? <></> : <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="h-10 w-full items-center justify-center rounded-sm border-2 border-gray-50 text-center shadow-lg"
                    >
                        <FcGoogle className="mx-2 my-2 inline h-auto w-5 " />
                        <div className="inline font-bold text-slate-600">
                            Continue with Google
                        </div>
                    </button>}</>
                    : <></>}

                <div className={`${Style.chat_input}`}>
                    <input type="text" className={`${Style.user_input}`} placeholder="Type a message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }} />

                    <button className={`${Style.send_btn}`} onClick={() => { sendMessage(); setUserInput("") }}>Send</button>
                </div>
            </div >

        </>
    )
}

