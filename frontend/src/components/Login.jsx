import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("login/", {
                email,
                password,
            });

            console.log("LOGIN DATA:", response.data);

            // Check whether login was successful
            if (response.data.token) {

                // Save JWT token
                localStorage.setItem("token", response.data.token);

                console.log(
                    "SAVED TOKEN:",
                    localStorage.getItem("token")
                );

                alert("Login Successful!");

                setEmail("");
                setPassword("");

                // Go to Dashboard only after successful login
                navigate("/dashboard");

            } else {

                // Login failed
                alert(response.data.message);

            }

        } catch (error) {

            console.log("LOGIN ERROR:", error);

            alert("Something went wrong. Please try again.");

        }

    };

    return (
        <>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

            <p>
                Don't have an account?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>

        </>
    );
}

export default Login;