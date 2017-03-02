import React from 'react'
import CourseFilterComponent from '../../components/course_filter/CourseFilterComponent'
import TableComponent from '../../components/table/TableComponent'
import styles from './TeacherCoursePage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/course_center/main'
import {Button} from 'antd'
// import PublishModal from '../../components/modal/PublishModal'
import CourseTree from '../../components/tree/CourseTree'
const StudentCoursePage = React.createClass({
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
      title:'微课',
      dataIndex:'content_num',
      key:'content_num',
      className:styles.tableColumn,
    },{
      title:'预习作业',
      dataIndex:'prepare_homework',
      key:'prepare_homework',
      className:styles.tableColumn,
    },{
      title:'课后作业',
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

  handlePublish(lessonId){
    this.setState({
      showPublishModal:true,
      lessonId:lessonId
    })
  },

  handleCheckDetail(text){
    this.context.router.push(`/index/courseCenter/courseInfo/detail/${text}`)
  },

  render(){
    const tableData = this.getTableData()
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div><Button type='primary' className={styles.operationButton} onClick={()=>{this.context.router.push(`/index/courseCenter/newCourse`)}}>新建课程</Button></div>
          <CourseFilterComponent pageType="teacherPage"/>
        </div>
        <div className={styles.body}>
          <div className={styles.treeContainer}>
            <CourseTree></CourseTree>
          </div>
          <TableComponent dataType="courseCenter" tableData={tableData} pageType="teacherPage" searchStr={this.state.searchStr}></TableComponent>
        </div>
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
    getTableData:bindActionCreators(getTableData,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(StudentCoursePage)