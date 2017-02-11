import React from 'react'
import {Modal,Row,Col,Select,Input,Form,Table,Icon} from 'antd'
import config from '../../config'
import {List,fromJS} from 'immutable'
import styles from './AddMicroClassModal.scss'
import VideoModal from './VideoModal'
const Option = Select.Option
const FormItem = Form.Item
const Search = Input.Search

//获取微课列表
const getMicrovideo = (type,currentPage,pageShow,subjectId,gradeId,textbookId,search)=>{
  return fetch(config.api.microvideo.get(type,currentPage,pageShow,subjectId,gradeId,textbookId,search),{
    method:'get',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    }
  }).then(res => res.json())
}

//获取年级列表
const getGradeList = (subjectList) => {
  return fetch(config.api.grade.getBySubject.get(subjectList),{
    method:'get',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    }
  }).then(res => res.json())
}

//获取章节列表

const getTextbookList = (subjectId,gradeId,version,term,unit) =>{
  return fetch(config.api.textbook.getTextBookByCondition(subjectId,gradeId,version,term,unit),{
    method:'get',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    }
  }).then(res => res.json())
}
const AddMicroClassModal = React.createClass({
  getDefaultProps(){
    return {
      subjectList:List(),
      versionList:List(),
      termList:List(),
      onSubmit:()=>{},
      onCancel:()=>{},
    }
  },
  getInitialState(){
    return {
      subjectOption:'',
      typeOption:'',
      versionOption:'',
      gradeOption:'',
      termOption:'',
      charpterOption:'',

      gradeList:List(),
      charpterList:List(),

      microVideo:List(),
    }
  },
  //改变维克类型
  handleChangeMicroClassType(value){
    this.setState({
      microClassTypeOption:value,

    })
    getMicrovideo(value,'1','10','','','','').then(res => {
      this.setState({
        microVideo:fromJS(res)
      })
    })
  },
  //改变学科
  handleChangeSubject(value){
    this.setState({
      subjectOption:value
    })

    Promise.all([
      getMicrovideo(this.state.microClassTypeOption,'1','10',value,'','',''),
      getGradeList(value),
      getTextbookList(value,this.state.gradeOption||'',this.state.versionOption||'',this.state.termOption||'',''),
    ]).then(result => {
      this.setState({
        microVideo:fromJS(result[0]),
        gradeList:fromJS(result[1]),
        charpterList:fromJS(result[2]),
      })
    })
  },
  //选择版本
  handleChangeVersion(value){
    this.setState({
      versionOption:value
    })
    Promise.all([
      getTextbookList(this.state.subjectOption||'',this.state.gradeOption||'',value,this.state.termOption,''),
      getMicrovideo(this.state.microClassTypeOption,'1','10',this.state.subjectOption||'',this.state.gradeOption||'',this.state.charpterOption||'',''),
    ]).then(result => {
      this.setState({
        charpterList:fromJS(result[0]),
        microVideo:fromJS(result[1]),
      })
    })
  },
  //改变年级
  handleChangeGrade(value){
    this.setState({
      gradeOption:value
    })
    getMicrovideo(this.state.microClassTypeOption,'1','10',this.state.subjectOption,value,'','').then(res => {
      this.setState({
        microVideo:fromJS(res)
      })
    })
  },
  //改变学期
  handleChangeTerm(value){
    this.setState({
      termOption:value
    })
    Promise.all([
      getTextbookList(this.state.subjectOption||'',this.state.gradeOption||'',this.state.versionOption||'',value,''),
      getMicrovideo(this.state.microClassTypeOption,'1','10',this.state.subjectOption,this.state.gradeOption,this.state.charpterOption,'')
    ]).then(result => {
      this.setState({
        charpterList:fromJS(result[0]),
        microVideo:fromJS(result[1])
      })
    })
  },
  handleChangeCharpter(value){
    this.setState({
      charpterOption:value,
    })
    getMicrovideo(this.state.microClassTypeOption,'1','10',this.state.subjectOption,this.state.gradeOption,value,'').then(res => {
      this.setState({
        microVideo:fromJS(res)
      })
    })
  },
  handlePlay(key){
    this.setState({
      showPlayModal:true,
      videoUrl:this.state.microVideo.get('result').find(v => v.get('id')==key).get('url')
    })
  },
  getTableData(){
    return this.state.microVideo.isEmpty()?[]:this.state.microVideo.get('result').map((v,k) => ({
      name:v.get('name'),
      uploaderName:v.get('uploaderName'),
      createdAt:v.get('createdAt'),
      description:v.get('description'),
      key:v.get('id'),
      num:k
    })).toJS()
  },
  render(){
    const microClassTypeList =fromJS([{id:'areaList',text:'公共微课'},{id:'schoolList',text:'学校微课'},{id:'privateList',text:'个人微课'}])
    const termList = fromJS([{id:'上学期',text:'上学期'},{id:'下学期',text:'下学期'}])
    const {getFieldDecorator} = this.props.form
    const tableData = this.getTableData()
    const tableColumn = [{
      title:'序号',
      dataIndex:'num',
      key:'num',
    },{
      title:'微课名称',
      dataIndex:'name',
      key:'name',
    },{
      title:'创建人',
      dataIndex:'uploaderName',
      key:'uploaderName',
    },{
      title:'创建时间',
      dataIndex:'createdAt',
      key:'createdAt',
    },{
      title:'简介',
      dataIndex:'description',
      key:'description',
    },{
      title:'播放',
      dataIndex:'player',
      key:'player',
      render:(text,record)=>{
        return (<a><Icon type="play-circle" onClick={this.handlePlay.bind(this,record.key)}/></a>)
      }
    }]
    return (
      <Modal title="添加微课" visible={true} onOk={()=>{this.props.onSubmit(this.state.selectedMircroVideos)}} onCancel={this.props.onCancel} width={850}>
        <div>
          <div className={styles.filters}>
            <Form>
              <Row gutter={8}>
                <Col span={6}>
                  <div className={styles.filterItem}>
                    <Select placeholder='选择微课类型' size="large"  value={this.state.microClassTypeOption} onChange={this.handleChangeMicroClassType}>
                    {
                      microClassTypeList.map(v => (
                        <Option key={v.get('id')} value={v.get('id')} title={v.get('text')}>{v.get('text')}</Option>
                      ))
                    }
                    </Select>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.filterItem}>
                    <Select placeholder='选择学科' size="large" value={this.state.subjectOption||undefined} onChange={this.handleChangeSubject}>
                    {
                      this.props.subjectList.map(v => (
                        <Option key={v.get('subject_id')} value={v.get('subject_id')} title={v.get('subject_name')}>{v.get('subject_name')}</Option>
                      ))
                    }
                    </Select>
                  </div>

                </Col>
                <Col span={6}>
                  <div className={styles.filterItem}>
                    <Select placeholder='选择版本' size="large" value={this.state.versionOption||undefined} onChange={this.handleChangeVersion}>
                    {
                      this.props.versionList.map(v => (
                        <Option key={v.get('id')} value={v.get('id')} title={v.get('text')}>{v.get('text')}</Option>
                      ))
                    }
                    </Select>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.filterItem}>
                    <Select placeholder='选择年级' size="large" value={this.state.gradeOption||undefined} onChange={this.handleChangeGrade}>
                    {
                      this.state.gradeList.map(v => (
                        <Option key={v.get('gradeId')} value={v.get('gradeId')} title={v.get('gradeName')}>{v.get('gradeName')}</Option>
                      ))
                    }
                    </Select>
                  </div>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <div className={styles.filterItem}>
                    <Select placeholder='选择学期' size="large" value={this.state.termOption||undefined} onChange={this.handleChangeTerm}>
                    {
                      termList.map(v => (
                        <Option key={v.get('id')} value={v.get('id')} title={v.get('text')}>{v.get('text')}</Option>
                      ))
                    }
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.filterItem}>
                    <Select placeholder='选择章节课程' size="large" value={this.state.charpterOption||undefined} onChange={this.handleChangeCharpter}>
                    {
                      this.state.charpterList.map((v,k) => (
                        <Option key={k} value={v.get('textbook_menu_id')} title={v.get('course')}>{v.get('course')}</Option>
                      ))
                    }
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.filterItem}>
                    <Search size="large"
                      placeholder="教师姓名、学校名称"
                      onSearch={value => console.log(value)}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.table}>
          <Table rowSelection={
            {
              onChange:(selectedRowKeys,selectedRows)=>{
                const that = this
                let selectedMircroVideos = selectedRowKeys.reduce((pre,cur)=>{
                  return pre.push(that.state.microVideo.get('result').find(v => v.get('id')==cur).set('type','video'))
                },List())
                this.setState({
                  selectedMircroVideos:selectedMircroVideos
                })
              }
            }
          } columns={tableColumn} dataSource ={tableData}/>
          </div>
        </div>
        {this.state.showPlayModal?<VideoModal videoUrl={this.state.videoUrl} onCancel={()=>{this.setState({showPlayModal:false})}}/>:null}
      </Modal>
    )
  }
})

export default Form.create()(AddMicroClassModal)
