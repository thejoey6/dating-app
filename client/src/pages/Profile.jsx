import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar'
import '../App.css';

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    birth_day: "",
	  birth_month: "",
	  birth_year: "",
	  gender: "",
	  gender_preference: "",
	  img_url_1: "",
	  img_url_2: "",
	  img_url_3: "",
	  img_url_4: "",
	  img_url_5: "",
	  img_url_6: "",
	  bio: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  // Profile Completion State
  const [isProfileComplete, setIsProfileComplete] = useState(false); 

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;  

      if(!id) return;                                   
      setIsNew(false);    //Should always reach this point
      const response = await fetch(
        `http://localhost:5050/profile/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }

      const profile = await response.json();
      if (!profile) {
        console.warn(`profile with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(profile);
      //Check if Profile is complete
      if (profile.name || profile.birth_day || profile.birth_month || profile.birth_year || profile.gender ||
        profile.gender_preference /*|| !user.img_url_1*/) { //Add image requirement if we don't decide to use default pictures
        setIsProfileComplete(true)
      }
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    /* Implement when all forms are available for completion:
    
    if (!form.name || !form.birth_day || !form.birth_month || !form.birth_year || !form.gender || 
      !form.gender_preference || !form.img_url_1) {
      return;
    }
    */

    const person = { ...form };
    try {
      let response;

      if (isNew) {
        // ERROR: should never reach this point

      } else {
        // if we are updating a profile we will PATCH to /profile/:id.
        response = await fetch(`http://localhost:5050/profile/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);

    } finally {
      setForm({ name: "", birth_day: "", birth_month: "", birth_year: "", gender: "", gender_preference: "",
      img_url_1: "", img_url_2: "", img_url_3: "", img_url_4: "", img_url_5: "", img_url_6: "",
      bio: "" });
      navigate("/dashboard");
    }
  }

 return (
  <>
    <Navbar isProfileComplete={isProfileComplete} />
    <div className="profile-container">
      <h3 className="profile-header">Edit Profile</h3>
      <form onSubmit={onSubmit} className="profile-form">
        <div className="profile-form-section">
          <div className="profile-info">
            <h2 className="profile-info-header">Profile Info</h2>
            <p className="profile-info-text">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="profile-inputs">

            <div className="profile-input-group">
              <label htmlFor="name" className="profile-label">Name</label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="profile-input"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="profile-input-group">
              <label htmlFor="DOB" className="profile-label">Date of birth</label>
              <div className="profile-input-wrapper">

                <input
                  type="number"
                  name="DOB_month"
                  id="DOB_month"
                  className="profile-input"
                  placeholder="MM"
                  value={form.birth_month}
                  onChange={(e) => updateForm({ birth_month: e.target.value })}
                  required                
                />
                <input
                  type="number"
                  name="DOB_day"
                  id="DOB_day"
                  className="profile-input"
                  placeholder="DD"
                  value={form.birth_day}
                  onChange={(e) => updateForm({ birth_day: e.target.value })}
                  required
                />
                <input
                  type="number"
                  name="DOB_year"
                  id="DOB_year"
                  className="profile-input"
                  placeholder="YYYY"
                  value={form.birth_year}
                  onChange={(e) => updateForm({ birth_year: e.target.value })}
                  required
                />

              </div>
            </div>

            <div className="profile-input-group">
              <label htmlFor="gender" className="profile-label">Gender</label>
              <div className="profile-radio-group">
                <div className="profile-radio-item">
                  <input
                    type="radio"
                    id="man"
                    name="gender"
                    value="Man"
                    className="profile-radio"
                    checked={form.gender === 'Man'}
                    onChange={(e) => updateForm({ gender: e.target.value })}
                    required
                  />
                  <label htmlFor="man" className="profile-radio-label">Man</label>
                </div>
                <div className="profile-radio-item">
                  <input
                    type="radio"
                    id="woman"
                    name="gender"
                    value="Woman"
                    className="profile-radio"
                    checked={form.gender === 'Woman'}
                    onChange={(e) => updateForm({ gender: e.target.value })}
                    required
                  />
                  <label htmlFor="woman" className="profile-radio-label">Woman</label>
                </div>
                <div className="profile-radio-item">
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    value="Other"
                    className="profile-radio"
                    checked={form.gender === 'Other'}
                    onChange={(e) => updateForm({ gender: e.target.value })}
                    required
                  />
                  <label htmlFor="other" className="profile-radio-label">Other</label>
                </div>
              </div>
            </div>

            <div className="profile-input-group">
              <label htmlFor="gender_preference" className="profile-label">Show me</label>
              <div className="profile-radio-group">
                <div className="profile-radio-item">
                  <input
                    type="radio"
                    id="men"
                    name="gender_preference"
                    value="Men"
                    className="profile-radio"
                    checked={form.gender_preference === 'Men'}
                    onChange={(e) => updateForm({ gender_preference: e.target.value })}
                    required
                  />
                  <label htmlFor="men" className="profile-radio-label">Men</label>
                </div>
                <div className="profile-radio-item">
                  <input
                    type="radio"
                    id="women"
                    name="gender_preference"
                    value="Women"
                    className="profile-radio"
                    checked={form.gender_preference === 'Women'}
                    onChange={(e) => updateForm({ gender_preference: e.target.value })}
                    required
                  />
                  <label htmlFor="women" className="profile-radio-label">Women</label>
                </div>
                <div className="profile-radio-item">
                  <input
                    type="radio"
                    id="everyone"
                    name="gender_preference"
                    value="Everyone"
                    className="profile-radio"
                    checked={form.gender_preference === 'Everyone'}
                    onChange={(e) => updateForm({ gender_preference: e.target.value })}
                    required
                  />
                  <label htmlFor="everyone" className="profile-radio-label">Everyone</label>
                </div>
              </div>
            </div>

            <div className="profile-input-group">
              <label htmlFor="bio" className="profile-label">About me</label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  name="bio"
                  id="bio"
                  className="profile-input"
                  placeholder="I love to hike!"
                  value={form.bio}
                  onChange={(e) => updateForm({ bio: e.target.value })}
                />
              </div>
            </div>

          <div className="profile-picture-group">

            <div className="profile-input-group">
              <label htmlFor="url" className="profile-label">Profile photo URL</label>
              <div className="profile-input-wrapper">
                <input
                  type="url"
                  name="url1"
                  id="url1"
                  className="profile-input"
                  placeholder="www.pictureofme.com/selfie"
                  value={form.img_url_1}
                  onChange={(e) => updateForm({ img_url_1: e.target.value })}
                />
                <div className="photo-container">
                  {form.img_url_1 && <img src={form.img_url_1} alt="picture preview"/>}
                </div>
              </div>
            </div>

              <div className="profile-input-group">
              <label htmlFor="url" className="profile-label">Additional photo URLs</label>
              <div className="profile-input-wrapper">
                <input
                  type="url"
                  name="url2"
                  id="url2"
                  className="profile-input"
                  placeholder="I'm optional!"
                  value={form.img_url_2}
                  onChange={(e) => updateForm({ img_url_2: e.target.value })}
                />
                <div className="photo-container">
                  {form.img_url_2 && <img src={form.img_url_2} alt="picture preview"/>}
                </div>

                <input
                  type="url"
                  name="url3"
                  id="url3"
                  className="profile-input"
                  placeholder="I'm optional!"
                  value={form.img_url_3}
                  onChange={(e) => updateForm({ img_url_3: e.target.value })}
                />
                <div className="photo-container">
                  {form.img_url_3 && <img src={form.img_url_3} alt="picture preview"/>}
                </div>

                <input
                  type="url"
                  name="url4"
                  id="url4"
                  className="profile-input"
                  placeholder="I'm optional!"
                  value={form.img_url_4}
                  onChange={(e) => updateForm({ img_url_4: e.target.value })}
                />
                <div className="photo-container">
                  {form.img_url_4 && <img src={form.img_url_4} alt="picture preview"/>}
                </div>

                <input
                  type="url"
                  name="url5"
                  id="url5"
                  className="profile-input"
                  placeholder="I'm optional!"
                  value={form.img_url_5}
                  onChange={(e) => updateForm({ img_url_5: e.target.value })}
                />
                <div className="photo-container">
                  {form.img_url_5 && <img src={form.img_url_5} alt="picture preview"/>}
                </div>

                <input
                  type="url"
                  name="url6"
                  id="url6"
                  className="profile-input"
                  placeholder="I'm optional!"
                  value={form.img_url_6}
                  onChange={(e) => updateForm({ img_url_6: e.target.value })}
                />
                <div className="photo-container">
                  {form.img_url_6 && <img src={form.img_url_6} alt="picture preview"/>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

        <input
          type="submit"
          value="Save Profile"
          className="profile-submit"
        />
      </form>
    </div>
  </>
  );
}
