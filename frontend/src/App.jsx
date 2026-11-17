import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import AddApplication from "./pages/AddApplication.jsx";
import Applications from "./pages/Applications.jsx";
import Chat from "./pages/Chat.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/add" element={<AddApplication />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}