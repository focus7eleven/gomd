import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select,InputNumber,notification} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,addTextbook,editTextbook,deleteTextbook,searchTextbook} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './EduOutline.scss'
import _ from 'lodash'
import config from '../../../config'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const confirm = Modal.confirm

const getSelectJson = (data) => {
  const {selectid,selectname,table,selectstyle,selectcompareid} = data
  return new Promise((resolve,reject) =>{
    fetch(config.api.select.json.get(selectid,selectname,table,selectstyle,selectcompareid),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      resolve(res)
    })
  })
}

const EduOutlinePage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),
  _phaseList:List(),
  _gradeList:List(),
  _subjectList:List(),
  _termList:[{id:'上学期',text:'上学期'},{id:'下学期',text:'下学期'}],
  _versionList:List(),

  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      searchStr:'',
      loading:true,

      gradeList:List(),
      phaseOption:this.props.workspace.get('otherMsg').get('phaseOption')||'',
      gradeOption:this.props.workspace.get('otherMsg').get('gradeOption')||'',
      subjectOption:this.props.workspace.get('otherMsg').get('subjectOption')||'',
    }
  },

  getDefaultProps(){
    return {}
  },
  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'textbook')
    }

  },
  // componentWillReceiveProps(nextProps){
  //   if(!nextProps.menu.get('data').isEmpty()){
  //     this._currentMenu = findMenuInTree(nextProps.menu.get('data'),'grade')
  //   }
  // },
  componentDidMount(){
    if(this.state.loading){
      Promise.all([getSelectJson({selectid:"phase_code",selectname:"phase_name",table:"study_phase"}).then(res => {this._phaseList = res}),
      getSelectJson({selectid:"grade_id",selectname:"grade_name",table:"grade"}).then(res => {this._gradeList = res}),
      getSelectJson({selectid:"subject_id",selectname:"subject_name",table:"subject"}).then(res => {this._subjectList = res}),
      getSelectJson({selectstyle:'JKS'}).then(res => {this._versionList = res})]).then(()=>{
        this.setState({
          loading:false
        })
      })
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      className:styles.tableColumn,
    },{
      title: '学段',
      dataIndex: 'phase_name',
      key: 'phase_name',
      className:styles.tableColumn,
    },{
      title: '年级',
      dataIndex: 'grade_name',
      key: 'grade_name',
      className:styles.tableColumn,
    },{
      title: '版本',
      dataIndex: 'textbook_version_name',
      key: 'textbook_version_name',
      className:styles.tableColumn,
    },{
      title: '学科',
      dataIndex: 'subject_name',
      key: 'subject_name',
      className:styles.tableColumn,
    },{
      title: '学期',
      dataIndex: 'textbook_term',
      key: 'textbook_term',
      className:styles.tableColumn,
    },{
      title: '发布年份',
      dataIndex: 'textbook_year',
      key: 'textbook_year',
      className:styles.tableColumn,
    },{
      title: '目录',
      dataIndex: 'catalogue',
      key: 'catalogue',
      className:styles.tableColumn,
      render:(text,record)=>{
        return (<div className={styles.catalogueColumn}><a onClick={()=>{this._currentRow = this.props.workspace.get('data').get('result').get(record.key);this.refs.fileInput.click()}}>导入</a><a onClick={this.handleShowTextbookDetail.bind(this,record.key)}>详情</a></div>)
      }
    }])
    tableHeader = tableHeader.concat(authList.filter(v => (v.get('authUrl').split('/')[2] != 'view')&&(v.get('authUrl').split('/')[2] != 'add')).map( v => {
      return {
        title: PermissionDic[v.get('authUrl').split('/')[2]],
        dataIndex: v.get('authUrl').split('/')[2],
        key: v.get('authUrl').split('/')[2],
        className:styles.editColumn,
        render:(text,record) => {
          return (
            <div>
              <Button type="primary" className={styles.editButton} onClick={this.handleShowEditTextbookModal.bind(this,record.key)}>编辑</Button>
              <Button type="primary" className={styles.deleteButton} onClick={this.handleShowDeleteModal.bind(this,record.key)}>删除</Button>
            </div>
          )
        }
      }
    }))
    tableBody = !this.props.workspace.get('data').isEmpty()?this.props.workspace.get('data').get('result').map( (v,key) => {
      return {
        key:key,
        id:key+1,
        ...(v.toJS())
      }
    }):List()
    return {
      tableHeader:tableHeader.toJS(),
      tableBody:tableBody.toJS(),
    }
  },

  handleShowTextbookDetail(key){
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    fetch(config.api.textbook.menulist.get(this._currentRow.get('textbook_id')),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
    }).then(res => res.json()).then(res => {
      this.setState({
        showTextbookDetailModal:true,
        textbookDetail:res
      })
    })
  },

  handleShowDeleteModal(key){
    const that = this
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    confirm({
      title: '确定删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.deleteTextbook({
          textbookId:currentRow.get('textbook_id'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },
  handleCloseAddTextbookModal(type){
    console.log("Asdf")
    switch (type) {
      case 'create':
        this.setState({
          showAddTextbookModal:false
        })
        break;
      case 'edit':
        this.setState({
          showEditTextbookModal:false
        })
      default:

    }
  },
  handleShowEditTextbookModal(key){
    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)

    const phase = this._phaseList.find(v => v.text == this._currentRow.get('phase_name'))
    const grade = this._gradeList.find(v => v.text == this._currentRow.get('grade_name'))
    const subject = this._subjectList.find(v => v.text == this._currentRow.get('subject_name'))
    const term = this._termList.find(v => v.text == this._currentRow.get('textbook_term'))
    const year = this._currentRow.get('textbook_year')
    const version = this._versionList.find(v => v.id == this._currentRow.get('textbook_version'))
    setFieldsValue({
      phase:phase.id,
      grade:grade?grade.id:'',
      subject:subject?subject.id:'',
      term:term?term.id:'',
      year:year,
      version:version?version.id:'',
    })
    this.setState({
      showEditTextbookModal:true
    })
  },
  handleAddTextbook(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('phase'),getFieldError('grade'),getFieldError('subject'),getFieldError('term'),getFieldError('year'),getFieldError('version')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.addTextbook({
        phaseCode:getFieldValue('phase'),
        gradeId:getFieldValue('grade'),
        subjectId:getFieldValue('subject'),
        term:getFieldValue('term'),
        year:getFieldValue('year'),
        version:getFieldValue('version'),
        name:getFieldValue('name'),
      })
    }
  },
  handleEditTextbook(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('phase'),getFieldError('grade'),getFieldError('subject'),getFieldError('term'),getFieldError('year'),getFieldError('version')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editTextbook({
        phaseCode:getFieldValue('phase'),
        gradeId:getFieldValue('grade'),
        subjectId:getFieldValue('subject'),
        term:getFieldValue('term'),
        year:getFieldValue('year'),
        version:getFieldValue('version'),
        name:getFieldValue('name'),
        textbookId:this._currentRow.get('textbook_id')
      })
    }
  },
  handleSearchTableData(){
    const { searchStr,phaseOption,gradeOption,subjectOption} = this.state
    const currentPage = this.props.workspace.get('data').get('nowPage')
    this.props.searchTextbook({searchStr,currentPage,phaseOption,gradeOption,subjectOption})
  },
  handleDeleteDetailRecord(record){
    let formData = new FormData()
    formData.append('textbook_menu_id',record['textbook_menu_id'])
    fetch(config.api.textbook.menulist.delete,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title =='Success'){
        notification.success({message:'删除成功'})
        this.setState({
          deleteSuccess:true,
          textbookDetail:_.filter(this.state.textbookDetail,(v)=> (v['textbook_menu_id'] != record['textbook_menu_id']))
        })
      }
    })
  },
  handleFileChange(e){
    //上传文件
    let file = e.target.files[0]
    let formData = new FormData()
    formData.append('textbook_id',this._currentRow.get('textbook_id'))
    formData.append('file',file)
    fetch(config.api.textbook.import,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData,
    }).then(res => res.json()).then(res => {
      notification.success({message:'上传成功'})
    })
  },
  renderSelectBar(optionList,type,onSelect=()=>{}){
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder={`请选择${type}`}
        filterOption={(input,option)=>{return option.props.title.indexOf(input)>=0}}
        optionFilterProp="children"
        showSearch
        onSelect={onSelect}
      >
      {
        optionList.map((v,k) => (
          <Option key={k} value={v.id} title={v.text}>{v.text}</Option>
        ))
      }
      </Select>
    )
  },
  filterGrade(value,option){
    fetch(config.api.grade.getGradeList(value),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        gradeList:res.map(v => ({id:v.gradeId,text:v.gradeName}))
      })
    })
  },
  renderEditTextbookModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    return (
      <Modal title={type=='edit'?'编辑教学大纲':'添加教学大纲'} visible={this.state.showEditTextbookModal} onCancel={this.handleCloseAddTextbookModal.bind(this,type)} maskClosable={false}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddTextbookModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('phase')&&!getFieldValue('grade')&&!getFieldValue('subject')&&!getFieldValue('term')&&(type=='create')}
        onClick={type=='edit'?this.handleEditTextbook:this.handleAddTextbook}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='学段'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='phase'>
            {getFieldDecorator('phase', {
              rules: [{ required: true, message: '输入学段' }],
            })(
              this.renderSelectBar(this._phaseList,'学段',this.filterGrade)
            )}
            </FormItem>
            <FormItem
            label='年级'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='grade'>
            {getFieldDecorator('grade', {
              rules: [{ required: true, message: '输入年级' }],
            })(
              this.renderSelectBar(this.state.gradeList,'年级')
            )}
            </FormItem>
            <FormItem
            label='学科'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='subject'>
            {getFieldDecorator('subject', {
              rules: [{ required: true, message: '输入学科' },{max:20,message:'输入不超过20个字'}],
            })(
              this.renderSelectBar(this._subjectList,'学科')
            )}
            </FormItem>
            <FormItem
            label='学期'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='term'>
            {getFieldDecorator('term', {
              rules: [{ required: true, message: '输入学期' }],
            })(
              this.renderSelectBar(this._termList,'学期')
            )}
            </FormItem>
            <FormItem
            label='发布年份'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='year'>
            {getFieldDecorator('year', {
              rules: [{ required: true, message: '输入发布年份' }],
            })(
              <InputNumber style={{width:200}} placeholder="输入发布年份"/>
            )}
            </FormItem>
            <FormItem
            label='大纲版本'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='version'>
            {getFieldDecorator('version', {
              rules: [{ required: true, message: '输入大纲版本' }],
            })(
              this.renderSelectBar(this._versionList,'大纲版本')
            )}
            </FormItem>
            <FormItem
            label='备注'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='comment'>
            {getFieldDecorator('comment', {
              rules: [],
            })(
              <Input style={{width:200}} placeholder="输入备注"/>
            )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },
  renderAddTextbookModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    console.log("Asdfasdf:",getFieldValue('comment'),type)
    return (
      <Modal title={type=='edit'?'编辑教学大纲':'添加教学大纲'} visible={this.state.showAddTextbookModal} onCancel={this.handleCloseAddTextbookModal.bind(this,type)} maskClosable={false}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddTextbookModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('phase')&&!getFieldValue('grade')&&!getFieldValue('subject')&&!getFieldValue('term')&&(type=='create')}
        onClick={type=='edit'?this.handleEditTextbook:this.handleAddTextbook}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='学段'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='phase'>
            {getFieldDecorator('phase', {
              rules: [{ required: true, message: '输入学段' }],
            })(
              this.renderSelectBar(this._phaseList,'学段',this.filterGrade)
            )}
            </FormItem>
            <FormItem
            label='年级'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='grade'>
            {getFieldDecorator('grade', {
              rules: [{ required: true, message: '输入年级' }],
            })(
              this.renderSelectBar(this.state.gradeList,'年级')
            )}
            </FormItem>
            <FormItem
            label='学科'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='subject'>
            {getFieldDecorator('subject', {
              rules: [{ required: true, message: '输入学科' },{max:20,message:'输入不超过20个字'}],
            })(
              this.renderSelectBar(this._subjectList,'学科')
            )}
            </FormItem>
            <FormItem
            label='学期'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='term'>
            {getFieldDecorator('term', {
              rules: [{ required: true, message: '输入学期' }],
            })(
              this.renderSelectBar(this._termList,'学期')
            )}
            </FormItem>
            <FormItem
            label='发布年份'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='year'>
            {getFieldDecorator('year', {
              rules: [{ required: true, message: '输入发布年份' }],
            })(
              <InputNumber style={{width:200}} placeholder="输入发布年份"/>
            )}
            </FormItem>
            <FormItem
            label='大纲版本'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='version'>
            {getFieldDecorator('version', {
              rules: [{ required: true, message: '输入大纲版本' }],
            })(
              this.renderSelectBar(this._versionList,'大纲版本')
            )}
            </FormItem>
            <FormItem
            label='备注'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='comment'>
            {getFieldDecorator('comment', {
              rules: [],
            })(
              <Input style={{width:200}} placeholder="输入备注"/>
            )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },

  renderDeleteRecorder(record){
    Modal.confirm({
      title: '删除详情',
      content: '确认删除？',
      onOk:()=>{
        this.handleDeleteDetailRecord.call(this,record)
      },
      onCancel() {

      },
    });
  },
  renderTextbookDetailModal(){
    const tableHeader = [{
      title: '学期',
      dataIndex: 'term',
      key: 'term',
      width:60,
      className:styles.tableColumn,
    },{
      title: '单元',
      dataIndex: 'unit',
      key: 'unit',
      className:styles.tableColumn,
    },{
      title: '课程',
      dataIndex: 'course',
      key: 'course',
      width:214,
      className:styles.tableColumn,
    },{
      title: '删除',
      dataIndex: 'delete',
      key: 'delete',
      className:styles.tableColumn,
      width: 60,
      render:(text,record) => <Icon type='delete' onClick={this.renderDeleteRecorder.bind(this,record)}/>
    }]
    return (
      <Modal title='教科书目录' visible={true} onCancel={()=>{this.setState({showTextbookDetailModal:false})}}
      footer={[<div key='1'></div>]}
      >
        <Table size='small' columns={tableHeader} dataSource={this.state.textbookDetail} />
      </Modal>
    )
  },
  render(){
    const tableData = this.getTableData()

    const {workspace} = this.props
    const {setFieldsValue} = this.props.form
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/textbook/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={()=>{
            setFieldsValue({
              phase:'',
              grade:'',
              subject:'',
              term:'',
              year:'',
              version:'',
            })
            this.setState({showAddTextbookModal:true})}}>新建</Button>:<div> </div>}
          <div className={styles.headerOperation}>
            <Select
              className={styles.operation}
              placeholder='选择学段'
              value={this.props.workspace.get('otherMsg').get('phaseOption')}
              onChange={(value)=>{this.setState({phaseOption:value},()=>{this.handleSearchTableData()})}}
            >
            <Option key={-1} value={''} title='所有学段'>所有学段</Option>
            {
              this.state.loading?<Option key={0} value='0' title='0'><Spin size="small"/></Option>:this._phaseList.map((v,k) => (
                <Option key={k} value={v.id} title={v.text}>{v.text}</Option>
              ))
            }
            </Select>
            <Select
              className={styles.operation}
              placeholder='选择年级'
              value={this.props.workspace.get('otherMsg').get('gradeOption')}
              onChange={(value)=>{this.setState({gradeOption:value},()=>{this.handleSearchTableData()})}}
            >
            <Option key={-1} value={''} title='所有年级'>所有年级</Option>
            {
              this.state.loading?<Option key={0} value='0' title='0'><Spin size="small"/></Option>:this._gradeList.map((v,k) => (
                <Option key={k} value={v.id} title={v.text}>{v.text}</Option>
              ))
            }
            </Select>
            <Select
              className={styles.operation}
              placeholder='选择学科'
              value={this.props.workspace.get('otherMsg').get('subjectOption')}
              onChange={(value)=>{this.setState({subjectOption:value},()=>{this.handleSearchTableData()})}}
            >
            <Option key={-1} value={''} title='所有学科'>所有学科</Option>
            {
              this.state.loading?<Option key={0} value='0' title='0'><Spin size="small"/></Option>:this._subjectList.map((v,k) => (
                <Option key={k} value={v.id} title={v.text}>{v.text}</Option>
              ))
            }
            </Select>
            {/*<Search style={{width: '240px'}} placeholder="请输入查询条件" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />*/}
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('textbook',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              showQuickJumper:true,
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.renderAddTextbookModal('create')}
        {this.renderEditTextbookModal('edit')}
        {this.state.showTextbookDetailModal?this.renderTextbookDetailModal():null}
        <input type='file' ref='fileInput' style={{display:'none'}} onChange={this.handleFileChange}/>
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    workspace:state.get('workspace'),
  }
}
function mapDispatchToProps(dispatch){
  return {
    getWorkspaceData:bindActionCreators(getWorkspaceData,dispatch),
    addTextbook:bindActionCreators(addTextbook,dispatch),
    editTextbook:bindActionCreators(editTextbook,dispatch),
    deleteTextbook:bindActionCreators(deleteTextbook,dispatch),
    searchTextbook:bindActionCreators(searchTextbook,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(EduOutlinePage))
