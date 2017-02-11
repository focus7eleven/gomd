import React from 'react'
import styles from './MultipleChoiceQuestion.scss'
import {List,fromJS} from 'immutable'
import {Table,Icon,Input,Radio,Select,Row,Col,Button,Rate,InputNumber} from 'antd'
import Ueditor from '../../ueditor/Ueditor'

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
      questionNo:1,

      moveUp:()=>{},//上移
      moveDown:()=>{},//下移
      onDestory:()=>{},//销毁该题目
      onChangeQuestionType:()=>{},//改变题目类型
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
      radioCheck:-1,//选择题的答案
      showFooter:false,//显示添加额外信息面板
      showScoreSetting:false,//显示设定分数的组件
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
      key:'num',
      className:styles.columns,
      render:(text,record)=>{
        return <Radio checked={this.state.radioCheck==record.key} onClick={()=>{this.setState({radioCheck:record.key})}}></Radio>
      }
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
        {this.state.showScoreSetting?<InputNumber min={0} defaultValue={0} />:null}
        </div>
      )
    },{
      title:<Icon type='close' onClick={this.props.destroy}/>,
      className:styles.columns,
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
  handleDeleteAnswerItem(key){
    this.setState({
      answerList:this.state.answerList.filter((v,k) => k!=key)
    })
  },
  handleWindowEvent(){
    this.setState({
      editingQuestion:false,
      editingAnswerItem:this.state.editingAnswerItem.map(v => false),
      showFooter:false,
    })
  },
  //设定分支
  handleSetScore(){
    this.setState({
      showScoreSetting:!this.state.showScoreSetting
    })
  },
  //添加答案选项
  handleAddAnswerItem(){
    this.setState({
      answerList:this.state.answerList.push(fromJS({answer:false,content:"答案一",id:"0",questionId:"1",score:0}))
    })
  },
  renderQuestion(){
    return (
      <div className={styles.question} onClick={(e)=>{e.stopPropagation();this.setState({editingQuestion:true,showFooter:true})}}>
      {
        this.state.editingQuestion?<Ueditor />:<span >输入题目</span>
      }
      </div>
    )
  },
  renderFooter(){
    return (
      <div className={styles.footer} onClick={(e)=>{e.stopPropagation()}}>
        <Row>
          <Col span={6}>
            <Button onClick={this.handleAddAnswerItem}>添加备选</Button>
          </Col>
          <Col span={6}>
            <Select style={{width:'200px'}} onFocus={()=>{
              window.removeEventListener('click',this.handleWindowEvent)
            }} onBlur={()=>{
              window.addEventListener('click',this.handleWindowEvent)
            }} onChange={this.props.onChangeQuestionType}>
            {
              questionType.map(v => (
                <Option value={v.id} title={v.text} key={v.id}>{v.text}</Option>
              ))
            }
            </Select>
          </Col>
          <Col span={6}>
            难度：<Rate />
          </Col>
          <Col>
            <Button onClick={this.handleSetScore}>设定分值</Button>
          </Col>
        </Row>
        <Row >
          <Col span={10}>
            注解：<Input />
          </Col>
          <Col span={10} offset={2}>
            描述：<Input />
          </Col>
        </Row>
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
        <Table bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
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
