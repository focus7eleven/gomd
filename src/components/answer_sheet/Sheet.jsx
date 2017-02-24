import React, {PropTypes} from 'react'
import styles from './Sheet.scss'
import {InputNumber,Modal,Select,Icon,Button,Input,Checkbox} from 'antd'
import {Map,Record,List,fromJS} from 'immutable'
import classnames from 'classnames'
import parseIndex from '../../utils/chineseIndex'

const Sheet = React.createClass({
  propTypes: {
    questions: PropTypes.object.isRequired,
    sheetName: PropTypes.string.isRequired,
  },

  getQuestionIndex(index){
    // if(this.state.continuousIndex){
    //   const zhangjieNum = this.state.questions.slice(0,index+1).filter((item)=>item.get('questionType')==='zhangjie').size
    //   const childQuestionNum = this.state.questions.slice(0,index).filter((item)=>item.get('isChild')).size
    //   return index + 1 - zhangjieNum - childQuestionNum
    // }else{
      const lastZhangjieIndex = this.props.questions.slice(0,index+1).findLastIndex((item)=>item.get('questionType')==='zhangjie')
      const calcChildStartAt = lastZhangjieIndex === -1 ? 0 : lastZhangjieIndex
      const childQuestionNum = this.props.questions.slice(calcChildStartAt,index).filter((item)=>item.get('isChild')).size
      return index - lastZhangjieIndex - childQuestionNum
    // }
  },

  getLastParentIndex(index){
    const questions = this.props.questions
    let i = index;
    while(i>=0){
      if(!questions.get(i).get('isChild')){
        return i
      }
      i--;
    }
    return 0;
  },

  getChildIndex(index){
    const questions = this.props.questions
    if(!questions.get(index+1)&&!questions.get(index).get('isChild')){
      return ""
    }else if(questions.get(index+1)&&!questions.get(index).get('isChild')&&!questions.get(index+1).get('isChild')){
      return ""
    }else{
      const parentIndex = this.getLastParentIndex(index)
      const prefix = this.getQuestionIndex(parentIndex)
      const suffix = index - parentIndex + 1
      return prefix + "." + suffix
    }
  },

  renderChapter(item,index){
    const questionType = item.get('questionType')
    return (
      <div className={classnames(styles.questionContainer,styles.specialBackground,styles.hasBorderTop)} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center', paddingTop: 5}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <Select disabled={true} value={questionType} defaultValue="xuanze" style={{ width: 120 }}>
            <Option value="xuanze">单选题</Option>
            <Option value="duoxuan">多选题</Option>
            <Option value="panduan">判断题</Option>
            <Option value="tiankong">填空题</Option>
            <Option value="jianda">简答题(计算题)</Option>
            <Option value="zuowen_cn">语文作文题</Option>
            <Option value="zuowen_en">英语作文题</Option>
            <Option value="zhangjie">章节</Option>
          </Select>
        </div>
        <div className={styles.block}>
          <span>标题</span>
          <Input disabled={true} style={{width: 240}} value={item.get('questionTitle')} />
        </div>
        <div className={styles.block}>
          <span>对齐类型</span>
          <Select disabled={true} value={item.get('optionType')} defaultValue="left" style={{ width: 70 }}>
            <Option value="left">居左</Option>
            <Option value="middle">居中</Option>
            <Option value="right">居右</Option>
          </Select>
        </div>
      </div>
    )
  },

  renderQuestion(item,index){
    const questionType = item.get('questionType')
    const isChild = item.get('isChild')
    const isCustomized = item.get('isCustomized')
    return (
      <div className={classnames(styles.questionContainer,isChild?null:styles.hasBorderTop)} key={index}>
        <div className={styles.block}>
          <span style={{paddingLeft: 0}}>序号</span>
          <span style={{fontSize: 14, textAlign: 'center', paddingTop: 3}}>{index+1}</span>
        </div>
        <div className={styles.block}>
          <span>题目类型</span>
          <Select disabled={true} value={questionType} defaultValue="xuanze" style={{ width: 120 }}>
            <Option value="xuanze">单选题</Option>
            <Option value="duoxuan">多选题</Option>
            <Option value="panduan">判断题</Option>
            <Option value="tiankong">填空题</Option>
            <Option value="jianda">简答题(计算题)</Option>
            <Option value="zuowen_cn">语文作文题</Option>
            <Option value="zuowen_en">英语作文题</Option>
            <Option value="zhangjie">章节</Option>
          </Select>
        </div>
        <div className={styles.block}>
          <span>子题目</span>
          <Checkbox disabled={true} style={{marginTop: 3}} checked={item.get('isChild')} ></Checkbox>
        </div>
        <div className={styles.verticalLayout}>
          {
            isChild?null:
            <div className={styles.horizontalLayout}>
              <div className={styles.block} style={{marginRight: 0}}>
                <span style={{height: 18}}>{" "}</span>
                <span style={{marginTop: 5}}>{parseIndex(this.getQuestionIndex(index))+"、"}</span>
              </div>
              <div className={styles.block} style={{marginBottom: 10}}>
                <span>标题</span>
                <Input disabled={true} style={{width: 470}} value={item.get('questionTitle')}  />
              </div>
            </div>
          }
          <div className={styles.horizontalLayout}>
            <div className={styles.block} style={{marginRight: 8,minWidth: 16}}>
              <span style={{height: 18}}>{" "}</span>
              <span style={{marginTop: 5}}>{this.getChildIndex(index)}</span>
            </div>
            <div className={styles.block}>
              <span>子标题</span>
              <Input disabled={true} style={{width: 240}} value={item.get('childQuestionTitle')} />
            </div>
            <div className={styles.block}>
              <span>题目个数</span>
              <InputNumber disabled={true} min={1} max={999} style={{width: 80}} value={item.get('questionNum')} />
            </div>
            {
              questionType === 'xuanze' || questionType === 'duoxuan' ?
              <div className={styles.horizontalLayout}>
                <div className={styles.block}>
                  <span>选项类型</span>
                  <Select disabled={true} value={item.get('optionType')} defaultValue="en_zimu" style={{ width: 120 }}>
                    <Option value="en_zimu">字母</Option>
                    <Option value="shuzi">数字</Option>
                  </Select>
                </div>
                <div className={styles.block}>
                  <span>选项个数</span>
                  <InputNumber disabled={true} min={2} max={9} style={{width: 80}} value={item.get('optionNum')} />
                </div>
              </div>:null
            }
            {
              questionType === 'panduan' ?
              <div className={styles.block}>
                <span>选项类型</span>
                <Select disabled={true} value={item.get('optionType')} defaultValue="dui_cuo" style={{ width: 120 }} >
                  <Option value="dui_cuo">对/错</Option>
                  <Option value="gou_cha">√(正)/x(误)</Option>
                  <Option value="t_f">T(正)/F(误)</Option>
                </Select>
              </div>:null
            }
            {
              questionType === 'tiankong' ?
              <div className={styles.horizontalLayout}>
                <div className={styles.block}>
                  <span>答题区域大小(行)</span>
                  <Select disabled={true} value={item.get('answerWidth')} defaultValue="1/3" style={{ width: 120 }} >
                    <Option value="1/4">1/4</Option>
                    <Option value="1/3">1/3</Option>
                    <Option value="1/2">1/2</Option>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                  </Select>
                </div>
                <div className={styles.block}>
                  <span>答题区域个数</span>
                  <InputNumber disabled={true} min={1} max={50} style={{width: 80}} value={item.get('answerHeight')} />
                </div>
              </div>:null
            }
            {
              questionType === 'zuowen_en' || questionType === 'zuowen_cn' || questionType === 'jianda'?
              <div className={styles.block}>
                <span>答题区域高度(行)</span>
                <InputNumber disabled={true} min={questionType==='jianda'?5:1} max={questionType==='jianda'?30:150} style={{width: 80}} value={item.get('answerHeight')} />
              </div>:null
            }
            {
              questionType === 'jianda'?
              <div className={styles.block}>
                <span>设置成</span>
                <div className={styles.horizontalLayout} style={{alignItems: 'center'}}>
                  <InputNumber disabled={true} min={1} max={3} style={{width: 50}} value={item.get('jiandaAnswerRow')} />
                  <span style={{marginLeft: 3,marginRight: 3}}>排×</span>
                  <InputNumber disabled={true} min={1} max={3} style={{width: 50}} value={item.get('jiandaAnswerCol')} />
                  <span style={{marginLeft: 3}}>列</span>
                </div>
              </div>:null
            }
          </div>
        </div>
      </div>
    )
  },

  render(){
    const {sheetName, questions} = this.props;
    console.log(questions.toJS());
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.sheetHead}>
            <span>答题卡名称</span>
            <Input disabled={true} value={sheetName} />
          </div>
        </div>
        <div className={styles.body}>
          {questions.map((item,index) => item.get('questionType')==='zhangjie'?this.renderChapter(item,index):this.renderQuestion(item,index))}
        </div>
      </div>
    )
  }
})

export default Sheet
