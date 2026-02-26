import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../api";
import UserContext from "../UserContext";

function Profile() {
    const [profile, setProfile] = useState({ username: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const {
        currentUser,
        homeAddress,
        setHomeAddress,
        billingAddress,
        setBillingAddress,
        addressLoading,
        addressError
    } = useContext(UserContext);

    useEffect(() => {
        if (currentUser) {
            setProfile(prev => ({
                username: currentUser.username || "",
                email: prev.email !== currentUser.email ? currentUser.email || "" : prev.email,
                phone: prev.phone !== currentUser.phone ? currentUser.phone || "" : prev.phone
            }));
        }
        setLoading(false);
    }, [currentUser]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    const handleHomeChange = (e) => {
        setHomeAddress({ ...homeAddress, [e.target.name]: e.target.value });
    };
    const handleBillingChange = (e) => {
        setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await apiRequest(`/users/${profile.username}`, {
                method: "patch",
                data: {
                    email: profile.email,
                    phone: profile.phone
                },
            });
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Error updating profile");
        }
    };

    const handleHomeSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await apiRequest(`/address/${profile.username}/home`, {
                method: "post",
                data: homeAddress
            });
            setSuccess("Home/shipping address updated!");
        } catch (err) {
            setError(err.message || "Error updating home/shipping address");
        }
    };

    const handleBillingSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await apiRequest(`/address/${profile.username}/billing`, {
                method: "post",
                data: billingAddress,
            });
            setSuccess("Billing address updated!");
        } catch (err) {
            setError(err.message || "Error updating billing address");
        }
    };

    if (loading || addressLoading) return <div>Loading profile...</div>;
    if (addressError) return <div style={{ color: "red" }}>{addressError}</div>;

    return (
        <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h1>Your Profile</h1>
            <form onSubmit={handleProfileSubmit} style={{ marginBottom: 32 }}>
                <h2>Profile Info</h2>
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
                        onChange={handleProfileChange}
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
                        onChange={handleProfileChange}
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: 10, background: "#2196f3", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>
                    Update Profile
                </button>
            </form>
            <form onSubmit={handleHomeSubmit} style={{ marginBottom: 32 }}>
                <h2>Home Address</h2>
                <div style={{ marginBottom: 16 }}>
                    <label>Street:</label>
                    <input name="street" value={homeAddress.street} onChange={handleHomeChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>City:</label>
                    <input name="city" value={homeAddress.city} onChange={handleHomeChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>State:</label>
                    <input name="state" value={homeAddress.state} onChange={handleHomeChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Postal Code:</label>
                    <input name="postal_code" value={homeAddress.postal_code} onChange={handleHomeChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Country:</label>
                    <input name="country" value={homeAddress.country} onChange={handleHomeChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <button type="submit" style={{ width: "100%", padding: 10, background: "#4caf50", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>
                    Update Home/Shipping Address
                </button>
            </form>
            <form onSubmit={handleBillingSubmit}>
                <h2>Billing Address</h2>
                <div style={{ marginBottom: 16 }}>
                    <label>Street:</label>
                    <input name="street" value={billingAddress.street} onChange={handleBillingChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>City:</label>
                    <input name="city" value={billingAddress.city} onChange={handleBillingChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>State:</label>
                    <input name="state" value={billingAddress.state} onChange={handleBillingChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Postal Code:</label>
                    <input name="postal_code" value={billingAddress.postal_code} onChange={handleBillingChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Country:</label>
                    <input name="country" value={billingAddress.country} onChange={handleBillingChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                </div>
                <button type="submit" style={{ width: "100%", padding: 10, background: "#ff9800", color: "#fff", border: "none", borderRadius: 6, fontWeight: 700 }}>
                    Update Billing Address
                </button>
            </form>
            {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
            {success && <div style={{ color: "green", marginTop: 16 }}>{success}</div>}
        </div>
    );
}

export default Profile;