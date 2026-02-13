import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";


function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [storedUsername, setStoredUsername] = useLocalStorage("username", null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useLocalStorage("token", null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest("/auth/token", {
                method: "post",
                data: { username, password }
            });
            setToken(res.token);
            // Decode the token to get the username
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            setStoredUsername(payload.username);
            console.log("Login successful, token:", res.token);
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#e91e63", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;