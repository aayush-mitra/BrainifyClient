import React, {useState, useEffect, useContext} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {logout, verify} from '../../api/users'
import {getFeed, getList} from '../../api/lists'

import { getFromStorage } from '../../utils/storage'
import { randomQuestion } from '../../utils/quiz'
import './index.css'

import Navbar from '../../components/Navbar'
import Loading from '../../components/Loading'

import { MainContext } from '../../App'


export default function List() {

    const history = useNavigate()
    const params = useParams()
    const ctx = useContext(MainContext)

    const [loading, setLoading] = useState(true)

    const [mode, setMode] = useState(1)

    const [studyIndex, setStudyIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [switchCard, setSwitchCard] = useState(0)

    const [question, setQuestion] = useState({})

    const [list, setList] = useState({})

    useEffect(() => {
        async function getListData() {
            const response = await getList(params.id)
            if (response.success) {
                setList(response.list)
                setLoading(false)
                //console.log(response.list)
            } else {
                setLoading(false)
                console.error(response.message)
            }
        }
        getListData()
    }, [])

    const getQuestion = () => {
        setQuestion(randomQuestion(list.cards))
    }

    

    const changeMode = (num) => {
        setMode(num)
        if (num === 1) {
            setStudyIndex(0)
            setIsFlipped(false)
            setSwitchCard(0)
            setQuestion({})
        } else if (num === 2) {
            if (mode !== 2) {
                getQuestion()
            }
            
        } else if (num === 3) {
            history('/edit/'+list._id)
        }
    }
    const answerQuestion = (e) => {
        if (e.target.textContent === question.correct) {
            e.target.style.borderColor = "green"
            setTimeout(() => {
                setMode(1)
                setMode(2)
                getQuestion()
            }, 1000)
            
        } else {
            e.target.style.borderColor = "red"
            setTimeout(() => {
                setMode(1)
                setMode(2)
            }, 1000)
        }
    }
    

    const nextCard = () => {
        if (studyIndex + 1 < list.cards.length) {

            setSwitchCard(1)
            setTimeout(() => {
                
                    setStudyIndex(studyIndex + 1)
                
            }, 250)
        }
    }

    const prevCard = () => {
        if (studyIndex - 1 >= 0) {
            setSwitchCard(2)
            setTimeout(() => {
                
                    setStudyIndex(studyIndex - 1)
                
            }, 250)
        }
    }

    const copyURL = () => {
        const el = document.createElement('input')
        el.value = window.location.href;
        document.body.appendChild(el)
        el.select();
        document.execCommand('copy')
        document.body.removeChild(el)

    }

    const download = async () => {
        let out = {};
        out.name = list.name;
        out.description = list.description;
        out.creator = list.userId.name;
        out.cards = {}

        list.cards.forEach(card => {
            out.cards[card.term] = card.definition
        })
        out.viewedAt = new Date().toString()
        
        let fileName = out.name
        fileName = fileName.replace(/ /g, '_')

        const json = JSON.stringify(out, null, 2)
        const blob = new Blob([json], {type: 'application/json'})
        const href = await URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href;
        link.download = fileName + '.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

    }
    

    if (loading) {
        return <Loading />
    }

    return (
        <div className="body"> 
            <header>
                <Navbar />
            </header>

            <div className="list-wrapper">
                <div className="list-title"><h1>{list.name}</h1><Link to={`/profile/${list.userId._id}`}><p>{list.userId.username}</p></Link></div>
                <div className="list-container">
                    <aside className="list-sidebar">
                        <div 
                            onClick={() => changeMode(1)}
                            className={mode === 1 ? 'option selected' : 'option'}
                        >
                            <i className="material-icons">view_carousel</i> Study
                        </div>
                        <div 
                            onClick={() => changeMode(2)}
                            className={mode === 2 ? 'option selected' : 'option'}
                        >
                            <i className="material-icons">quiz</i> Quiz
                        </div>
                        {
                            list.userId._id === ctx.user._id ? (
                                <div 
                                    onClick={() => changeMode(3)}
                                    className={mode === 3 ? 'option selected' : 'option'}
                                >
                                    <i className="material-icons">edit</i> Edit
                                </div>
                            ) : null
                        }
                        
                    </aside>
                    {
                        mode === 1 ? (
                            <section className="list-main">
                                <div className="card">
                                    <div 
                                        className={
                                            isFlipped ? 'card_inner isFlipped' : 'card_inner'
                                        }
                                        switchCard={switchCard}
                                        onAnimationEnd={() => setSwitchCard(false)}
                                        onClick={() => setIsFlipped(!isFlipped)}
                                    >
                                        <div className="card_face front">
                                            <div className="term">
                                                {list.cards[studyIndex].term}

                                            </div>
                                        </div>
                                        <div className="card_face back">
                                            <div className="definition">
                                                {list.cards[studyIndex].definition}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="navigator">
                                    <p>
                                        <i onClick={prevCard} className="material-icons backward">arrow_back</i>
                                        {studyIndex + 1}/{list.cards.length}
                                        <i onClick={nextCard} className="material-icons forward">arrow_forward</i>
                                        </p>
                                </div>
                            </section>
                        ) : null
                    }

                    {
                        mode === 2 ? (
                            <section className="list-main">
                                <div className="quiz">
                                    <div className="quiz-question">{question.question}</div>
                                    <div className="choices">
                                        <div onClick={(e) => answerQuestion(e)} className="choice" id="choice1">{question.choices[0]}</div>
                                        <div onClick={(e) => answerQuestion(e)} className="choice" id="choice2">{question.choices[1]}</div>
                                        <div onClick={(e) => answerQuestion(e)} className="choice" id="choice3">{question.choices[2]}</div>
                                        <div onClick={(e) => answerQuestion(e)} className="choice" id="choice4">{question.choices[3]}</div>
                                    </div>
                                </div>
                            </section>
                        ) : null
                    }
                    
                    
                    
                </div>
                <section className="about">
                        <div className="info">
                            <h3>Author: <Link to={`/profile/${list.userId._id}`}>{list.userId.name}</Link></h3>
                            {
                                list.createdAt !== undefined ? <pre style={{color: 'lightgray'}}>Created: {list.createdAt.split('T')[0]}</pre> : null
                            }
                            
                            
                            <p>{list.description}</p>
                        </div>
                        <div className="share">
                            <div title="Copy Link">
                            <i onClick={copyURL} className="material-icons" >content_copy</i>
                            </div>
                            <div title="Download JSON File">
                            <i onClick={download} className="material-icons">file_download</i>
                            </div>
                        </div>
                </section>
            </div>
            <div className="list-of-terms">
                <h2>Terms/Definitions</h2>
                {
                    list.cards.map((card, i) => {
                        return (
                            <div key={i} className="term-card">
                                <div className="list-term-part">{card.term}</div>
                                <div className="list-definition-part">{card.definition}</div>
                            </div>
                        )
                    })
                }
                
                
            </div>
        </div>
    )
}
