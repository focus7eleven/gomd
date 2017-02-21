import React from 'react'
import {Select} from 'antd'
import styles from './CreateExampaperFilter.scss'
import config from '../../config'
import {getSubject,getGrade,setExamInfo} from './utils'
import {fromJS} from 'immutable'

const Option = Select.Option;

const CreateExampaperFilter = React.createClass({
  getDefaultProps(){
    return {
      examId:'',
      name:'',
    }
  },
  componentWillMount(){
    getSubject().then(res => {
      this.setState({
        subjects:fromJS(res)
      })
    })
    getGrade({
      subjectId:this.state.subjectOption
    }).then(res => {
      this.setState({
        grade:fromJS(res)
      })
    })
  },

  componentWillReceiveProps(nextProps){
    getSubject().then(res => {
      this.setState({
        subjects:fromJS(res)
      })
    })
    getGrade({
      subjectId:this.state.subjectOption
    }).then(res => {
      this.setState({
        grade:fromJS(res)
      })
    })
  },

  getInitialState(){
    return {
      subjects: [],
      grade: [],

      subjectOption:'',
      gradeOption:'',
      termOption:'',
    }
  },
  getData(){
    return {
      subjectId:this.state.subjectOption,
      gradeId:this.state.gradeOption,
      termId:this.state.termOption
    }
  },
//改变年级
  handleGradeChange(value){
    this.setState({
      gradeOption:value
    })
    setExamInfo({
      examId:this.props.examId,
      name:this.props.name,
      subjectId:this.state.subjectOption,
      term:this.state.termOption,
      gradeId:value,
      oneAnswer:0,
      oneAnswerContent:'',
    })
  },
//改变学期
  handleTermChange(value){
    this.setState({
      termOption:value
    })
    setExamInfo({
      examId:this.props.examId,
      name:this.props.name,
      subjectId:this.state.subjectOption,
      term:value,
      gradeId:this.state.gradeOption,
      oneAnswer:0,
      oneAnswerContent:'',
    })
  },
//改变学科
  handleSubjectChange(value){
    this.setState({
      subjectOption:value
    })
    getGrade({
      subjectId:value
    }).then(res => {
      this.setState({
        grade:fromJS(res)
      })
      setExamInfo({
        examId:this.props.examId,
        name:this.props.name,
        subjectId:value,
        term:this.state.termOption,
        gradeId:this.state.gradeOption,
        oneAnswer:0,
        oneAnswerContent:'',
      })
    })
  },

  render(){
    const {subjects,grade} = this.state

    return (
      <div className={styles.container}>
        <Select defaultValue="" style={{ marginLeft:20,width: 150 }} onChange={this.handleSubjectChange}>
          <Option value="">所有学科</Option>
          {
            subjects.map((item,index)=>{
              return <Option value={item.get('subject_id')} key={index}>{item.get('subject_name')}</Option>
            })
          }
        </Select>
        <Select defaultValue="" style={{ marginLeft:20,width: 150 }} onChange={this.handleGradeChange}>
          <Option value="">所有年级</Option>
          {
            grade.map((item,index)=>{
              return <Option value={item.get('gradeId')} key={index}>{item.get('gradeName')}</Option>
            })
          }
        </Select>
        <Select defaultValue="" style={{ marginLeft:20,width: 150 }} onChange={this.handleTermChange}>
          <Option value="">所有学期</Option>
          <Option value="上学期">上学期</Option>
          <Option value="下学期">下学期</Option>
        </Select>
      </div>
    )
  }
})

export default CreateExampaperFilter
