import React, {useState, useEffect, useContext} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {register, login} from '../../api/users'

import { setInStorage } from '../../utils/storage'
import './index.css'

import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

import { MainContext } from '../../App'

export default function Auth({setToken, setUser}) {
  const [state, setState] = useState("login")

  const [name, setName] = useState("");
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false);

  const history = useNavigate();

  const changeEvt = (val, type) => {
    if (type === 'name') {
      setName(val)
    } else if (type === 'username') {
      setUsername(val)
    } else if (type === 'email') {
      setEmail(val)
    } else if (type === 'password') {
      setPassword(val)
    } else if (type === 'confirmPassword') {
      setConfirmPassword(val)
    }
  }

  const saveToLocalStorage = (token, user) => {
    setInStorage("Brainify", { token: token });
    setToken(token);
    setUser(user);
  };

  const onRegister = async (e) => {
    e.preventDefault()
    if (
      name === '' ||
      username === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === '' 
    ) {
      setError('All fields must be filled.')
    } else if (username.includes(' ') || username.includes('/')) {
      setError('Username cannot include spaces.')
    } else if (!email.includes('@')) {
      setError('Email must be valid.')
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.')
    } else {
      setError('')
      setLoading(true)
    }

    const response = await register(name, username, email, password)
    if (response.success) {
      const response2 = await login(response.user.email, password)
      if (response2.success) {
        saveToLocalStorage(response2.token, response2.user)
        
        
      } else {
        setError(response2.message)
        setLoading(false)
      }
    } else {
      setError(response.message)
      setLoading(false)
    }
  }

  const onLogin = async (e) => {
    e.preventDefault()
    if (
      email === '' ||
      password === '' 
    ) {
      setError('All fields must be filled.')
    } else if (!email.includes('@')) {
      setError('Email must be valid.')
    } else {
      setError('')
      setLoading(true)
    }

    const response = await login(email, password)
    if (response.success) {
      saveToLocalStorage(response.token, response.user)
    } else {
      setError(response.message)
      setLoading(false)
    }

  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="body">
    
      <div className="auth-wrapper">
          <div className="auth-container">
              <div 
                className={state === "login" ? "tab1 selected" : "tab1"}
                onClick={() => setState('login')}
              >
                <h3>Login</h3>
              </div>

              <div 
                className={state === "register" ? "tab2 selected" : "tab2"}
                onClick={() => setState('register')}
              >
                <h3>Register</h3>
              </div>

              <div className="auth-main">
                
                  <form className="auth-form" onSubmit={state === 'login' ? onLogin : onRegister}>
                      <p style={{color: '#dd5f5f'}}>{error}</p>
                      {
                        state === "register" ? (
                          <>
                          <div className="auth-group">
                            <input 
                              name="name" 
                              onChange={(e) => changeEvt(e.target.value, 'name')} 
                              placeholder="Name" 
                              type="text" 
                              value={name}
                            />
                          
                          </div>
                          <div className="auth-group">
                          <input 
                              name="username" 
                              onChange={(e) => changeEvt(e.target.value, 'username')} 
                              placeholder="Username" 
                              type="text" 
                              value={username}
                            />
                          </div>
                          </>
                        ) : (
                          null
                        )
                      }
                      
                      <div className="auth-group">
                        <input 
                          name="email" 
                          onChange={(e) => changeEvt(e.target.value, 'email')} 
                          placeholder="Email" 
                          type="email" 
                          value={email}
                        />
                      </div>
                      <div className="auth-group">
                        <input 
                          name="password" 
                          onChange={(e) => changeEvt(e.target.value, 'password')} 
                          placeholder="Password" 
                          type="password" 
                          value={password}
                        />
                      </div>
                      {
                        state === "register" ? (
                          <div className="auth-group">
                            <input 
                              name="confirmPassword" 
                              onChange={(e) => changeEvt(e.target.value, 'confirmPassword')} 
                              placeholder="Confirm Password" 
                              type="password" 
                              value={confirmPassword}
                            />
                        </div>
                        ) : (
                          null
                        )
                      }
                      
                      <div className="auth-group">
                          <button type="submit">Submit</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    </div>
  )
}
