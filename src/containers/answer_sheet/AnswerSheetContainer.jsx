import React from 'react'
import {Spin} from 'antd'
import styles from './AnswerSheetContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getAnswerSheet} from '../../actions/answer_sheet/main'

const AnswerSheetContainer = React.createClass({
  componentDidMount(){
    this.props.getTableData(this.props.location.pathname.split('/').slice(-1)[0],'',1)
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.answerSheet.get('loading') && (nextProps.answerSheet.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getTableData(nextProps.location.pathname.split('/').slice(-1)[0],'',1)
    }
  },

  render(){
    return this.props.answerSheet.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /></div>:this.props.children
  }
})

function mapStateToProps(state){
  return{
    answerSheet:state.get('answerSheet'),
    menu:state.get('menu'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getAnswerSheet,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AnswerSheetContainer)
