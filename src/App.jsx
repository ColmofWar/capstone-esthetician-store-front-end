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
  const [homeAddress, setHomeAddress] = useState({ street: "", city: "", state: "", postal_code: "", country: "" });
  const [billingAddress, setBillingAddress] = useState({ street: "", city: "", state: "", postal_code: "", country: "" });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);

  useEffect(() => {
    setInfoLoaded(false);
    async function loadUserAndAddresses() {
      if (token && username) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userObj = JSON.parse(storedUser);
            
            // Fetch latest user info (email, phone)
            let latestUser = { ...userObj };
            console.log("Fetched user from localStorage:", token);
            try {
              const userRes = await apiRequest(`/users/${userObj.username}`, {
              });
              if (userRes.user) {
                latestUser = { ...latestUser, ...userRes.user };
              }
            } catch (e) {
              // fallback to stored user if fetch fails
            }
            setCurrentUser({ ...latestUser, token });

            // Fetch home address
            const homeRes = await apiRequest(`/address/${userObj.username}/home`, {
              method: "get"
            });
            if (homeRes.address) {
              setHomeAddress({
                street: homeRes.address.street || "",
                city: homeRes.address.city || "",
                state: homeRes.address.state || "",
                postal_code: homeRes.address.postal_code || "",
                country: homeRes.address.country || ""
              });
            }

            // Fetch billing address
            const billingRes = await apiRequest(`/address/${userObj.username}/billing`, {
              method: "get"
            });
            if (billingRes.address) {
              setBillingAddress({
                street: billingRes.address.street || "",
                city: billingRes.address.city || "",
                state: billingRes.address.state || "",
                postal_code: billingRes.address.postal_code || "",
                country: billingRes.address.country || ""
              });
            }
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
    }
    loadUserAndAddresses();
  }, [token, username]);

    // ...existing code...

  return (
    <>
      <div className="App">
        <UserContext.Provider value={{
          currentUser,
          setCurrentUser,
          token,
          setToken,
          homeAddress,
          setHomeAddress,
          billingAddress,
          setBillingAddress,
          addressLoading,
          addressError
        }}>
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
