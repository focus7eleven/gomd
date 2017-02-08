import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,addGrade,editGrade} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import styles from './GradePage.scss'
import _ from 'lodash'
import config from '../../../config'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
const confirm = Modal.confirm


const GradePage = React.createClass({
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
    }
  },

  getDefaultProps(){
    return {}
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
    fetch(config.api.phase.phaseList.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this._phaseList = fromJS(res)
    })
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '名称',
      dataIndex: 'gradeName',
      key: 'gradeName',
      className:styles.tableColumn,
    },{
      title: '别称',
      dataIndex: 'gradeNickName',
      key: 'gradeNickName',
      className:styles.tableColumn,
    },{
      title: '学段',
      dataIndex: 'phaseName',
      key: 'phaseName',
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
              <Button type="primary" className={styles.editButton} onClick={this.handleShowEditGradeModal.bind(this,record.key)}>编辑</Button>
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
        that.props.editGrade({
          gradeId:currentRow.get('gradeId'),
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
          showAddGradeModal:false
        })
        break;
      case 'edit':
        this.setState({
          showEditGradeModal:false
        })
      default:

    }
  },
  handleShowEditGradeModal(key){
    console.log(key)
    const {setFieldsValue} = this.props.form
    this._currentRow = this.props.workspace.get('data').get('result').get(key)
    this.setState({
      showEditGradeModal:true
    },()=>{
      setFieldsValue({
        gradeName:this._currentRow.get('gradeName'),
        gradeNickName:this._currentRow.get('gradeNickName'),
        phaseName:this._currentRow.get('phaseCode'),
      })
    })

  },
  handleAddGrade(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('gradeName'),getFieldError('gradeNickName'),getFieldError('phaseName')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.addGrade({
        gradeName:getFieldValue('gradeName'),
        gradeNickName:getFieldValue('gradeNickName'),
        phaseCode:getFieldValue('phaseName')
      })
    }
  },
  handleEditGrade(){
    const {getFieldValue,getFieldError} = this.props.form
    let errors = [getFieldError('gradeName'),getFieldError('gradeNickName'),getFieldError('phaseName')]
    if(!errors.reduce((pre,cur)=>pre||cur,false)){
      this.props.editGrade({
        gradeName:getFieldValue('gradeName'),
        gradeNickName:getFieldValue('gradeNickName'),
        phaseCode:getFieldValue('phaseName'),
        action:'edit',
        gradeId:this._currentRow.get('gradeId')
      })
    }
  },
  renderAddGradeModal(type){
    const {getFieldDecorator,getFieldValue} = this.props.form
    return (
      <Modal title='添加年级' visible={true} onCancel={this.handleCloseAddGradeModal.bind(this,type)}
      footer={[
        <Button key='cancel' type='ghost' onClick={this.handleCloseAddGradeModal.bind(this,type)}>取消</Button>,
        <Button key='ok' type='primary'
        disabled={!getFieldValue('gradeName')&&!getFieldValue('phaseName')}
        onClick={type=='edit'?this.handleEditGrade:this.handleAddGrade}>确认</Button>
      ]}
      >
        <div>
          <Form>
            <FormItem
            label='年级名称'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='gradeName'>
            {getFieldDecorator('gradeName', {
              rules: [{ required: true, message: '输入年级名称' },{max:10,message:'输入不超过10个字'}],
            })(
              <Input placeholder="输入不超过10个字"/>
            )}
            </FormItem>
            <FormItem
            label='学段'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='phaseName'>
            {getFieldDecorator('phaseName', {
              rules: [{ required: true, message: '选择学段' }],
            })(
              <Select placeholder='选择学段' style={{ width: 244 }} onChange={this.handleSelectPhase}>
                {
                  this._phaseList.map(v => (
                    <Option key={v.get('phase_code')} value={v.get('phase_code')} title={v.get('phase_name')}>{v.get('phase_name')}</Option>
                  ))
                }
              </Select>
            )}
            </FormItem>
            <FormItem
            label='年级别称'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            key='gradeNickName'>
            {getFieldDecorator('gradeNickName', {
              rules: [{ max:10, message: '输入不超过10个字' }],
            })(
              <Input placeholder='输入不超过10个字'/>
            )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },

  //搜索框输入的change事件
  handleSearchTableData(value){
    this.props.getWorkspaceData('grade',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  render(){
    const tableData = this.getTableData()

    const {workspace} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/grade/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={()=>{this.setState({showAddGradeModal:true})}}>新建</Button>:<div> </div>}<Search style={{width: '260px'}} placeholder="请输入年级名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('grade',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              showQuickJumper:true,
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('grade',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr)
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.state.showAddGradeModal?this.renderAddGradeModal('create'):null}
        {this.state.showEditGradeModal?this.renderAddGradeModal('edit'):null}
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
    addGrade:bindActionCreators(addGrade,dispatch),
    editGrade:bindActionCreators(editGrade,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(GradePage))
