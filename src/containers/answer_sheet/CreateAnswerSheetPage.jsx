import React from 'react'
import styles from './CreateAnswerSheetPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Select,Icon,Button,Input,Checkbox} from 'antd'
import {Map,Record,List,fromJS} from 'immutable'
import classnames from 'classnames'

const Option = Select.Option;

const questionProtoType = Record({
  questionType: '单选题',
  isChild: false,
  questionTitle: '',
})

const CreateAnswerSheetPage = React.createClass({
  getInitialState(){
    return {
      sheetName: '',
      continuousIndex: false,
      questions: fromJS([{
        questionType: '章节',
        isChild: false,
        questionTitle: '',
      },{
        questionType: '单选题',
        isChild: false,
        questionTitle: '',
      }]),
      questionIndex: 1,
    }
  },

  handleSheetNameChange(e){
    this.setState({sheetName: e.target.value})
  },

  handleContinuousIndex(e){
    this.setState({continuousIndex: e.target.checked})
  },

  handleFieldChange(index,key,e){
    const questions = this.state.questions;
    let value
    switch (key) {
      case 'questionType':
        value = e;
        break;
      case 'isChild':
        value = e.target.checked;
        break;
      default:
        value = e.target.value
    }
    this.setState({questions: questions.update(index, v => v.set(key, value))})
  },

  renderQuestion(item,index){
    const questionType = item.get('questionType')
    return (
      <div className={classnames(styles.questionContainer,questionType==='章节'?styles.specialBackground:null)} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center', paddingTop: 5}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <Select value={questionType} defaultValue="单选题" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'questionType')}>
            <Option value="单选题">单选题</Option>
            <Option value="多选题">多选题</Option>
            <Option value="判断题">判断题</Option>
            <Option value="填空题">填空题</Option>
            <Option value="简答题（计算题）">简答题（计算题）</Option>
            <Option value="语文作文题">语文作文题</Option>
            <Option value="英语作文题">英语作文题</Option>
            <Option value="章节">章节</Option>
          </Select>
        </div>
        {
          questionType === '章节' ? null :
            <div className={styles.block}>
              <span>子题目</span>
              <Checkbox style={{marginTop: 3}} checked={item.get('isChild')} onChange={this.handleFieldChange.bind(null,index,'isChild')}></Checkbox>
            </div>
        }
        <div className={styles.block}>
          <span>标题</span>
          <Input style={{width: 240}} value={item.get('questionTitle')} onChange={this.handleFieldChange.bind(null,index,'questionTitle')} />
        </div>
        <div className={styles.block}>
          <span style={{height: 18}}>{" "}</span>
          <div>
            <Button type="primary" className={styles.editButton}><Icon type="plus" /></Button>
            <Button type="primary" className={styles.deleteButton}><Icon type="close" /></Button>
          </div>
        </div>
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
