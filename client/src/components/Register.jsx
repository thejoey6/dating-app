import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useCookies} from 'react-cookie';
import '../Auth.css'


export default function Register({ setShowRegister, setShowLogin }) {

  //Form
  const [form, setForm] = useState({ email: "", password: "", });

  //Cookies
  const [cookies, setCookie, removeCookie] = useCookies();

  //Error State
  const [errorMessage, setErrorMessage] = useState("");

  //Update form
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value }; }); 
    }

  //Navigate
  const navigate = useNavigate();
  
  function handleLoginClick() {
    setShowLogin(true)
    setShowRegister(false)
  }

  function validateEmail(email) {
    // Regular expression to validate email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setErrorMessage("*Please enter an email and password*")
      return;
    }

    if (!validateEmail(form.email)) {
      setErrorMessage("*Please enter a valid email address*");
      return;
    }

    const person = { ...form };
    try {
      let response;
        // if we are adding a new profile we will POST to /profile.
        response = await fetch("http://localhost:5050/profile/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
        
      if (!response.ok) {
        if (response.status === 409) { //User already exists
          setErrorMessage(
            <span>
              *User already exists. Please
              <span className='registerLink' onClick={handleLoginClick}> Login</span>
              *
            </span>
          )
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const result = await response.json();

        //Set Cookies
        setCookie('AuthToken', result.token);
        setCookie('UserId', result.insertedId);
        navigate(`/profile/${result.insertedId}`);     
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);

    } finally {
      setForm({ email: "", password: "" });
    }
  }

  return (
    <div className='Auth'>
      <div className='Box'>
        <h1 className='TitleMessage'>Register</h1>
        <div className='formContainer'>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className='inputContainer'>
            <input
              type='email'
              className='email'
              onChange={(e) => updateForm({ email: e.target.value })}
              value={form.email}
              placeholder='Email'
            />
          </div>
          <div className='inputContainer'>
            <input
              type='password'
              className='password'
              onChange={(e) => updateForm({ password: e.target.value })}
              value={form.password}
              placeholder='Password'
            />
          </div>
        </div>
        <button className='AuthButton' onClick={onSubmit}>Create Account</button>
      </div>
    </div>
  );
};
