import { useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyForm = {
    company: "",
    role: "",
    status: "applied",
    dateApplied: "",
    jobUrl: "",
    notes: ""
};

export default function AddApplication() {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave() {
        setError("");

        if (form.company.trim() === "" || form.role.trim() === "") {
            setError("Company and role are required.");
            return;
        }

        const response = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (response.status === 401) {
            navigate("/");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            navigate("/applications");
        } else {
            setError(data.error);
        }
    }

    return (
        <div className="page-container">
            <h1>Add a Job Application</h1>

            <div className="inputs">
                <input name="company" className="form-input" placeholder="Company"
                       value={form.company} onChange={handleChange} />
                <input name="role" className="form-input" placeholder="Role"
                       value={form.role} onChange={handleChange} />

                <select name="status" className="form-input"
                        value={form.status} onChange={handleChange}>
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input name="dateApplied" type="date" className="form-input" aria-label="Date applied"
                       value={form.dateApplied} onChange={handleChange} />
                <input name="jobUrl" className="form-input" placeholder="Job posting link (optional)"
                       value={form.jobUrl} onChange={handleChange} />
                <textarea name="notes" className="form-input" rows="4" placeholder="Notes (optional)"
                          value={form.notes} onChange={handleChange} />
            </div>

            {error && <p className="error">{error}</p>}

            <button onClick={handleSave}>Save</button>
        </div>
    );
}