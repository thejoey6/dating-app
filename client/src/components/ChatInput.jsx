import {useState} from 'react'
import '../App.css'

const ChatInput = ({user, openedUser, getSentMessages, getReceivedMessages}) => {
    const [input, setInput] = useState('')


    const draftMessage = async () => {
        
        const newMessage = {
            timestamp: new Date().toISOString(),
            sender_user_ID: user._id,
            recipient_user_ID: openedUser._id,
            message: input
        }

        try {
                const response = await fetch("http://localhost:5050/message/send", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
              });
              
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            setInput("")
            getSentMessages()
            getReceivedMessages()
    } catch (error) {
        console.log(error)
    }
}


    return (
        <div className="chat-input">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <button className="chat-send" onClick={draftMessage}>
                Send
            </button>

        </div>
    )
}
export default ChatInput;
