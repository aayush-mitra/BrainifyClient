import React, {useState, useEffect, useContext} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {getProfile} from '../../api/users'

import './index.css'

import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

import { MainContext } from '../../App'

export default function Profile() {

    const history = useNavigate()
    const params = useParams()
    const ctx = useContext(MainContext)

    const [loading, setLoading] = useState(true)

    const [profile, setProfile] = useState({})

    useEffect(() => {
      async function getProfileData() {
          const response = await getProfile(params.id)
          if (response.success) {
              setProfile(response.user)
              setLoading(false)
              console.log(response)
          } else {
              setLoading(false)
              console.error(response.message)
          }
      }
      getProfileData()
  }, [])

    const redirectToList = (id) => {
      history(`/list/${id}`)
    }


    if (loading) {
        return <Loading />
    }

    return (
      <div className='body'>
        <header>
            <Navbar />
        </header>

        <div>
            <div className="profile">
                
                <div className="lists">
                    
                    
                    <div className="profileCard">
                        <h1>{profile.name}</h1>
                        <p>@{profile.username}</p>
                        <p>{profile.email}</p>
                        <p>Joined: {profile.createdAt.split("T")[0]}</p>
                        <p>{profile.lists.length} {profile.lists.length === 1 ? 'List' : "Lists"}</p>
                    </div>

                    {
                      profile.lists.map((list, i) => {
                        return (
                          <div onClick={() => redirectToList(list._id)} key={i} className="profile-list">
                            <div>
                                <h3>{list.name}</h3>
                                <section>
                                    <p className="items" style={{color: 'gray'}}>{list.cards.length} items</p>

                                    <p className="author" style={{color: 'gray'}}>{list.createdAt.split("T")[0]}</p>
                                </section>
                            </div>
                        </div>
                        )
                      })
                    }
                    
                    
                    
                    {
                      profile._id === ctx.user._id ? (
                        <Link to="/create">
                          <div className="profile-list" id="new">
                              <span>+</span>
                          </div>
                      </Link>
                      ) : null
                    }
                    
                    
                </div>
            </div>
        </div>
    </div>
    )
}
 