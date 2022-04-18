import React, {useState, useEffect, useContext} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './index.css'

import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

import {create, update, createCards, deleteList} from '../../api/lists'

import { MainContext } from '../../App'


export default function Create(props) {

    const ctx = useContext(MainContext);
    const history = useNavigate();

    const [loading, setLoading] = useState(true)
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    const [list, setList] = useState({})
    const [cards, setCards] = useState([])

    const addCard = () => {

        let old = [...cards]
        old.push({term: '', definition: ''})
        setCards(old)
    }

    const deleteCard = (ind) => {
        let old = [...cards]
        old.splice(ind, 1)
        setCards(old)
    }

    const changeCard = (val, ind, type) => {
        let old = [...cards]
        if (type === 'term') {
            old[ind].term = val;
        } else {
            old[ind].definition = val;

        }

        setCards(old)
        console.log(cards)
    }

    const changeEvt = (val, type) => {
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

    const onSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        let name = list.name === '' ? "Draft" : list.name
        const response = await update(name, list.description, list._id)
        if (response.success) {
            let cardsArr = cards.length > 0 ? cards : [{term: 'Term', definition: 'Definition'}]
            const response2 = await createCards(list._id, cardsArr)
            if (response2.success) {
                props.setUser(response.user)
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


    useEffect(() => {
        //create
        async function asyncStuff() {
            const response = await create('', ctx.user._id, '')
            if (response.success) {
                setList(response.list)

                props.setUser(response.user)
                setLoading(false)
            } else {
                console.log(response.message)
                setLoading(false)
            }
        }

        asyncStuff()
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
                        <h2>Create a New List</h2>
                        <button onClick={onSave}>Save</button>
                        
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
                            cards.map((card, i, arr) => {
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
                                                    value={cards[i].term}
                                                />
                                                <label>Term</label>
                                            </div>
                                            <div>
                                                <input 
                                                    placeholder="Enter Definition Here" 
                                                    id="definition" 
                                                    type="text" 
                                                    onChange={(e) => changeCard(e.target.value, i, 'definition')}
                                                    value={cards[i].definition}
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
                        
                        <button id="create-button-last" onClick={onSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
