import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from "react-router-dom";
import '../App.css'
import bruinLogo from '../assets/bruin-love.png';

const Navbar = ({ setShowRegister, setShowLogin, showLogin, isProfileComplete }) => {
  const [cookies, setCookie, removeCookie] = useCookies()
  const userID = cookies.UserId
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  const handleClick = () => {
    setShowRegister(false)
    setShowLogin(true);
  };

  const goHome = () => {
    navigate('/')
    setShowRegister(false)
    setShowLogin(true);
  }

  const logout = () => {
    removeCookie('UserId', cookies.UserId)
    removeCookie('AuthToken', cookies.AuthToken)
    navigate('/')
  }

  const register = () => {
    setShowRegister(true)
    setShowLogin(false)
  }

  return (
    <nav>
      <h1 className="nav-title" onClick={goHome}>Bruin Date</h1>
      <div className="nav-designs">
        <img src={bruinLogo} alt="Logo" className="nav-logo" />
      </div>

      <div className="nav-buttons">
        {cookies.UserId && cookies.AuthToken ? (
          <>
            <button className="nav-button" onClick={logout}>
              Logout
            </button>

            {isDashboard ? (
              <>
                <button className="nav-button" onClick={() => navigate(`/profile/${userID}`)}>
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                {isProfileComplete ? (
                  <button className="nav-button" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </button>
                ) : null}
              </>
            )}

          </>
        ) : (
          <>
            <button className="nav-button" onClick={handleClick}>
              Log in
            </button>

            <button className="nav-button" onClick={register}>
              Create Account
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;