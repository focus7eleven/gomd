import React from 'react'
import styles from './NestingQuestion.scss'
import {Row,Col,Icon,Button} from 'antd'
import {fromJS} from 'immutable'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import NoteQuestion from './NoteQuestion'
import ShortAnswerQuestion from './ShortAnswerQuestion'

const NestingQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:fromJS({}),
      onDelete:()=>{},//删除题目
      onUpdate:()=>{},//更新题目
    }
  },
  getInitialState(){
    return {
      editingQuestion:false,//是否编辑题目
      question:'请输入题目',//题目
      showFooter:false,//显示添加备注面板
      showScoreSetting:'',//显示修改分数面板
    }
  },
  render(){
    return (
      <div className={styles.noteQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>嵌套题</span>
        </div>
        <div className={styles.questionContainer}>
          <div className={styles.questionNo}>
          {
            this.props.questionInfo.get('questionNo')
          }
          </div>
          <div className={styles.questionContent} onClick={this.handleEditQuestion}>
          {
            this.state.editingQuestion?<div><Ueditor initialContent={this.props.questionInfo.get('examination')||'请输入题目内容'} onDestory={this.handleUpdateQuestion}/></div>:<div dangerouslySetInnerHTML={{__html:this.props.questionInfo.get('examination')||'请输入题目内容'}}></div>
          }
          {
            this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
              value={this.props.questionInfo.get('score')}
              onChange={this.handleChangeScore}/></div>:null
          }
          </div>
          <div className={styles.questionNo}>
            <Icon type='close' onClick={(e)=>{e.stopPropagation();this.props.onDelete(this.props.questionInfo.get('id'))}}/>
          </div>
        </div>
        <div className={styles.subQuestionContainer}>
        {
          this.props.questionInfo.get('childQuestion').map((v,k)=>{
            if(v.get('kind')=='01'||v.get('kind')=='02'||v.get('kind')=='03'){
              //单选
              return <MultipleChoiceQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
            }else if(v.get('kind')=='04'){
              //填空
              return <NoteQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
            }else if(v.get('kind')=='05'||v.get('kind')=='06'||v.get('kind')=='07'){
              //填空
              return <ShortAnswerQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
            }else if(v.get('kind')=='08'){
              //嵌套题
              return <NestingQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
            }else{
              return null
            }
          })
        }
        </div>
        <div className={styles.moveButton}>
            <Button onClick={(e)=>{this.props.moveUp(this.props.questionInfo.get('id'))}}><Icon type="caret-up" /></Button>
            <Button onClick={(e)=>{this.props.moveDown(this.props.questionInfo.get('id'))}}><Icon type="caret-down" /></Button>
        </div>
        {
          this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})
export default NestingQuestion
