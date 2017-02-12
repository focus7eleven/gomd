import React from 'react'
import CourseFilterComponent from '../../components/course_filter/CourseFilterComponent'
import TableComponent from '../../components/table/TableComponent'
import styles from './UncheckedCoursePage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {checkCourse,getTableData} from '../../actions/course_center/main'
import {Button} from 'antd'
import CourseTree from '../../components/tree/CourseTree'
import config from '../../config'

const UncheckedCoursePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState(){
    return {
      searchStr:'',
      showPublishModal:false,
    }
  },

  getTableData(){
    const tableHeader=[{
      title:'序号',
      dataIndex:'num',
      key:'num',
      className:styles.tableColumn,
    },{
      title:'课程名称',
      dataIndex:'name',
      key:'name',
      className:styles.tableColumn,
    },{
      title:'微课数量',
      dataIndex:'content_num',
      key:'content_num',
      className:styles.tableColumn,
    },{
      title:'预习作业数量',
      dataIndex:'prepare_homework',
      key:'prepare_homework',
      className:styles.tableColumn,
    },{
      title:'课后作业数量',
      dataIndex:'after_class_homework',
      key:'after_class_homework',
      className:styles.tableColumn,
    },{
      title:'创建人',
      dataIndex:'teacher_name',
      key:'teacher_name',
      className:styles.tableColumn,
    },{
      title:'创建时间',
      dataIndex:'created_at_string',
      key:'created_at_string',
      className:styles.tableColumn,
    },{
      title:'查看详情',
      dataIndex:'lesson_id',
      key:'detail',
      className:styles.tableColumn,
      render:(text,record)=>{
        return (<Button type='primary' onClick={this.handleCheckDetail.bind(this,text)}>详情</Button>)
      }
    },{
      title:'操作',
      dataIndex:'lesson_id',
      key:'operation',
      className:styles.operationColumn,
      render:(text,record)=>{
        return (
          <div>
            <Button type='primary' className={styles.rejectButton} onClick={this.handleCheckCourse.bind(this,text,false)}>打回</Button>
            <Button type='primary' className={styles.agreeButton} onClick={this.handleCheckCourse.bind(this,text,true)}>同意</Button>
          </div>
        )
      }
    }]
    const tableBody = this.props.courseCenter.get('data').isEmpty()?[]:this.props.courseCenter.get('data').get('result').map((v,k) => ({
      key:k,
      num:k+1,
      ...v.toJS(),
    })).toJS()
    return {
      tableHeader,
      tableBody,
    }
  },

  handleCheckCourse(lessonId,result){
    this.props.checkCourse(lessonId,result).then(res => {
      console.log(res);
      res.data==='success'?this.props.getTableData('uncheckPage','',1):null
    })
  },

  handleCheckDetail(text){
    this.context.router.push(`/index/courseCenter/detail/${text}`)
  },

  render(){
    const tableData = this.getTableData()
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div></div>
          <CourseFilterComponent pageType="uncheckPage"/>
        </div>
        <div className={styles.body}>
          <div className={styles.treeContainer}>
            <CourseTree></CourseTree>
          </div>
          <TableComponent dataType="courseCenter" tableData={tableData} pageType="uncheckPage" searchStr={this.state.searchStr}></TableComponent>
        </div>
        {this.state.showPublishModal?<PublishModal lessonId={this.state.selectedLesson} onOk={()=>{this.context.router.push(`/index/course-center/publishedCourse`)}} onCancel={()=>{this.setState({showPublishModal:false})}}/>:null}
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    courseCenter:state.get('courseCenter')
  }
}

function mapDispatchToProps(dispatch){
  return {
    checkCourse:bindActionCreators(checkCourse,dispatch),
    getTableData:bindActionCreators(getTableData,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(UncheckedCoursePage)
