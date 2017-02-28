/**
 * created by cq on 2017/2/16.
 */
import React from 'react'
import {Spin} from 'antd'
import styles from './NotifyContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const NotifyContainer = React.createClass({
  componentDidMount(){
  },

  componentWillReceiveProps(nextProps){

  },

  render(){
    return this.props.children
  }
})

function mapStateToProps(state){
  return{
  }
}

function mapDispatchToProps(dispatch){
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NotifyContainer)
