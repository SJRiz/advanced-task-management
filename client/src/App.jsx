import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Tasks from './pages/Tasks'
import Login from './pages/Login'
import Register from "./pages/Register";
import Groups from './pages/Groups';

function App() {
  // Save the email and login as a state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const [savedEmail, setSavedEmail] = useState("Please Log In.")
  const navigate = useNavigate()

  // Every time the page loads, or the logged in state changes, redirect to groups page
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"))

    const email = localStorage.getItem("email")
    if (email) {
      setSavedEmail("Hello, " + localStorage.getItem("email"))
    }

    if (isLoggedIn && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/")
    }

  }, [isLoggedIn, location.pathname])

  // Function to log the user out, and send them to log in page
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    setIsLoggedIn(false)
    setSavedEmail("Please Log In.")
    navigate("/login")
  }

  return (
    <>
    <h1 className='text-center p-3 border-b-1 border-gray-500'>{savedEmail}</h1>
      <div className="bg-gradient-to-r from-black via-gray-900 to-black h-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-center border-4 backdrop-blur-2xl
        border-gray-900 w-100 h-175 container mx-auto p-4 rounded-3xl shadow-lg
        bg-gradient-to-tr from-gray-900 to-gray-950 transform transition-transform duration-300 ease-in-out hover:scale-102">
        <nav className="bg-gray-900 rounded-3xl p-1 border-1 mb-5 border-gray-600">
          {isLoggedIn ? (
            // If logged in, show the logout button only
            <button onClick={handleLogout}
            className=" w-87 rounded-3xl"
            id='btn'>Log Out</button>
          ) : (
            // Else, show the navigation to register and log in
            <>
            <Link to="/register">Register </Link>
            | <Link to="/login">Log In</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Groups />} />
          <Route path="/tasks" element={<Tasks />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setSavedEmail={setSavedEmail}/>} />
        </Routes>
        </div>
      </div>
    </>
  )
}

export default App