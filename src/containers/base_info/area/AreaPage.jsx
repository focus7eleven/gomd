import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,addArea,editArea} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './AreaPage.scss'
import _ from 'lodash'
import config from '../../../config'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const confirm = Modal.confirm


const AreaPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),
  _areaList:List(),

  getDefaultProps(){
    return {
    }
  },
  getInitialState(){
    return {
      searchStr:''
    }
  },
  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'grade')
    }
  },
  // componentWillReceiveProps(nextProps){
  //   if(!nextProps.menu.get('data').isEmpty()){
  //     this._currentMenu = findMenuInTree(nextProps.menu.get('data'),'grade')
  //   }
  // },
  componentDidMount(){
    fetch(config.api.area.list.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this._areaList = fromJS(res)
    })
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '名称',
      dataIndex: 'areaName',
      key: 'areaName',
      className:styles.tableColumn,
    },{
      title: '负责人',
      dataIndex: 'userName',
      key: 'userName',
      className:styles.tableColumn,
    },{
      title: '上级组织',
      dataIndex: 'parentName',
      key: 'parentName',
      className:styles.tableColumn,
    },{
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      className:styles.tableColumn,
    },{
      title: '网站',
      dataIndex: 'website',
      key: 'website',
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
              <Button type="primary" style={{backgroundColor:'#30D18E',borderColor:'#30D18E'}} onClick={this.handleShowEditAreaModal.bind(this,record.key)}>编辑</Button>
              <Button type="primary" className={styles.deleteButton} style={{marginLeft:'10px'}} onClick={this.handleShowDeleteModal.bind(this,record.key)}>删除</Button>
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
        that.props.editArea({
          areaId:currentRow.get('areaId'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },
  handleCloseAddAreaModal(type){
    switch (type) {
      case 'create':
        this.setState({
          showAddAreaModal:false
        })
        break;
      case 'edit':
        this.setState({
          showEditAreaModal:false
        })
      default:

    }
  },
  handleShowEditAreaModal(key){

    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    this.setState({
      showEditAreaModal:true
    },()=>{
      setFieldsValue({
        areaName:this._currentRow.get('areaName'),
        address:this._currentRow.get('address'),
        website:this._currentRow.get('website'),
        remark:this._currentRow.get('remark'),
      })
    })

  },
  handleAddArea(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('areaName'),getFieldError('admin_name'),getFieldError('admin_code')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.addArea({
        areaName:getFieldValue('areaName'),
        'adminName':getFieldValue('admin_name'),
        'adminCode':getFieldValue('admin_code'),
        parentId:getFieldValue('parentId'),
        address:getFieldValue('address'),
        website:getFieldValue('website'),
        remark:getFieldValue('remark'),
      })
    }
  },
  handleEditArea(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('areaName')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editArea({
        areaId:this._currentRow.get('areaId'),
        areaName:getFieldValue('areaName'),
        address:getFieldValue('address'),
        website:getFieldValue('website'),
        remark:getFieldValue('remark'),

        action:'edit',
      })
    }
  },
  renderAddAreaModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    return (
      <Modal title='添加地区' visible={true} onCancel={this.handleCloseAddAreaModal.bind(this,type)}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddAreaModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('areaName')}
        onClick={type=='edit'?this.handleEditArea:this.handleAddArea}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='名称'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='areaName'>
            {getFieldDecorator('areaName', {
              rules: [{ required: true, message: '输入名称' },{max:30,message:'输入不超过30个字'}],
            })(
              <Input placeholder="输入不超过30个字"/>
            )}
            </FormItem>
            {type=='edit'?null:<FormItem
            label='管理员用户名'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='admin_name'>
            {getFieldDecorator('admin_name', {
              rules: [{ required: true, message: '输入管理员用户名' },{min:6,max:16,message:'输入6-16个字'}],
            })(
              <Input placeholder="输入6-16个字"/>
            )}
            </FormItem>}
            {type=='edit'?null:<FormItem
            label='管理员密码'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='admin_code'>
            {getFieldDecorator('admin_code', {
              rules: [{ required: true, message: '输入管理员密码' },{ min:6,max:16, message: '输入6-16个字' }],
            })(
              <Input placeholder='输入6-16个字'/>
            )}
            </FormItem>}
            {type=='edit'?null:<FormItem
            label='上级组织'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='parentId'>
            {getFieldDecorator('parentId', {
              rules: [{ max:50, message: '输入不超过50个字' }],
            })(
              <Select placeholder='选择教育局' style={{ width: 244 }} onChange={this.handleSelectPhase}>
                {
                  this._areaList.map(v => (
                    <Option key={v.get('areaId')} value={v.get('areaId')} title={v.get('areaName')}>{v.get('areaName')}</Option>
                  ))
                }
              </Select>
            )}
            </FormItem>}
            <FormItem
            label='地址'
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
            label='网址'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='website'>
            {getFieldDecorator('website', {
              rules: [{ max:60, message: '输入不超过50个字' },{
                validator(rule, value, callback, source, options) {
                  var errors = [];
                  // test if email address already exists in a database
                  // and add a validation error to the errors array if it does
                  var regExp = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
                  if(!regExp.test(value)){
                    errors.push(new Error('输入网址'))
                  }

                  callback(errors);
                }
              }],
            })(
              <Input placeholder='输入不超过60个字'/>
            )}
            </FormItem>
            <FormItem
            label='备注'
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
    this.props.getWorkspaceData('area',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  render(){
    const tableData = this.getTableData()

    const {workspace} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/grade/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={()=>{this.setState({showAddAreaModal:true})}}>新建</Button>:<div> </div>}<Search style={{width: '260px'}} placeholder="请输入机关名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('area',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              showQuickJumper:true,
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('area',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr)
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.state.showAddAreaModal?this.renderAddAreaModal('create'):null}
        {this.state.showEditAreaModal?this.renderAddAreaModal('edit'):null}
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
    addArea:bindActionCreators(addArea,dispatch),
    editArea:bindActionCreators(editArea,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(AreaPage))
