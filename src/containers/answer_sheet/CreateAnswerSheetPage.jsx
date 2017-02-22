import React from 'react'
import styles from './CreateAnswerSheetPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {createAnswerSheet} from '../../actions/answer_sheet/main'
import {Modal,Select,Icon,Button,Input,Checkbox} from 'antd'
import {Map,Record,List,fromJS} from 'immutable'
import classnames from 'classnames'
import parseIndex from '../../utils/chineseIndex'
import moment from 'moment'

const Option = Select.Option;

const testData = fromJS([{
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
}])

const questionProtoType = fromJS({
  questionType: 'xuanze',
  isChild: false,
  questionTitle: '单选题',
  questionIndex: 1,
  childQuestionTitle: '',
  questionNum: 1,
  optionType: 'en_zimu',
  optionNum: 4,
  answerWidth: 0,
  answerHeight: 1,
  isCustomized: false,
  widthArr:['1/3'],
  heightArr:[1],
})

const getTypeName = (type) => {
  let result
  switch (type) {
    case 'zhangjie':
      result = '章节'
      break;
    case 'xuanze':
      result = '单选题'
      break;
    case 'duoxuan':
      result = '多选题'
      break;
    case 'panduan':
      result = '判断题'
      break;
    case 'tiankong':
      result = '填空题'
      break;
    case 'jianda':
      result = '简答题(计算题)'
      break;
    case 'zuowen_en':
      result = '英语作文题'
      break;
    case 'zuowen_cn':
      result = '语文作文题'
      break;
    default:
      result = '单选题'
  }
  return result
}

