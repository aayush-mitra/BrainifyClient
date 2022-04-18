import React, {useState, useEffect, useContext} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {logout, verify} from '../../api/users'
import {getFeed, getList} from '../../api/lists'

import { getFromStorage } from '../../utils/storage'
import { randomQuestion } from '../../utils/quiz'
import './index.css'

import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

import {create, update, createCards, updateCards, deleteList} from '../../api/lists'
import { MainContext } from '../../App'


export default function Edit(props) {

    const history = useNavigate()
    const params = useParams()
    const ctx = useContext(MainContext)

    const [loading, setLoading] = useState(true)

    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [savingStatus, setSavingStatus] = useState('')

    const [list, setList] = useState({})
    //const [cards, setCards] = useState([])

    const setChanges = () => {
        if (!unsavedChanges) {
            setUnsavedChanges(true)
        }
    }
    
    const addCard = () => {
        //setChanges(true)
        let cards = list.cards;
        let old = [...cards]
        old.push({term: '', definition: ''})
        setList({
            ...list,
            cards: old
        })
    }

    const deleteCard = (ind) => {
        //setChanges(true)
        let cards = list.cards;
        let old = [...cards]
        old.splice(ind, 1)
        setList({
            ...list,
            cards: old
        })
    }

    const changeCard = (val, ind, type) => {
        //setChanges(true)
        let cards = list.cards;
        let old = [...cards]
        if (type === 'term') {
            old[ind].term = val;
        } else {
            old[ind].definition = val;

        }

        setList({
            ...list,
            cards: old
        })
        console.log(cards)
        console.log(list)
    }

    const changeEvt = (val, type) => {
        //setChanges(true)
        console.log(unsavedChanges)
        if (type === 'title') {
            let updated = {name: val}
            setList(list => ({
                ...list,
                ...updated
            }))
        } else if (type === 'description') {
            let updated = {description: val}
            setList(list => ({
                ...list,
                ...updated
            }))
        }

        
    }

    useEffect(() => {
        if (list !== {}) {
            const timeoutId = setTimeout(() => {
                setChanges(true)
            }, 1000)
            return () => clearTimeout(timeoutId)
        }
        
    }, [list])

    const onSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        const response = await update(list.name, list.description, list._id)
        if (response.success) {
            const response2 = await updateCards(list._id, list.cards)
            if (response2.success) {
                props.setUser(response2.user)
                history('/list/' + list._id)
            } else {
                console.log(response2.message)
                setLoading(false)
            }
            
        } else {
            console.log(response.message)
            setLoading(false)
        }
    }

    const autoSave = async () => {
        const response = await update(list.name, list.description, list._id)
        if (response.success) {
            const response2 = await updateCards(list._id, list.cards)
            if (response2.success) {
                props.setUser(response2.user)
                //history('/list/' + list._id)
            } else {
                console.log(response2.message)
                //setUnsavedChanges(false)
            }
            
        } else {
            console.log(response.message)
            //setUnsavedChanges(false)
        }
    }

    const onDelete = async () => {
        setLoading(true)
        const response = await deleteList(list._id, ctx.user._id)
        if (response.success) {
            
            ctx.setUser(response.user)
            setLoading(false)
            history('/')
            
        } else {
            setLoading(false)
            console.log(response.message)
        }
    }

    useEffect(() => {
        if (unsavedChanges) {
            setSavingStatus("Saving...")
            autoSave()
            setUnsavedChanges(false)
            setTimeout(() => {
                setSavingStatus("")
                //setTimeout(() => {
                    //setSavingStatus("")
                    
                //}, 1000)
            }, 1000)
        }
        
            

        
        
    }, [unsavedChanges])

    


    useEffect(() => {
        async function getListData() {
            const response = await getList(params.id)
            if (response.success) {
                setList(response.list)
                //setCards(response.list.cards)
                setLoading(false)
                console.log(response.list)
            } else {
                setLoading(false)
                console.error(response.message)
            }
        }
        getListData()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <div className='body'>
            <header>
                <Navbar setUser={props.setUser} setToken={props.setToken} user={props.user}/>
            </header>

            <div>
                <div className="create-wrapper">
                    <div className="create-title">
                        <h2>Edit List</h2>
                        <pre style={{color: 'gray'}}>{savingStatus}</pre>
                        <button onClick={onSave}>Done</button>
                        
                    </div>
                    <div className="create-info">
                        <input 
                            name="title" 
                            onChange={(e) => changeEvt(e.target.value, 'title')} 
                            value={list.name}
                            placeholder="Title" 
                            type="text" 
                        />

                        <textarea 
                            placeholder="Description" 
                            name="description" 
                            id="" 
                            cols="30" 
                            rows="10"
                            value={list.description}
                            onChange={(e) => changeEvt(e.target.value, 'description')}
                        />
                    </div>
                    <div className="create-list">
                        {
                            list.cards.map((card, i, arr) => {
                                return (
                                    <div key={i} className="create-card">
                                        <div className="create-top">
                                            <p>{i + 1}</p>
                                            <p onClick={(e) => deleteCard(i)}><i className="gg-trash"></i></p>
                                        </div>
                                        <section>
                                            <div>
                                                <input 
                                                    placeholder="Enter Term Here" 
                                                    id="term" 
                                                    type="text" 
                                                    onChange={(e) => changeCard(e.target.value, i, 'term')}
                                                    value={list.cards[i].term}
                                                />
                                                <label>Term</label>
                                            </div>
                                            <div>
                                                <input 
                                                    placeholder="Enter Definition Here" 
                                                    id="definition" 
                                                    type="text" 
                                                    onChange={(e) => changeCard(e.target.value, i, 'definition')}
                                                    value={list.cards[i].definition}
                                                />
                                                <label>Definition</label>
                                            </div>
                                        </section>
                                    </div>
                                )
                            })
                        }
                        
                        
                        <div onClick={addCard} className="create-card create-new">
                            <span>+</span>
                        </div>
                        
                        
                        
                        <button id="create-button-last" onClick={onSave}>Done</button>
                        <button style={{backgroundColor: '#f74242'}} id="create-button-last" onClick={onDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )

}