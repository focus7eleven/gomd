import React from 'react'
import styles from './PublishedCoursePage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/course_center/main'
import CourseFilterComponent from '../../components/course_filter/CourseFilterComponent'
import TableComponent from '../../components/table/TableComponent'
import {Button} from 'antd'
import {List,fromJS} from 'immutable'

const PublishedCoursePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      searchStr:'',
    }
  },
  getTableData(){
    const tableHeader = [{
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
      title:'班级',
      dataIndex:'target_name',
      key:'target_name',
      className:styles.tableColumn,
    },{
      title:'创建时间',
      dataIndex:'created_at_string',
      key:'created_at_string',
      className:styles.tableColumn,
    },{
      title:'查看详情',
      key:'detail',
      className:styles.tableColumn,
      render:(text,record)=>{
        return (<Button onClick={this.handleCheckDetail.bind(this,text)} type='primary'>详情</Button>)
      }
    }]
    const tableData = this.props.courseCenter.get('data').isEmpty()?List():this.props.courseCenter.get('data').get('result').map((v,k) => ({
      ...v.toJS(),
      key:k,
      num:k+1
    }))
    return {
      tableBody:tableData.toJS(),
      tableHeader,
    }
  },
  //查看课程详情
  handleCheckDetail(currentRow){
    let lessonId = currentRow['lesson_id']
    this.context.router.push(`/index/courseCenter/publishedCourse/detail/${lessonId}`)
  },
  render(){
    const tableData = this.getTableData()
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div></div>
          <CourseFilterComponent pageType="publishedPage"/>
        </div>
        <div className={styles.body}>
          <TableComponent dataType="courseCenter" tableData={tableData} pageType="publishedPage" searchStr={this.state.searchStr}></TableComponent>
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

export default connect(mapStateToProps,mapDispatchToProps)(PublishedCoursePage)
