import React, { useState, useContext } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import useLocalStorage from "../hooks/useLocalStorage";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setToken: setTokenContext, setCurrentUser } = useContext(UserContext);
    const [token, setToken] = useLocalStorage("token", null);
    const [storedUsername, setStoredUsername] = useLocalStorage("username", null);
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
            // Set token and username using their setters
            await Promise.all([
                setToken(res.token),
                setStoredUsername(() => {
                    const payload = JSON.parse(atob(res.token.split('.')[1]));
                    return payload.username;
                })
            ]);
            setTokenContext && setTokenContext(res.token); // update context if needed
            // Decode the token to get the username
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            // Wait for state updates to propagate
            await new Promise(resolve => setTimeout(resolve, 0));
            // Fetch full user object and store in localStorage, set context before signaling parent
            let userObj = { username: payload.username };
            try {
                const user = await apiRequest(`/users/${payload.username}`);
                setCurrentUser && setCurrentUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                userObj = user;
            } catch (e) {
                // fallback: store username only if user fetch fails
                setCurrentUser && setCurrentUser({ username: payload.username });
                localStorage.setItem("user", JSON.stringify({ username: payload.username }));
            }
            if (onLogin) onLogin(userObj);
            // Wait for context update before signaling parent
            await new Promise(resolve => setTimeout(resolve, 0));
            console.log("Login successful, token:", res.token);
            // Navigation handled by parent (AuthPage)
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