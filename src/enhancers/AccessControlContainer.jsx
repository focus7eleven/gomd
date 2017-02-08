import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {login} from '../actions/user'
import LoginContainer from '../containers/LoginContainer'

function mapStateToProps(state) {
	return {
		user: state.get('user'),
	}
}

function mapDispatchToProps(dispatch) {
	return {}
}

export const LoginControlHOC = (Component) => connect(mapStateToProps, mapDispatchToProps)(React.createClass({
	render() {
		// 用来判断当用户以url方式访问时，如果storage里面没有accessToken，需要跳转到登录页面。
		const isAuth = sessionStorage.getItem('accessToken')
		return isAuth?<Component {...this.props}></Component>:<LoginContainer {...this.props}></LoginContainer>
	},
}))
