import React from 'react'
import {Spin} from 'antd'
import styles from './CourseCenterContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/course_center/main'

const CourseCenterContainer = React.createClass({
  componentDidMount(){
    this.props.getTableData(this.props.location.pathname.split('/').slice(-1)[0],'',1)
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.courseCenter.get('loading') && (nextProps.courseCenter.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getTableData(nextProps.location.pathname.split('/').slice(-1)[0],'',1)
    }
  },

  render(){
    return this.props.courseCenter.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /></div>:this.props.children
  }
})

function mapStateToProps(state){
  return{
    courseCenter:state.get('courseCenter'),
    menu:state.get('menu'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getTableData,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CourseCenterContainer)
