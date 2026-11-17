import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleRegister() {
        setError("");

        if (form.firstName === "" || form.username === "" || form.password === "") {
            setError("Please fill in the required fields.");
            return;
        }

        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/");
        } else {
            setError(data.error);
        }
    }

    return (
        <div className="login-container">
            <h1>Create an Account</h1>

            <div className="inputs">
                <input name="firstName" className="form-input" placeholder="First Name"
                       value={form.firstName} onChange={handleChange} />
                <input name="lastName" className="form-input" placeholder="Last Name"
                       value={form.lastName} onChange={handleChange} />
                <input name="dob" type="date" className="form-input" aria-label="Date of Birth"
                       value={form.dob} onChange={handleChange} />
                <input name="email" type="email" className="form-input" placeholder="Email Address"
                       value={form.email} onChange={handleChange} />
                <input name="username" className="form-input" placeholder="Username"
                       value={form.username} onChange={handleChange} />
                <input name="password" type="password" className="form-input" placeholder="Password"
                       value={form.password} onChange={handleChange} />
            </div>

            {error && <p className="error">{error}</p>}

            <button onClick={handleRegister}>Register</button>

            <p>
                Already have an account? <Link to="/">Login Here!</Link>
            </p>
        </div>
    );
}