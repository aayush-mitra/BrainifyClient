import React, {useState, useEffect, useContext} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {logout, verify} from '../../api/users'
import {getFeed} from '../../api/lists'

import { getFromStorage } from '../../utils/storage'
import './index.css'

import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

import { MainContext } from '../../App'

export default function Home(props) {
  const history = useNavigate();

  const [isLoading, setLoading] = useState(true)
  const [feed, setFeed] = useState([])

  const redirectToList = (id) => {
      history(`/list/${id}`)
  }

  useEffect(() => {
      async function accessFeed() {
          const response = await getFeed()
          if (response.success) {
            setLoading(false)
            setFeed(response.lists)
          } else {
              setLoading(false)
              console.log(response.message)
          }
      }
      accessFeed()
  }, [])
  
  if (!isLoading) {
    return (
      <div className="body">
        <header>
            <Navbar setUser={props.setUser} setToken={props.setToken} user={props.user}/>
        </header>

        <main>
            <div className="wrapper">
                <h1>Recommended Lists</h1>
                <div className="lists">
                    {
                        feed.map((item, i) => {
                            return (
                                <div onClick={() => redirectToList(item._id)} className="list" key={i}>
                                    <div>
                                        <h3>{item.name}</h3>
                                        <section>
                                            <p className="items">{item.cards.length} items</p>

                                            <p className="author">{item.userId.name}</p>
                                        </section>
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                    <Link to="/create">
                        <div className="list" id="new">
                            <span>+</span>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    </div>
    )
  } else {
    return (
      <Loading />
    )
  }
  
}
