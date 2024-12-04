import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";


const DisplayMatches = ({ matches, setOpenChat, setOpenProfile }) => {

    const [cookies] = useCookies(null)
    const userID = cookies.UserId

    const matchIds = matches.map(({ _id }) => _id)
    const [matchProfiles, setMatchProfiles] = useState(null)
    const [lastMessages, setLastMessages] = useState({})


    const getMatches = async () => {
        if (!matchIds) return
        try {
            const response = await fetch(`http://localhost:5050/profile/matches`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(matchIds)
            });
            const data = await response.json();
            setMatchProfiles(data);
        } catch (error) {
            console.log(error);
        }
    }


    /*-----LOGIC FOR DISPLAYING LAST MESSAGE-----*/

    const fetchLastMessagesForAllMatches = async () => {
        for (const match of matchProfiles) {
            await fetchMessagesForMatch(match);
        }
    };

    const fetchMessagesForMatch = async (match) => {
        const senderId = userID;
        const recipientId = match._id;
        try {
            const response = await fetch(`http://localhost:5050/message/sent?senderId=${senderId}&recipientId=${recipientId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const sentMessages = await response.json();

            const responseReceived = await fetch(`http://localhost:5050/message/sent?senderId=${recipientId}&recipientId=${senderId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const receivedMessages = await responseReceived.json();

            const messages = [...sentMessages, ...receivedMessages];
            const orderedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            if (orderedMessages.length > 0) {
                setLastMessages(prev => ({
                    ...prev,
                    [match._id]: orderedMessages[orderedMessages.length - 1].message
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    /*----------*/

    useEffect(() => {
        getMatches();
    }, [matches]);


    useEffect(() => {
        if (matchProfiles) {
            fetchLastMessagesForAllMatches();
        }
    }, [matchProfiles]);


    //Only Display if both users have swiped right
   const realMatches = matchProfiles
        ? matchProfiles.filter(matchedProfile =>
            matchedProfile.matches && //Check for edge cases. Defensive Programming
            matchedProfile.matches.some(profile => profile._id === userID)
        )
        : []; 


    return (
        <div className="matches-and-messages">
            <div className="matches-display">
                <h3 className="section-header">MATCHES</h3>
                <div className="matches-list">
                    {realMatches?.map((match) => (
                        <div key={match._id} className="match-list-card" onClick={() => { setOpenProfile(match); setOpenChat(null); }}>   {/*PROFILE*/}
                            <div className="img-container">
                                <img src={match?.img_url_1 ? match?.img_url_1 : 'https://i.imgur.com/mCHMpLT.png'} alt={match?.name} />
                                <div className="overlay">
                                    <div className="overlay-text">View Profile</div>
                                </div>
                            </div>
                            <p className="match-name">{match?.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-list-display">
                <h3 className="section-header">MESSAGES</h3>
                <div className="chats-list">
                {realMatches.map((match) => {
                        const lastMessage = lastMessages[match._id] || "Tap to start chat!";
                        return (
                            <div key={match._id} className="match-card" onClick={() => { setOpenProfile(null); setOpenChat(match); }}>
                                <div className="img-container">
                                    <img src={match?.img_url_1 ? match.img_url_1 : 'https://i.imgur.com/mCHMpLT.png'} alt={match?.name} />
                                </div>
                                <div className="message-info">
                                    <p className="list-match-name">{match?.name}</p>
                                    <p className="prompt-message">{lastMessage}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DisplayMatches;