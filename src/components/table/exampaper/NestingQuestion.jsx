import React from 'react'
import styles from './NestingQuestion.scss'
import {Row,Col,Icon,Button,Select,Rate,Input,InputNumber} from 'antd'
import {fromJS} from 'immutable'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import NoteQuestion from './NoteQuestion'
import ShortAnswerQuestion from './ShortAnswerQuestion'
import Ueditor from '../../ueditor/Ueditor'
import {updateQuestion,setScore,QUESTION_TYPE,changeQuestionPosition,deleteQuestion} from './exampaper-utils'

const NestingQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:fromJS({}),
      onDelete:()=>{},//删除题目
      onUpdate:()=>{},//更新题目
    }
  },
  getInitialState(){
    return {
      editingQuestion:false,//是否编辑题目
      question:'请输入题目',//题目
      showFooter:false,//显示添加备注面板
      showScoreSetting:'',//显示修改分数面板
    }
  },
  //显示编辑题目
  handleEditQuestion(e){
    e.stopPropagation()
    this.setState({
      editingQuestion:!this.state.editingQuestion,
      showFooter:!this.state.showFooter
    })
  },
  //修改题目
  handleUpdateQuestion(value){
    updateQuestion({
      qid:this.props.questionInfo.get('id'),
      examination:value,
      comment:this.props.questionInfo.get('comment'),
      description:this.props.questionInfo.get('description'),
      difficulty:this.props.questionInfo.get('difficulty'),
      kind:this.props.questionInfo.get('kind'),
      drawZone:'',
      score:this.props.questionInfo.get('score'),
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['examination'],value)
  },
  //更新子题目
  handleUpdateSubQuestion(questionId,path,value){
    let index = this.props.questionInfo.get('subQuestion').findKey(v => v.get('id')==questionId)
    let newQuestion = this.props.questionInfo.setIn(['subQuestion',index].concat(path),value)
    this.props.onUpdate(this.props.questionInfo.get('id'),['subQuestion'],newQuestion.get('subQuestion'))
  },
  //删除子题目
  handleDeleteSubQuestion(questionId){
    let index = this.props.questionInfo.get('subQuestion').findKey(v => v.get('id')==questionId)
    // let newQuestion = this.props.questionInfo.setIn(['subQuestion',index].concat(path),value)
    let newSubQuestion = this.props.questionInfo.get('subQuestion').filter(v => v.get('id')!=questionId)
    this.props.onUpdate(this.props.questionInfo.get('id'),['subQuestion'],newSubQuestion)
  },
  //向上移动子题目
  handleMoveUpSubQuestion(questionId){
    let subQuestionIndex = this.props.questionInfo.get('subQuestion').findKey(v => v.get('id')==questionId)
    let subQuestion = this.props.questionInfo.get('subQuestion').get(subQuestionIndex)
    let preSubQuestion = this.props.questionInfo.get('subQuestion').get(subQuestionIndex-1)
    changeQuestionPosition({
      moveDownQuestionId:preSubQuestion.get('id'),
      moveUpQuestionId:subQuestion.get('id'),
    })
    let newSubQuestion = this.props.questionInfo.get('subQuestion').set(subQuestionIndex,preSubQuestion).set(subQuestionIndex-1,subQuestion)
    this.props.onUpdate(this.props.questionInfo.get('id'),['subQuestion'],newSubQuestion)
  },
  //向下移动子题目
  handleMoveDownSubQuestion(questionId){
    let subQuestionIndex = this.props.questionInfo.get('subQuestion').findKey(v => v.get('id')==questionId)
    let subQuestion = this.props.questionInfo.get('subQuestion').get(subQuestionIndex)
    let nextSubQuestion = this.props.questionInfo.get('subQuestion').get(subQuestionIndex+1)
    changeQuestionPosition({
      moveDownQuestionId:subQuestion.get('id'),
      moveUpQuestionId:nextSubQuestion.get('id'),
    })
    let newSubQuestion = this.props.questionInfo.get('subQuestion').set(subQuestionIndex,nextSubQuestion).set(subQuestionIndex+1,subQuestion)
    this.props.onUpdate(this.props.questionInfo.get('id'),['subQuestion'],newSubQuestion)
  },
  renderFooter(){
    return (
      <div className={styles.footer} >
        <Row>
          <Col span={6}>
            <Button onClick={this.handleAddBlank}>添加填空</Button>
          </Col>
          <Col span={6}>
            <Select style={{width:'200px'}} defaultValue={this.props.questionInfo.get('kind')} onFocus={()=>{
              window.removeEventListener('click',this.handleWindowEvent)
            }} onBlur={()=>{
              window.addEventListener('click',this.handleWindowEvent)
            }} onChange={this.props.onChangeQuestionType}>
            {
              QUESTION_TYPE.map(v => (
                <Option value={v.id} title={v.text} key={v.id}>{v.text}</Option>
              ))
            }
            </Select>
          </Col>
          <Col span={6}>
            难度：<Rate value={this.props.questionInfo.get('difficulty')} onChange={this.handlerSetHardness}/>
          </Col>
          <Col>
            <Button onClick={this.handleSetScore}>设定分值</Button>
          </Col>
        </Row>
        <Row >
          <Col span={10}>
            注解：<div><Input onBlur={this.handleUpdateComment}/></div>
          </Col>
          <Col span={10} offset={2}>
            描述：<div><Input onBlur={this.handleUpdateDescription}/></div>
          </Col>
        </Row>
      </div>
    )
  },
  render(){
    return (
      <div className={styles.noteQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>嵌套题</span>
        </div>
        <div className={styles.questionContainer}>
          <div className={styles.questionNo}>
          {
            this.props.questionInfo.get('questionNo')
          }
          </div>
          <div className={styles.questionContent} onClick={this.handleEditQuestion}>
          {
            this.state.editingQuestion?<div><Ueditor initialContent={this.props.questionInfo.get('examination')||'请输入题目内容'} onDestory={this.handleUpdateQuestion}/></div>:<div dangerouslySetInnerHTML={{__html:this.props.questionInfo.get('examination')||'请输入题目内容'}}></div>
          }
          {
            this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
              value={this.props.questionInfo.get('score')}
              onChange={this.handleChangeScore}/></div>:null
          }
          </div>
          <div className={styles.questionNo}>
            <Icon type='close' onClick={(e)=>{e.stopPropagation();this.props.onDelete(this.props.questionInfo.get('id'))}}/>
          </div>
        </div>
        <div className={styles.subQuestionContainer}>
        {
          this.props.questionInfo.get('subQuestion')?this.props.questionInfo.get('subQuestion').map((v,k)=>{
            if(v.get('kind')=='01'||v.get('kind')=='02'||v.get('kind')=='03'){
              //单选
              return <MultipleChoiceQuestion questionInfo={v} key={k} onDelete={this.handleDeleteSubQuestion} onUpdate={this.handleUpdateSubQuestion} moveUp={this.handleMoveUpSubQuestion} moveDown={this.handleMoveDownSubQuestion}/>
            }else if(v.get('kind')=='04'){
              //填空
              return <NoteQuestion questionInfo={v} key={k} onDelete={this.handleDeleteSubQuestion} onUpdate={this.handleUpdateSubQuestion} moveUp={this.handleMoveUpSubQuestion} moveDown={this.handleMoveDownSubQuestion}/>
            }else if(v.get('kind')=='05'||v.get('kind')=='06'||v.get('kind')=='07'){
              //填空
              return <ShortAnswerQuestion questionInfo={v} key={k} onDelete={this.handleDeleteSubQuestion} onUpdate={this.handleUpdateSubQuestion} moveUp={this.handleMoveUpSubQuestion} moveDown={this.handleMoveDownSubQuestion}/>
            }else if(v.get('kind')=='08'){
              //嵌套题
              return <NestingQuestion questionInfo={v} key={k} onDelete={this.handleDeleteSubQuestion} onUpdate={this.handleUpdateSubQuestion} moveUp={this.handleMoveUpSubQuestion} moveDown={this.handleMoveDownSubQuestion}/>
            }else{
              return null
            }
          }):null
        }
        </div>
        <div className={styles.moveButton}>
            <Button onClick={(e)=>{this.props.moveUp(this.props.questionInfo.get('id'))}}><Icon type="caret-up" /></Button>
            <Button onClick={(e)=>{this.props.moveDown(this.props.questionInfo.get('id'))}}><Icon type="caret-down" /></Button>
        </div>
        {
          // this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})
export default NestingQuestion
