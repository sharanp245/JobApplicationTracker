import { useOutletContext } from "react-router-dom";

export default function Home() {
    const { user } = useOutletContext();

    return (
        <div className="page-container">
            <h1>Welcome, {user.firstName} {user.lastName}!</h1>
        </div>
    );
}