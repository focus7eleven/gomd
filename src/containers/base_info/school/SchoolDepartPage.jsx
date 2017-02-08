import React from 'react'
import styles from './SchoolDepartPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Row,Col,Upload,Select,DatePicker,Icon,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {setStaff,getLeaderList,getMemberList,getSchoolUserList,addSchoolDepart,editSchoolDepart,getWorkspaceData} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../../reducer/menu'
import _ from 'lodash'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm
const Option = Select.Option;

const SchoolDepartPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  _departmentId: 0,

  getInitialState(){
    return {
      searchStr: "",
      modalType: "",
      modalVisibility: false,
      staffModalType: "",
      staffModalVisibility: false,
      selectedStaff: [],
      selectedRecord: [],
      intersection: [],
      rowsChanged: false,
      searchUserId: "",
      searchTeacherName: "",
      modalData: [],
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'schoolDepart')
    }
    let formData = new FormData()
    formData.append("filter","");
    this.props.getSchoolUserList(formData);
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '机构名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
      className:styles.tableColumn,
    },{
      title: '职能',
      dataIndex: 'function',
      key: 'function',
      className:styles.tableColumn,
    },{
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      className:styles.tableColumn,
    },{
      title: '负责人',
      dataIndex: 'leaderCount',
      key: 'leaderCount',
      className:styles.tableColumn,
      render: (text, record) => {
        return <a onClick={this.handleStaffModalDisplay.bind(null,true,"leader",record.key)}><Icon type="edit" /> 领导个数：{text}</a>
      }
    },{
      title: '机构成员',
      dataIndex: 'memberCount',
      key: 'memberCount',
      className:styles.tableColumn,
      render: (text, record) => {
        return <a onClick={this.handleStaffModalDisplay.bind(null,true,"member",record.key)}><Icon type="edit" /> 成员个数：{text}</a>
      }
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      className:styles.tableColumn,
    }])
    tableHeader = tableHeader.concat(authList.filter(v => (v.get('authUrl').split('/')[2] != 'import')&&(v.get('authUrl').split('/')[2] != 'view')&&(v.get('authUrl').split('/')[2] != 'add')).map( v => {
      return {
        title: PermissionDic[v.get('authUrl').split('/')[2]],
        dataIndex: v.get('authUrl').split('/')[2],
        key: v.get('authUrl').split('/')[2],
        className:styles.editColumn,
        render:(text,record) => {
          return (
            <div>
              <Button data-visible={true} data-modaltype={record.key} className={styles.editButton} type="primary" onClick={this.handleModalDispaly}>编辑</Button>
              <Button className={styles.deleteButton} type="primary" onClick={this.handleDeleteRecord.bind(this,record.key)}>删除</Button>
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

  handleStaffModalDisplay(visibility,type,id){
    this._schoolUserList = this.props.workspace.get('schoolUserList');
    if(type=="leader"){
      const userList = this.props.workspace.get('schoolUserList');
      this._departmentId = this.props.workspace.get('data').get('result').get(id).get('departmentId');
      this.props.getLeaderList(this._departmentId,"").then((res)=>{
        const leaderList = res.data;
        const intersection = _.intersectionWith(userList,leaderList,(a,b)=>a.userId===b.userId);
        const selected = intersection.map((item)=>item.userId)
        this.setState({modalData: this._schoolUserList,selectedStaff:selected,intersection,staffModalType:type,staffModalVisibility:visibility});
      });
    }else if(type=="member"){
      const userList = this.props.workspace.get('schoolUserList');
      this._departmentId = this.props.workspace.get('data').get('result').get(id).get('departmentId');
      this.props.getMemberList(this._departmentId,"").then((res)=>{
        const memberList = res.data;
        const intersection = _.intersectionWith(userList,memberList,(a,b)=>a.userId===b.userId);
        const selected = intersection.map((item)=>item.userId)
        this.setState({modalData: this._schoolUserList,selectedStaff:selected,intersection,staffModalType:type,staffModalVisibility:visibility});
      });
    }else{
      this.setState({staffModalType:type,staffModalVisibility:visibility});
    }
  },

  handleSetStaff(){
    const {intersection,selectedRecord,staffModalType,rowsChanged} = this.state;
    if(!rowsChanged){
      this.setState({staffModalVisibility: false});
    }else {
      const changeList = _.xorWith(intersection,selectedRecord,(a,b)=>a.userId===b.userId);
      let removeList = [];
      let addList = [];
      changeList.map((item)=>{
        if(_.indexOf(intersection,item)>=0){
          removeList.push(item.userId);
        }else{
          addList.push(item.userId);
        }
      })
      let formData = new FormData();
      formData.append('departmentId',this._departmentId);
      formData.append('addList',addList.join(","));
      formData.append('removeList',removeList.join(","));
      const result = this.props.setStaff(formData,staffModalType==="leader"?"Leader":"Member");
      let visibility = true;
      result.then((res)=>{
        if(res!=="error"){
          visibility = false;
        }
      })
      this.setState({staffModalVisibility: visibility})
    }
  },

  onSearchUserId(value){
    const {searchUserId} = this.state;
    const reg = new RegExp(searchUserId, 'gi');
    this.setState({
      userIdDropdownVisible: false,
      modalData: this._schoolUserList.map((record) => {
        const match = record.userId.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          userId: (
            <span>
              {record.userId.split(reg).map((text, i) => (
                i > 0 ? [<span className={styles.highlight}>{match[0]}</span>, text] : text
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  },

  onUserIdInputChange(e) {
    this.setState({searchUserId: e.target.value});
  },

  onSearchTeacherName(value){
    const {searchTeacherName} = this.state;
    const reg = new RegExp(searchTeacherName, 'gi');
    this.setState({
      teacherNameDropdownVisible: false,
      modalData: this._schoolUserList.map((record) => {
        const match = record.name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          name: (
            <span>
              {record.name.split(reg).map((text, i) => (
                i > 0 ? [<span className={styles.highlight}>{match[0]}</span>, text] : text
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  },

  onTeacherNameInputChange(e) {
    this.setState({searchTeacherName: e.target.value});
  },

  renderStaffModal(){
    const {searchTeacherName,teacherNameDropdownVisible,searchUserId,userIdDropdownVisible,staffModalType,staffModalVisibility,selectedStaff,modalData} = this.state
    const columns = [{
      title: '教师编号',
      dataIndex: 'userId',
      filterDropdown: (
        <div className={styles.customFilterDropdown}>
          <Search
            className={styles.filterInput}
            placeholder="请输入教师编号"
            value={searchUserId}
            onSearch={this.onSearchUserId}
            onChange={this.onUserIdInputChange}
          />
        </div>
      ),
      filterDropdownVisible: userIdDropdownVisible,
      onFilterDropdownVisibleChange: visible => this.setState({userIdDropdownVisible: visible}),
    },{
      title: '教师姓名',
      dataIndex: 'name',
      filterDropdown: (
        <div className={styles.customFilterDropdown}>
          <Search
            className={styles.filterInput}
            placeholder="请输入教师姓名"
            value={searchTeacherName}
            onSearch={this.onSearchTeacherName}
            onChange={this.onTeacherNameInputChange}
          />
        </div>
      ),
      filterDropdownVisible: teacherNameDropdownVisible,
      onFilterDropdownVisibleChange: visible => this.setState({teacherNameDropdownVisible: visible}),
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedStaff: selectedRowKeys, selectedRecord: selectedRows,rowsChanged: true});
      },
      selectedRowKeys: selectedStaff,
    };
    const data = modalData.length>=0?modalData.map((v,key) => {
      return {
        key: v.userId,
        name: v.name,
        userId: v.userId,
      }
    }):[];
    return (
      <Modal title={staffModalType==="leader"?"设置领导人":"设置成员"} visible={staffModalVisibility}
        onOk={this.handleSetStaff} onCancel={this.handleStaffModalDisplay.bind(null,false,"",null)}
      >
        <div>
          <Table pagination={false} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>

      </Modal>
    )
  },

  handleAddRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('departmentName',values.departmentName)
        formData.append('phone',values.phone)
        formData.append('function',values.function)
        formData.append('remark',values.remark)
        const result = this.props.addSchoolDepart(formData)
        let visibility = true;
        result.then((res)=>{
          if(res!=="error"){
            visibility = false;
          }
        })
        this.setState({modalVisibility: visibility})
      }
    });
  },

  handleSearchStrChanged(e){
    this.setState({searchStr: e.target.value});
  },

  handleSearchTableData(value){
    this.props.getWorkspaceData('schoolDepart',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  handleEditRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('departmentId',this._currentRow.get('departmentId'))
        formData.append('action',"edit")
        formData.append('departmentName',values.departmentName)
        formData.append('phone',values.phone)
        formData.append('function',values.function)
        formData.append('remark',values.remark)
        const result = this.props.editSchoolDepart(formData)
        let visibility = true;
        result.then((res)=>{
          if(res!=="error"){
            visibility = false;
          }
        })
        this.setState({modalVisibility: visibility});
      }
    });
  },

  handleDeleteRecord(key){
    const departmentId = this.props.workspace.get('data').get('result').get(key).get('departmentId')
    const that = this
    let formData = new FormData()
    formData.append('departmentId',departmentId)
    formData.append('action',"delete")
    confirm({
      title: '你先删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editSchoolDepart(formData)
      },
      onCancel() {},
    });
  },

  handleModalDispaly(evt){
    const visibility = evt.currentTarget.getAttribute("data-visible")==="true"?true:false;
    const type = evt.currentTarget.getAttribute('data-modaltype');
    if(type==='add'){
      this.props.form.resetFields();
      this.setState({modalVisibility: visibility,modalType: type});
    }else if(!visibility){
      this.setState({modalVisibility: visibility,modalType: type});
    }else{
      const {setFieldsValue} = this.props.form
      this._currentRow = this.props.workspace.get('data').get('result').get(type)
      setFieldsValue({
        'departmentName':this._currentRow.get('departmentName'),
        'phone':this._currentRow.get('phone'),
        'function':this._currentRow.get('function'),
        'remark':this._currentRow.get('remark'),
      })
      this.setState({modalVisibility: visibility,modalType: 'edit'});
    }
  },

  renderModal(){
    const { getFieldDecorator } = this.props.form;
    const { modalType, modalVisibility } = this.state;
    const formItemLayout = {labelCol:{span:5},wrapperCol:{span:12}};
    return (
      <Modal title={modalType==="add"?"添加学校机构":"编辑学校机构"} visible={modalVisibility}
          onOk={modalType==="add"?this.handleAddRecord:this.handleEditRecord} data-visible={false} data-modaltype="" onCancel={this.handleModalDispaly}
        >
        <div>
          <Form>
            <Row>
              <Col span={24}>
                <FormItem
                  label="机构名称"
                  {...formItemLayout}
                  key='departmentName'
                >
                  {
                    getFieldDecorator('departmentName', {
                      rules: [{required: true,message: "机构名称不能为空"},{
                        validator(rule, value, callback, source, options) {
                          var errors = [];
                          if(value && value.length > 20){
                            errors.push(
                              new Error('姓名应不超过20个字')
                            )
                          }
                          callback(errors);
                        }
                      }],
                    })(<Input placeholder='输入不超过20个字'/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="职能"
                  {...formItemLayout}
                  key='function'
                >
                  {
                    getFieldDecorator('function', {initialValue: "",
                      rules: [{max:200, message: '输入不超过200个字' }],
                    })(<Input type="textarea" placeholder='输入不超过200个字' rows={3}/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="电话"
                  {...formItemLayout}
                  key='phone'
                >
                  {
                    getFieldDecorator('phone', {
                      rules: [{
                        validator(rule, value, callback, source, options) {
                          var errors = [];
                          if(value && value.length > 15){
                            errors.push(
                              new Error('电话应不超过15位')
                            )
                          }
                          callback(errors);
                        }
                      }],
                    })(<Input placeholder='输入不超过15位'/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="备注"
                  {...formItemLayout}
                  key='remark'
                >
                  {
                    getFieldDecorator('remark', {initialValue: "",
                      rules: [{max:50, message: '输入不超过50个字' }],
                    })(<Input type="textarea" placeholder='输入不超过50个字' rows={3}/>)
                  }
                </FormItem>
              </Col>
            </Row>
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
              this._currentMenu.get('authList').find((v)=>v.get('authName')=='增加') ?
              <Button data-visible={true} data-modaltype="add" type="primary" className={styles.operationButton} onClick={this.handleModalDispaly}>
                新建
              </Button>:null
            }
          </div>
          <Search style={{width:'260px'}} placeholder="请输入学校机构名称" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
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
                      this.props.getWorkspaceData('schoolDepart',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
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
        {this.renderStaffModal()}
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
    addSchoolDepart: bindActionCreators(addSchoolDepart,dispatch),
    editSchoolDepart: bindActionCreators(editSchoolDepart,dispatch),
    getSchoolUserList: bindActionCreators(getSchoolUserList,dispatch),
    getMemberList: bindActionCreators(getMemberList,dispatch),
    getLeaderList: bindActionCreators(getLeaderList,dispatch),
    setStaff: bindActionCreators(setStaff,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(SchoolDepartPage))
