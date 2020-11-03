import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router, 
  Route,  
  Switch
} from 'react-router-dom';
import { Home } from './home';
import { Results } from './results';
import { ToastProvider } from 'react-toast-notifications'


class App extends Component {

  render(): JSX.Element {
    return(
      <Router>
        <div className="App" id='page'>
          <ToastProvider>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/results' component={Results} />
            </Switch>
          </ToastProvider>
        </div>
      </Router>
    );

  }

}

export default App;
