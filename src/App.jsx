import { useState, useEffect } from 'react'
import './css/App.css'

import useLocalStorage from "./hooks/useLocalStorage";
import NavBar from './components/NavBar'; 
import AppRoutes from './routes/AppRoutes';
import UserContext from "./UserContext";
import { apiRequest } from "./api";

function App() {
  const [token, setToken] = useLocalStorage("token", null);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(() => {
    async function getUser() {
      setInfoLoaded(false);
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded token payload:", payload);
          console.log("Fetching user data for:", payload.username);
          const user = await apiRequest(`/users/${payload.username}`);
          setCurrentUser(user);
        } catch (err) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setInfoLoaded(true);
    }
    getUser();
  }, [token]);

  return (
    <>
      <div className="App">
        <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken }}>
          <NavBar />
          <div className="app-container">
            <AppRoutes />
          </div>
        </UserContext.Provider>
      </div>
    </>
  )
}

export default App
