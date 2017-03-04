import React from 'react'
import {Select,Modal} from 'antd'
import {List,fromJS} from 'immutable'
const Option = Select.Option
import config from '../../config'
import styles from './PublishModal.scss'

const PublishModal = React.createClass({
  getDefaultProps(){
    return {
      onOk:()=>{},
      onCancel:()=>{},
      lessonId:'',
    }
  },
  getInitialState(){
    return {
      classList:List()
    }
  },
  componentDidMount(){
    fetch(config.api.group.getByTeacherForHomework,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        classList:fromJS(res)
      })
    })
  },
  selectClass(value){
    this.setState({
      selectedClass:value
    })
  },
  handlePublish(){
    let formData = new FormData()
    formData.append('selectedClasses',this.state.selectedClass.join(','))
    formData.append('selectedClassNames',this.state.classList.filter(v => this.state.selectedClass.find(k => k == v.get('groupId'))).map(v => v.get('className')).toJS().join(','))
    formData.append('lessonId',this.props.lessonId)
    fetch(config.api.lesson.publish,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      console.log("-->:",res)
      this.props.onOk()
    })
  },
  render(){
    return (
      <Modal title='发布课程' visible={true} onCancel={this.props.onCancel} onOk={this.handlePublish} width={300}>
        <div style={{marginBottom: '10px',
                    fontSize: '12px',
                    paddingLeft: '6px'}}>选择发布对象：</div>
        <div className={styles.content}>
          <span>班级：</span>
          <Select multiple style={{width:'200px'}} onChange={this.selectClass}>
          {
            this.state.classList.map((v,k) => (
              <Option key={k} value={v.get('groupId')} title={v.get('className')}>{v.get('className')}</Option>
            )).toJS()
          }
          </Select>
          </div>
      </Modal>
    )
  }
})

export default PublishModal
