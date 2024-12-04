import Chat from './Chat';
import ChatInput from './ChatInput';
import {useState, useEffect} from "react";
import '../App.css'

const DisplayChat = ({user, openedUser}) => {
    const [sentMessages, setSentMessages] = useState([])
    const [receivedMessages, setReceivedMessages] = useState([])

    
    const getSentMessages = async () => {
        const senderId = user._id
        const recipientId = openedUser._id 
        try {
            const response = await fetch(`http://localhost:5050/message/sent?senderId=${senderId}&recipientId=${recipientId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching sent messages: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setSentMessages(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getReceivedMessages = async () => {
        const senderId = openedUser._id
        const recipientId = user._id
        try {
            const response = await fetch(`http://localhost:5050/message/sent?senderId=${senderId}&recipientId=${recipientId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching sent messages: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setReceivedMessages(data)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getSentMessages()
        getReceivedMessages()
    }, [])


    const messages = [];

    sentMessages?.forEach(message => {
        const format = {}
        format['first_name'] = user?.name
        format['img'] = user?.img_url_1
        format['message'] = message.message
        format['timestamp'] = message.timestamp
        messages.push(format)
    });

    receivedMessages?.forEach(message => {
        const format = {}
        format['first_name'] = openedUser?.name
        format['img'] = openedUser?.img_url_1
        format['message'] = message.message
        format['timestamp'] = message.timestamp
        messages.push(format)
    });

    const orderedMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))


    return (
        <>
        <Chat orderedMessages={orderedMessages} user={user}/>
        <ChatInput 
            user={user} 
            openedUser={openedUser} 
            getSentMessages={getSentMessages} 
            getReceivedMessages={getReceivedMessages}/>
        </>
    )
}
export default DisplayChat;
