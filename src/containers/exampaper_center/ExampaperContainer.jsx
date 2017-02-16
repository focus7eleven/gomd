import React from 'react'
import {Spin} from 'antd'
import styles from './ExampaperContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getExampaper} from '../../actions/exampaper_action/main'

const ExampaperContainer = React.createClass({
  componentDidMount(){
    this.props.getTableData(this.props.location.pathname.split('/').slice(-1)[0],'',1,'','')
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.exampaper.get('loading') && (nextProps.exampaper.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getTableData(nextProps.location.pathname.split('/').slice(-1)[0],'',1,'','')
    }
  },

  render(){
    return this.props.exampaper.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /></div>:this.props.children
  }
})

function mapStateToProps(state){
  return{
    exampaper:state.get('microCourse'),
    menu:state.get('menu'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getExampaper,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExampaperContainer)