const CreateAnswerSheetPage = React.createClass({
  getInitialState(){
    return {
      sheetName: moment().format("YYYYMMDD-SSSSS"),
      continuousIndex: false,
      questions: fromJS([{
        questionType: 'xuanze',
        isChild: false,
        questionTitle: '单选题',
        questionIndex: 1,
        childQuestionTitle: '',
        questionNum: 1,
        optionType: 'en_zimu',
        optionNum: 4,
        answerWidth: 0,
        answerHeight: 1,
        isCustomized: false,
        widthArr: fromJS(['1/3']),
        heightArr:fromJS([1]),
      }]),
      showCustomizeBlankModal: false,
      showCustomizeCalcModal: false,
      currentQuestionIndex: 0,
      currentWidthArr: fromJS(['1/3']),
      currentHeightArr: fromJS([1]),
      currentRowColArr: fromJS([[5,1,1]]),
      currentTitleArr: fromJS(['']),
    }
  },

  handleSheetNameChange(e){
    this.setState({sheetName: e.target.value})
  },

  handleContinuousIndex(e){
    this.setState({continuousIndex: e.target.checked})
  },

  handleAddQuestion(index){
    let {continuousIndex,questions} = this.state;
    console.log(questions.get(index).toJS());
    let newIndex = questions.get(index).get('questionIndex') + 1;
    let i = index
    const size = questions.size
    if(continuousIndex){
      while(i<size-1){
        i++;
        if(questions.get(i).get('questionType')==='zhangjie'){
          continue;
        }
        questions = questions.update(i, v => v.set('questionIndex', v.get('questionIndex') + 1))
      }
    }else{
      while(i<size-1){
        i++;
        if(questions.get(i).get('questionType')==='zhangjie'){
          break;
        }
        questions = questions.update(i, v => v.set('questionIndex', v.get('questionIndex') + 1))
      }
    }

    questions = questions.splice(index+1,0,questionProtoType.set('questionIndex',newIndex));
    this.setState({questions});
  },

  handleTypeChanged(index,value){
    // const newTitle = parseIndex(index+1) + '、' + getTypeName(value)
    const newTitle = getTypeName(value)
    const questions = this.state.questions.update(index, v => v.set('questionTitle',newTitle).set('questionNum',1).set('questionType',value).set('childQuestionTitle',''));
    switch (value) {
      case 'zhangjie':
        this.setState({questions: questions.update(index, v => v.set('optionType','left').set('questionIndex',0))})
        break;
      case 'xuanze':
        this.setState({questions: questions.update(index, v => v.set('optionType','en_zimu'))})
        break;
      case 'duoxuan':
        this.setState({questions: questions.update(index, v => v.set('optionType','en_zimu'))})
        break;
      case 'panduan':
        this.setState({questions: questions.update(index, v => v.set('optionType','dui_cuo'))})
        break;
      case 'tiankong':
        this.setState({questions: questions.update(index, v => v.set('answerWidth','1/3').set('answerHeight',1).set('widthArr',fromJS(['1/3'])).set('heightArr',fromJS([1])))})
        break;
      case 'jianda':
        this.setState({questions: questions.update(index, v => v.set('answerHeight',5).set('titleArr',fromJS([''])).set('heightArr',fromJS([[5,1,1]])).set('jiandaAnswerCol',1).set('jiandaAnswerRow',1))})
        break;
      case 'zuowen_cn':
        this.setState({questions: questions.update(index, v => v.set('answerHeight',40))})
        break;
      case 'zuowen_en':
        this.setState({questions: questions.update(index, v => v.set('answerHeight',10))})
        break;
      default:
        this.setState({questions: questions.update(index, v => v.set('optionType','en_zimu'))})
    }
  },

  handleInitWidthAndHeight(index,num){
    const questions = this.state.questions;
    const question = questions.get(index)
    if(question.get('questionType')==='tiankong'){
      const h = question.get('answerHeight')
      const w = question.get('answerWidth')
      const newWidth = Array.from({length: num},(v,i)=>w)
      const newHeight = Array.from({length: num},(v,i)=>h)
      this.setState({questions: questions.update(index, v => v.set('questionNum',num).set('widthArr',fromJS(newWidth)).set('heightArr',fromJS(newHeight)))})
    }else if(question.get('questionType')==='jianda'){
      const h = question.get('answerHeight')
      const r = question.get('jiandaAnswerRow')
      const c = question.get('jiandaAnswerCol')
      const newHeight = Array.from({length: num},(v,i)=>[h,r,c])
      const newTitle = Array.from({length: num}, (v,i)=>question.get('childQuestionTitle'))
      this.setState({questions: questions.update(index, v => v.set('questionNum',num).set('titleArr',fromJS(newTitle)).set('heightArr',fromJS(newHeight)))})
    }else{
      this.setState({questions: questions.update(index, v => v.set('questionNum',num))})
    }
  },

  handleFieldChange(index,key,e){
    const questions = this.state.questions;
    let value
    switch (key) {
      case 'questionType':
        value = e;
        this.handleTypeChanged(index,value)
        break;
      case 'optionType':
        value = e;
        break;
      case 'answerWidth':
        value = e;
        break;
      case 'isChild':
        value = e.target.checked;
        break;
      case 'questionNum':
        this.handleInitWidthAndHeight(index,e.target.value)
        break;
      default:
        value = e.target.value
    }
    key === 'questionType' || key === 'questionNum' ? null : this.setState({questions: questions.update(index, v => v.set(key, value))})
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

  handleSaveAnswerSheet(){
    let formData = new FormData();
    const {sheetName,questions} = this.state;
    formData.append('answersheet_name',sheetName)
    questions.map((item,index)=>{
      formData.append('question_id',0);
      formData.append('question_sort',index+1);
      formData.append('question_type',item.get('questionType'));
      item.get('isChild')?formData.append('child_question_flag',index+1):null
      formData.append('question_title',item.get('questionTitle'));
      if(item.get('questionType')==='jianda'){
        formData.append('child_question_title',item.get('titleArr').join('|'));
      }else{
        formData.append('child_question_title',item.get('childQuestionTitle'));
      }
      formData.append('question_num',item.get('questionNum'));
      formData.append('option_type',item.get('optionType'));
      formData.append('option_num',item.get('optionNum'));
      if(item.get('questionType')==='tiankong'){
        formData.append('answer_height', item.get('heightArr').join('|'));
        formData.append('answer_width',item.get('widthArr').join('|'));
      }else if(item.get('questionType')==='jianda'){
        formData.append('answer_height', item.get('heightArr').toJS().join('|').replace(/,/g,'*'));
        formData.append('answer_width',item.get('answerWidth'));
      }else{
        formData.append('answer_height', item.get('answerHeight'));
        formData.append('answer_width',item.get('answerWidth'));
      }
    })
    this.props.createAnswerSheet(formData);
  },

  // 弹出模态框
  handleCustomize(index){
    const question = this.state.questions.get(index)
    const questionType = question.get('questionType')
    if(questionType === 'tiankong'){
      this.setState({showCustomizeBlankModal: true, currentQuestionIndex: index, currentWidthArr: question.get('widthArr'), currentHeightArr: question.get('heightArr')})
    }else if(questionType === 'jianda'){
      this.setState({showCustomizeCalcModal: true, currentQuestionIndex: index, currentTitleArr: question.get('titleArr'), currentRowColArr: question.get('heightArr')})
    }
  },

  handleCancelCustomize(index){
    const questions = this.state.questions;
    const question = questions.get(index)
    if(question.get('questionType')==='tiankong'){
      const h = question.get('answerHeight')
      const w = question.get('answerWidth')
      const newWidth = Array.from({length: question.get('questionNum')},(v,i)=>w)
      const newHeight = Array.from({length: question.get('questionNum')},(v,i)=>h)
      this.setState({questions: questions.update(index, v => v.set('isCustomized',false).set('widthArr',fromJS(newWidth)).set('heightArr',fromJS(newHeight)))})
    }else if(question.get('questionType')==='jianda'){

    }
  },

  // 确认定制填空
  handleCustomizeBlank(){
    const {currentQuestionIndex,currentWidthArr,currentHeightArr,questions} = this.state
    this.setState({showCustomizeBlankModal:false,  questions: questions.update(currentQuestionIndex, v => v.set('isCustomized',true).set('widthArr', currentWidthArr).set('heightArr',currentHeightArr))})
  },

  // 确认定制简答
  handleCustomizeCalc(){
    const {currentQuestionIndex,currentRowColArr,currentTitleArr,questions} = this.state
    this.setState({showCustomizeCalcModal:false,  questions: questions.update(currentQuestionIndex, v => v.set('isCustomized',true).set('heightArr',currentRowColArr).set('titleArr',currentTitleArr))})
  },

  handleHideCustomizeBlankModal(){
    const question = this.state.questions.get(this.state.currentQuestionIndex)
    this.setState({showCustomizeBlankModal: false, currentWidthArr: question.get('widthArr'), currentHeightArr: question.get('heightArr')})
  },

  handleHideCustomizeCalcModal(){
    const question = this.state.questions.get(this.state.currentQuestionIndex)
    this.setState({showCustomizeCalcModal: false, currentHeightArr: question.get('heightArr'), currentTitleArr: question.get('titleArr')})
  },

  // 设置填空题的高度和区域个数
  handleArray(index,type,e){
    if(type==='widthArr'){
      this.setState({currentWidthArr: this.state.currentWidthArr.set(index,e)})
    }else{
      this.setState({currentHeightArr: this.state.currentHeightArr.set(index,e.target.value)})
    }
  },

  // 设置简答题的子标题
  handleTitleArray(index,e){
    this.setState({currentTitleArr: this.state.currentTitleArr.set(index,e.target.value)})
  },

  // 设置简答题的答题高度，几排几列
  handleHeightArray(index,type,e){
    this.setState({currentRowColArr: this.state.currentRowColArr.setIn([index,type],e.target.value)})
  },

  renderCustomizeBlankModal(){
    const {showCustomizeBlankModal,currentWidthArr,currentHeightArr} = this.state;
    const currentQuestion = this.state.questions.get(this.state.currentQuestionIndex)
    return (
      <Modal title="定制填空题答题区" visible={showCustomizeBlankModal}
          onOk={this.handleCustomizeBlank} onCancel={this.handleHideCustomizeBlankModal}>
          <div className={styles.verticalLayout}>
            <div className={styles.horizontalLayout} style={{fontSize: 14,paddingLeft: 5,marginBottom: 24,borderBottom:"1px solid #d9d9d9"}}>
              <span style={{marginRight: 44}}>子题目</span>
              <span style={{marginRight: 62}}>答题区域大小(行):</span>
              <span>答题区域个数:</span>
            </div>
            {
              currentWidthArr.map((item,index)=>{
                return (
                  <div key={index} style={{marginBottom: 10}}>
                    <span style={{marginRight: 56, marginLeft: 22,fontSize: 14}}>{index+1}</span>
                    <Select value={item} onChange={this.handleArray.bind(null,index,'widthArr')} defaultValue="1/3" style={{ width: 148, marginRight: 24 }}>
                      <Option value="1/4">1/4</Option>
                      <Option value="1/3">1/3</Option>
                      <Option value="1/2">1/2</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                    </Select>
                    <Input type="number" value={currentHeightArr.get(index)} onChange={this.handleArray.bind(null,index,'heightArr')} min="1" max="50" placeholder="1-50" style={{width: 120}} />
                  </div>
                )
              })
            }
          </div>
      </Modal>
    )
  },

  renderCustomizeCalcModal(){
    const {showCustomizeCalcModal,currentRowColArr,currentTitleArr} = this.state;
    const currentQuestion = this.state.questions.get(this.state.currentQuestionIndex)
    return (
      <Modal width={700} title="定制简答题答题区" visible={showCustomizeCalcModal}
          onOk={this.handleCustomizeCalc} onCancel={this.handleHideCustomizeCalcModal}>
          <div className={styles.verticalLayout}>
            <div className={styles.horizontalLayout} style={{fontSize: 14,paddingLeft: 5,marginBottom: 24,borderBottom:"1px solid #d9d9d9"}}>
              <span style={{marginRight: 30}}>子题目</span>
              <span style={{marginRight: 215}}>子标题</span>
              <span style={{marginRight: 30}}>答题区域大小(行):</span>
              <span>设置成:</span>
            </div>
            {
              currentRowColArr.map((item,index)=>{
                return (
                  <div key={index} style={{marginBottom: 10}}>
                    <span style={{marginRight: 44, marginLeft: 22,fontSize: 14}}>{index+1}</span>
                    <Input value={currentTitleArr.get(index)} onChange={this.handleTitleArray.bind(null,index)} placeholder="输入少于30个字" style={{width: 240,marginRight: 20}} />
                    <Input value={item.get(0)} onChange={this.handleHeightArray.bind(null,index,0)} type="number" min='5' max='30' placeholder='5-30' style={{width: 118, marginRight: 20}} />
                    <div style={{display:'inline'}}>
                      <Input value={item.get(1)} onChange={this.handleHeightArray.bind(null,index,1)} type="number" min="1" max="3" placeholder="1-3" style={{width: 50}} />
                      <span style={{marginLeft: 3,marginRight: 3}}>排×</span>
                      <Input value={item.get(2)} onChange={this.handleHeightArray.bind(null,index,2)} type="number" min="1" max="3" placeholder="1-3" style={{width: 50}} />
                      <span style={{marginLeft: 3}}>列</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
      </Modal>
    )
  },

  renderChapter(item,index){
    const questionType = item.get('questionType')
    return (
      <div className={classnames(styles.questionContainer,styles.specialBackground,styles.hasBorderTop)} key={index}>
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
            <Option value="jianda">简答题(计算题)</Option>
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
            <Button type="primary" className={styles.editButton} onClick={this.handleAddQuestion.bind(null,index)}><Icon type="plus" /></Button>
            <Button type="primary" className={styles.deleteButton} onClick={this.handleDeleteQuestion.bind(null,index)}><Icon type="close" /></Button>
          </div>
        </div>
      </div>
    )
  },

  renderQuestion(item,index){
    const questionType = item.get('questionType')
    const isChild = item.get('isChild')
    const isCustomized = item.get('isCustomized')
    return (
      <div className={classnames(styles.questionContainer,isChild?null:styles.hasBorderTop)} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center', paddingTop: 3}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <Select value={questionType} defaultValue="xuanze" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'questionType')}>
            <Option value="xuanze">单选题</Option>
            <Option value="duoxuan">多选题</Option>
            <Option value="panduan">判断题</Option>
            <Option value="tiankong">填空题</Option>
            <Option value="jianda">简答题(计算题)</Option>
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
            <div className={styles.horizontalLayout}>
              <div className={styles.block} style={{marginRight: 0}}>
                <span style={{height: 18}}>{" "}</span>
                <span style={{marginTop: 5}}>{parseIndex(item.get('questionIndex'))+"、"}</span>
              </div>
              <div className={styles.block} style={{marginBottom: 10}}>
                <span>标题</span>
                <Input placeholder="输入少于30个字" style={{width: 470}} value={item.get('questionTitle')} onChange={this.handleFieldChange.bind(null,index,'questionTitle')} />
              </div>
            </div>
          }
          <div className={styles.horizontalLayout}>
            <div className={styles.block} style={{marginRight: 8}}>
              <span style={{height: 18}}>{" "}</span>
              <span style={{marginTop: 5}}>3.1</span>
            </div>
            <div className={styles.block}>
              <span>子标题</span>
              <Input placeholder="输入少于30个字" style={{width: 240}} value={item.get('childQuestionTitle')} onChange={this.handleFieldChange.bind(null,index,'childQuestionTitle')} />
            </div>
            <div className={styles.block}>
              <span>题目个数</span>
              <Input type="number" min="1" max="999" placeholder="1-999" style={{width: 80}} value={item.get('questionNum')} onChange={this.handleFieldChange.bind(null,index,'questionNum')} />
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
                  <Input type="number" min="2" max="9" placeholder="2-9" style={{width: 80}} value={item.get('optionNum')} onChange={this.handleFieldChange.bind(null,index,'optionNum')} />
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
                  <Select value={item.get('answerWidth')} disabled={isCustomized} defaultValue="1/3" style={{ width: 120 }} onChange={this.handleFieldChange.bind(null,index,'answerWidth')}>
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
                  <Input type="number" min="1" max="50" disabled={isCustomized} placeholder="1-50" style={{width: 80}} value={item.get('answerHeight')} onChange={this.handleFieldChange.bind(null,index,'answerHeight')} />
                </div>
              </div>:null
            }
            {
              questionType === 'zuowen_en' || questionType === 'zuowen_cn' || questionType === 'jianda'?
              <div className={styles.block}>
                <span>答题区域高度(行)</span>
                <Input type="number" disabled={isCustomized} min={questionType==='jianda'?'5':'1'} max={questionType==='jianda'?'30':'150'} placeholder={questionType==='jianda'?'5-30':'1-150'} style={{width: 80}} value={item.get('answerHeight')} onChange={this.handleFieldChange.bind(null,index,'answerHeight')} />
              </div>:null
            }
            {
              questionType === 'jianda'?
              <div className={styles.block}>
                <span>设置成</span>
                <div className={styles.horizontalLayout}>
                  <Input disabled={isCustomized} type="number" min="1" max="3" placeholder="1-3" style={{width: 50}} value={item.get('jiandaAnswerRow')} onChange={this.handleFieldChange.bind(null,index,'jiandaAnswerRow')} />
                  <span style={{marginLeft: 3,marginRight: 3}}>排×</span>
                  <Input disabled={isCustomized} type="number" min="1" max="3" placeholder="1-3" style={{width: 50}} value={item.get('jiandaAnswerCol')} onChange={this.handleFieldChange.bind(null,index,'jiandaAnswerCol')} />
                  <span style={{marginLeft: 3}}>列</span>
                </div>
              </div>:null
            }
            <div className={styles.block}>
              <span style={{height: 18}}>{" "}</span>
              <div>
                <Button type="primary" className={styles.editButton} onClick={this.handleAddQuestion.bind(null,index)}><Icon type="plus" /></Button>
                <Button type="primary" className={styles.deleteButton} onClick={this.handleDeleteQuestion.bind(null,index)}><Icon type="close" /></Button>
              </div>
            </div>
            {
              questionType === 'tiankong' || questionType === 'jianda' ?
              <div className={styles.block}>
                <span style={{height: 18}}>{" "}</span>
                <div>
                  <Button type="primary" className={styles.customizeButton} onClick={this.handleCustomize.bind(null,index)}>定制</Button>
                  <Button type="primary" disabled={!isCustomized} className={styles.cancelButton} onClick={this.handleCancelCustomize.bind(null,index)}>取消定制</Button>
                </div>
              </div>:null
            }
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
          <Button type="primary" onClick={this.handleSaveAnswerSheet}>保存</Button>
        </div>
        <div className={styles.body}>
          {questions.map((item,index) => item.get('questionType')==='zhangjie'?this.renderChapter(item,index):this.renderQuestion(item,index))}
        </div>
        {this.renderCustomizeBlankModal()}
        {this.renderCustomizeCalcModal()}
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
    createAnswerSheet: bindActionCreators(createAnswerSheet,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateAnswerSheetPage)
