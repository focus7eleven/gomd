import React from 'react'
import TableComponent from '../../components/table/TableComponent'
import styles from './MyExampaperPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getExampaper,deletePaper} from '../../actions/exampaper_action/main'
import {Input,Button,Select} from 'antd'
import {List,fromJS} from 'immutable'
import config from '../../config'
import ExampaperFilter from './ExampaperFilter'
import classnames from 'classnames'

const Search = Input.Search
const Option = Select.Option

const MyExampaperPage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState(){
    return {
      searchStr:'',

      subjectList:List(),
      gradeList:List(),
    }
  },
  componentDidMount(){
    console.log("asdfasdf:",this.props)
  },
  handleDeletePaper(examId){
    this.props.deletePaper(examId)
  },
  handleEditPaper(examId){
    this.context.router.push(`/index/answersheet_exam_make/editExampaper/${examId}`)
  },
  handleWatchPaper(examId){
    this.context.router.push(`/index/answersheet_exam_make/selfexampapercenter/displayExampaper/${examId}`)
  },
  getTableData(){
    const tableHeader = [{
      title:'学科',
      dataIndex:'subject_name',
      key:'subject_name',
      className:styles.tableColumn,
    },{
      title:'年级',
      dataIndex:'gradeName',
      key:'gradeName',
      className:styles.tableColumn,
    },{
      title:'学期',
      dataIndex:'term',
      key:'term',
      className:styles.tableColumn,
    },{
      title:'试卷名称',
      dataIndex:'name',
      key:'name',
      className:styles.tableColumn,
    },{
      title:'题数',
      dataIndex:'questionNumber',
      key:'questionNumber',
      className:styles.tableColumn,
    },{
      title:'操作',
      className:classnames(styles.tableColumn,styles.actionColumn),
      render:(text,record)=>{
        return this.props.type=='draft'?(<div style={{width:'200px'}}>
          <Button type="primary" onClick={this.handleEditPaper.bind(this,text.id)} style={{marginRight:'10px'}}>编辑</Button>
          <Button onClick={this.handleDeletePaper.bind(this,text.id)} className={styles.deleteButton}>删除</Button>

          </div>):(<div style={{width:'200px'}}>
          {/*<Button onClick={this.handleDeletePaper.bind(this,text.id)} className={styles.deleteButton}>删除</Button>*/}
          <Button type="primary" onClick={this.handleWatchPaper.bind(this,text.id)} style={{marginLeft:'10px'}}>查看</Button>
          </div>)
        }
    }]
    const tableBody = this.props.exampaper.get('data').isEmpty()?List():this.props.exampaper.get('data').get('result').map((v,k)=>({
      key:k,
      ...v.toJS(),
    }))
    return {
      tableHeader:tableHeader,
      tableBody:tableBody.toJS()
    }
  },
  render(){
    const tableData = this.getTableData()
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button type='primary' onClick={()=>{this.context.router.push(`/index/question-exampaper/newexampaper`)}}>新建试卷</Button><ExampaperFilter />
        </div>
        <div className={styles.body}>
          <TableComponent dataType="exampaper" tableData={tableData} pageType="selfexampapercenter" searchStr={this.state.searchStr}></TableComponent>
        </div>
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    exampaper:state.get('examPaper')
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getExampaper,dispatch),
    deletePaper:bindActionCreators(deletePaper,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MyExampaperPage)
