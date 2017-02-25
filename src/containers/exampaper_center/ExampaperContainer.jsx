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
    if(!this.props.examPaper.get('loading') && (nextProps.examPaper.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getTableData(nextProps.location.pathname.split('/').slice(-1)[0],'',1)
    }
  },

  render(){
    return this.props.examPaper.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /></div>:this.props.children
  }
})

function mapStateToProps(state){
  return{
    examPaper:state.get('examPaper'),
    menu:state.get('menu'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getExampaper,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExampaperContainer)
