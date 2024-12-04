import { useCookies } from 'react-cookie'
import '../App.css'


const ChatHeader = ({user, setOpenChat, setOpenProfile}) => {
    return (
        <>
        <div className="chat-container-header">
            <div className="header-back-arrow" onClick={() => {setOpenChat(null); setOpenProfile(null); } }>
                <h1>&lt;</h1>
            </div>
            <div className="profile-chat-header" onClick={() => setOpenProfile(user)}>
                <div className="img-container">
                    <img src={user.img_url_1 ? user.img_url_1 : 'https://i.imgur.com/mCHMpLT.png'} alt={"photo of" + user.name} />
                    <div className="overlay">
                            <div className="overlay-text">View Profile</div>
                    </div>
                </div>
                <h3>{user.name}</h3>
            </div>
        </div>
        </>
    );
}

export default ChatHeader;
