import React from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
const Keywords = ({ messages: initalMessages }) => {
    
    const { data: session } = useSession()
    console.log(session)
    console.log(session?.user?.email)
    console.log(process.env.ADMIN_EMAIL)
    const [messages, setMessages] = useState(initalMessages.reverse());
    
    const [uploadData, setFormData] = useState({
        message: "",
        keywords: "",
        button: "",
        update: false,
        files: "",
        auth: false,
        id: ""
    });
    
    if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
        return <div>Access Denied</div>
    }
    const submit = async () => {

        if (uploadData.message === "" || uploadData.keywords === "") {
            alert("Please fill all the fields")
            return
        }
        console.log(uploadData.keywords.split(",").map((keyword) => keyword.trim()));
        fetch(`api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: uploadData.message,
                keywords: uploadData.keywords.split(",").map((keyword) => keyword.trim()),
                button: uploadData.button.split(",").map((button) => button.trim()),
                update: uploadData.update,
                id: uploadData.id,
                files: uploadData.files?.split(",").map((file) => file.trim()),
                del: false,
                auth: uploadData.auth
            })
        }).then(res => res.json())
            .then(data => { console.log(data.message); setMessages(data.messages.reverse()); setFormData({ message: "", keywords: "", button: "", update: false, id: "", files: "", auth: false }) })
    }
    const del = async (del) => {



        fetch(`api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: del,
                del: true
            })
        }).then(res => res.json())
            .then(data => { console.log(data.message); setMessages(messages.filter((mss) => mss._id != del)) })
    }

    const update = async (id) => {

        let message = messages.filter((mss) => mss._id == id)[0]
        console.log(id, message);
        setFormData({ message: message.message, keywords: message.keywords.join(", "), button: message.button.join(", "), update: true, id: id, files: message.files?.join(", "), auth: message.auth })

    }

    return (
        <>
            <div class="container mx-auto px-4 py-8">
                <form class="my-8 ">
                    <label class="block mb-2" htmlFor="keyword">Keyword</label>
                    <input class="border border-gray-400 py-2 px-4 mb-4 w-full" type="text" name="keyword" id="keyword" value={uploadData.keywords} onChange={(e) => setFormData({ ...uploadData, keywords: e.target.value })} />
                    <label class="block mb-2" htmlFor="message">Message</label>
                    <input class="border border-gray-400 py-2 px-4 mb-4 w-full" type="text" name="message" id="message" value={uploadData.message} onChange={(e) => setFormData({ ...uploadData, message: e.target.value })} />
                    <label class="block mb-2" htmlFor="button">Button</label>
                    <input class="border border-gray-400 py-2 px-4 mb-4 w-full" type="text" name="button" id="button" value={uploadData.button} onChange={(e) => setFormData({ ...uploadData, button: e.target.value })} />
                    <label class="block mb-2" htmlFor="files">Files URLs</label>
                    <input class="border border-gray-400 py-2 px-4 mb-4 w-full" type="text" name="files" id="files" value={uploadData.files} onChange={(e) => setFormData({ ...uploadData, files: e.target.value })} />

                    <label htmlFor="auth-toggle" className="block mb-2 mr-2">Auth Required?</label>

                    <input
                        type="checkbox"
                        id="auth-toggle"
                        class="border border-gray-400 py-2 px-4 mb-4"
                        value={uploadData.auth}
                        onChange={(e) => setFormData({ ...uploadData, auth: e.target.checked })}
                    />

                    <br />

                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={submit}>Submit</button>
                </form>
            
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">Keywords</th>
                            <th class="px-4 py-2">Message</th>
                            <th class="px-4 py-2">Buttons</th>
                            <th class="px-4 py-2">Files URLs</th>
                            <th class="px-4 py-2">Auth Required?</th>
                            <th class="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((message, index) => {
                            return (
                                <tr key={index}>
                                    <td class="border px-4 py-2">
                                        {
                                            message.keywords.map((keyword, index) => {
                                                return (
                                                    <span key={index}>{keyword} <br /></span>
                                                )
                                            })
                                        }
                                    </td>
                                    <td class="border px-4 py-2">{message.message}</td>
                                    <td class="border px-4 py-2">
                                        {
                                            message.button.map((button, index) => {
                                                return (
                                                    <span key={index}>{button} <br /></span>
                                                )
                                            })
                                        }
                                    </td>
                                    <td class="border px-4 py-2">
                                        {
                                            message.files.map((file, index) => {
                                                return (
                                                    <a key={index} href={file} target="_blank">{file} <br /></a>
                                                )
                                            })
                                        }
                                    </td>
                                    <td class="border px-4 py-2">
                                        <span className={message.auth ? "text-green-600" : "text-red-600"}>
                                            {message.auth ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td class="border px-4 py-2">
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => del(message._id)}>Delete</button>
                                        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => update(message._id)}>Update</button>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>

               
            </div>


        </>
    )
}

export async function getServerSideProps() {
    let res = await fetch(`${process.env.API_PATH}/message`)
    let data = await res.json()
    if (!data) {
        return {
            props: {
                messages: null,
            }
        }
    } else {
        return {
            props: {
                messages: data, 
            }
        }
    }
}

export default Keywords