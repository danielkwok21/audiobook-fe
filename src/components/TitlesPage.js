// import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { useEffect, useState } from 'react'
import { getBooks, getChapters, getProgresses, getThumbnail } from '../services/api';
import {
    Card,
    Progress
} from 'antd'

function TitlePage() {

    const [books, setBooks] = useState([])
    const history = useHistory()

    useEffect(() => {
        getBooks()
            .then(res => {

                return Promise.all(res.books.map(book => {
                    return getChapters(book)
                        .then(res => {
                            const _book = {
                                title: book,
                                thumbnail: res.thumbnail
                            }

                            return _book
                        })
                }))
            })
            .then(_books => setBooks(_books))

    }, [])

    return (
        <div className="App">
            <h1>Titles</h1>
            <Router>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        overflow: 'scroll',
                        flexWrap: 'wrap',

                    }}
                >
                    {
                        [...books].map((book, i) => {
                            return (

                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 3,
                                        flexDirection: 'column',
                                        margin: 10,
                                    }}
                                >
                                    <img
                                        style={{
                                            borderRadius: 10,
                                            display: 'inline-block',
                                        }}
                                        onClick={() => history.push(`/book/${book.title}`)}
                                        key={book.title}
                                        height={200} src={getThumbnail(book.title, book.thumbnail)}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </Router>

        </div>
    );
}

export default TitlePage;
