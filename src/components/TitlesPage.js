// import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { useEffect, useState } from 'react'
import { getBooks, getChapters, getThumbnail } from '../services/api';
import {
    Card
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
                        // backgroundColor: 'red',
                        display: 'flex',
                        // justifyContent: 'center',
                        overflow: 'scroll'
                    }}
                >
                    {
                        books.map(book => {
                            return (
                                <img
                                    style={{
                                        borderRadius: 10,
                                        display: 'inline-block',
                                        margin: 10,
                                    }}
                                    onClick={() => history.push(`/book/${book.title}`)}
                                    key={book.title}
                                    height={200} src={getThumbnail(book.title, book.thumbnail)}
                                />
                            )
                        })
                    }
                    <Card

                        style={{
                            borderRadius: 10,
                            display: 'inline-block',
                            margin: 10,
                            height: 200,
                            width: 130,
                            textAlign: 'center'
                        }}
                    >
                        <h3>Coming soon</h3>
                    </Card>
                </div>
            </Router>

        </div>
    );
}

export default TitlePage;
