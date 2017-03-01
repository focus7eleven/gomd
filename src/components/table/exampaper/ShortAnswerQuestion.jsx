import React from 'react'
import styles from './ShortAnswerQuestion.scss'
import {Table,Icon,Row,Col,Select,Rate,Button,Input,InputNumber} from 'antd'
import Ueditor from '../../ueditor/Ueditor'
import _ from 'underscore'
import {fromJS} from 'immutable'
import {updateQuestion,updateOption,setScore,QUESTION_TYPE} from './exampaper-utils'

const Option = Select.Option
const ShortAnswerQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:{},
      onDelete:()=>{},//删除题目
      onUpdate:()=>{},//更新题目
    }
  },
  getInitialState(){
    return {
      answerList:this.props.questionInfo.get('optionPojoList'),
      editingDrawZone:false,//编辑作图区
      drawZone:'作图区',//作图区
      editingAnswerItem:false,//编辑答案选项
      question:'请输入题目内容',//题目
      comment:'',//注解
      description:'',//描述
      drawZone:'',//作图区
      difficulty:1,//难度
      score:this.props.questionInfo.get('score'),//分数
      showScoreSetting:false,//显示分值面板
    }
  },
  //添加备注
  handleUpdateComment(e){
    updateQuestion({
      qid:this.props.questionInfo.get('id'),
      examination:this.props.questionInfo.get('examination'),
      comment:e.target.value,
      description:this.props.questionInfo.get('description'),
      difficulty:this.props.questionInfo.get('difficulty'),
      kind:this.props.questionInfo.get('kind'),
      drawZone:'',
      score:this.props.questionInfo.get('score'),
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['comment'],e.target.value)
  },
  //添加描述
  handleUpdateDescription(e){
    updateQuestion({
      qid:this.props.questionInfo.get('id'),
      examination:this.props.questionInfo.get('examination'),
      comment:this.props.questionInfo.get('comment'),
      description:e.target.value,
      difficulty:this.props.questionInfo.get('difficulty'),
      kind:this.props.questionInfo.get('kind'),
      drawZone:'',
      score:this.props.questionInfo.get('score'),
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['description'],e.target.value)
  },
  //设定分值
  handleChangeScore(key,value){
    setScore({
      questionId:this.props.questionInfo.get('id'),
      score:value
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['score'],value)
  },
  //修改题目
  handleUpdateQuestion(type,value){
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
    this.props.onUpdate(this.props.questionInfo.get('id'),type=='title'?['examination']:['drawZone'],value)
  },
  //修改答案选项
  handleUpdateOption(value){
    updateOption({
      optionId:this.props.questionInfo.get('optionPojoList').get(0).get('id'),
      content:value,
      score:this.props.questionInfo.getIn(['optionPojoList',0,'score']),
      isAnswer:this.props.questionInfo.getIn(['optionPojoList',0,'answer'])
    })
    this.props.onUpdate(this.props.questionInfo.get('id'),['optionPojoList',0,'content'],value)
  },
  //显示设定分值面板
  handleSetScore(){
    this.setState({
      showScoreSetting:!this.state.showScoreSetting
    })
  },
  renderFooter(){
    return (
      <div className={styles.footer} onClick={(e)=>{e.stopPropagation()}} >
        <Row>
          <Col span={6}>
            <Select style={{width:'200px'}} defaultValue={this.props.questionInfo.get('kind')} onFocus={()=>{
              window.removeEventListener('click',this.handleWindowEvent)
            }} onBlur={()=>{
              window.addEventListener('click',this.handleWindowEvent)
            }} onChange={(value)=>this.props.onChangeQuestionType(this.props.questionInfo.get('id'),value)}>
            {
              QUESTION_TYPE.map(v => (
                <Option value={v.id} title={v.text} key={v.id}>{v.text}</Option>
              ))
            }
            </Select>
          </Col>
          <Col span={6}>
            难度：<Rate value={this.state.difficulty} onChange={this.handlerSetHardness}/>
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
  renderQuestion(){
    return (
      <div className={styles.question} onClick={(e)=>{e.stopPropagation();this.setState({editingQuestion:!this.state.editingQuestion,showFooter:!this.state.showFooter,showScoreSetting:false,})}}>
      {
        this.state.editingQuestion?<Ueditor name={this.props.questionInfo.get('id')} initialContent={this.props.questionInfo.get('examination')||'请输入题目'} onDestory={this.handleUpdateQuestion.bind(this,'title')}/>:<span dangerouslySetInnerHTML={{__html:this.props.questionInfo.get('examination')||'请输入题目'}}></span>
      }
      {this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
        value={this.props.questionInfo.get('optionPojoList').getIn([0,'score'])}
        onChange={this.handleChangeScore.bind(this,0)}/></div>:null}
      </div>
    )
  },
  getTableData(){
    const questionType = this.props.questionInfo.get('kind')

    const tableHeader = [{
      title:this.props.questionInfo.get('questionNo'),
      key:'num',
      className:styles.columnsNo,
      width:50,
    },{
      title:this.renderQuestion(),
      dataIndex:'answer',
      key:'answer',
      className:styles.columns,
      render:(text,record) => {
        if(record.key>-1){
          //编辑答案
          return (
            <div className={styles.question}>
            {
              this.state.editingAnswerItem?<Ueditor name={this.props.questionInfo.getIn(['optionPojoList',record.key,'id'])} initialContent={text||'输入选项内容'} onDestory={this.handleUpdateOption}/>:<span dangerouslySetInnerHTML={{__html:text||'输入选项内容'}}></span>
            }
            </div>
          )
        }else{
          //编辑作图区
          return (
            <div className={styles.question}>
            {
              this.state.editingDrawZone?<Ueditor name={this.props.questionInfo.get('id')+'drawZone'} onDestory={this.handleUpdateQuestion.bind(this,'drawZone')}/>:<span >{text||'作图区'}</span>
            }
            </div>
          )
        }
      }
    },{
      title:<Icon type='close' onClick={()=>this.props.onDelete(this.props.questionInfo.get('id'),this.state)}/>,
      className:styles.columnsNo,
      width:50,
      render:(text,record)=>{
        return <Icon type='close' onClick={this.handleDeleteAnswerItem}/>
      }
    }]
    const tableBody = this.props.questionInfo.get('kind')=='05'?fromJS([{
      answer:this.state.drawZone,
      key:-1,
    }]).concat(this.props.questionInfo.get('optionPojoList').map((v,k) => ({
      answer:v.get('content'),
      key:k,
    }))).toJS():this.props.questionInfo.get('optionPojoList').map((v,k) => ({
      answer:v.get('content'),
      key:k,
    })).toJS()

    return {
      tableHeader,
      tableBody,
    }
  },
  render(){
    let questionTypeName = ''
    switch (this.props.questionInfo.get('kind')) {
      case '05':
        questionTypeName = '简答题'
        break;
      case '06':
        questionTypeName = '语文作文题'
        break;
      case '07':
        questionTypeName = '英语作文题'
        break;
      default:
        questionTypeName = ''
    }
    const tableData = this.getTableData()
    return (
      <div className={styles.multipleChoiceQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>{questionTypeName}</span>
        </div>
        <Table onRowClick={(record,index)=>{
          if(record.key==-1){
            this.setState({
              editingDrawZone:!this.state.editingDrawZone
            })
          }else{
            this.setState({
              editingAnswerItem:!this.state.editingAnswerItem
            })
          }
        }} bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
        <div className={styles.moveButton}>
          {this.props.questionInfo.get('questionNo')==1?null:<Button onClick={(e)=>{this.props.moveUp(this.props.questionInfo.get('id'))}}><Icon type="caret-up" /></Button>}
          <Button onClick={(e)=>{this.props.moveDown(this.props.questionInfo.get('id'))}}><Icon type="caret-down" /></Button>
        </div>
        {
          this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})

export default ShortAnswerQuestion
