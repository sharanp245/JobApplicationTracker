import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    // Keep the newest message in view
    useEffect(function () {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [history, sending]);

    async function sendMessage() {
        const text = input.trim();
        if (text === "" || sending) return;

        if (history.length >= 40) {
            setError("This conversation is getting long. Click 'New chat' to start fresh.");
            return;
        }

        const newHistory = [...history, { role: "user", content: text }];
        setHistory(newHistory);
        setInput("");
        setError("");
        setSending(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newHistory })
            });

            if (response.status === 401) {
                navigate("/");
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setHistory([...newHistory, { role: "assistant", content: data.reply }]);
            } else {
                setHistory(history); // drop the failed question
                setError(data.error);
            }
        } catch (err) {
            setHistory(history);
            setError("Could not reach the server.");
        } finally {
            setSending(false);
        }
    }

    function newChat() {
        setHistory([]);
        setError("");
    }

    return (
        <div className="page-container">
            <h1>AI Coach</h1>
            <p className="hint">Ask what to learn or brush up on, based on your applications.</p>

            <div className="chat-log">
                {history.map(function (m, index) {
                    return <div key={index} className={"bubble " + m.role}>{m.content}</div>;
                })}
                {sending && <div className="bubble assistant">Thinking...</div>}
                <div ref={bottomRef} />
            </div>

            {error && <p className="error">{error}</p>}

            <div className="chat-input-row">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Type a message..."
                    maxLength={2000}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                />
                <button onClick={sendMessage} disabled={sending}>Send</button>
            </div>
            <button onClick={newChat}>New chat</button>
        </div>
    );
}