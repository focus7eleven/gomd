import React from 'react'
import {Spin} from 'antd'
import styles from './VideoDetailContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getVideoDetail} from '../../../actions/micro_course/main'

const VideoDetailContainer = React.createClass({
  componentWillMount(){
    this.props.getVideoDetail(this.props.params.videoId)
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.microCourse.get('loadingDetail') && (this.props.location.pathname != nextProps.location.pathname)){
      this.props.getVideoDetail(nextProps.params.videoId)
    }
  },

  render(){
    return this.props.microCourse.get('loadingDetail') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /></div>:this.props.children
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
    getVideoDetail:bindActionCreators(getVideoDetail,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(VideoDetailContainer)
