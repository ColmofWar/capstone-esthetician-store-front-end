import React, { useState } from "react";
import { apiRequest } from "../api";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";


function Signup({ onSignup }) {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useLocalStorage("token", null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await apiRequest("/users", {
                method: "post",
                data: form
            });
            setToken(res.token);
            setSuccess(true);
            navigate("/");
        } catch (err) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
                {success && <div style={{ color: "green", marginBottom: 12 }}>User registered successfully!</div>}
                <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#2196f3", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}

export default Signup;
