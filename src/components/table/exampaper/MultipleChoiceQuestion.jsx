import React from 'react'
import styles from './MultipleChoiceQuestion.scss'
import {List,fromJS} from 'immutable'
import {Table,Icon,Input} from 'antd'
import Ueditor from '../../ueditor/Ueditor'

const MultipleChoiceQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionNo:1,

      moveUp:()=>{},//上移
      moveDown:()=>{},//下移
    }
  },
  getInitialState(){
    return {
      answerList:fromJS([
        {answer:false,content:"答案一",id:"0",questionId:"1",score:0},
        {answer:false,content:"答案二",id:"1",questionId:"1",score:0},
        {answer:false,content:"答案三",id:"2",questionId:"1",score:0},
        {answer:false,content:"答案四",id:"3",questionId:"1",score:0}
      ]),//答案列表
      question:'输入题目内容',//
      editingQuestion:false,//是否编辑题目
      editingAnswerItem:[false,false,false,false],//编辑答案选项
    }
  },
  componentDidMount(){
    window.addEventListener('click',this.handleWindowEvent)
  },
  componentWillUnmount(){
    window.removeEventListener('click',this.handleWindowEvent)
  },
  getTableData(){
    const tableHeader = [{
      title:this.props.questionNo,
      dataIndex:'num',
      key:'num',
    },{
      title:this.renderQuestion(),
      dataIndex:'answer',
      key:'answer',
      render:(text,record) => (
        <div className={styles.question} onClick={(e)=>{e.stopPropagation();this.setState({
          editingAnswerItem:this.state.editingAnswerItem.map((v,k) => k==record.key?!v:v)})}}>
        {
          this.state.editingAnswerItem[record.key]?<Ueditor />:<span >{text}</span>
        }
        </div>
      )
    }]
    const tableBody = this.state.answerList.map((v,k) => ({
      answer:v.get('content'),
      num:'11',
      key:k,
    })).toJS()
    return {
      tableHeader,
      tableBody,
    }
  },
  handleWindowEvent(){
    this.setState({
      editingQuestion:false,
      editingAnswerItem:this.state.editingAnswerItem.map(v => false)
    })
  },
  renderQuestion(){
    console.log("-ninininiL:",this.state.editingQuestion)
    return (
      <div className={styles.question} onClick={(e)=>{e.stopPropagation();this.setState({editingQuestion:true})}}>
      {
        this.state.editingQuestion?<Ueditor />:<span >输入题目</span>
      }
      </div>
    )
  },
  render(){
    const tableData = this.getTableData()
    return(
      <div className={styles.multipleChoiceQuestion}>
        <div className={styles.tag}>
          <span className={styles.text}>单选题</span>
        </div>
        <Table bordered dataSource={tableData.tableBody} columns={tableData.tableHeader}/>
        <div className={styles.moveButton}>
          <div>
          </div>
        </div>
      </div>
    )
  }
})

export default MultipleChoiceQuestion
