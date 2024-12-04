import { useEffect, useState } from "react";
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navbar from '../components/Navbar'
import '../App.css';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [potentialMatches, setPotentialMatches] = useState(null);
    const navigate = useNavigate();
    const [cookies] = useCookies()
    const userID = cookies.UserId

    const getUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5050/profile/${id}`);

            const user = await response.json();
            setUser(user);
        } catch (error) {
            console.log(error)
        }
    }

    function returnAge(profile) {
        const profile_dob = new Date(profile.birth_year, profile.birth_month - 1, profile.birth_day);

        const today = new Date();
        let age = today.getFullYear() - profile_dob.getFullYear();
        const monthDifference = today.getMonth() - profile_dob.getMonth();
        const dayDifference = today.getDate() - profile_dob.getDate();

        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        return age;
    }


    const getPotentialMatches = async () => {

        if (!user) return;
        if (user.gender_preference === 'Everyone') {        //Other only shows up here

            try {
                const response = await fetch(`http://localhost:5050/profile/users`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setPotentialMatches(data);
            } catch (error) {
                console.log(error)
            }

        } else {        //Men or Women

            try {
                const response = await fetch(`http://localhost:5050/profile/gendered-users?genderPreference=${user.gender_preference}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setPotentialMatches(data);
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (!userID) {
            navigate("/");
        } else {
            getUser(userID)
        }
    }, [userID])

    useEffect(() => {
        if (user) {
            getPotentialMatches()
        }
    }, [user])


    if (!user) {
        return <div>Loading...</div>; //To Prevent null checks to user
    }

    //If Profile is not yet complete then navigate to Profile page  
    if (!user.name || !user.birth_day || !user.birth_month || !user.birth_year || !user.gender ||
        !user.gender_preference /*|| !user.img_url_1*/) { //Add image requirement if we don't decide to use default pictures
        navigate(`/profile/${userID}`)
    }

    const updateMatches = async (matchID) => {
        try {
            const response = await fetch(`http://localhost:5050/profile/match/${userID}/${matchID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            await response.json();
            getUser(userID)
        } catch (error) {
            console.log(error)
        }
    }


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
    }

    const preferenceCheck = (matchPreference) => {
        if (!user || !user.gender) {
            return false; // Return false if user or user gender is not defined
        }
        
        if (matchPreference === "Men") {
            return user.gender === "Man";
        } else if (matchPreference === "Women") {
            return user.gender === "Woman";
        } else {
            return true; // If potential match prefers Everyone
        }
    }

    const dontDisplay = user?.matches.map(({ _id }) => _id).concat(userID).concat(user.blocked_users ? user.blocked_users.map(({ _id }) => _id) : []);

    const filteredPotentialMatches = potentialMatches?.filter(
        potentialMatch => (!dontDisplay.includes(potentialMatch._id) &&
                          preferenceCheck(potentialMatch.gender_preference)
        )
    )

    // Function to block a user
    const blockUser = async (blockUserId) => {
        try {
            // Call the backend API to block the user
            const response = await fetch(`http://localhost:5050/profile/block/${userID}/${blockUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            await response.json();
            getUser(userID);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />
            {user && (
                <div className="dashboard">
                    <ChatContainer user={user} onBlock={blockUser} />
                    <div className="swipe-container">
                        <div className="card-container">
                                {filteredPotentialMatches?.map((potentialMatch) =>
                                    <TinderCard
                                        className="swipe-card"
                                        key={potentialMatch._id}
                                        onSwipe={(dir) => swiped(dir, potentialMatch._id)}>
                                        <div
                                            style={{ backgroundImage: `url(${potentialMatch.img_url_1 ? potentialMatch.img_url_1 : 'https://i.imgur.com/mCHMpLT.png'})` }}
                                            className="card">
                                            <div className="card-content">
                                                <h2>{potentialMatch.name}, {returnAge(potentialMatch)}</h2>
                                                <p>{potentialMatch.bio}</p>
                                                <button className="block-button" onClick={() => blockUser(potentialMatch._id)}>Block</button>
                                            </div>
                                        </div>
                                    </TinderCard>
                                )}
                                                        <div className="no-cards-message">
                                    <h2>No more matches available</h2>
                                    <p>Try again later or update your preferences.</p>
                                </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;

