import React from 'react'
import styles from './HomeworkDetailModal.scss'
import {Input,Modal,Row,Col} from 'antd'
import config from '../../config'

const HomeworkDetailModal = React.createClass({
  getDefaultProps(){
    return {
      homeworkId:'',
      onCancel:()=>{},
    }
  },

  getInitialState(){
    return {
      subject:'',
      homeworkName:'',
      finishTime:'',
      homeworkDesc:'',
      classes: [],
    }
  },

  componentDidMount(){
    fetch(config.api.homework.getHomeworkDetail(this.props.homeworkId),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      console.log("~~~~",res);
      this.setState({
        subject:res[0].subject,
        homeworkName:res[0]['homework_name'],
        finishTime:res[0]['finish_time'],
        homeworkDesc:res[0]['homework_desc'],
      })
    })
    fetch(config.api.homework.getHomeworkClass(this.props.homeworkId),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        classes: res
      })
    })
  },

  render(){
    return (
      <Modal width={940} title='作业详情' visible={true} onOk={()=>{this.props.onCancel()}} onCancel={()=>{this.props.onCancel()}} footer={[]}>
        <div className={styles.container}>
          <div className={styles.column1}>
            <div className={styles.box}>
              <span>名称</span>
              <Input disabled={true} value={this.state.homeworkName} />
            </div>
            <div className={styles.box}>
              <span>学科</span>
              <Input disabled={true} value={this.state.subject} />
            </div>
            <div className={styles.box}>
              <span>年级</span>
              <Input disabled={true} value={this.state.subject} />
            </div>
            <div className={styles.box}>
              <span>学期</span>
              <Input disabled={true} value={this.state.subject} />
            </div>
            <div className={styles.box}>
              <span>版本</span>
              <Input disabled={true} value={this.state.subject} />
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.box}>
              <span>要求</span>
              <Input type="textarea" disabled={true} value={this.state.homeworkDesc} />
            </div>
          </div>
          <div className={styles.column3}>
            <div className={styles.verticalBox}>
              <span>附件</span>
              <span>无</span>
            </div>
            <div className={styles.verticalBox}>
              <span>答题卡</span>
              <span>无</span>
            </div>
            <div className={styles.verticalBox}>
              <span>班级/群组</span>
              <Input type="textarea" disabled={true} value={this.state.classes} />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
})

export default HomeworkDetailModal
