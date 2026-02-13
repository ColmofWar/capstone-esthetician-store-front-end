import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";

function Profile() {
    const [profile, setProfile] = useState({ username: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                // Replace 'demo' with actual username if available
                const res = await apiRequest("/users/demo", {
                    method: "get",
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile({
                    username: res.user.username || "",
                    email: res.user.email || "",
                    phone: res.user.phone || ""
                });
            } catch (err) {
                setError(err.message || "Error loading profile");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const token = localStorage.getItem("token");
            const res = await apiRequest(`/users/${profile.username}`, {
                method: "patch",
                data: {
                    email: profile.email,
                    phone: profile.phone
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Error updating profile");
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h1>Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={profile.username}
                        disabled
                        style={{ width: "100%", padding: 8, marginTop: 4, background: "#f5f5f5" }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="phone">Phone:</label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={profile.phone}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
                {success && <div style={{ color: "green", marginBottom: 12 }}>{success}</div>}
                <button type="submit" style={{ width: "100%", padding: 10, background: "#2196f3", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default Profile;