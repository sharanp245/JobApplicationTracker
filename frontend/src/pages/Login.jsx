import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin() {
        setError("");

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/home");
        } else {
            setError(data.error);
        }
    }

    return (
        <div className="login-container">
            <h1>Welcome to the Login Page</h1>

            <div className="inputs">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <p className="error">{error}</p>}

            <button onClick={handleLogin}>Login</button>

            <p>
                Don't have an account? <Link to="/register">Register Here!</Link>
            </p>
        </div>
    );
}