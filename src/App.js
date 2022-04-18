import './App.css';
import React, {useEffect, useState, createContext, useContext} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from './pages/Home'
import Auth from './pages/Auth'
import Create from './pages/Create'
import List from './pages/List'
import Profile from './pages/Profile'
import Edit from './pages/Edit'

import { getFromStorage, setInStorage } from "./utils/storage";
import {verify} from './api/users'

import Loading from './components/Loading'

export const MainContext = createContext('');

function App() {
  const [user, setUser] = useState({})
  const [token, setToken] = useState("")
  const [isLoading, setLoading] = useState(true)
  
  useEffect(() => {
    async function tokenStuff() {
      const obj = getFromStorage("Brainify");
      
      if (obj && obj.token) {
        let response = await verify(obj.token)
        
        if (response.success) {
          setToken(obj.token);
          setUser(response.user);
          setLoading(false)
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false);
      }
    }
    tokenStuff()
  }, [])

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MainContext.Provider value={{
      user,
      token,
      setUser,
      setToken
    }}>
      <Router>
        <Routes>
          {/* Home */}
          {
            token !== "" ? (
              <Route exact path="/" element={<Home setUser={setUser} setToken={setToken} user={user}/>} />
            ) : (
              <Route exact path="/" element={<Navigate to="/auth" />} />
            )
          }

          {/* Auth */}
          
          {
            token === "" ? (
              <Route exact path="/auth" element={<Auth setUser={setUser} setToken={setToken}/>} />
            ) : (
              <Route exact path="/auth" element={<Navigate to="/" />} />
            )
          }

          {/* Create */}

          {
            token !== "" ? (
              <Route exact path="/create" element={<Create setUser={setUser} setToken={setToken} user={user}/>} />
            ) : (
              <Route exact path="/create" element={<Navigate to="/auth" />} />
            )
          }

          {/* Profile */}

          {
            token !== "" ? (
              <Route path="/profile/:id" element={<Profile setUser={setUser} setToken={setToken} user={user}/>} />
            ) : (
              <Route path="/profile/:id" element={<Navigate to="/auth" />} />
            )
          }

          {/* List Page */}

          {
            token !== "" ? (
              <Route path="/list/:id" element={<List setUser={setUser} setToken={setToken} user={user}/>} />
            ) : (
              <Route path="/list/:id" element={<Navigate to="/auth" />} />
            )
          }

          {/* Edit List */}
          {
            token !== "" ? (
              <Route path="/edit/:id" element={<Edit setUser={setUser} setToken={setToken} user={user}/>} />
            ) : (
              <Route path="/edit/:id" element={<Navigate to="/auth" />} />
            )
          }
          {/*  404 */}

          
        </Routes>
      </Router>
    </MainContext.Provider>
  );
}
export default App;
