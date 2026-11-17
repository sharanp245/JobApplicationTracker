import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(function () {
        async function loadUser() {
            const response = await fetch("/api/me");
            if (!response.ok) {
                navigate("/");
                return;
            }
            setUser(await response.json());
        }
        loadUser();
    }, []);

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        navigate("/");
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <nav className="navbar">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/add">Add Application</NavLink>
                <NavLink to="/applications">My Applications</NavLink>
                <NavLink to="/chat">AI Coach</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <Outlet context={{ user }} />
        </>
    );
}