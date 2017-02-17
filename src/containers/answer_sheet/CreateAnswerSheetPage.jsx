import React from 'react'
import styles from './CreateAnswerSheetPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon,Button,Input,Checkbox} from 'antd'

const questionProtoType = {

}

const CreateAnswerSheetPage = React.createClass({
  getInitialState(){
    return {
      sheetName: '',
      continuousIndex: false,
      questions: [{
        question_type: 1,
      }],
      questionIndex: 1,
    }
  },

  handleSheetNameChange(e){
    this.setState({sheetName: e.target.value})
  },

  handleContinuousIndex(e){
    this.setState({continuousIndex: e.target.checked})
  },

  renderQuestion(item,index){
    return (
      <div className={styles.questionContainer} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center'}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <span>{index+1}</span>
        </div>
        <Button type="primary" className={styles.editButton}><Icon type="plus" /></Button>
        <Button type="primary" className={styles.deleteButton}><Icon type="close" /></Button>
      </div>
    )
  },

  render(){
    const {sheetName, continuousIndex, questions} = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.sheetHead}>
            <span>答题卡名称</span>
            <Input onChange={this.handleSheetNameChange} value={sheetName} />
            <Checkbox checked={continuousIndex} onChange={this.handleContinuousIndex}>跨章节连续编号</Checkbox>
          </div>
        </div>
        <div className={styles.body}>
          {questions.map((item,index) => this.renderQuestion(item,index))}
        </div>
      </div>
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
