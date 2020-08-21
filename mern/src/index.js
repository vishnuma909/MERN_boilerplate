import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import HeaderComp from './components/Header/header';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import LoginComponent from './components/Login/login';
import RegisterComponent from './components/Register/register';
import { Provider } from 'react-redux';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { logoutUser, initializeAPI } from "./actions/authActions";
import PrivateRoute from "../src/privateroute/privateroute";
import store from './store';
import Dashboard from './components/dashboard/dashboard';
import { usePromiseTracker } from 'react-promise-tracker';

if (localStorage.jwtToken && localStorage.jwtToken !== 'undefined' && localStorage.jwtToken !== null && localStorage.jwtToken !== '') {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  } else {
    store.dispatch(initializeAPI(decoded._id))
    window.localStorage.href = "./dashboard";
  }
} else {
  store.dispatch(logoutUser());
}

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return promiseInProgress && <div style={{ width: "100%", height: "100%", display: "flex", position: "fixed", justifyContent: "center", alignItems: "center", zIndex: '999' }}><Spinner animation="border" variant="primary" role="status"><span className="sr-only">Loading...</span></Spinner></div>
}

const routing = (
  <Provider store={store}>
    <LoadingIndicator />
    <Router>
      <Container>
        <Row>
          <Col xs={12}>
            <HeaderComp />
          </Col>
        </Row>
      </Container>
      <div>
        <Switch>
          {/* <Route path="/<url_path>" component={<Component/Function name created>} /> */}
          <Route path="/login" component={LoginComponent} />
          <Route path="/register" component={RegisterComponent} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route component={LoginComponent} />
        </Switch>
      </div>
    </Router>
  </Provider>
)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
