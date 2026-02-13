
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function AuthPage() {
    const [view, setView] = useState("login");
    const [welcomeUser, setWelcomeUser] = useState(null);
    const navigate = useNavigate();

    const handleAuth = (user) => {
        if (user && user.username) {
            setWelcomeUser(user.username);
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <button
                    onClick={() => setView("login")}
                    style={{
                        padding: "0.7rem 2rem",
                        background: view === "login" ? "#e91e63" : "#eee",
                        color: view === "login" ? "#fff" : "#333",
                        border: "none",
                        borderRadius: "20px 0 0 20px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>
                <button
                    onClick={() => setView("signup")}
                    style={{
                        padding: "0.7rem 2rem",
                        background: view === "signup" ? "#2196f3" : "#eee",
                        color: view === "signup" ? "#fff" : "#333",
                        border: "none",
                        borderRadius: "0 20px 20px 0",
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}
                >
                    Sign Up
                </button>
            </div>
            {welcomeUser && (
                <div style={{ color: "green", fontWeight: 600, marginBottom: 20, fontSize: 18 }}>
                    Welcome, {welcomeUser}! Redirecting to the home page...
                </div>
            )}
            {view === "login" ? (
                <Login onLogin={handleAuth} />
            ) : (
                <Signup onSignup={handleAuth} />
            )}
        </div>
    );
}

export default AuthPage;
