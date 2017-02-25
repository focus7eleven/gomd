import React from 'react'
import styles from './TeacherPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Row,Col,Upload,Select,DatePicker,Icon,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {setTeacherRole,downloadExcel,importExcel,editStaff,addStaff,getWorkspaceData} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import TableComponent from '../../../components/table/TableComponent'
import {findMenuInTree} from '../../../reducer/menu'
import moment from 'moment'
import config from '../../../config.js'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm
const Option = Select.Option;
moment.locale('zh-cn');

const TeacherPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  getInitialState(){
    return {
      searchStr: "",
      modalType: "",
      modalVisibility: false,
      importModalVisibility: false,
      imageUrl: "",
      excelFile: null,
      // 设置角色
      roleModalVisibility: false,
      userRoleList: [],
      roles:[],
      roleChanged: false,
      // 查看教师班级
      classModalVisibility: false,
      teacherClassList: [],
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'teacher')
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '工号',
      dataIndex: 'workNum',
      key: 'workNum',
      className:styles.tableColumn,
    },{
      title: '姓名',
      dataIndex: 'teacherName',
      key: 'teacherName',
      className:styles.tableColumn,
    },{
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      className:styles.tableColumn,
      render: (text, record) => {
        return <a onClick={this.handleRoleModalDispaly.bind(null,true,record.key)}>设置</a>
      }
    },{
      title: '教授学科',
      dataIndex: 'subjectName',
      key: 'subjectName',
      className:styles.tableColumn,
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      className:styles.tableColumn,
      render:(text,record) => {
        return (text=="M"?"男":(text=="F"?"女":""))
      }
    },{
      title: '身份证号',
      dataIndex: 'id',
      key: 'id',
      className:styles.tableColumn,
    },{
      title: '电话1',
      dataIndex: 'phone1',
      key: 'phone1',
      className:styles.tableColumn,
    },{
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      className:styles.tableColumn,
    },{
      title: '班级详情',
      dataIndex: 'classCount',
      key: 'classCount',
      className:styles.tableColumn,
      render: (text,record) => {
        return <a onClick={this.handleClassModalDisplay.bind(null,true,record.key)}>班级个数：{text}</a>
      }
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
              <Button className={styles.editButton} type="primary" onClick={this.handleModalDispaly.bind(this,true,record.key)}>编辑</Button>
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

  handleRoleModalDispaly(visibility,key){
    if(visibility){
      this._teacherUserId = this.props.workspace.get('data').get('result').get(key).get('userId');
      fetch(config.api.staff.getTeacherRole(this._teacherUserId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then((json)=>{
        this.setState({roleModalVisibility: true, roles: json.roles, userRoleList: json.userRoleList})
      })
    }else {
      this.setState({roleModalVisibility: visibility});
    }
  },

  handleSetRole(){
    // Need to be fixed
    console.log(this.state.userRoleList);
    let formData = new FormData();
    formData.append('userId',this._teacherUserId)
    formData.append('roleIds',this.state.userRoleList)
    this.props.setTeacherRole(formData);
  },

  handleClassModalDisplay(visibility,key){
    if(visibility){
      this._teacherUserId = this.props.workspace.get('data').get('result').get(key).get('userId');
      fetch(config.api.staff.getTeacherClass(this._teacherUserId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then((json)=>{
        this.setState({classModalVisibility: visibility,teacherClassList: json})
      })
    }else {
      this.setState({classModalVisibility: visibility});
    }
  },

  handleAddRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('workNum',values.workNum)
        formData.append('teacherName',values.teacherName)
        formData.append('teachYears',values.teachYears)
        formData.append('id',values.id)
        formData.append('sex',values.sex)
        formData.append('phone1',values.phone1)
        formData.append('phone2',values.phone2)
        formData.append('birth',moment(values.birth).format("YYYY/MM/DD"))
        formData.append('homeAddr',values.homeAddr)
        formData.append('email',values.email)
        formData.append('weChat',values.weChat)
        formData.append('qq',values.qq)
        formData.append('userImg',this.state.imageUrl)
        const result = this.props.addStaff(formData,"teacher")
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

  handleSearchStrChanged(e){
    this.setState({searchStr: e.target.value});
  },

  handleSearchTableData(value){
    this.props.getWorkspaceData('teacher',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  handleEditRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('userId',this._currentRow.get('userId'))
        formData.append('action',"edit")
        formData.append('workNum',values.workNum)
        formData.append('teacherName',values.teacherName)
        formData.append('teachYears',values.teachYears)
        formData.append('id',values.id)
        formData.append('sex',values.sex)
        formData.append('phone1',values.phone1)
        formData.append('phone2',values.phone2)
        formData.append('birth',moment(values.birth).format("YYYY/MM/DD"))
        formData.append('homeAddr',values.homeAddr)
        formData.append('email',values.email)
        formData.append('weChat',values.weChat)
        formData.append('qq',values.qq)
        formData.append('userImg',this.state.imageUrl?this.state.imageUrl:"")
        const result = this.props.editStaff(formData,"teacher")
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
    const userId = this.props.workspace.get('data').get('result').get(key).get('userId')
    const that = this
    let formData = new FormData()
    formData.append('userId',userId)
    formData.append('action',"delete")
    confirm({
      title: '确定删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editStaff(formData,"teacher")
      },
      onCancel() {},
    });
  },

  handleImportRecord(){
    this.state.excelFile?this.props.importExcel(this.state.excelFile,"teacher"):null;
  },

  handleImportModalDisplay(visibility){
    this.setState({importModalVisibility: visibility});
  },

  handleModalDispaly(visibility,type){
    if(type==='add'){
      this.props.form.resetFields();
      this.setState({modalVisibility: visibility,modalType: type});
    }else if(type===""){
      this.setState({modalVisibility: visibility,modalType: type});
    }else{
      const {setFieldsValue} = this.props.form
      this._currentRow = this.props.workspace.get('data').get('result').get(type)
      setFieldsValue({
        'workNum':this._currentRow.get('workNum'),
        'teacherName':this._currentRow.get('teacherName'),
        'teachYears':this._currentRow.get('teachYears'),
        'id':this._currentRow.get('id'),
        'sex':this._currentRow.get('sex'),
        'phone1':this._currentRow.get('phone1'),
        'phone2':this._currentRow.get('phone2'),
        'birth':moment(this._currentRow.get('birth')),
        'email':this._currentRow.get('email'),
        'homeAddr':this._currentRow.get('homeAddr'),
        'weChat':this._currentRow.get('weChat'),
        'qq':this._currentRow.get('qq'),
      })
      this.setState({modalVisibility: visibility,modalType: 'edit', imageUrl: this._currentRow.get('userImg')});
    }
  },

  handleAvatarChange(e){
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.addEventListener('load', () => this.setState({imageUrl:reader.result}));
    reader.readAsDataURL(file);
  },

  handleImportFileChange(e){
    const file = e.target.files[0];
    this.setState({excelFile: file});
  },

  handleDownloadExcel(){
    this.props.downloadExcel("teacher");
  },

  renderImportModal(){
    const {importModalVisibility} = this.state;
    return (
      <Modal title="批量导入" visible={importModalVisibility} onOk={this.handleImportRecord} onCancel={this.handleImportModalDisplay.bind(this,false)}>
        <div>
          <h3>导入步骤:</h3>
          <p>1. 点击<a onClick={this.handleDownloadExcel}>下载模板</a></p>
          <p>2. 按模板要求完善导入人员的信息</p>
          <p>3. 选择该文件进行导入</p>
          <input type="file" onChange={this.handleImportFileChange} />
        </div>
      </Modal>
    )
  },

  renderRoleModal(){
    const {roles,userRoleList,roleModalVisibility} = this.state
    const columns = [{
      title: '角色',
      dataIndex: 'roleName',
    },{
      title: '角色描述',
      dataIndex: 'roleDesc',
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({userRoleList: selectedRowKeys,roleChanged: true});
      },
      selectedRowKeys: userRoleList,
    };
    const data = roles.length>=0?roles.map((v,key) => {
      return {
        key: v.roleId,
        roleName: v.roleName,
        roleDesc: v.roleDesc,
      }
    }):[];
    return (
      <Modal title="设置教师角色" visible={roleModalVisibility}
        onOk={this.handleSetRole} onCancel={this.handleRoleModalDispaly.bind(null,false,"")}
      >
        <div>
          <Table pagination={false} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
      </Modal>
    )
  },

  renderClassModal(){
    const {teacherClassList,classModalVisibility} = this.state
    const columns = [{
      title: '班级名称',
      dataIndex: 'className',
    },{
      title: '班级人数',
      dataIndex: 'studentCount',
    },{
      title: '任课科目',
      dataIndex: 'subjectName',
    },{
      title: '班主任',
      dataIndex: 'mentorName',
    }];
    const data = teacherClassList.length>=0?teacherClassList.map((v,key) => {
      return {
        key: key,
        className: v.className,
        studentCount: v.studentCount,
        subjectName: v.subjectName,
        mentorName: v.mentorName,
      }
    }):[];
    return (
      <Modal title="查看教师所在班级" visible={classModalVisibility}
        onOk={this.handleClassModalDisplay.bind(null,false,"")} onCancel={this.handleClassModalDisplay.bind(null,false,"")}
      >
        <div>
          <Table pagination={false} columns={columns} dataSource={data} />
        </div>
      </Modal>
    )
  },

  renderModal(){
    const { getFieldDecorator } = this.props.form;
    const { modalType, modalVisibility, imageUrl } = this.state;
    const formItemLayout = {labelCol:{span:5},wrapperCol:{span:12}};
    return (
      <Modal width={850} title={modalType==="add"?"添加教师":"编辑教师"} visible={modalVisibility}
          onOk={modalType==="add"?this.handleAddRecord:this.handleEditRecord} onCancel={this.handleModalDispaly.bind(this,false,"")}
        >
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  label='工号'
                  {...formItemLayout}
                  key='workNum'
                >
                {
                  getFieldDecorator('workNum', {
                    rules: [{required: true,message: "工号不能为空"},{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && (value.length < 5 ||value.length > 20)){
                          errors.push(
                            new Error('工号应不少于5位，不超过20位')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input placeholder='输入5-20位数字或字母'/>)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="姓名"
                  {...formItemLayout}
                  key='teacherName'
                >
                {
                  getFieldDecorator('teacherName', {
                    rules: [{required: true,message: "姓名不能为空"},{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && value.length > 36){
                          errors.push(
                            new Error('姓名应不超过36个字')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input placeholder='输入不超过36个字'/>)
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="身份证"
                  {...formItemLayout}
                  key='id'
                >
                {
                  getFieldDecorator('id', {
                    rules: [{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && value.length > 18){
                          errors.push(
                            new Error('身份证应不超过18位')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input placeholder='输入不超过18位'/>)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="性别"
                  {...formItemLayout}
                  key='sex'
                >
                {
                  getFieldDecorator('sex',{initialValue:"M"})(
                    <Select
                      placeholder="请选择性别"
                      optionFilterProp="children"
                    >
                      <Option value="M">男</Option>
                      <Option value="F">女</Option>
                    </Select>
                  )
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="教龄"
                  {...formItemLayout}
                  key='teachYears'
                >
                {
                  getFieldDecorator('teachYears', {
                    initialValue: 0,
                    rules: [{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && value > 200){
                          errors.push(
                            new Error('教龄应不超过200')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input type="number" min="0" max="200" placeholder='请输入200以内整数'/>)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="出生日期"
                  {...formItemLayout}
                  key='birth'
                >
                {
                  getFieldDecorator('birth')(
                    <DatePicker style={{width: '100%'}} placeholder="选择出生日期" disabledDate={(current)=> current && current.valueOf() > Date.now()} />
                  )
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="电话1"
                  {...formItemLayout}
                  key='phone1'
                >
                {
                  getFieldDecorator('phone1', {
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
              <Col span={12}>
                <FormItem
                  label="电话2"
                  {...formItemLayout}
                  key='phone2'
                >
                {
                  getFieldDecorator('phone2', {
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
              <Col span={12}>
                <FormItem
                  label="微信"
                  {...formItemLayout}
                  key='weChat'
                >
                {
                  getFieldDecorator('weChat')(<Input placeholder='输入微信号'/>)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="QQ"
                  {...formItemLayout}
                  key='qq'
                >
                {
                  getFieldDecorator('qq')(<Input placeholder='输入QQ号'/>)
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="住址"
                  {...formItemLayout}
                  key='homeAddr'
                >
                {
                  getFieldDecorator('homeAddr', {initialValue: "",
                    rules: [{max:180, message: '输入不超过180个字' }],
                  })(<Input type="textarea" placeholder='输入不超过180个字' rows={3}/>)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="邮箱"
                  {...formItemLayout}
                  key='email'
                >
                {
                  getFieldDecorator('email', {initialValue: "",
                    rules: [{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && value.length > 40){
                          errors.push(
                            new Error('邮箱应不超过40个字')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input placeholder='输入不超过40个字'/>)
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="上传头像"
                  {...formItemLayout}
                  key="upload"
                >
                  <div className={styles.avatarUploader}>
                    <div className={styles.imgContainer}>
                      { imageUrl&&imageUrl.indexOf("base64")>=0 ? <img src={imageUrl} alt="" className={styles.avatar} /> : "" }
                    </div>
                    <div className={styles.inputContainer}>
                      <Icon type="plus" />
                      <Input type="file" onChange={this.handleAvatarChange} />
                    </div>
                  </div>
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
              <Button type="primary" className={styles.operationButton} onClick={this.handleModalDispaly.bind(this,true,"add")}>
                新建
              </Button>:null
            }
            {
              this._currentMenu.get('authList').find((v)=>v.get('authName')=='导入') ?
              <Button type="primary" className={styles.operationButton} onClick={this.handleImportModalDisplay.bind(this,true)}>
                导入
              </Button>:null
            }
          </div>
          <Search style={{width:'260px'}} placeholder="请输入教师姓名" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <TableComponent dataType="baseInfo" tableData={tableData} pageType="teacher" searchStr={this.state.searchStr}></TableComponent>
        </div>
        {this.renderModal()}
        {this.renderImportModal()}
        {this.renderRoleModal()}
        {this.renderClassModal()}
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
    addStaff: bindActionCreators(addStaff,dispatch),
    editStaff: bindActionCreators(editStaff,dispatch),
    downloadExcel: bindActionCreators(downloadExcel,dispatch),
    importExcel: bindActionCreators(importExcel,dispatch),
    setTeacherRole: bindActionCreators(setTeacherRole,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(TeacherPage))
