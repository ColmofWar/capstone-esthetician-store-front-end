import React, { useContext } from "react";
import UserContext from "../UserContext";

function Home() {
    const { currentUser } = useContext(UserContext);
    return (
        <div>
            <h1>
                {currentUser ? `Welcome, ${currentUser.username}!` : "Welcome to the Home Page"}
            </h1>
        </div>
    );
}

export default Home;