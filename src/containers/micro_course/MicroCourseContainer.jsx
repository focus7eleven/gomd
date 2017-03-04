import React from 'react'
import {Spin} from 'antd'
import styles from './MicroCourseContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/micro_course/main'

const MicroCourseContainer = React.createClass({
  componentDidMount(){
    if(this.props.location.pathname.split('/').length<=4){
        const pathname = this.props.location.pathname.split('/').slice(-1)[0];
        console.log('pathname1 ='+pathname)
        pathname === 'createvideo' ? null:this.props.getTableData(pathname,'',1)
    }
  },

  componentWillReceiveProps(nextProps){
      const pathname = nextProps.location.pathname.split('/').slice(-1)[0];
      console.log('pathname ='+pathname)
    if(nextProps.location.pathname.split('/').length<=4 && !this.props.microCourse.get('loading') && (nextProps.microCourse.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
        pathname === 'createvideo'?null:this.props.getTableData(nextProps.location.pathname.split('/').slice(-1)[0],'',1)
    }
  },

  render(){
    if(this.props.location.pathname.split('/').slice(-2)[0] === 'video_detail' || this.props.location.pathname.split('/').slice(-1)[0]==='createvideo'||this.props.location.pathname.split('/').slice(-2)[0]==='createvideo'){
      return this.props.children
    }else{
      return !this.props.microCourse.get('data').get('result') || this.props.microCourse.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /><div>努力加载中，请耐心等待！</div></div>:this.props.children
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
