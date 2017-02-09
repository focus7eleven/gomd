import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,addDict,editDict} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './DictPage.scss'
import _ from 'lodash'
import config from '../../../config'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const confirm = Modal.confirm


const DictPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      searchStr:'',
    }
  },

  getDefaultProps(){
    return {}
  },
  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'dict')
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
      title: '序号',
      dataIndex: 'dictId',
      key: 'dictId',
      className:styles.tableColumn,
    },{
      title: '字段类型',
      dataIndex: 'dictStyle',
      key: 'dictStyle',
      className:styles.tableColumn,
    },{
      title: '类型描述',
      dataIndex: 'styleDesc',
      key: 'styleDesc',
      className:styles.tableColumn,
    },{
      title:'字段名',
      dataIndex:'dictName',
      key:'dictName',
      className:styles.tableColumn,
    },{
      title:'字段值',
      dataIndex:'dictCode',
      key:'dictCode',
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
              <Button type="primary" className={styles.editButton}  onClick={this.handleShowEditDictModal.bind(this,record.key)}>编辑</Button>
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
      title: '你先删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editDict({
          dictId:currentRow.get('dictId'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },
  handleCloseAddDictModal(type){
    switch (type) {
      case 'create':
        this.setState({
          showAddDictModal:false
        })
        break;
      case 'edit':
        this.setState({
          showEditDictModal:false
        })
      default:

    }
  },
  handleShowEditDictModal(key){
    console.log(key)
    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    this.setState({
      showEditDictModal:true
    },()=>{
      setFieldsValue({
        dictStyle:this._currentRow.get('dictStyle'),
        styleDesc:this._currentRow.get('styleDesc'),
        dictName:this._currentRow.get('dictName'),
        dictCode:this._currentRow.get('dictCode'),
      })
    })

  },
  handleAddDict(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('gradeName'),getFieldError('gradeNickName'),getFieldError('phaseName')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.addDict({
        dictStyle:getFieldValue('dictStyle'),
        styleDesc:getFieldValue('styleDesc'),
        dictName:getFieldValue('dictName'),
        dictCode:getFieldValue('dictCode'),
      })
    }
  },
  handleEditDict(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('dictStyle'),getFieldError('styleDesc'),getFieldError('dictName'),getFieldError('dictCode')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editDict({
        dictStyle:getFieldValue('dictStyle'),
        styleDesc:getFieldValue('styleDesc'),
        dictName:getFieldValue('dictName'),
        dictCode:getFieldValue('dictCode'),
        action:'edit',
        dictId:this._currentRow.get('dictId')
      })
    }
  },
  handleSearchTableData(){
    this.props.getWorkspaceData('dict',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },
  renderAddDictModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    return (
      <Modal title='添加字典' visible={true} onCancel={this.handleCloseAddDictModal.bind(this,type)}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddDictModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('dictStyle')&&!getFieldValue('dictName')&&!getFieldValue('dictCode')}
        onClick={type=='edit'?this.handleEditDict:this.handleAddDict}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='字段类型'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='dictStyle'>
            {getFieldDecorator('dictStyle', {
              rules: [{ required: true, message: '输入字段类型' },{max:10,message:'输入不超过10个字'}],
            })(
              <Input placeholder="输入不超过10个字"/>
            )}
            </FormItem>
            <FormItem
            label='类型描述'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='styleDesc'>
            {getFieldDecorator('styleDesc', {
              rules: [{max:50,message:'输入不超过50个字'}],
            })(
              <Input placeholder="输入不超过50个字"/>
            )}
            </FormItem>
            <FormItem
            label='字段名'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='dictName'>
            {getFieldDecorator('dictName', {
              rules: [{ required: true, message: '输入字段名' },{max:30,message:'输入不超过30个字'}],
            })(
              <Input placeholder="输入不超过30个字"/>
            )}
            </FormItem>
            <FormItem
            label='字段值'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='dictCode'>
            {getFieldDecorator('dictCode', {
              rules: [{ required: true, message: '输入字段值' },{max:2,message:'输入不超过两位'}],
            })(
              <Input placeholder="输入不超过两位"/>
            )}
            </FormItem>
          </Form>
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
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/dict/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={()=>{this.setState({showAddDictModal:true})}}>新建</Button>:<div> </div>}<Search style={{width:'260px'}} placeholder="请输入年级名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('dict',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              showQuickJumper:true,
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('dict',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr)
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.state.showAddDictModal?this.renderAddDictModal('create'):null}
        {this.state.showEditDictModal?this.renderAddDictModal('edit'):null}
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
    addDict:bindActionCreators(addDict,dispatch),
    editDict:bindActionCreators(editDict,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(DictPage))
