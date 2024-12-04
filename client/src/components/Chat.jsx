import '../App.css'

const Chat = ({orderedMessages, user}) => {

    function isSentMessage (message) {
        return message.first_name === user.name && message.img === user.img_url_1
    }

    return (
        <>
            <div className= "chat-display" >
                {orderedMessages.map((message, index) => (
                    <div key={index} 
                    className={`received-message-wrap ${isSentMessage(message) ? 'sent-message-wrap' : ''}`}>

                        {!isSentMessage(message) && (
                            <div className="message-img-container">
                                <img src={message.img ? message.img : 'https://i.imgur.com/mCHMpLT.png'} alt={"photo of " + message.first_name} />
                            </div>
                        )}
                            <div className="message-content">
                                <p>{message.message}</p>
                            </div>
                        </div>
                ))}
            </div>


        </>
    )
}
export default Chat;
