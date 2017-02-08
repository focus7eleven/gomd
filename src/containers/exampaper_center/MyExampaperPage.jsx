import React from 'react'
import TableComponent from '../../components/table/TableComponent'
import styles from './MyExampaperPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getExampaper,deletePaper} from '../../actions/exampaper_action/main'
import {Input,Button,Select} from 'antd'
import {List,fromJS} from 'immutable'
import config from '../../config'

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
        return (<div><Button onClick={this.handleDeletePaper.bind(this,text.id)} className={styles.deleteButton}>删除</Button></div>)
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
          <div className={styles.filters}>
            <Select style={{ width: 200 ,marginRight: '10px'}} value={this.state.subjectOption} onChange={this.handleChangeSubject}>
            <Option value='' title='所有学科'>所有学科</Option>
            {
              this.state.subjectList.map((v,k)=>(
                <Option key={k} value={v.get('subject_id')} title={v.get('subject_name')}>{v.get('subject_name')}</Option>
              ))
            }
            </Select>
            <Select style={{ width: 200 }} value={this.state.gradeOption} onChange={this.handleChangeGrade}>
            <Option value='' title='所有年级'>所有年级</Option>
            {
              this.state.gradeList.map((v,k)=>(
                <Option key={k} value={v.get('gradeId')} title={v.get('gradeName')}>{v.get('gradeName')}</Option>
              ))
            }
            </Select>
          </div>
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
    exampaper:state.get('exampaper')
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getExampaper,dispatch),
    deletePaper:bindActionCreators(deletePaper,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MyExampaperPage)
