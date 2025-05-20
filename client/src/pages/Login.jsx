import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({setIsLoggedIn, setSavedEmail}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("https://task-management-1dlj.onrender.com/login", { email, password })
            const token = res.data.access_token
            localStorage.setItem("token", token)
            localStorage.setItem("email", email)
            setSavedEmail("Hello, " + email)
            setIsLoggedIn(true)
            navigate("/") // redirect to home after login
        } catch (err) {
            alert("Login failed")
        }
    }

    return (
        <div className='p-6 mt-20'>
            <h2 className='text-5xl border-b p-3'>Log In</h2>
            <br/>
            <form onSubmit={handleLogin}>
            <input
                className="bg-white text-black rounded-2xl text-center mb-3 mt-6"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                className="bg-white text-black rounded-2xl text-center mb-5"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <br/>
            <button type="submit" id="btn">Login</button>
            </form>
        </div>
    )
}