import 'babel-polyfill'
import 'general-polyfill'
import 'whatwg-fetch'
import reducer from './reducer'
import {createMyStore} from './store'
import routes from './routes'
import {Provider} from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import 'common.scss'

const store = createMyStore(reducer)
ReactDOM.render(<Provider store={store}>{routes}</Provider>, document.getElementById('react-root'))
