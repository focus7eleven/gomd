import React from 'react'
import {Select} from 'antd'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getFilteredTableData,getGradeOptions,getSubjectOptions} from '../../actions/exampaper_action//main'
import styles from './ExampaperFilterComponent.scss'
import config from '../../config'

const Option = Select.Option;

const CourseFilterComponent = React.createClass({
  propTypes: {
    pageType: React.PropTypes.string.isRequired,
  },

  componentWillMount(){
    this.props.getGradeOptions()
    this.props.getSubjectOptions()

  },

  componentWillReceiveProps(nextProps){
    this.setState({
      grade: nextProps.courseCenter.get('gradeOptions'),
      subjects: nextProps.courseCenter.get('subjectOptions'),

    })
  },

  getInitialState(){
    return {

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



  handleSubjectChange(value){
    this.props.getFilteredTableData(this.props.pageType,'',1,'',value);
  },

  render(){
    const {subjects,grade} = this.state

    return (
      <div className={styles.container}>
        <Select defaultValue="" style={{ width: 200 }} onChange={this.handleGradeChange}>
          <Option value="">所有年级</Option>
          {
            grade.map((item,index)=>{
              return <Option value={item.gradeId} key={index}>{item.gradeName}</Option>
            })
          }
        </Select>
        <Select defaultValue="" style={{ marginLeft:20,width: 200 }} onChange={this.handleTermChange}>
          <Option value="">所有学期</Option>
          <Option value="上学期">上学期</Option>
          <Option value="下学期">下学期</Option>
        </Select>
        <Select defaultValue="" style={{ marginLeft:20,width: 200 }} onChange={this.handleSubjectChange}>
          <Option value="">所有学科</Option>
          {
            subjects.map((item,index)=>{
              return <Option value={item.subject_id} key={index}>{item.subject_name}</Option>
            })
          }
        </Select>
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    courseCenter: state.get('courseCenter'),
  }
}

function mapDispatchToProps(dispatch){
  return {
    getFilteredTableData:bindActionCreators(getFilteredTableData,dispatch),
    getGradeOptions:bindActionCreators(getGradeOptions,dispatch),
    getSubjectOptions:bindActionCreators(getSubjectOptions,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CourseFilterComponent)
