import React from 'react'
import {Spin} from 'antd'
import styles from './MicroCourseContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/micro_course/main'

const MicroCourseContainer = React.createClass({
  componentDidMount(){
    this.props.getTableData(this.props.location.pathname.split('/').slice(-1)[0],'',1)
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.microCourse.get('loading') && (nextProps.microCourse.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getTableData(nextProps.location.pathname.split('/').slice(-1)[0],'',1)
    }
  },

  render(){
    if(this.props.location.pathname.split('/').slice(-1)[0] === 'video_detail'){
      return this.props.children
    }else{
      return !this.props.microCourse.get('data').get('result') || this.props.microCourse.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /></div>:this.props.children
    }
  }
})

function mapStateToProps(state){
  return{
    microCourse:state.get('microCourse'),
    menu:state.get('menu'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getTableData,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MicroCourseContainer)
