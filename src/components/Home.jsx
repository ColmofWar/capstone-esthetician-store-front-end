import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

function Home() {
    const [username] = useLocalStorage("username", null);
    console.log("Home page username:", username);
    return (
        <div>
            <h1>
                {username ? `Welcome, ${username}!` : "Welcome to the Home Page"}
            </h1>
        </div>
    );
}

export default Home;