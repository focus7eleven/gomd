import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select,InputNumber,Tree} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,editRoleDesc,addRole,editRole} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './RoleSettingPage.scss'
import _ from 'lodash'
import config from '../../../config'
import {getTreeFromList,findInTree,findPathInTree} from '../../../utils/tree-utils'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const confirm = Modal.confirm
const TreeNode = Tree.TreeNode

function findAllChildren(flatternTree,target,subtreeList){
  let newSubtreeList = target.reduce((pre,cur)=>{
    return subtreeList.concat(flatternTree.filter(v => v.get('pId')==cur))
  },subtreeList)
  let newTarget = target.reduce((pre,cur)=>{
    return pre.concat(flatternTree.filter(v => v.get('pId')==cur))
  },List())
  if(newTarget.size==0){
    return newSubtreeList
  }else{
    return findAllChildren(flatternTree,newTarget.map(v => v.get('id')),newSubtreeList)
  }
}

const RoleSettingPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),
  _permissionList:List(),
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      searchStr:'',
      checkedList:List([]),
      permissionTree:List(),
    }
  },

  getDefaultProps(){
    return {}
  },
  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'role')
    }
  },
  // componentWillReceiveProps(nextProps){
  //   if(!nextProps.menu.get('data').isEmpty()){
  //     this._currentMenu = findMenuInTree(nextProps.menu.get('data'),'grade')
  //   }
  // },
  componentDidMount(){
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      className:styles.tableColumn,
    },{
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      className:styles.tableColumn,
      render:(text,record)=>{
        return <a onClick={this.handleShowRoleDescEditModal.bind(this,text,record.key)}><Icon type='edit'/>{text}</a>
      }
    },{
      title: '权限配置',
      dataIndex: 'premissionEdit',
      key: 'premissionEdit',
      className:styles.tableColumn,
      render:(text,record)=>{
        return <Icon type='search' onClick={this.handleShowPermissionModal.bind(this,record.key)}/>
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
              <Button type="primary" className={styles.editButton} onClick={this.handleShowEditRoleModal.bind(this,record.key)}>编辑</Button>
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
  handleShowRoleDescEditModal(text,key){
    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    this.setState({
      showRoleDescEditModal:true,
    },()=>{
      setFieldsValue({
        roleDesc:text
      })
    })

  },
  handleShowPermissionModal(key){
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    Promise.all([fetch(config.api.permission.list.get(this._currentRow.get('roleId')),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()),fetch(config.api.permission.tree.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
    }).then(res => res.json())
    ]).then(result => {
      this._permissionList = fromJS(result[1])
      this.setState({
        permissionTree:this._permissionList.filter(v => v.get('pId')=='0'),
        checkedList:fromJS(result[0]),
        showPermissionModal:true
      })
    })
  },
  handleShowDeleteModal(key){
    const that = this
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    confirm({
      title: '你先删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editRole({
          roleId:currentRow.get('roleId'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },
  handleCloseAddRoleModal(type){
    switch (type) {
      case 'create':
        this.setState({
          showAddRoleModal:false
        })
        break;
      case 'edit':
        this.setState({
          showEditRoleModal:false
        })
      default:

    }
  },
  handleShowEditRoleModal(key){
    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)

    this.setState({
      showEditRoleModal:true
    },()=>{
      setFieldsValue({
        roleName:this._currentRow.get('roleName'),
      })
    })
  },
  handleAddRole(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('roleName'),getFieldError('range_code')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.addRole({
        roleName:getFieldValue('roleName'),
        roleDesc:getFieldValue('roleDesc'),
        rangeCode:getFieldValue('range_code'),
      })
    }
  },
  handleEditRole(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('roleName')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editRole({
        roleName:getFieldValue('roleName'),
        action:'edit',
        roleId:this._currentRow.get('roleId')
      })
    }
  },
  handleEditRoleDesc(){
    const {getFieldValue} = this.props.form
    this.props.editRoleDesc({
      text:getFieldValue('roleDesc'),
      table:'role',
      column:'role_desc',
      pk:'role_id',
      pkv:this._currentRow.get('roleId')
    })
  },
  handleSearchTableData(value){
    this.props.getWorkspaceData('role',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },
  renderRoleDescEditModal(){
    const {getFieldDecorator} = this.props.form
    return (
      <Modal title='编辑角色描述' visible={true}
      onCancel={()=>{this.setState({showRoleDescEditModal:false})}}
      onOk={this.handleEditRoleDesc}
      >
        <Form>
          <FormItem
          label='角色描述'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
          key='roleDesc'>
          {getFieldDecorator('roleDesc', {
            rules: [{ required: true, message: '输入角色描述' },{max:200,message:'输入不超过200个字'}],
          })(
            <Input type='textarea' rows={4} placeholder="输入不超过10个字"/>
          )}
          </FormItem>
        </Form>
      </Modal>
    )
  },
  renderAddRoleModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    return (
      <Modal title='添加角色' visible={true} onCancel={this.handleCloseAddRoleModal.bind(this,type)}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddRoleModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('roleName')&&!getFieldValue('range_code')&&(type=='create')}
        onClick={type=='edit'?this.handleEditRole:this.handleAddRole}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='角色名称'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='dictStyle'>
            {getFieldDecorator('roleName', {
              rules: [{ required: true, message: '输入角色名称' },{max:20,message:'输入不超过20个字'}],
            })(
              <Input placeholder="输入不超过20个字"/>
            )}
            </FormItem>
            {
              type=='create'?<FormItem
              label='角色描述'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='styleDesc'>
              {getFieldDecorator('roleDesc', {
                rules: [{max:200,message:'输入不超过200个字'}],
              })(
                <Input placeholder="输入不超过200个字"/>
              )}
              </FormItem>:null
            }{
              type=='create'?<FormItem
              label='所属区域'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='range_code'>
              {getFieldDecorator('range_code', {
                initialValue:0,
                rules: [{ required: true, message: '所属区域' }],
              })(
                <InputNumber style={{width:'244px'}} placeholder="输入数字"/>
              )}
              </FormItem>:null
            }
          </Form>
        </div>
      </Modal>
    )
  },
  onloadData(treenode){
    return new Promise((resolve,reject)=>{
      let path = findPathInTree(this.state.permissionTree,List([]),treenode.props.eventKey)
      this.setState({
        permissionTree:this.state.permissionTree.setIn(path.push('children'),this._permissionList.filter(v => v.get('pId')==treenode.props.eventKey)),
      })
      resolve();
    })
  },
  handleSavePermission(){
    let formData = new FormData()
    formData.append('roleId',this._currentRow.get('roleId'))
    this.state.checkedList.forEach(v => {
      formData.append('resourceIds',v.get('resource_id'))
      formData.append('code',v.get('code'))
    })
    fetch(config.api.permission.set.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      this.setState({
        showPermissionModal:false
      })
    })

  },
  handleCheckPermission(checkedKeys,e){

    const allChildren = findAllChildren(this._permissionList,List([e.node.props.eventKey]),List([this._permissionList.find(v =>v.get('id')==e.node.props.eventKey)]))
    console.log("popo:",allChildren.toJS(),e.checked)
    if(e.checked){
      this.setState({
        checkedList:this.state.checkedList.concat(allChildren.map(v => {return fromJS({'resource_id':v.get('id'),code:v.get('code')})}))
      })
    }else{
      this.setState({
        checkedList:allChildren.reduce((pre,cur)=>{
          return pre.filter(v => v.get('resource_id')!=cur.get('id'))
        },this.state.checkedList)
      })
    }
  },
  renderShowPermissionModal(){
    const renderTree = (tree) => tree.map(node => {
      if(node.get('children')){
        return (<TreeNode title={node.get('name')} key={node.get('id')} isLeaf={false} checked>
        {
          renderTree(node.get('children'))
        }
        </TreeNode>)
      }else{
        return <TreeNode title={node.get('name')} key={node.get('id')} isLeaf={false} checked></TreeNode>
      }

    }).toJS()
    return (
      <Modal title='权限' visible={true} onOK={this.handleSavePermission} onCancel={()=>{this.setState({showPermissionModal:false})}}
      footer={[
        <Button key='cancel' type='ghost' onClick={()=>{this.setState({showPermissionModal:false})}}>取消</Button>,
        <Button key='ok' type='primary' onClick={this.handleSavePermission}>确认</Button>
      ]}
      >
        <div className={styles.permissionTree}>
          <Tree loadData={this.onloadData} checkable checkedKeys={this.state.checkedList.map(v => v.get('resource_id')).toJS()}
          onCheck={this.handleCheckPermission}>
          {
            renderTree(this.state.permissionTree)
          }
          </Tree>
        </div>
      </Modal>
    )
  },

  render(){
    const tableData = this.getTableData()

    const {workspace} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/role/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={()=>{this.setState({showAddRoleModal:true})}}>新建</Button>:<div> </div>}<Search placeholder="请输入查询条件" style={{width: '260px'}} value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('role',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              showQuickJumper:true,
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('role',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr)
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.state.showAddRoleModal?this.renderAddRoleModal('create'):null}
        {this.state.showEditRoleModal?this.renderAddRoleModal('edit'):null}
        {this.state.showRoleDescEditModal?this.renderRoleDescEditModal():null}
        {this.state.showPermissionModal?this.renderShowPermissionModal():null}
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
    editRoleDesc:bindActionCreators(editRoleDesc,dispatch),
    addRole:bindActionCreators(addRole,dispatch),
    editRole:bindActionCreators(editRole,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(RoleSettingPage))
