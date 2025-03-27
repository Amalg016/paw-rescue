import React, { useState } from "react";

import './auth.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// For development (if not using Docker)
const devAPI = axios.create({
    baseURL: '/api', // Let Nginx handle the proxy
});
const SignIn = () => {
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate(); // Initialize useNavigate


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value,
        });
    }

    const handleSignin = async () => {
        try {
            const response = await devAPI.post(`/signin`, userDetails);
            alert("User signed in successfully!");

            localStorage.setItem("userDetails", JSON.stringify(response.data));

            navigate("/");

        } catch (error) {
            console.error("Error authentication:", error);
            alert("User credentials mismatch.");
        }
    }

    return (
        <div className="staffPage">

            <div className="authForm">

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Username" onChange={handleFormChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" onChange={handleFormChange} />
                </div>

                <button onClick={handleSignin}>Signin</button>


            </div>
        </div>
    )
}

export default SignIn;
