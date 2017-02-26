import React from 'react'
import {Spin} from 'antd'
import styles from './EditSheetContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getSheetQuestion} from '../../actions/answer_sheet/main'

const EditSheetContainer = React.createClass({
  componentWillMount(){
    this.props.getDetailData(this.props.params.sheetId)
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.answerSheet.get('loadingDetail') && ((this.props.location.pathname != nextProps.location.pathname))){
      this.props.getDetailData(nextProps.params.sheetId)
    }
  },

  render(){
    return this.props.answerSheet.get('loadingDetail') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /><div>努力加载中，请耐心等待！</div></div>:this.props.children
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
    getDetailData:bindActionCreators(getSheetQuestion,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditSheetContainer)
