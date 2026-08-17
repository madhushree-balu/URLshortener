import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("register/", {
                name: name,
                email: email,
                password: password
            });

            console.log("REGISTER DATA:", response.data);

            alert("Registration Successful!");

            setName("");
            setEmail("");
            setPassword("");

            // Go to Login page after successful registration
            navigate("/login");

        } catch (error) {

            console.log("REGISTER ERROR:", error);

            alert("Registration Failed!");

        }

    };

    return (
        <>
            <h1>Register</h1>

            <form className="register-form" onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Submit
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </form>
        </>
    );
}

export default Register;