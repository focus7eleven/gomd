import React from 'react'
import {fromJS} from 'immutable'
import styles from './ChoiceQuestion.scss'
import {Table,Radio} from 'antd'

const ChoiceQuestion = React.createClass({
    getDefaultProps(){
      return {
        questionInfo:fromJS({})
      }
    },
    getTableData(){
      const questionType = this.props.questionInfo.get('kind')
      let selectComponent = null
      switch (questionType) {
        case '01'://单选
          selectComponent = (record)=>(<Radio ></Radio>)
          break;
        case '02'://判断
          selectComponent = (record)=>(<Radio ></Radio>)
          break;
        case '03'://多选
          selectComponent = (record)=>(<Checkbox />)
          break;
        default:
          selectComponent = ()=>null
      }
      const tableHeader = [{
        title:this.props.questionInfo.get('questionNo'),
        key:'num',
        className:styles.columns,
        width:50,
        render:(text,record)=>{
          return <div onClick={(e)=>{e.stopPropagation()}}>{selectComponent(record)}</div>
        }
      },{
        title:this.renderQuestion(),
        dataIndex:'answer',
        key:'answer',
        render:(text,record) => {
          return (
          <div className={styles.question}>
            <span dangerouslySetInnerHTML={{__html: text||'请输入选项内容'}}></span>
          </div>
        )}
      }]
      const tableBody = this.props.questionInfo.get('optionPojoList').map((v,k) => ({
        answer:v.get('content'),
        key:k,
      })).toJS()
      return {
        tableHeader,
        tableBody,
      }
    },
    renderQuestion(){
      return (
        <div className={styles.question}>
          <span dangerouslySetInnerHTML={{__html: this.props.questionInfo.get('examination')||'请输入题目内容'}}></span>
        </div>
      )
    },
    render(){
      const tableData = this.getTableData()
      let questionTypeName = ''
      switch (this.props.questionInfo.get('kind')) {
        case '01':
          questionTypeName = '单选题'
          break;
        case '02':
          questionTypeName = '判断题'
          break;
        case '03':
          questionTypeName = '多选题'
          break;
        case '04':
          questionTypeName = '填空题'
          break;
        case '05':
          questionTypeName = '简答（计算题）'
          break;
        case '05':
          questionTypeName = '语文作文'
          break;
        case '07':
          questionTypeName = '英语作文'
          break;
        default:
          questionTypeName = ''
      }
      return (
        <div className={styles.container}>
          <div className={styles.tag}>
          {questionTypeName}
          </div>
          <Table bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
        </div>
      )
    }
})

export default ChoiceQuestion
