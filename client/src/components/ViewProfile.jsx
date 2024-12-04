import '../App.css'
import {useState} from 'react'
import { useCookies } from 'react-cookie';

const ViewProfile = ({user, block, setOpenChat, setOpenProfile}) => {

    //Cookies for checking userID (not always same as user)
    const [ cookies ] = useCookies();
    const userID = cookies.UserId; // ID of logged in user 

    const [imageIndex, setImageIndex] = useState(1);

    const getImageCount = () => {
        let images = 0;
        for (let i = 1; i <= 6; i++) {
            if (user[`img_url_${i}`]) 
                { images = i; } 
            else { break; }
        }
        return images;
    };
    const imageCount = getImageCount();

    function returnAge (profile) {
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

    /* Get relevant image */

    const getImageUrl = (index) => user[`img_url_${index}`];

    const nextImage = () => {
        if (imageIndex < imageCount && getImageUrl(imageIndex + 1)) {
            setImageIndex(imageIndex + 1);
        }
    };

    const previousImage = () => {
        if (imageIndex > 1) {
            setImageIndex(imageIndex - 1);
        }
    };

    /*------------*/

    const handleBlock = async () => {
        block(user._id);
        setOpenChat(null);
        setOpenProfile(null);
    };

    return (
        <>
        <div className="view-profile">
            <div className="whole">
                <div className="image-container">
                    {imageIndex > 1 && (
                        <button className="arrow left-arrow" onClick={previousImage}>
                            &lt;
                        </button>
                    )}
                    <img
                        className="ProfileImage"
                        src={getImageUrl(imageIndex) || 'https://i.imgur.com/mCHMpLT.png'}
                        alt={`photo of ${user.name}`}
                    />
                        {imageIndex < imageCount && getImageUrl(imageIndex + 1) && (
                        <button className="arrow right-arrow" onClick={nextImage}>
                            &gt;
                        </button>
                    )}
                </div>
                    <div className='ProfileDetails'>
                        <div className='CustomPrompts'>
                            <div className='PromptContainer'>
                                <h1 className='Prompt'>Age:</h1>
                                <h1 className='PromptDetail'>{returnAge(user)} Years old</h1>
                            </div>
                            <div className='PromptContainer'>
                                <h1 className='Prompt'>I identify as...</h1>
                                <h1 className='PromptDetail'>{user.gender}</h1>
                            </div>
                            <div className='PromptContainer'>
                                <h1 className='Prompt'>I prefer...</h1>
                                <h1 className='PromptDetail'>{user.gender_preference}</h1>
                            </div>
                            <div className='PromptContainer'>
                                <h1 className='Prompt'>Something you should know about me...</h1>
                                <h1 className='PromptDetail'>{user.bio || "I haven't filled this out yet"}</h1>
                            </div>
                            <>
                                {(user._id != userID) ? (
                                <button className="block-button" onClick={handleBlock}>
                                    Block
                                </button>
                                ) : null }
                            </>
                        </div>
                    </div>
            </div>
        </div>
        </>
    );
}

export default ViewProfile;