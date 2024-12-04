import Navbar from '../components/Navbar'
import Login from "../components/Login"
import Register from "../components/Register"
import {useState} from 'react'

const Home = () => {
    const [showLogin, setShowLogin] = useState(true)
    const [showRegister, setShowRegister] = useState(false)

    return (
        <div className="overlay">
            <Navbar
                setShowRegister={setShowRegister}
                setShowLogin={setShowLogin}
                showLogin={showLogin}
            />
            <div className="home">
                
                {showLogin && (
                    <Login setShowLogin={setShowLogin} setShowRegister={setShowRegister} />
                )}
                {showRegister && (
                    <Register setShowLogin={setShowLogin} setShowRegister={setShowRegister}/>
                )}

            </div>
        </div>
    )
}
export default Home