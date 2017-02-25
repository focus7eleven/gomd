import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,searchSchool,addSchool,editSchool} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './SchoolPage.scss'
import _ from 'lodash'
import config from '../../../config'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const confirm = Modal.confirm


const SchoolPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),
  _phaseList:List(),
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      searchStr:'',
      areaList:List(),
      areaOption:this.props.workspace.get('otherMsg').get('areaOption')||'',
    }
  },

  getDefaultProps(){
    return {}
  },
  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'school')
    }
  },
  // componentWillReceiveProps(nextProps){
  //   if(!nextProps.menu.get('data').isEmpty()){
  //     this._currentMenu = findMenuInTree(nextProps.menu.get('data'),'grade')
  //   }
  // },
  componentDidMount(){
    fetch(config.api.area.children.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        areaList:fromJS(res)
      })
    })
    fetch(config.api.phase.phaseList.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this._phaseList = res
    })
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '所属教育局',
      dataIndex: 'area_name',
      key: 'area_name',
      className:styles.tableColumn,
    },{
      title: '学校名称',
      dataIndex: 'school_name',
      key: 'school_name',
      className:styles.tableColumn,
    },{
      title: '学校编码',
      dataIndex: 'school_code',
      key: 'school_code',
      className:styles.tableColumn,
    },{
      title: '上级校区',
      dataIndex: 'parent_name',
      key: 'parent_name',
      className:styles.tableColumn,
    },{
      title: '描述',
      dataIndex: 'school_desc',
      key: 'school_desc',
      className:styles.tableColumn,
    },{
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      className:styles.tableColumn,
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      className:styles.tableColumn,
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
              <Button type="primary" className={styles.editButton} onClick={this.handleShowEditSchoolModal.bind(this,record.key)}>编辑</Button>
              <Button type="primary" className={styles.deleteButton} onClick={this.handleShowDeleteModal.bind(this,record.key)}>删除</Button>
            </div>
          )
        }
      }
    }))
    tableBody = !this.props.workspace.get('data').isEmpty()?this.props.workspace.get('data').get('result').map( (v,key) => {
      return {
        key:key,
        ...(v.toJS())
      }
    }):List()
    return {
      tableHeader:tableHeader.toJS(),
      tableBody:tableBody.toJS(),
    }
  },
  handleShowDeleteModal(key){
    const that = this
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    confirm({
      title: '确定删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editSchool({
          schoolId:currentRow.get('school_id'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },
  handleCloseAddGradeModal(type){
    switch (type) {
      case 'create':
        this.setState({
          showAddSchoolModal:false
        })
        break;
      case 'edit':
        this.setState({
          showEditSchoolModal:false
        })
      default:

    }
  },
  handleShowEditSchoolModal(key){

    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    console.log(key,'-->:',this._currentRow.toJS())
    fetch(config.api.school.phase.get(this._currentRow.get('school_code')),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        showEditSchoolModal:true
      },()=>{
        setFieldsValue({
          school_name:this._currentRow.get('school_name'),
          school_code:this._currentRow.get('school_code'),
          admin_name:this._currentRow.get('admin_name'),
          admin_code:this._currentRow.get('admin_code'),
          area_id:this._currentRow.get('area_id'),
          phase_value:res,
          school_desc:this._currentRow.get('school_desc'),
          address:this._currentRow.get('address'),
          remark:this._currentRow.get('remark')
        })
      })
    })

  },
  handleAddSchool(){

    const {getFieldValue,getFieldError} = this.props.form
    console.log("--<:",getFieldValue('phase_value'))
    let errors = [getFieldError('school_name'),getFieldError('admin_name'),getFieldError('school_code')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.addSchool({
        schoolName:getFieldValue('school_name'),
        schoolCode:getFieldValue('school_code'),
        adminName:getFieldValue('admin_name'),
        adminCode:getFieldValue('admin_code'),
        areaId:getFieldValue('area_id'),
        phaseValue:getFieldValue('phase_value'),
        schoolDesc:getFieldValue('school_desc'),
        address:getFieldValue('address'),
        remark:getFieldValue('remark')
      })
    }
  },
  handleEditSchool(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('school_name'),getFieldError('admin_name'),getFieldError('school_code')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editSchool({
        schoolName:getFieldValue('school_name'),
        schoolCode:getFieldValue('school_code'),
        adminName:getFieldValue('admin_name'),
        adminCode:getFieldValue('admin_code'),
        areaId:getFieldValue('area_id'),
        phaseValue:getFieldValue('phase_value'),
        schoolDesc:getFieldValue('school_desc'),
        address:getFieldValue('address'),
        remark:getFieldValue('remark'),
        action:'edit',
        schoolId:this._currentRow.get('school_id')
      })
    }
  },
  renderAddSchoolModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    return (
      <Modal title='添加学校' visible={true} onCancel={this.handleCloseAddGradeModal.bind(this,type)}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddGradeModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('school_name')&&!getFieldValue('school_code')}
        onClick={type=='edit'?this.handleEditSchool:this.handleAddSchool}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='学校名称'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='school_name'>
            {getFieldDecorator('school_name', {
              rules: [{ required: true, message: '输入年级名称' },{max:30,message:'输入不超过30个字'}],
            })(
              <Input placeholder="输入不超过30个字"/>
            )}
            </FormItem>
            <FormItem
            label='学校编码'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='school_code'>
            {getFieldDecorator('school_code', {
              rules: [{ required: true, message: '输入年级名称' },{max:10,message:'输入不超过10个字'}],
            })(
              <Input placeholder="输入不超过10个字"/>
            )}
            </FormItem>
            {
              <FormItem
              label='管理员用户名'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='admin_name'>
              {getFieldDecorator('admin_name', {
                rules: [{ required: true, message: '输入年级名称' },{min:6,max:16,message:'输入6-16个字'}],
              })(
                <Input placeholder="输入6-16个字"/>
              )}
              </FormItem>
            }
            {
              <FormItem
              label='管理员密码'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='admin_code'>
              {getFieldDecorator('admin_code', {
                rules: [{ required: true, message: '输入年级名称' },{max:10,message:'输入不超过10个字'}],
              })(
                <Input placeholder="输入不超过10个字"/>
              )}
              </FormItem>
            }
            <FormItem
            label='所属教育局'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='area_id'>
            {getFieldDecorator('area_id', {
              rules: [{ required: true, message: '选择学段' }],
            })(
              <Select placeholder='选择教育局' style={{ width: 244 }} disabled={type=='edit'}>
                {
                  this.state.areaList.map(v => (
                    <Option key={v.get('areaId')} value={v.get('areaId')} title={v.get('areaName')}>{v.get('areaName')}</Option>
                  ))
                }
              </Select>
            )}
            </FormItem>
            <FormItem
            label='所属学段'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='phase_value'>
            {getFieldDecorator('phase_value',{
              rules:[{required:true,message:'选择学段'}]
            })(
              <Select
                multiple
                style={{ width: '100%' }}
                placeholder="选择学段"

              >
                {this._phaseList.map((v,k) => (
                  <Option key={k} value={v['phase_code']}>{v['phase_name']}</Option>
                ))}
              </Select>
            )
            }
            </FormItem>
            <FormItem
            label='学校描述'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='school_desc'>
            {getFieldDecorator('school_desc', {
              rules: [{ max:200, message: '输入不超过200个字' }],
            })(
              <Input placeholder='输入不超过200个字'/>
            )}
            </FormItem>
            <FormItem
            label='学校地址'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='address'>
            {getFieldDecorator('address', {
              rules: [{ max:180, message: '输入不超过180个字' }],
            })(
              <Input placeholder='输入不超过180个字'/>
            )}
            </FormItem>
            <FormItem
            label='学校备注'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='remark'>
            {getFieldDecorator('remark', {
              rules: [{ max:200, message: '输入不超过200个字' }],
            })(
              <Input placeholder='输入不超过200个字'/>
            )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },

  //搜索框输入的change事件
  handleSearchTableData(value){
    console.log("-->:",this.state.searchStr,areaOption)
    const {searchStr,areaOption} = this.state
    const currentPage = this.props.workspace.get('data').get('nowPage')
    this.props.searchSchool({searchStr,currentPage,areaOption})
  },

  render(){
    const tableData = this.getTableData()
    console.log("-->:asdfasdf",this._currentMenu.toJS())
    const {workspace} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/school/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={()=>{this.setState({showAddSchoolModal:true})}}>新建</Button>:<div> </div>}
          <div className={styles.headerOperation}>
            <Select
              className={styles.operation}
              placeholder='选择学段'
              value={this.props.workspace.get('otherMsg').get('areaOption')}
              onChange={(value)=>{this.setState({areaOption:value},()=>{this.handleSearchTableData()})}}
            >
            {
              this.state.areaList.map((v,k) => (
                <Option key={k} value={v.get('areaId')} title={v.get('areaName')}>{v.get('areaName')}</Option>
              ))
            }
            </Select>
          <Search style={{width: '260px'}} placeholder="请选择所属教育局" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
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
                this.props.getWorkspaceData('school',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr,'pageByArea')
              },
              showQuickJumper:true,
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('school',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr,'pageByArea')
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.state.showAddSchoolModal?this.renderAddSchoolModal('create'):null}
        {this.state.showEditSchoolModal?this.renderAddSchoolModal('edit'):null}
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
    searchSchool:bindActionCreators(searchSchool,dispatch),
    addSchool:bindActionCreators(addSchool,dispatch),
    editSchool:bindActionCreators(editSchool,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(SchoolPage))
