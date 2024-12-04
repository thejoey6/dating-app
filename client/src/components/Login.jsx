import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import '../Auth.css';


const Login = ({ setShowRegister, setShowLogin }) => {
  //Form
  const [form, setForm] = useState({ email: "", password: "", });

  //Cookies
  const [cookies, setCookie, removeCookie] = useCookies();

  //Error State
  const [errorMessage, setErrorMessage] = useState("");

  //Update form
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setErrorMessage("*Please enter an email and password*")
      return;
    }

    const person = { ...form };
    try {
      let response;
      // Send request to database
      response = await fetch("http://localhost:5050/profile/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setErrorMessage('*Invalid email and password*')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }


      const result = await response.json();
      const ID = result._id;  // Retrieve userID

      //Set Cookies
      setCookie('AuthToken', result.token);
      setCookie('UserId', ID);

      navigate(`/dashboard`);

    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);

    } finally {
      setForm({ email: "", password: "" });
    }
  }

  function handleRegisterClick() {
    setShowLogin(false)
    setShowRegister(true)
  }

  return (
    <div className='Auth'>
      <div className='Box'>
        <h1 className='TitleMessage'>Welcome</h1>
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
        <div className='inputContainer'>
          <button className='AuthButton' onClick={onSubmit}>Sign In</button>
        </div>
        <div className='inputContainer'>
          <p className='noAccountText'>
            No account? <span className='registerLink' onClick={handleRegisterClick}>Sign up now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

