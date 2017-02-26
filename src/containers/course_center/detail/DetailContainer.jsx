import React from 'react'
import {Spin} from 'antd'
import styles from './DetailContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getDetailData} from '../../../actions/course_center/main'

const CourseCenterContainer = React.createClass({
  componentWillMount(){
    this.props.getDetailData(this.props.params.lessonId)
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.courseCenter.get('loadingDetail') && (nextProps.courseCenter.get('courseDetail').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getDetailData(nextProps.params.lessonId)
    }
  },

  render(){
    return this.props.courseCenter.get('loadingDetail') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /><div>努力加载中，请耐心等待！</div></div>:this.props.children
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
    getDetailData:bindActionCreators(getDetailData,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CourseCenterContainer)
