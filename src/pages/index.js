import React, { useState, useEffect, useRef } from 'react'
import Style from '@/styles/styles.module.css'
import { useSession } from "next-auth/react"
import { signIn, signOut } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
const responses = { // Databas
    "initial": [{ text: "Welcome to KJ Somaiya College of Engineering", sender: "bot" },
    { text: "Send us a hi!!", sender: "bot" }],

    "hi": { text: "How can I help you?", sender: "bot", buttons: ["About", "Admissions", "Departments", "Placements", "Contact Us"] },

    "about": { text: "KJ Somaiya College of Engineering is a college in Mumbai, India. It is part of the Somaiya Vidyavihar. It was established in 1983 and is affiliated to the University of Mumbai. It offers a degree in Computer Engineering, Electronics Engineering, Information Technology, Electronics and Telecommunication Engineering, and Mechanical Engineering.", sender: "bot" },

    "admission": { text: "Admissions are based on the MHT-CET exam. The college also has a quota for NRI students.", sender: "bot" },
    "department": { text: "The college has 5 departments: Computer Engineering, Electronics Engineering, Information Technology, Electronics and Telecommunication Engineering, and Mechanical Engineering.", sender: "bot", buttons: ['btech-dates'] },
    "placement": { text: "The college has a placement cell that helps students get placed in companies.", sender: "bot" },
    "contact": { text: "You can contact us at KJ Somaiya College of Engineering, Vidyanagar, Vidyavihar, Mumbai, Maharashtra 400077", sender: "bot" },

}

// $>


export default function Home() {

    const { data: session, status } = useSession()
    console.log(session)

    const [messages, setMessages] = useState([{ text: "Welcome to KJ Somaiya College of Engineering", sender: "bot" },
    { text: "Send us a hi!!", sender: "bot" }]);
    const [userInput, setUserInput] = useState("");
    const [firstLoginMessage, setFLM] = useState(false);

    function selectMessage(inp) {
        let lower = inp.toLowerCase()
        let msg = "I am sorry, I don't understand that"
        if (lower.includes("hi") || lower.includes("hello")) {
            msg = responses["hi"]
        }
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

    async function sendMessage(botMessage = "") {
        var userMessage = { text: `${userInput}`, sender: "user" }
        
        if(userInput === "") return
        
        if(userInput.toLowerCase() == 'logout'){
            signOut()
        }
        
        if (botMessage !== "") {
            userMessage = { text: `${botMessage}`, sender: "user" }
        }
        let inp = userInput ? userInput : botMessage
        // let msg = selectMessage(inp)

        let res = await fetch("/api/getnext", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessage: inp,
                // auth: session ? true : false
            })
        })
        let data = await res.json()
        let msg = data.botMessage
        console.log(data, "data");
        if (data.error) {
            console.log(data.error, "error");
            if (data.error === "Unauthenticated" && !firstLoginMessage) {
                setFLM(true)
            }
        }

        let allMessage = [...messages, userMessage, msg]

        // if (!session) {
        //     if (!inp.toLowerCase().includes("hi") && !inp.toLowerCase().includes("hello"))
        //         allMessage.push({ text: "For further Information please login", sender: "bot" })
        //     if (!firstLoginMessage) {
        //         setFLM(true)
        //     }
        // }

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
    
    function capitalizeFirstLetter(text) {
        return text.split('-').map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }

    return (
        <>


            <div className={`${Style.chat_container} `}>

                <div className={`${Style.chat_header}`}>
                    <img src="/images/KJSCE-Somaiya-Logo.jpg" alt="Chatbot" />
                    <h2>KJSCE</h2>
                </div>

                <div className={`${Style.chat_messages}`} id="chat-messages">

                    {
                        messages.map((message, index) => (
                            <>
                                <div key={index}>
                                    {message.text.includes('$>') ? (
                                        message.text.split('$>').map((part, index) => (
                                            <div key={index} className={`${Style.message} ${Style[message.sender]}`}>{capitalizeFirstLetter(part)}</div>
                                        ))
                                    ) : (
                                            <div className={`${Style.message} ${Style[message.sender]}`}>{capitalizeFirstLetter(message.text)}</div>
                                    )}
                                </div>
                                <div className={`${Style.btn_grp}`}>
                                    {
                                        message.files ? message.files.map((text, index) => {
                                            
                                            if (text === '') {
                                                return <></>
                                            } else {
                                                return (<>
                                                        <div key={index} className={` ${Style.chat_buttons} `}>
                                                        
                                                            <a className='text-wrap'  target='_blank' href={ text } >Click Here!</a>
                                                        </div> 
                                                </>)


                                            }

                                        }) : <></>
                                    }
                                </div>
                                <div className={`${Style.btn_grp}`}>
                                    {
                                        message.buttons ? message.buttons.map((text, index) => {
                                            console.log(text, "text");
                                            if (text === '') {
                                                return <></>
                                            } else {
                                                return (<>
                                                    <button key={index} className={` ${Style.chat_buttons} `} onClick={() => { setUserInput(text); sendMessage(text) }}>{text.split('-').map((word) => { return word.charAt(0).toUpperCase() + word.slice(1); }).join(" ")}</button>
                                                </>)


                                            }

                                        }) : <></>
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
                        <FcGoogle className="m-2 inline h-auto w-5 " />
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

