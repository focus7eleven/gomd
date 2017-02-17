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
    fetch(config.api.courseCenter.getDistinctSubject,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        subjectList:fromJS(res),
        subjectOption:''
      })
      //获取年级
      fetch(config.api.grade.getBySubject.get(res[0]['subject_id']),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => {
        this.setState({
          gradeList:fromJS(res),
          gradeOption:''
        })
      })
    })
  },

  handleChangeSubject(value){
    this.setState({
      subjectOption:value
    })
    fetch(config.api.grade.getBySubject.get(value),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        gradeList:fromJS(res),
        gradeOption:res[0].gradeId
      })
      this.props.getTableData('selfexampapercenter','',1,value,res[0].gradeId)
    })
  },
  handleChangeGrade(value){
    this.setState({
      gradeOptionf:value
    })
    this.props.getTableData('selfexampapercenter','',1,this.state.subjectOption,value)
  },
  handleDeletePaper(examId){
    this.props.deletePaper(examId)
  },
  handleEditPaper(examId){
    this.context.router.push(`/index/question-exampaper/editExampaper/${examId}`)
  },
  getTableData(){
    const tableHeader = [{
      title:'学科',
      dataIndex:'subject_name',
      key:'subject_name'
    },{
      title:'年级',
      dataIndex:'gradeName',
      key:'gradeName',
    },{
      title:'学期',
      dataIndex:'term',
      key:'term',
    },{
      title:'试卷名称',
      dataIndex:'name',
      key:'name',
    },{
      title:'题数',
      dataIndex:'questionNumber',
      key:'questionNumber',
    },{
      title:'操作',
      render:(text,record)=>{
        return (<div>
          <Button onClick={this.handleDeletePaper.bind(this,text.id)} className={styles.deleteButton}>删除</Button>
          <Button type="primary" onClick={this.handleEditPaper.bind(this,text.id)} style={{marginLeft:'10px'}}>编辑</Button>
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
