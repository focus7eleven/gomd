import React from 'react'
import styles from './ShortAnswerQuestion.scss'
import {Table,Icon,Row,Col,Select,Rate,Button,Input,InputNumber} from 'antd'
import Ueditor from '../../ueditor/Ueditor'
import _ from 'underscore'
import {fromJS} from 'immutable'
import {updateQuestion,updateOption,setScore} from './exampaper-utils'

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
const Option = Select.Option
const ShortAnswerQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:{},
      onDelete:()=>{},//删除题目
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
  //设定分值
  handleChangeScore(key,value){
    this.setState({
      score:value
    })
    setScore({
      questionId:this.props.questionInfo.get('id'),
      score:value
    })
  },
  //修改题目
  handleUpdateQuestion(type,value){
    type=='title'?this.setState({
      question:value||'请输入题目'
    }):this.setState({
      drawZone:value||'作图区'
    })
    updateQuestion({
      qid:this.props.questionInfo.get('id'),
      examination:value,
      comment:this.state.comment,
      description:this.state.description,
      difficulty:this.state.difficulty,
      kind:this.props.questionInfo.get('kind'),
      drawZone:this.state.drawZone,
      score:this.state.score,
    })
  },
  //修改答案选项
  handleUpdateOption(value){
    this.setState({
      answerList:this.state.answerList.setIn([0,'content'],value)
    })
    updateOption({
      optionId:this.state.answerList.get(0).get('id'),
      content:value,
      score:this.state.answerList.get(0).get('score'),
      isAnswer:true,
    })
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
            难度：<Rate value={this.state.difficulty} onChange={this.handlerSetHardness}/>
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
  renderQuestion(){
    return (
      <div className={styles.question} onClick={(e)=>{e.stopPropagation();this.setState({editingQuestion:!this.state.editingQuestion,showFooter:!this.state.showFooter})}}>
      {
        this.state.editingQuestion?<Ueditor onDestory={this.handleUpdateQuestion.bind(this,'title')}/>:<span >{this.state.question}</span>
      }
      {this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
        value={this.state.answerList.getIn([0,'score'])}
        onChange={this.handleChangeScore.bind(this,0)}/></div>:null}
      </div>
    )
  },
  getTableData(){
    const questionType = this.props.questionInfo.get('kind')

    const tableHeader = [{
      title:this.props.questionInfo.get('questionNo'),
      key:'num',
      className:styles.columns,
      width:50,
    },{
      title:this.renderQuestion(),
      dataIndex:'answer',
      key:'answer',
      render:(text,record) => {
        if(record.key>-1){
          //编辑答案
          return (
            <div className={styles.question}>
            {
              this.state.editingAnswerItem?<Ueditor onDestory={this.handleUpdateOption}/>:<span >{text||'输入选项内容'}</span>
            }
            </div>
          )
        }else{
          //编辑作图区
          return (
            <div className={styles.question}>
            {
              this.state.editingDrawZone?<Ueditor onDestory={this.handleUpdateQuestion.bind(this,'drawZone')}/>:<span >{text||'作图区'}</span>
            }
            </div>
          )
        }
      }
    },{
      title:<Icon type='close' onClick={()=>this.props.onDelete(this.props.questionInfo.get('id'),this.state)}/>,
      className:styles.columns,
      width:50,
      render:(text,record)=>{
        return <Icon type='close' onClick={this.handleDeleteAnswerItem}/>
      }
    }]
    const tableBody = this.props.questionInfo.get('kind')=='05'?fromJS([{
      answer:this.state.drawZone,
      key:-1,
    }]).concat(this.state.answerList.map((v,k) => ({
      answer:v.get('content'),
      key:k,
    }))).toJS():this.state.answerList.map((v,k) => ({
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
          <div>
          </div>
        </div>
        {
          this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})

export default ShortAnswerQuestion
