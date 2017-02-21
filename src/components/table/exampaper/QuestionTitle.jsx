import React from 'react'
import styles from './QuestionTitle.scss'
import {fromJS} from 'immutable'
import {Input} from 'antd'
import {updateQuestion} from './exampaper-utils'
const QuestionTitle = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:fromJS({}),
      onUpdate:()=>{},
      onDelete:()=>{},
    }
  },
  getInitialState(){
    return {
      editingTitle:true
    }
  },
  componentDidMount(){
    this.refs.titleInput.focus()
  },
  handleUpdateTitle(e){
    if(e.target.value){
      updateQuestion({
        qid:this.props.questionInfo.get('id'),
        examination:e.target.value,
        comment:this.props.questionInfo.get('comment'),
        description:e.target.value,
        difficulty:this.props.questionInfo.get('difficulty'),
        kind:this.props.questionInfo.get('kind'),
        drawZone:'',
        score:this.props.questionInfo.get('score'),
      })
      this.setState({
        editingTitle:false,
      })
      this.props.onUpdate(this.props.questionInfo.get('id'),['examination'],e.target.value)
    }else{
      this.props.onDelete(this.props.questionInfo.get('id'))
    }
  },
  render(){
    console.log("Asdfasdfasdf")
    return (
      <div className={styles.questionTitleContainer}>
        <div className={styles.line}></div>
        {
          this.state.editingTitle?<Input defaultValue={this.props.questionInfo.get('examination')} ref='titleInput' style={{width:'200px'}} onBlur={this.handleUpdateTitle}/>:<span onClick={()=>{this.setState({editingTitle:true})}}>{this.props.questionInfo.get("examination")}</span>
        }
        <div className={styles.line}></div>
      </div>
    )
  }
})

export default QuestionTitle
