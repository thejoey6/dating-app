import ChatHeader from "./ChatHeader"
import DisplayMatches from "./DisplayMatches"
import DisplayChat from "./DisplayChat"
import ViewProfile from "./ViewProfile"
import {useState, useEffect} from "react"
import '../App.css'

const ChatContainer = ({ user, onBlock }) => {

    const [openChat, setOpenChat] = useState(null)
    const [headerUser, setHeaderUser] = useState(user)
    const [openProfile, setOpenProfile] = useState(null)

    useEffect(() => {
        if (openChat !== null) {
            setHeaderUser(openChat);
        } else {
            if (openProfile !== null) {
                setHeaderUser(openProfile);
            } else {
                setHeaderUser(user);
            }
        }
    }, [openChat, openProfile]);


    return (
        <div className="chat-container">
            <ChatHeader user={headerUser} setOpenProfile={setOpenProfile} setOpenChat={setOpenChat} />

            {!openChat && !openProfile && (
                <DisplayMatches matches={user.matches} setOpenProfile={setOpenProfile} setOpenChat={setOpenChat} />
            )}

            {openChat && !openProfile && <DisplayChat user={user} openedUser={openChat} />}

            {openProfile && (
                <div className="profile-view">
                    <ViewProfile user={openProfile} block={onBlock} setOpenProfile={setOpenProfile} setOpenChat={setOpenChat} />
                </div>
            )}
        </div>
    );
}

export default ChatContainer