import { useState, useEffect } from 'react'
import './css/App.css'

import useLocalStorage from "./hooks/useLocalStorage";
import NavBar from './components/NavBar'; 
import AppRoutes from './routes/AppRoutes';
import UserContext from "./UserContext";
import { apiRequest } from "./api";

function App() {
  const [token, setToken] = useLocalStorage("token", null);
  const [username] = useLocalStorage("username", null);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(() => {
    setInfoLoaded(false);
    if (token && username) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setCurrentUser({ ...userObj, token });
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setInfoLoaded(true);
  }, [token, username]);

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
