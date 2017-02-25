import React from 'react'
import {Spin} from 'antd'
import styles from './HomeworkContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/homework_action/main'

const HomeworkContainer = React.createClass({
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

export default connect(mapStateToProps,mapDispatchToProps)(HomeworkContainer)
