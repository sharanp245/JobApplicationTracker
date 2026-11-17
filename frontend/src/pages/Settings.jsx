import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ username: "", email: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pictureVersion, setPictureVersion] = useState(Date.now());
    const [deletePassword, setDeletePassword] = useState("");
    const navigate = useNavigate();

    useEffect(function () {
        async function loadProfile() {
            const response = await fetch("/api/profile");
            if (response.status === 401) {
                navigate("/");
                return;
            }
            const data = await response.json();
            setProfile(data);
            setForm({ username: data.username, email: data.email || "" });
        }
        loadProfile();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSaveProfile() {
        setMessage("");
        setError("");

        const response = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (response.status === 401) {
            navigate("/");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setProfile({ ...profile, username: form.username.trim(), email: form.email.trim() });
            setMessage("Profile updated.");
        } else {
            setError(data.error);
        }
    }

    async function handlePictureChange(e) {
        const input = e.target;
        const file = input.files[0];
        if (!file) return;

        setMessage("");
        setError("");

        // Friendly early check. The server still does the real check.
        if (file.size > 2 * 1024 * 1024) {
            setError("Picture must be 2 MB or smaller.");
            input.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("picture", file);

        // No Content-Type header here: the browser adds the correct one for files itself
        const response = await fetch("/api/profile/picture", {
            method: "POST",
            body: formData
        });

        if (response.status === 401) {
            navigate("/");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setProfile({ ...profile, hasAvatar: true });
            setPictureVersion(Date.now()); // forces the browser to reload the image
            setMessage("Picture updated.");
        } else {
            setError(data.error);
        }
        input.value = "";
    }

    async function handleDeleteAccount() {
        setMessage("");
        setError("");

        if (!confirm("This permanently deletes your account and all your applications. Continue?")) {
            return;
        }

        const response = await fetch("/api/account", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: deletePassword })
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/");
        } else {
            setError(data.error);
        }
    }

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="page-container">
            <h1>Settings</h1>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <div className="section">
                {profile.hasAvatar ? (
                    <img
                        className="avatar"
                        src={"/api/profile/picture?v=" + pictureVersion}
                        alt="Your profile"
                    />
                ) : (
                    <div className="avatar placeholder">
                        {profile.firstName.charAt(0).toUpperCase()}
                    </div>
                )}
                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handlePictureChange} />
            </div>

            <div className="section">
                <h2>Your details</h2>
                <p>Name: {profile.firstName} {profile.lastName}</p>
                <p>Date of birth: {profile.dob || "not set"}</p>

                <div className="inputs">
                    <input name="username" className="form-input" placeholder="Username"
                           value={form.username} onChange={handleChange} />
                    <input name="email" type="email" className="form-input" placeholder="Email"
                           value={form.email} onChange={handleChange} />
                </div>
                <button onClick={handleSaveProfile}>Save changes</button>
            </div>

            <div className="danger-zone">
                <h2>Delete account</h2>
                <p>Enter your password to confirm. This cannot be undone.</p>
                <input type="password" className="form-input" placeholder="Password"
                       value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
                <button onClick={handleDeleteAccount}>Delete my account</button>
            </div>
        </div>
    );
}