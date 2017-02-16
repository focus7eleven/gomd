import React from 'react'
import styles from './CreateAnswerSheetPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const CreateAnswerSheetPage = React.createClass({
  getInitialState(){
    return {}
  },

  render(){
    return (
      <div className={styles.container}></div>
    )
  }
})

function mapStateToProps(state){
  return{
    answerSheet: state.get('answerSheet')
  }
}
function mapDispatchToProps(dispatch){
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateAnswerSheetPage)
