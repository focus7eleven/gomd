import React from 'react'
import styles from './MultipleChoiceQuestion.scss'
import {List,fromJS} from 'immutable'
import {Table,Icon,Input,Radio,Select,Row,Col,Button,Rate,InputNumber,Checkbox} from 'antd'
import Ueditor from '../../ueditor/Ueditor'
import {updateOption,updateQuestion,deleteOption} from './exampaper-utils'

const Option = Select.Option
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
const MultipleChoiceQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:fromJS({
        creatorUserId:"031218647663209576",
        examinationPaperId:"240252698337873920",
        id:'240252718520864768',
        kind:'01',
        optionPojoList:[{answer:false,content:"答案一",id:"240252718520864769",questionId:"240252718520864768",score:0},
        {answer:false,content:"答案二",id:"240252718587973632",questionId:"240252718520864768",score:0},
        {answer:false,content:"答案三",id:"240252718587973633",questionId:"240252718520864768",score:0},
        {answer:false,content:"答案四",id:"240252718655082496",questionId:"240252718520864768",score:0}],
        ownerId:'031218647663209576',
        questionNo:1,
      }),//题目的详细信息


      moveUp:()=>{},//上移
      moveDown:()=>{},//下移
      onDestory:()=>{},//销毁该题目
      onChangeQuestionType:()=>{},//改变题目类型
    }
  },
  getInitialState(){
    return {
      answerList:this.props.questionInfo.get('optionPojoList'),//答案列表
      question:'输入题目内容',//
      editingQuestion:false,//是否编辑题目
      editingAnswerItem:[false,false,false,false],//编辑答案选项
      radioCheck:-1,//选择题的答案
      showFooter:false,//显示添加额外信息面板
      showScoreSetting:false,//显示设定分数的组件
      comment:'',//备注
      description:'',//描述
      difficulty:0,
      drawZone:'',
      score:1,
      scoreList:List([0,0,0,0]),//每个答案选项的分值
    }
  },
  componentDidMount(){
    window.addEventListener('click',this.handleWindowEvent)
  },
  componentWillUnmount(){
    window.removeEventListener('click',this.handleWindowEvent)
  },
  getTableData(){
    const questionType = this.props.questionInfo.get('kind')
    const tableHeader = [{
      title:this.props.questionInfo.get('questionNo'),
      key:'num',
      className:styles.columns,
      width:50,
      render:(text,record)=>{
        return <div onClick={(e)=>{e.stopPropagation()}}>{questionType=='01'?<Radio checked={this.state.radioCheck==record.key} onClick={this.handleSetRightAnswer.bind(this,record.key)}></Radio>:<Checkbox checked={this.state.answerList.getIn([record.key,'answer'])} onChange={this.handleSetRightAnswer.bind(this,record.key)}/>}</div>
      }
    },{
      title:this.renderQuestion(),
      dataIndex:'answer',
      key:'answer',
      render:(text,record) => (
        <div className={styles.question} onClick={()=>{}}>
        {
          this.state.editingAnswerItem[record.key]?<Ueditor onDestory={this.handleUpdateOption.bind(this,record.key)}/>:<span >{text||'输入选项内容'}</span>
        }
        {this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
          value={this.state.answerList.getIn([record.key,'score'])}
          onChange={this.handleChangeScore.bind(this,record.key)}/></div>:null}
        </div>
      )
    },{
      title:<Icon type='close' onClick={this.props.destroy}/>,
      className:styles.columns,
      width:50,
      render:(text,record)=>{
        return <Icon type='close' onClick={this.handleDeleteAnswerItem.bind(this,record.key)}/>
      }
    }]
    const tableBody = this.state.answerList.map((v,k) => ({
      answer:v.get('content'),
      key:k,
    })).toJS()
    return {
      tableHeader,
      tableBody,
    }
  },
  //确定正确的答案
  handleSetRightAnswer(key,e){
    updateOption({
      optionId:this.state.answerList.get(key).get('id'),
      content:this.state.answerList.get(key).get('content'),
      score:this.state.answerList.get(key).get('score'),
      isAnswer:true
    }).then(res => {
      this.props.questionInfo.get('kind')=='01'?this.setState({
        radioCheck:key,
        answerList:this.state.answerList.map((v,k) => v.set('answer',key==k))
      }):this.setState({
        answerList:this.state.answerList.setIn([key,'answer'],true)
      })
    })
  },
  //修改题目
  handleUpdateQuestion(value){
    this.setState({
      question:value
    })
    updateQuestion({
      qid:this.props.questionInfo.get('id'),
      examination:value,
      comment:this.state.comment,
      description:this.state.description,
      difficulty:this.state.difficulty,
      kind:this.props.questionInfo.get('kind'),
      drawZone:'',
      score:this.state.score,
    })
  },
  //修改答案选项
  handleUpdateOption(key,value){
    this.setState({
      answerList:this.state.answerList.setIn([key,'content'],value)
    })
    updateOption({
      optionId:this.state.answerList.get(key).get('id'),
      content:value,
      score:this.state.score,
      isAnswer:this.state.radioCheck == key
    })
  },
  handleDeleteAnswerItem(key){
    this.setState({
      answerList:this.state.answerList.filter((v,k) => k!=key)
    })
    deleteOption({
      optionId:this.state.answerList.find((v,k) => k!=key).get('id')
    })
  },
  handleWindowEvent(){
    this.setState({
      // editingQuestion:false,
      // editingAnswerItem:this.state.editingAnswerItem.map(v => false),
      showFooter:false,
    })
  },
  //设定分值
  handleSetScore(){
    this.setState({
      showScoreSetting:!this.state.showScoreSetting
    })
  },
  //修改分值
  handleChangeScore(key,value){
    this.setState({
      scoreList:this.state.answerList.setIn([key,'score'],value)
    })
    updateOption({
      optionId:this.state.answerList.get(key).get('id'),
      content:this.state.answerList.get(key).get('content'),
      score:value,
      isAnswer:this.state.answerList.get(key).get('answer'),
    })
  },
  //添加答案选项
  handleAddAnswerItem(){
    this.setState({
      answerList:this.state.answerList.push(fromJS({answer:false,content:"答案一",id:"0",questionId:"1",score:0}))
    })
  },
  //设定难度
  handlerSetHardness(value){
    this.setState({
      difficulty:value
    })
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
  },
  //添加注解
  handleAddComment(){

  },
  renderQuestion(){
    return (
      <div className={styles.question} onClick={(e)=>{e.stopPropagation();this.setState({editingQuestion:!this.state.editingQuestion,showFooter:true})}}>
      {
        this.state.editingQuestion?<Ueditor onDestory={this.handleUpdateQuestion}/>:<span >{this.state.question}</span>
      }
      </div>
    )
  },
  renderFooter(){
    return (
      <div className={styles.footer} onClick={(e)=>{e.stopPropagation()}} >
        <Row>
          <Col span={6}>
            <Button onClick={this.handleAddAnswerItem}>添加备选</Button>
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
  render(){
    const tableData = this.getTableData()
    return(
      <div className={styles.multipleChoiceQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>{this.props.questionInfo.get('kind')=='01'?'单选题':'多选题'}</span>
        </div>
        <Table onRowClick={(record,index)=>{console.log("asdfasd");this.setState({
          editingAnswerItem:this.state.editingAnswerItem.map((v,k) => k==record.key?!v:v)})}} bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
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

export default MultipleChoiceQuestion
