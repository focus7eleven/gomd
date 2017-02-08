import React from 'react'
import {connect} from 'react-redux'
import config from '../config'
import {login} from '../actions/user'
import {bindActionCreators} from 'redux'


const AppContainer = React.createClass({
	contextTypes:{
		router: React.PropTypes.object,
	},
	componentWillMount(){
		window.login = () => {
			this.props.login('superadmin','superadmin')
		}
	},
	render(){
		return (
        this.props.children
		)
	},
})

function mapStateToProps(state) {
	return {}
}

function mapDispatchToProps(dispatch) {
	return {
		login:bindActionCreators(login,dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
