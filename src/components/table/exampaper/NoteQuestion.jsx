import React from 'react'
import Ueditor from '../../ueditor/Ueditor'
import styles from './NoteQuestion.scss'
import {fromJS} from 'immutable'
import {Row,Col,Button,Select,Rate,Input,InputNumber,Icon} from 'antd'
import {updateQuestion,setScore} from './exampaper-utils'
const mockData = {
    "id": "240958772334432256",
    "questionNo": 3,
    "examination": "",
    "parentId": "",
    "comment": "",
    "drawZone": null,
    "description": "",
    "difficulty": 0,
    "score": 1.0,
    "kind": "04",
    "mustanswer": false,
    "audioName": null,
    "videoName": null,
    "pdfName": null,
    "haveAudio": false,
    "haveVideo": false,
    "havePdf": false,
    "questionIndex": null,
    "updateDate": null,
    "creatorUserId": "031218647663209576",
    "ownerId": "031218647663209576",
    "subQuestion": "",
    "abilityId": null,
    "examinationPaperId": "240956727753838592",
    "optionPojoList": null,
    "importDate": null,
    "select": false,
    "draft": false,
    "public": false
}
const questionType = [{
  id:'0',
  text:'单选'
},{
  id:'1',
  text:'多选'
},{
  id:'2',
  text:'填空'
},{
  id:'3',
  text:'判断'
},{
  id:'4',
  text:'简答（计算）'
},{
  id:'5',
  text:'语文作文'
},{
  id:'6',
  text:'英语作文'
},]
const NoteQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:fromJS(mockData),
      onDelete:()=>{},//删除题目
      onUpdate:()=>{},//更新题目
    }
  },
  getInitialState(){
    return {
      editingQuestion:false,//是否编辑题目
      question:'请输入题目',//题目
      showFooter:false,//显示添加备注面板
      difficulty:0,//题目难度
      score:1,//题目分数
      comment:'',//注解
      description:'',//描述
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
  //给题目添加一个空格
  handleAddBlank(){
    this.ue = UE.instants.ueditorInstant0
    let range = this.ue.selection.getRange()
    range.select()
    let content = this.ue.selection.getText()
    if( content != null && content.length > 0 ) {
      var html = "<span class='fillspaceAnswer' style='background-color: rgba(204, 204, 204, 0.51); margin-left: 3px; margin-right: 3px'>"+content+"</span>";
      this.ue.execCommand("inserthtml", html);
    }
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
  //修改难度
  handlerSetHardness(value){
    updateQuestion({
      qid:this.props.questionInfo.get('id'),
      examination:this.state.question,
      comment:this.state.comment,
      description:this.state.description,
      difficulty:value,
      kind:this.props.questionInfo.get('kind'),
      drawZone:'',
      score:this.state.score,
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['difficulty'],value)
  },
  //设定分值
  handleSetScore(){
    this.setState({
      showScoreSetting:!this.state.showScoreSetting
    })
  },
  //修改分值
  handleChangeScore(value){
    setScore({
      questionId:this.props.questionInfo.get('id'),
      score:value,
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['score'],value)
  },
  renderFooter(){
    return (
      <div className={styles.footer} >
        <Row>
          <Col span={6}>
            <Button onClick={this.handleAddBlank}>添加填空</Button>
          </Col>
          <Col span={6}>
            <Select style={{width:'200px'}} onFocus={()=>{
              // window.removeEventListener('click',this.handleWindowEvent)
            }} onBlur={()=>{
              // window.addEventListener('click',this.handleWindowEvent)
            }} onChange={this.props.onChangeQuestionType}>
            {
              questionType.map(v => (
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
            注解：<div><Input /></div>
          </Col>
          <Col span={10} offset={2}>
            描述：<div><Input /></div>
          </Col>
        </Row>
      </div>
    )
  },
  render(){
    return (
      <div className={styles.noteQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>填空题</span>
        </div>
        <div className={styles.questionContainer}>
          <div className={styles.questionNo}>
          {
            this.props.questionInfo.get('questionNo')
          }
          </div>
          <div className={styles.questionContent} onClick={this.handleEditQuestion}>
          {
            this.state.editingQuestion?<div><Ueditor onDestory={this.handleUpdateQuestion}/></div>:<div>{this.props.questionInfo.get('examination')}</div>
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
        <div className={styles.moveButton}>
            <Button onClick={(e)=>{this.props.moveUp(this.props.questionInfo.get('id'))}}><Icon type="caret-up" /></Button>
            <Button onClick={(e)=>{this.props.moveDown(this.props.questionInfo.get('id'))}}><Icon type="caret-down" /></Button>
        </div>
        {
          this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})

export default NoteQuestion
