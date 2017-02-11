import React from 'react'
import {Select} from 'antd'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getFilteredTableData,getGradeOptions,getSubjectOptions,getVersionOptions} from '../../actions/course_center/main'
import styles from './CourseFilterComponent.scss'
import config from '../../config'

const Option = Select.Option;

const CourseFilterComponent = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes: {
    pageType: React.PropTypes.string.isRequired,
  },

  componentWillMount(){
    this.props.getGradeOptions()
    this.props.getSubjectOptions()
    this.props.getVersionOptions()
  },

  componentWillReceiveProps(nextProps){
    this.setState({
      grade: nextProps.courseCenter.get('gradeOptions'),
      subjects: nextProps.courseCenter.get('subjectOptions'),
      version: nextProps.courseCenter.get('versionOptions'),
    })
  },

  getInitialState(){
    return {
      version: [],
      subjects: [],
      grade: [],
    }
  },

  handleGradeChange(value){
    this.props.getFilteredTableData(this.props.pageType,'',1,value);
  },

  handleTermChange(value){
    this.props.getFilteredTableData(this.props.pageType,'',1,'','',value);
  },

  handleVersionChange(value){
    console.log(value);
  },

  handleSubjectChange(value){
    this.props.getFilteredTableData(this.props.pageType,'',1,'',value);
  },

  render(){
    const {version,subjects,grade} = this.state
    const userInfo = this.props.userInfo
    const page = this.context.router.routes[3].path

    return (
      <div className={styles.container}>
        <Select defaultValue="" style={{ width: 150 }} onChange={this.handleGradeChange}>
          <Option value="">所有年级</Option>
          {
            grade.map((item,index)=>{
              return <Option value={item.gradeId} key={index}>{item.gradeName}</Option>
            })
          }
        </Select>
        {
          (userInfo.userStyleName==='学校资源审核员'&&page==='uncheckCourse')?null:
          // (userInfo.userStyleName==='学校资源审核员')?null:
          <Select defaultValue="" style={{ marginLeft:20,width: 150 }} onChange={this.handleTermChange}>
            <Option value="">所有学期</Option>
            <Option value="上学期">上学期</Option>
            <Option value="下学期">下学期</Option>
          </Select>
        }
        <Select defaultValue="" style={{ marginLeft:20,width: 150 }} onChange={this.handleSubjectChange}>
          <Option value="">所有学科</Option>
          {
            subjects.map((item,index)=>{
              return <Option value={item.subject_id} key={index}>{item.subject_name}</Option>
            })
          }
        </Select>
        {
          // (userInfo.userStyleName==='学校资源审核员')?null:
          (userInfo.userStyleName==='学校资源审核员'&&page==='uncheckCourse')?null:
          <Select defaultValue="" style={{ marginLeft:20,width: 150 }} onChange={this.handleVersionChange}>
            <Option value="">所有版本</Option>
            {
              version.map((item,index)=>{
                return <Option value={item.id} key={index}>{item.text}</Option>
              })
            }
          </Select>
        }
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    courseCenter: state.get('courseCenter'),
    userInfo: state.get('user').get('userInfo'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getFilteredTableData:bindActionCreators(getFilteredTableData,dispatch),
    getGradeOptions:bindActionCreators(getGradeOptions,dispatch),
    getSubjectOptions:bindActionCreators(getSubjectOptions,dispatch),
    getVersionOptions:bindActionCreators(getVersionOptions,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CourseFilterComponent)
