import React from 'react'
import styles from './ExampaperFilter.scss'
import {Select} from 'antd'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getExampaper,getGradeOptions,getSubjectOptions} from '../../actions/exampaper_action/main'

const Option = Select.Option

const ExampaperFilter = React.createClass({
  componentDidMount(){
    this.props.getGradeOptions(this.props.subjectId)
    this.props.getSubjectOptions()
  },
  handleSubjectChange(value){
    const {subjectOption,gradeOption} = this.props
    this.props.getExampaper('selfexampapercenter','',0,value,gradeOption)
  },
  handleGradeChange(value){
    const {subjectOption,gradeOption} = this.props
    this.props.getExampaper('selfexampapercenter','',0,subjectOption,value)
  },
  render(){
    const {subjects,grade} = this.props
    return (
      <div className={styles.container}>
        <Select defaultValue="" style={{ marginLeft:20,width: 150 }} value={this.props.subjectOption||''} onChange={this.handleSubjectChange}>
          <Option value="">所有学科</Option>
          {
            subjects.map((item,index)=>{
              return <Option value={item.get('subject_id')} key={index}>{item.get('subject_name')}</Option>
            })
          }
        </Select>
        <Select defaultValue="" style={{ marginLeft:20,width: 150 }} value={this.props.gradeOption||''} onChange={this.handleGradeChange}>
          <Option value="">所有年级</Option>
          {
            grade.map((item,index)=>{
              return <Option value={item.get('gradeId')} key={index}>{item.get('gradeName')}</Option>
            })
          }
        </Select>
      </div>
    )
  }
})

function mapStateToProps(state){
  return {
    grade:state.getIn(['examPaper','gradeOptions']),
    subjects:state.getIn(['examPaper','subjectOptions']),
    gradeOption:state.getIn(['examPaper','otherMsg','gradeId']),
    subjectOption:state.getIn(['examPaper','otherMsg','subjectId']),
  }
}
function mapDispatchToProps(dispatch){
  return {
    getExampaper:bindActionCreators(getExampaper,dispatch),
    getGradeOptions:bindActionCreators(getGradeOptions,dispatch),
    getSubjectOptions:bindActionCreators(getSubjectOptions,dispatch),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ExampaperFilter)
