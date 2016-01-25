import React, { PropTypes, Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, Link, IndexRoute, browserHistory, hashHistory } from 'react-router'

// Components here
import Header from './components/navbar/index'


render( <Header />, document.getElementById( 'content' ) )