import logo from './logo.svg';
import './App.less';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useEffect, useState } from 'react'
import { getBooks } from './services/api';
import {
  Card
} from 'antd'
import TitlePage from './components/TitlesPage';
import BookPage from './components/BookPage';

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/book/:title/:chapter?/:time?">
            <BookPage />
          </Route>
          <Route path="/">
            <TitlePage />
          </Route>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
