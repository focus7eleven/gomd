import React from 'react'
import {Button,Icon,Form,Input,Row,Col,Modal,Table,Select,DatePicker,notification} from 'antd'
import {List,fromJS} from 'immutable'
import styles from './CreateClassPage.scss'
import config from '../../config'
import AddMicroClassModal from '../../components/modal/AddMicroClassModal.jsx'
import AddHomeworkModal from '../../components/modal/AddHomeworkModal'
import moment from 'moment'
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search
const CreateClassPage = React.createClass({
  getInitialState(){
    return {
      showHomeworkModal:false,
      showMicroClassModal:false,

      subjectList:List(),
      versionList:List(),
      gradeList:List(),
      termList:fromJS([{id:'1',text:'上学期'},{id:'2',text:'下学期'}]),
      charpterList:List(),

      subjectOption:'',
      versionOption:'',
      gradeOption:'',
      termOption:'',
      charpterOption:'',
      courseName:'',
      courseDesc:'',

      videoHomeworkList:List(),

      homeworkType:'1',
    }
  },
  //获取下拉框的数据
  getFilter(){
    return Promise.all([
      fetch(config.api.courseCenter.getDistinctSubject,{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => {
        return fromJS(res)
      }).then((subjectList)=>{
        return fetch(config.api.grade.getBySubject.get(this.state.subjectOption||subjectList.get(0).get('subject_id')),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json()).then(res => {
          return {
            subjectList:subjectList,
            gradeList:fromJS(res)
          }
        })
      }),
      fetch(config.api.select.json.get('','','','JKS',''),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => {
        return {
          versionList:fromJS(res)
        }
      }),

    ]).then(results => {
      const gradeList = results[0].gradeList
      const subjectList = results[0].subjectList
      const versionList = results[1].versionList
      return fetch(config.api.teachingPlan.course.schedules(this.state.subjectOption||subjectList.get(0).get('subject_id'),
      this.state.gradeOption||gradeList.get(0).get('gradeId'),
      this.state.termOption||this.state.termList.get(0).get('text'),
      this.state.versionOption||versionList.get(0).get('id')),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => {
        return {
          charpterList:fromJS(res),
          gradeList,
          subjectList,
          versionList,
        }
      }).then((result)=>{
        const {
          charpterList,
          gradeList,
          subjectList,
          versionList,
        } = result
        return fetch(config.api.lesson.lastChapterTime(this.state.charpterOption[0]||charpterList.get(0).get('teaching_schedule_id'),
        this.state.charpterOption[1]||charpterList.get(0).get('hours')),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.text()).then(res => {
          this.setState({
            chapterTime:res,
            charpterList,
            gradeList,
            versionList,
            subjectList,
          })
          return {
            ...result,
            chapterTime:res
          }
        })
      })
    })
  },
  componentDidMount(){
    this.getFilter().then((result) => {
      const {charpterList,gradeList,versionList,subjectList} = result
      this.setState({
        charpterOption:charpterList.isEmpty()?[null,null]:[charpterList.get(0).get('teaching_schedule_id'),charpterList.get(0).get('hours')],
        gradeOption:gradeList.isEmpty()?null:gradeList.get(0).get('gradeId'),
        versionOption:versionList.isEmpty()?null:versionList.get(0).get('id'),
        subjectOption:subjectList.isEmpty()?null:subjectList.get(0).get('subject_id'),
        termOption:this.state.termList.get(0).get('id'),
      })
    })
  },
  //打开添加作业的对话框
  handleShowHomeworkModal(){
    this.setState({
      showHomeworkModal:true
    })
  },
  //打开添加微课的对话框
  handleShowMicroClassModal(){
    this.setState({
      showMicroClassModal:true
    })
  },
  //改变下拉框的选项
  handleFilterChange(type,value){
    switch (type) {
      case 'subject':
        this.setState({
          subjectOption:value
        },()=>{
          this.getFilter()
        })
        break;
      case 'version':
        this.setState({
          versionOption:value
        },()=>{
          this.getFilter()
        })
        break;
      case 'grade':
        this.setState({
          gradeOption:value
        },()=>{
          this.getFilter()
        })
        break;
      case 'term':
        this.setState({
          termOption:value
        },()=>{
          this.getFilter()
        })
        break;
      case 'charpter':
        this.setState({
          charpterOption:[value,this.state.charpterList.find(v => v.get('teaching_schedule_id')).get('hours')]
        })
      default:

    }
  },
  //添加一条微课或者作业
  handleAddVideoHome(selectedMircroVideos){
    this.setState({
      videoHomeworkList:this.state.videoHomeworkList.concat(selectedMircroVideos),
      showMicroClassModal:false,
      showHomeworkModal:false,
    })
  },
  //保存新建的课程
  saveAsSchool(type){
    let formData = new FormData()
    formData.append('textbook_Version',this.state.versionOption)
    formData.append('textbook_Term',this.state.termOption)
    formData.append('course_date',this.state.chapterTime)
    formData.append('course_name',this.state.courseName)
    formData.append('course_des',this.state.courseDesc)
    formData.append('teaching_schedule_id',this.state.charpterOption[0])
    formData.append('hour_no',this.state.charpterOption[1])
    formData.append('isSchool',type)
    formData.append('video_content_id',this.state.videoHomeworkList.filter(v => v.get('type')=='video').map(v => v.get('id')).toJS().join(','))
    formData.append('homework_content_id',this.state.videoHomeworkList.filter(v => v.get('type')=='homework').map(v => v.get('homework_id')).toJS().join(','))
    formData.append('homeworkTypeList',this.state.videoHomeworkList.filter(v => v.get('type')=='homework').map(v => v.get('homework_id')+'|1').toJS().join(','))
    formData.append('lesson_id',"")
    fetch(config.api.lesson.create,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title=='Error'){
        notification.error({message:res.result})
      }else{
        notification.success({message:res.result})
      }
    })
  },
  //删除一条微课或者作业
  handleDeleteVideoHomework(key){
    this.setState({
      videoHomeworkList:this.state.videoHomeworkList.filter(v => {
        if(v.get('type')=='video'){
          return v.get('id')!=key
        }else{
          return v.get('homework_id')!=key
        }
      })
    })
  },
  //渲染微课或者作业表格
  renderVideoHomeworkList(){
    const tableColumn =[{
      title:'类型',
      dataIndex:'type',
      key:'type',
      render:(text,record)=>{
        return text=='video'?'微课':(<Select size='large' value={this.state.homeworkType} onChange={(value)=>{this.setState({homeworkType:value})}} style={{width:'200px'}}>
            <Option value='1' title='课后作业' key='1'>课后作业</Option>
            <Option value='2' title='预习作业' key='2'>预习作业</Option>
          </Select>)
      }
    },{
      title:'名称',
      dataIndex:'name',
      key:'name',
    },{
      title:'创建时间',
      dataIndex:'createdAt',
      key:'createdAt',
    },{
      title:'操作',
      key:'action',
      render:(text,record)=>{
        return (<Button className={styles.deleteButton} onClick={this.handleDeleteVideoHomework.bind(this,record.key)}>删除</Button>)
      }
    }]
    const tableData = this.state.videoHomeworkList.map(v => {
      if(v.get('type')=='video'){
        return {
          key:v.get('id'),
          type:v.get('type'),
          name:v.get('name'),
          createdAt:v.get('createdAt'),
        }
      }else{
        return {
          key:v.get('homework_id'),
          type:v.get('type'),
          name:v.get('homework_name'),
          createdAt:v.get('create_dt'),
        }
      }
    }).toJS()
    return this.state.videoHomeworkList.isEmpty()?null:<Table columns={tableColumn} dataSource={tableData}/>
  },
  render(){
    const {getFieldDecorator} = this.props.form
    return (
      <div className={styles.container}>
        <div className={styles.header}>
           <Button type='primary' style={{marginRight:'10px'}} onClick={this.handleShowMicroClassModal}><Icon type="plus" />微课</Button><Button type='primary' onClick={this.handleShowHomeworkModal}><Icon type="plus" />作业</Button>
        </div>
        <div className={styles.body}>
          <div className={styles.title}><Icon type='edit'/>教学计划</div>
          <Form>
            <Row type='flex' gutter={8}>
              <Col span={6}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />学科</span></div>
                  <Select placeholder='选择学科' size="large" value={this.state.subjectOption} onChange={this.handleFilterChange.bind(this,'subject')}>
                  {
                    this.state.subjectList.map(v => (
                      <Option key={v.get('subject_id')} value={v.get('subject_id')} title={v.get('subject_name')}>{v.get('subject_name')}</Option>
                    ))
                  }
                  </Select>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />版本</span></div>
                  <Select placeholder='选择版本' size="large" value={this.state.versionOption} onChange={this.handleFilterChange.bind(this,'version')}>
                  {
                    this.state.versionList.map(v => (
                      <Option key={v.get('id')} value={v.get('id')} title={v.get('text')}>{v.get('text')}</Option>
                    ))
                  }
                  </Select>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />年级</span></div>
                  <Select placeholder='选择年级' size="large" value={this.state.gradeOption} onChange={this.handleFilterChange.bind(this,'grade')}>
                  {
                    this.state.gradeList.map(v => (
                      <Option key={v.get('gradeId')} value={v.get('gradeId')} title={v.get('gradeName')}>{v.get('gradeName')}</Option>
                    ))
                  }
                  </Select>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />学期</span></div>
                  <Select placeholder='选择学期' size="large" value={this.state.termOption} onChange={this.handleFilterChange.bind(this,'term')}>
                  {
                    this.state.termList.map(v => (
                      <Option key={v.get('id')} value={v.get('id')} title={v.get('text')}>{v.get('text')}</Option>
                    ))
                  }
                  </Select>
                </div>
              </Col>
            </Row>
            <Row type='flex' gutter={8}>
              <Col span={6}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />章节课程</span></div>
                  <Select placeholder='选择章节课程' size="large" value={this.state.charpterList.isEmpty()?'':this.state.charpterOption[0]} onChange={this.handleFilterChange.bind(this,'charpter')}>
                  {
                    this.state.charpterList.map(v => (
                      <Option key={v.get('teaching_schedule_id')} value={v.get('teaching_schedule_id')} title={`${v.get('course')}第${v.get('hours')}课时`}>{`${v.get('course')}第${v.get('hours')}课时`}</Option>
                    ))
                  }
                  </Select>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />上课时间</span></div>
                  <DatePicker value={moment(this.state.chapterTime,'YYYY/MM/DD')} onChange={(date,dateString)=>{this.setState({chapterTime:dateString})}}  size='large' style={{width:'100%'}} showTime format="YYYY-MM-DD HH:mm:ss" />
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />课程名称</span></div>
                  <Input value={this.state.courseName} onChange={(e)=>{this.setState({courseName:e.target.value})}} size='large' placeholder="输入小于30个字" />
                </div>
              </Col>
            </Row>
            <Row type='flex' gutter={8}>
              <Col span={24}>
                <div className={styles.filterItem}>
                  <div ><span><Icon type="appstore" />课程说明</span></div>
                  <Input type='textarea' rows={2} value={this.state.courseDesc} onChange={(e)=>{this.setState({courseDesc:e.target.value})}} size='large' placeholder="请输入课程说明"/>
                </div>
              </Col>
            </Row>
          </Form>
          <div>
          {this.renderVideoHomeworkList()}
          </div>
        </div>
        <div className={styles.footer}>
          <Button type='primary' style={{marginRight:'10px'}} onClick={this.saveAsSchool.bind(this,'1')}>保存为学校课程</Button><Button type='primary' onClick={this.saveAsSchool.bind(this,'0')}>保存为个人课程</Button>
        </div>
        {this.state.showHomeworkModal?<AddHomeworkModal currentSubject={this.state.subjectOption} onSubmit={(selectedHomeworks)=>{this.handleAddVideoHome(selectedHomeworks)}} onCancel={()=>{this.setState({showHomeworkModal:false})}} />:null}
        {this.state.showMicroClassModal?<AddMicroClassModal onSubmit={(selectedMircroVideos)=>{this.handleAddVideoHome(selectedMircroVideos)}} onCancel={()=>{this.setState({showMicroClassModal:false})}} subjectList={this.state.subjectList} versionList={this.state.versionList} termList={this.state.termList}/>:null}
      </div>
    )
  }
})

export default Form.create()(CreateClassPage)
