import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import { connect} from 'react-redux'
import { findMenuInTree,findPath} from '../../../reducer/menu'
import {fromJS,List,Map} from 'immutable'
import { getWorkspaceData,addPhase,editPhase,deletePhase,addPhaseSubject } from '../../../actions/workspace'
import {bindActionCreators} from 'redux'
import _ from 'lodash'
import config from '../../../config'
import styles from './PhasePage.scss'


const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

const PhasePage = React.createClass({
  //当前所在的三级菜单
  _currentMenu:Map({
    authList:List()
  }),
  //学段列表，用户判断新家学段的编号是否重复
  _phaseList:[],
  //所有的学科列表
  _subjectList:[],

  getInitialState(){
    return {
      searchStr:'',
      phaseSubjectList:[]
    }
  },

  getDefaultProps(){
    return {}
  },
  //life cycle
  componentWillMount(){
    //当menu数据不为空的时候，找到当前menu
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'phase')
    }
  },
  componentWillReceiveProps(nextProps){
    //当mnue数据不为空的时候，找到当前menu
    if(!nextProps.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(nextProps.menu.get('data'),'phase')
    }
  },
  componentDidMount(){
    //组件挂载的时候获取所有学科的列表
    fetch(config.api.subject.subjectList.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      }
    }).then(res => {return res.json()}).then(res => {
      this._subjectList = res
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
  //生成表格数据
  getTableData(){
    let {type} = this.props.router.params
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '学段编号',
      dataIndex: 'phase_code',
      key: 'phase_code',
      className:styles.tableColumn,
    },{
      title: '学段名称',
      dataIndex: 'phase_name',
      key: 'phase_name',
      className:styles.tableColumn,
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      className:styles.tableColumn,
    },{
      title: '所属学科',
      dataIndex: 'subjectStr',
      key: 'subjectStr',
      className:styles.tableColumn,
    }])
    if(authList.some(v => v.get('authUrl')=='/subject/list')){
      tableHeader = tableHeader.push({
        title: PermissionDic['list'],
        dataIndex: 'list',
        key: 'list',
        className:styles.listColumn,
        // render:(text,record) => <Button type="primary" style={{backgroundColor:'#30D18E',borderColor:'#30D18E'}} onClick={this.handleShowAddSubjectModal.bind(this,record.key)}>{PermissionDic['list']}</Button>
        render:(text,record) => <a onClick={this.handleShowAddSubjectModal.bind(this,record.key)} >{PermissionDic['list']}</a>
      })
    }
    if(authList.some(v => v.get('authUrl')=='/phase/edit')){
      tableHeader = tableHeader.push({
        title: PermissionDic['edit'],
        dataIndex: 'edit',
        key: 'edit',
        className:styles.editColumn,
        render:(text,record) => (
          <div>
            <Button type="primary" className={styles.editButton} onClick={this.handleShowEditPhaseModal.bind(this,record.key)}>编辑</Button>
            <Button type="primary" className={styles.deleteButton} onClick={this.handleShowDeleteModal.bind(this,record.key)}>删除</Button>
          </div>
        )
      })
    }
    tableBody = !this.props.workspace.get('data').isEmpty()?this.props.workspace.get('data').get('result').map( (v,key) => {
      return {
        key:key,
        ...(v.toJS())
      }
    }):List()
    //构造表格数据结构
    return {
      tableHeader:tableHeader.toJS(),
      tableBody:tableBody.toJS(),
    }
  },
  handleShowDeleteModal(key){
    const that = this
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    Modal.confirm({
    title: '你要删除该记录吗',
    content: '删除不可恢复',
    onOk() {
      that.props.deletePhase({
        phaseCode:currentRow.get('phase_code'),
      })
    },
    onCancel() {},
  });
  },
  //搜索框输入的change事件
  handleSearchTableData(value){
    this.props.getWorkspaceData('phase',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },
  //显示编辑学段对话框
  handleShowEditPhaseModal(key){
    const {setFieldsValue} = this.props.form
    const currentRow = this.props.workspace.get('data').get('result').get(key)

    this.setState({
      showEditPhaseModal:true,
    },()=>{
      setFieldsValue({
        'phaseId':currentRow.get('phase_code'),
        'phaseName':currentRow.get('phase_name'),
        'remark':currentRow.get('remark'),
      })
    })
  },
  //控制显示添加学段对话框
  handleShowAddPhaseModal(){
    this.props.form.resetFields();
    this._phaseList.length==0?fetch(config.api.phase.phaseList.get,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this._phaseList = res
      this.setState({
        showAddPhaseModal:true
      })
    }):this.setState({
      showAddPhaseModal:true
    })
  },
  //添加学段
  handleAddPhase(){
    const {getFieldValue,getFieldError} = this.props.form
    if(getFieldValue('phaseId') && getFieldValue('phaseName') && !(getFieldError('phaseId') || getFieldError('phaseName'))){
      this.props.addPhase({
        phaseCode:getFieldValue('phaseId'),
        phaseName:getFieldValue('phaseName'),
        remark:getFieldValue('remark')
      })
      this.setState({
        showAddPhaseModal:false
      })
    }
  },
  //关闭对话框
  handleAddPhaseModalCancel(type){
    switch (type) {
      case 'edit':
        this.setState({
          showEditPhaseModal:false
        })
        break;
      case 'create':
        this.setState({
          showAddPhaseModal:false
        })
      default:

    }
  },
  //编辑学段
  handleEditPhase(){
    const {getFieldValue,getFieldError} = this.props.form
    if(getFieldValue('phaseId') && getFieldValue('phaseName') && !(getFieldError('phaseId') || getFieldError('phaseName'))){
      this.props.editPhase({
        phaseCode:getFieldValue('phaseId'),
        phaseName:getFieldValue('phaseName'),
        remark:getFieldValue('remark')
      })
      this.setState({
        showAddPhaseModal:false
      })
    }
  },
  //添加学段对应的学科
  handleShowAddSubjectModal(key){
    const {setFieldsValue} = this.props.form
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    //获取学段对应的学科列表
    fetch(config.api.phase.subjectList.get(currentRow.get('phase_code')),{
      method:'get',
      headers:{
        'from':'NODEJS',
        'token':sessionStorage.getItem('accessToken'),
      }
    }).then(res => res.json()).then(res => {
      this._phaseSubjectList = res
      this.setState({
        showAddSubjectModal:true,
        phaseSubjectList:res
      })
    })
    setFieldsValue({
      'phase_code':currentRow.get('phase_code')
    })
  },
  //选择某一个学段
  handleSelectSubject(value){
    this._phaseSubjectList = value
    this.setState({
      phaseSubjectList:value
    })
  },
  //添加一个学科
  handleAddSubject(){
    const {getFieldValue} = this.props.form
    this.props.addPhaseSubject({
      phaseCode:getFieldValue('phase_code'),
      subjectIds:this.state.phaseSubjectList,
    })
  },
  //渲染对话框
  renderAddPhaseModal(type){
    const { getFieldDecorator } = this.props.form;
    const phaseList = this._phaseList
    const authList = this._currentMenu.get('authList').map(v => v.get('authUrl'))
    return (
      <Modal title="添加学段" visible={true}
          onOk={this.handleAddPhase} onCancel={this.handleAddPhaseModalCancel.bind(this,type)}
          footer={[
            <div key='footer'>
              <Button key='cancel' type='ghost' onClick={this.handleAddPhaseModalCancel.bind(this,type)}>取消</Button>
              <Button key='ok' type='primary' onClick={type=='edit'?this.handleEditPhase:this.handleAddPhase}>确认</Button>
            </div>
          ]}
        >
        <div className={styles.addPhaseModal}>
          <Form>
            {
              type=='edit'?null:<FormItem
                label='学段编号'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
                key='phaseId'
              >
              {
                getFieldDecorator('phaseId', {
                  rules: [{ required: true, message: '请填写学段编号' },{
                    validator(rule, value, callback, source, options) {
                      var errors = [];
                      // test if email address already exists in a database
                      // and add a validation error to the errors array if it does
                      if(_.some(phaseList,v => v['phase_code']==value)){
                        errors.push(
                          new Error('学段编号重复')
                        )
                      }
                      if(isNaN(value) || value.length != 2){
                        errors.push(
                          new Error('学段号必须是2位数字')
                        )
                      }
                      callback(errors);
                    }
                  }],
                })(<Input placeholder='学段号必须是2位数字'/>)
              }
              </FormItem>
            }
            <FormItem
              label="学段名称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='pahseName'
            >
            {
              getFieldDecorator('phaseName', {
                rules: [{ required: true, message: '请输入学段名称' },{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    // test if email address already exists in a database
                    // and add a validation error to the errors array if it does
                    if(value.length >= 10){
                      errors.push(
                        new Error('学段名称小于10个字')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input placeholder='输入不超过10个字'/>)
            }
            </FormItem>
            <FormItem
              label="备注"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='remark'
            >
            {
              getFieldDecorator('remark', {
                rules: [{max:40, message: '输入不超过40个字' }],
              })(<Input type="textarea" placeholder='输入不超过40个字' rows={3}/>)
            }
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },
  renderAddSubjectModal(){
    return (
      <Modal
        title='添加学段学科'
       visible={true} onOk={this.handleAddSubject} onCancel={()=>{this.setState({showAddSubjectModal:false})}}>
        <div className={styles.phaseSubject}>
          <Select multiple style={{ width: '100%' }} onChange={this.handleSelectSubject} value={this.state.phaseSubjectList}>
            {
              this._subjectList.map((v,key )=> (
                <Option key={key} title={v.text} value={v.id}>{v.text}</Option>
              ))
            }
          </Select>
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
          {this._currentMenu.get('authList').some(v => v.get('authUrl')=='/phase/add')?<Button type="primary" style={{backgroundColor:'#FD9B09',borderColor:'#FD9B09'}} onClick={this.handleShowAddPhaseModal}>新建</Button>:<div> </div>}<Search style={{width: '260px'}} placeholder="请输入学段名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow} bordered columns={tableData.tableHeader} dataSource={tableData.tableBody}
            pagination={!this.props.workspace.get('data').isEmpty()?{
              total:this.props.workspace.get('data').get('totalCount'),
              pageSize:this.props.workspace.get('data').get('pageShow'),
              current:this.props.workspace.get('data').get('nowPage'),
              onChange:(page)=>{
                this.props.getWorkspaceData('phase',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
              },
              showQuickJumper:true,
              onShowSizeChange:(current,size)=>{
                this.props.getWorkspaceData('phase',this.props.workspace.get('data').get('nowPage'),size,this.state.searchStr)
              }
            }:null} />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.state.showAddPhaseModal?this.renderAddPhaseModal('create'):null}
        {this.state.showEditPhaseModal?this.renderAddPhaseModal('edit'):null}
        {this.state.showAddSubjectModal?this.renderAddSubjectModal():null}
      </div>
    )
  }
})
function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    workspace:state.get('workspace')
  }
}
function mapDispatchToProps(dispatch){
  return {
    getWorkspaceData:bindActionCreators(getWorkspaceData,dispatch),//获取表格数据
    addPhase:bindActionCreators(addPhase,dispatch),//添加学段
    editPhase:bindActionCreators(editPhase,dispatch),//编辑学段
    deletePhase:bindActionCreators(deletePhase,dispatch),//删除学段
    addPhaseSubject:bindActionCreators(addPhaseSubject,dispatch),//添加学科
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(PhasePage))
