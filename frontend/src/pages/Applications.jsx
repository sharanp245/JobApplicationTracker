import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationCard from "../components/ApplicationCard.jsx";

export default function Applications() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(function () {
        async function loadApplications() {
            const response = await fetch("/api/applications");
            if (response.status === 401) {
                navigate("/");
                return;
            }
            setItems(await response.json());
            setLoading(false);
        }
        loadApplications();
    }, []);

    async function handleDelete(id) {
        if (!confirm("Delete this application?")) return;

        const response = await fetch("/api/applications/" + id, { method: "DELETE" });

        if (response.ok) {
            setItems(items.filter(function (item) {
                return item.id !== id;
            }));
        } else {
            setError("Could not delete.");
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="page-container">
            <h1>My Applications</h1>

            {error && <p className="error">{error}</p>}

            {items.length === 0 && <p>No applications yet. Add your first one!</p>}

            {items.map(function (item) {
                return <ApplicationCard key={item.id} item={item} onDelete={handleDelete} />;
            })}
        </div>
    );
}