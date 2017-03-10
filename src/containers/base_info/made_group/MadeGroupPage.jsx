import React from 'react'
import styles from './MadeGroupPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Radio,Icon,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {editGroupStaff,getGroupStaff,addMadeGroup,getWorkspaceData} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../../reducer/menu'
import config from '../../../config.js'
import _ from 'lodash'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item
const Search = Input.Search

const MadeGroupPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState(){
    return {
      searchStr: "",
      searchMemberStr: "",
      modalVisibility: false,
      modalType: "",
      memberType: "teacher",
      memberIndex: [],
      memberList: [],
      memberModalVisibility: false,
    }
  },

  componentWillMount(){
    // this.props.getGroupStaff('teacher','');
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'madegroup')
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '名称',
      dataIndex: 'groupName',
      key: 'groupName',
      className:styles.tableColumn,
    },{
      title: '类型',
      dataIndex: 'groupTypeName',
      key: 'groupTypeName',
      className:styles.tableColumn,
    },{
      title: '学校',
      dataIndex: 'schoolName',
      key: 'schoolName',
      className:styles.tableColumn,
    },{
      title: '描述',
      dataIndex: 'groupDesc',
      key: 'groupDesc',
      className:styles.tableColumn,
    },{
      title: '人员',
      dataIndex: 'memberCount',
      key: 'memberCount',
      className:styles.tableColumn,
      render: (text, record) => {
        return (
          <a onClick={this.handleMemberModalVisibility.bind(null,true,record.groupId)}>群组人数：{text}</a>
        )
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
              <Button className={styles.editButton} type="primary" onClick={this.handleModalDispaly.bind(this,true,record.key)}>编辑</Button>
              <Button className={styles.deleteButton} type="primary" onClick={this.handleDeleteGroup.bind(this,record.key)}>删除</Button>
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

  handleAddGroup(){
    const {getFieldValue,getFieldError} = this.props.form
    if(getFieldValue('groupName') && !(getFieldError('groupName') || getFieldError('groupDesc'))){
      this.props.addMadeGroup({
        groupName:getFieldValue('groupName'),
        groupDesc:getFieldValue('groupDesc'),
      })
      this.setState({
        modalVisibility:false
      })
    }
  },

  handleSearchStrChanged(e){
    this.setState({searchStr: e.target.value});
  },

  handleSearchTableData(value){
    this.props.getWorkspaceData('madegroup',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  handleSearchMemberStrChanged(e){
    this.setState({searchMemberStr: e.target.value});
  },

  handleSearchMember(value){
    const {memberType,searchMemberStr} = this.state
    this.props.getGroupStaff(memberType,searchMemberStr);
  },

  handleEditGroup(key){
    console.log(key);
  },

  handleDeleteGroup(key){
    console.log(key);
  },

  handleModalDispaly(visibility,type){
    if(type==='add'){
      this.props.form.resetFields();
      this.setState({modalVisibility: visibility,modalType: type});
    }else if(type===''){
      this.setState({modalVisibility: visibility,modalType: type});
    }else{
      const {setFieldsValue} = this.props.form
      this._currentRow = this.props.workspace.get('data').get('result').get(type)
      setFieldsValue({
        'groupName':this._currentRow.get('groupName'),
        'groupDesc':this._currentRow.get('groupDesc'),
      })
      this.setState({modalVisibility: visibility,modalType: 'edit'});
    }
  },

  handleMemberModalVisibility(visibility,key){
    if(visibility){
      this.props.getGroupStaff('teacher','');
      this._groupId = key
      fetch(config.api.group.getCurrentGroupMember(this._groupId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then((json)=>{
        const memberIndex = json.map((item)=>item.userId)
        this.setState({memberIndex,memberList:json,memberType:'teacher',memberModalVisibility:visibility})
      })
    }else{
      this.setState({memberModalVisibility:visibility})
    }
  },

  handleMemberConfirm(){
    const {memberIndex} = this.state
    let formData = new FormData()
    formData.append('groupId',this._groupId)
    formData.append('addList',memberIndex)
    this.editGroupStaff(formData)
    this.setState({memberModalVisibility:false})
  },

  handleMemberTypeChanged(e){
    const value = e.target.value;
    this.setState({memberType: value})
  },

  renderMemberModal(){
    const {memberIndex,memberList,memberType,memberModalVisibility} = this.state
    console.log("current: ",memberList);
    const teacherList = this.props.workspace.get('groupTeacher')
    const patriarchList = this.props.workspace.get('groupPatriarch')
    const columns = [{
      title: '用户编号',
      dataIndex: 'userCode',
    },{
      title: '姓名',
      dataIndex: 'realName',
    },{
      title: '电话号码',
      dataIndex: 'phoneNum',
    }];
    let dataList = memberType === 'teacher' ? teacherList.toJS() : patriarchList.toJS();
    dataList = _.unionBy(memberList,dataList,'userId')

    const data = dataList.length>=0?dataList.map((v,key) => {
      return {
        key: v.userId,
        userId: v.userId,
        userCode: v.userCode,
        realName: v.realName,
        phoneNum: v.phoneNum,
      }
    }):[];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({memberIndex: selectedRowKeys, memberList: selectedRows});
      },
      selectedRowKeys: memberIndex,
    };
    return (
      <Modal title="群组人员" visible={memberModalVisibility} maskClosable={false}
        onOk={this.handleMemberConfirm} onCancel={this.handleMemberModalVisibility.bind(null,false,'')}>
        <div>
          <div className={styles.modalHeader}>
            <RadioGroup onChange={this.handleMemberTypeChanged} value={memberType} defaultValue="teacher">
              <RadioButton value="teacher">教师</RadioButton>
              <RadioButton value="patriarch">家长</RadioButton>
            </RadioGroup>
            <Search style={{width:'200px'}} placeholder="请输入人员姓名" value={this.state.searchMemberStr} onChange={this.handleSearchMemberStrChanged} onSearch={this.handleSearchMember} />
          </div>
          <Table pagination={false} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
      </Modal>
    )
  },

  renderModal(){
    const {modalVisibility,modalType} = this.state
    const {getFieldDecorator} = this.props.form
    return (
      <Modal title={modalType==="add"?"添加群组":"编辑群组"} visible={modalVisibility}
          onOk={modalType==="add"?this.handleAddGroup:this.handleEditGroup} onCancel={this.handleModalDispaly.bind(this,false,'')}
        >
        <div>
          <Form>
            {
              <FormItem
                label='群组名称'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
                key='groupName'
              >
              {
                getFieldDecorator('groupName', {
                  rules: [{ required: true, message: '请填写群组名称' },{
                    validator(rule, value, callback, source, options) {
                      var errors = [];
                      if(value.length > 20){
                        errors.push(
                          new Error('群组名称应不超过20个字')
                        )
                      }
                      callback(errors);
                    }
                  }],
                })(<Input placeholder='输入不超过20个字'/>)
              }
              </FormItem>
            }
            <FormItem
              label="群组描述"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              key='groupDesc'
            >
            {
              getFieldDecorator('groupDesc', {
                rules: [{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if(value.length > 100){
                      errors.push(
                        new Error('群组描述应不超过100个字')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input type="textarea" placeholder='输入不超过100个字'/>)
            }
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
          <div className={styles.headerOperation}>
            {
              this._currentMenu.get('authList').find((v)=>v.get('authName')=='新增') ?
              <Button data-action="add" type="primary" className={styles.operationButton} onClick={this.handleModalDispaly.bind(this,true,"add")}>
                新建
              </Button>:<div></div>
            }
        </div>
          <Search style={{width:'260px'}} placeholder="请输入群组名称" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <Table
              rowClassName={(record,index)=>index%2?styles.tableDarkRow:styles.tableLightRow}
              bordered
              columns={tableData.tableHeader}
              dataSource={tableData.tableBody}
              pagination={
                !this.props.workspace.get('data').isEmpty() ?
                  {
                    total:this.props.workspace.get('data').get('totalCount'),
                    pageSize:this.props.workspace.get('data').get('pageShow'),
                    current:this.props.workspace.get('data').get('nowPage'),
                    showQuickJumper:true,
                    onChange:(page)=>{
                      this.props.getWorkspaceData('madegroup',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
                    }
                  }
                  :
                  null
                }
              />
            <div className={styles.tableMsg}>当前条目{workspace.get('data').get('start')}-{parseInt(workspace.get('data').get('start'))+parseInt(workspace.get('data').get('pageShow'))}/总条目{workspace.get('data').get('totalCount')}</div>
          </div>
        </div>
        {this.renderModal()}
        {this.renderMemberModal()}
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
    getWorkspaceData: bindActionCreators(getWorkspaceData,dispatch),
    addMadeGroup: bindActionCreators(addMadeGroup,dispatch),
    getGroupStaff: bindActionCreators(getGroupStaff,dispatch),
    editGroupStaff: bindActionCreators(editGroupStaff,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(MadeGroupPage))
