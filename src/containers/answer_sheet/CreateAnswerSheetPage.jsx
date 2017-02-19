import React from 'react'
import styles from './CreateAnswerSheetPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Select,Icon,Button,Input,Checkbox} from 'antd'
import {Map,Record,List,fromJS} from 'immutable'
import classnames from 'classnames'
import parseIndex from '../../utils/chineseIndex'

const Option = Select.Option;

const questionProtoType = fromJS({
  questionType: 'xuanze',
  isChild: false,
  questionTitle: '',
  childQuestionTitle: '',
  questionNum: 1,
  optionType: 'en_zimu',
  optionNum: 4,
  answerWidth: 0,
  answerHeight: 1,
})

const CreateAnswerSheetPage = React.createClass({
  getInitialState(){
    return {
      sheetName: '',
      continuousIndex: false,
      questions: fromJS([{
        questionType: 'zhangjie',
        isChild: false,
        questionTitle: '',
        childQuestionTitle: '',
        questionNum: 1,
        optionType: 'left',
        optionNum: 4,
        answerWidth: 0,
        answerHeight: 0,
      },{
        questionType: 'xuanze',
        isChild: false,
        questionTitle: '',
        childQuestionTitle: '',
        questionNum: 1,
        optionType: 'en_zimu',
        optionNum: 4,
        answerWidth: 0,
        answerHeight: 0,
      },{
        questionType: 'panduan',
        isChild: false,
        questionTitle: '',
        childQuestionTitle: '',
        questionNum: 1,
        optionType: 'gou_cha',
        optionNum: 4,
        answerWidth: 0,
        answerHeight: 0,
      },{
        questionType: 'tiankong',
        isChild: false,
        questionTitle: '',
        childQuestionTitle: '',
        questionNum: 1,
        optionType: '',
        optionNum: 4,
        answerWidth: '1/3',
        answerHeight: 1,
      },{
        questionType: 'zuowen_cn',
        isChild: false,
        questionTitle: '',
        childQuestionTitle: '',
        questionNum: 1,
        optionType: '',
        optionNum: 4,
        answerWidth: 0,
        answerHeight: 6,
      },{
        questionType: 'jianda',
        isChild: false,
        questionTitle: '',
        childQuestionTitle: '',
        questionNum: 1,
        optionType: '',
        optionNum: 4,
        answerWidth: 0,
        answerHeight: 6,
        jiandaAnswerRow: 2,
        jiandaAnswerCol: 2,
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

  handleAddQuestion(){
    let questions = this.state.questions;
    const newTitle = parseIndex(questions.size+1) + '、单选题'
    questions = questions.push(questionProtoType.set('questionTitle',newTitle));
    this.setState({questions});
  },

  handleFieldChange(index,key,e){
    const questions = this.state.questions;
    let value
    switch (key) {
      case 'questionType':
        value = e;
        break;
      case 'optionType':
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

  handleDeleteQuestion(index){
    const questions = this.state.questions
    this.setState({questions: questions.delete(index)})
  },

  handleCanBeAChild(index){
    const questions = this.state.questions
    if(index===0){
      return true
    }else{
      return questions.get(index-1).get('questionType')==='zhangjie'
    }
  },

  renderChapter(item,index){
    const questionType = item.get('questionType')
    return (
      <div className={classnames(styles.questionContainer,styles.specialBackground)} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center', paddingTop: 5}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <Select value={questionType} defaultValue="xuanze" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'questionType')}>
            <Option value="xuanze">单选题</Option>
            <Option value="duoxuan">多选题</Option>
            <Option value="panduan">判断题</Option>
            <Option value="tiankong">填空题</Option>
            <Option value="jianda">简答题（计算题）</Option>
            <Option value="zuowen_cn">语文作文题</Option>
            <Option value="zuowen_en">英语作文题</Option>
            <Option value="zhangjie">章节</Option>
          </Select>
        </div>
        <div className={styles.block}>
          <span>标题</span>
          <Input style={{width: 240}} value={item.get('questionTitle')} onChange={this.handleFieldChange.bind(null,index,'questionTitle')} />
        </div>
        <div className={styles.block}>
          <span>对齐类型</span>
          <Select value={item.get('optionType')} defaultValue="left" style={{ width: 70 }} onChange={this.handleFieldChange.bind(null,index,'optionType')}>
            <Option value="left">居左</Option>
            <Option value="middle">居中</Option>
            <Option value="right">居右</Option>
          </Select>
        </div>
        <div className={styles.block}>
          <span style={{height: 18}}>{" "}</span>
          <div>
            <Button type="primary" className={styles.editButton} onClick={this.handleAddQuestion}><Icon type="plus" /></Button>
            <Button type="primary" className={styles.deleteButton} onClick={this.handleDeleteQuestion.bind(null,index)}><Icon type="close" /></Button>
          </div>
        </div>
      </div>
    )
  },

  renderQuestion(item,index){
    const questionType = item.get('questionType')
    const isChild = item.get('isChild')
    return (
      <div className={classnames(styles.questionContainer,isChild?null:styles.hasBorderTop)} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center', paddingTop: 5}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <Select value={questionType} defaultValue="xuanze" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'questionType')}>
            <Option value="xuanze">单选题</Option>
            <Option value="duoxuan">多选题</Option>
            <Option value="panduan">判断题</Option>
            <Option value="tiankong">填空题</Option>
            <Option value="jianda">简答题（计算题）</Option>
            <Option value="zuowen_cn">语文作文题</Option>
            <Option value="zuowen_en">英语作文题</Option>
            <Option value="zhangjie">章节</Option>
          </Select>
        </div>
        <div className={styles.block}>
          <span>子题目</span>
          <Checkbox disabled={this.handleCanBeAChild(index)} style={{marginTop: 3}} checked={item.get('isChild')} onChange={this.handleFieldChange.bind(null,index,'isChild')}></Checkbox>
        </div>
        <div className={styles.verticalLayout}>
          {
            isChild?null:
            <div className={styles.block} style={{marginBottom: 10}}>
              <span>标题</span>
              <Input placeholder="输入少于30个字" style={{width: 470}} value={item.get('questionTitle')} onChange={this.handleFieldChange.bind(null,index,'questionTitle')} />
            </div>
          }
          <div className={styles.horizontalLayout}>
            <div className={styles.block}>
              <span>子标题</span>
              <Input placeholder="输入少于30个字" style={{width: 240}} value={item.get('childQuestionTitle')} onChange={this.handleFieldChange.bind(null,index,'childQuestionTitle')} />
            </div>
            <div className={styles.block}>
              <span>题目个数</span>
              <Input type="number" min="1" style={{width: 80}} value={item.get('questionNum')} onChange={this.handleFieldChange.bind(null,index,'questionNum')} />
            </div>
            {
              questionType === 'xuanze' || questionType === 'duoxuan' ?
              <div className={styles.horizontalLayout}>
                <div className={styles.block}>
                  <span>选项类型</span>
                  <Select value={item.get('optionType')} defaultValue="en_zimu" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'optionType')}>
                    <Option value="en_zimu">字母</Option>
                    <Option value="shuzi">数字</Option>
                  </Select>
                </div>
                <div className={styles.block}>
                  <span>选项个数</span>
                  <Input type="number" min="2" style={{width: 80}} value={item.get('optionNum')} onChange={this.handleFieldChange.bind(null,index,'optionNum')} />
                </div>
              </div>:null
            }
            {
              questionType === 'panduan' ?
              <div className={styles.block}>
                <span>选项类型</span>
                <Select value={item.get('optionType')} defaultValue="dui_cuo" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'optionType')}>
                  <Option value="dui_cuo">对/错</Option>
                  <Option value="gou_cha">√(正)/x(误)</Option>
                  <Option value="t_f">T(正)/F(误)</Option>
                </Select>
              </div>:null
            }
            {
              questionType === 'tiankong' ?
              <div className={styles.horizontalLayout}>
                <div className={styles.block}>
                  <span>答题区域大小(行)</span>
                  <Select value={item.get('answerWidth')} defaultValue="1/3" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'answerWidth')}>
                    <Option value="1/4">1/4</Option>
                    <Option value="1/3">1/3</Option>
                    <Option value="1/2">1/2</Option>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                  </Select>
                </div>
                <div className={styles.block}>
                  <span>答题区域个数</span>
                  <Input type="number" min="1" max="50" style={{width: 80}} value={item.get('answerHeight')} onChange={this.handleFieldChange.bind(null,index,'answerHeight')} />
                </div>
              </div>:null
            }
            {
              questionType === 'zuowen_en' || questionType === 'zuowen_cn' || questionType === 'jianda'?
              <div className={styles.block}>
                <span>答题区域高度(行)</span>
                <Input type="number" min="5" max={questionType==='jianda'?'30':'150'} style={{width: 80}} value={item.get('answerHeight')} onChange={this.handleFieldChange.bind(null,index,'answerHeight')} />
              </div>:null
            }
            {
              questionType === 'jianda'?
              <div className={styles.block}>
                <span>设置成</span>
                <div className={styles.horizontalLayout}>
                  <Input type="number" min="1" max="3" style={{width: 40}} value={item.get('jiandaAnswerRow')} onChange={this.handleFieldChange.bind(null,index,'jiandaAnswerRow')} />
                  <span style={{marginLeft: 3,marginRight: 3}}>排×</span>
                  <Input type="number" min="1" max="3" style={{width: 40}} value={item.get('jiandaAnswerCol')} onChange={this.handleFieldChange.bind(null,index,'jiandaAnswerCol')} />
                  <span style={{marginLeft: 3}}>列</span>
                </div>
              </div>:null
            }
            <div className={styles.block}>
              <span style={{height: 18}}>{" "}</span>
              <div>
                <Button type="primary" className={styles.editButton} onClick={this.handleAddQuestion}><Icon type="plus" /></Button>
                <Button type="primary" className={styles.deleteButton} onClick={this.handleDeleteQuestion.bind(null,index)}><Icon type="close" /></Button>
              </div>
            </div>
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
          {questions.map((item,index) => item.get('questionType')==='zhangjie'?this.renderChapter(item,index):this.renderQuestion(item,index))}
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
