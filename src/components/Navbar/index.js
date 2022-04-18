import React, {useContext, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {logout} from '../../api/users'

import { MainContext } from '../../App'

import Loading from '../Loading'

import './index.css'

export default function Navbar(props) {
  const [loading, setLoading] = useState(false)


  const ctx = useContext(MainContext)
  const history = useNavigate()

  const onLogout = async (e) => {
    e.preventDefault()
    setLoading(true)
    const response = await logout(ctx.token)
    if (response.success) {
      ctx.setUser({})
      ctx.setToken('')
      history('/')

    } else {
      setLoading(false)
      console.error(response.message)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <nav>
        <h1 onClick={() => history('/')}>Brainify</h1>
        <div className="nav-list">
            <div><Link to="/">Home</Link></div>
            <div><Link to={`/profile/${ctx.user._id}`}>Profile</Link></div>
            <div onClick={onLogout}>Logout</div>
        </div>
    </nav>
  )
}
