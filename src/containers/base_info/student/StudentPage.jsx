import React from 'react'
import styles from './StudentPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Row,Col,Upload,Select,DatePicker,Icon,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {downloadExcel,importExcel,editStaff,addStaff,getWorkspaceData} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../../reducer/menu'
import TableComponent from '../../../components/table/TableComponent'
import moment from 'moment'
import config from '../../../config.js'
import relations from '../../../utils/relation'
import _ from 'lodash'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm
const Option = Select.Option;
moment.locale('zh-cn');

const StudentPage = React.createClass({
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
      // 查看学生班级
      studentClassList: [],
      classModalVisibility: false,
      // 设置家长
      studentPatriarchList: [], // 有关系的家长
      patriarchList: [], // 所有家长
      patriarchModalVisibility: false,
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'student')
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '学号',
      dataIndex: 'stuNum',
      key: 'stuNum',
      className:styles.tableColumn,
    },{
      title: '姓名',
      dataIndex: 'stuName',
      key: 'stuName',
      className:styles.tableColumn,
    },{
      title: '性别',
      dataIndex: 'stuSex',
      key: 'stuSex',
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
      title: '班级',
      dataIndex: 'classCount',
      key: 'classCount',
      className:styles.tableColumn,
      render: (text,record) => {
        return <a onClick={this.handleClassModalDisplay.bind(null,true,record.key)}>所属班级个数：{text}</a>
      }
    },{
      title: '家长',
      dataIndex: 'patriarchCount',
      key: 'patriarchCount',
      className:styles.tableColumn,
      render: (text,record) => {
        return <a onClick={this.handlePatriarchModalDisplay.bind(null,true,record.key)}>{this.props.userStyle=='15'?<Icon type="edit"/>:null}家长个数：{text}</a>
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

  handlePatriarchModalDisplay(visibility,key){
    const editMode = this.props.userStyle == '15'
    if(visibility){
      this._studentId = this.props.workspace.get('data').get('result').get(key).get('studentId');
      if(!editMode){
        fetch(config.api.staff.getPatriarch(this._studentId),{
          method:'GET',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken'),
          }
        }).then(res => res.json()).then((json)=>{
          this.setState({patriarchModalVisibility: visibility,studentPatriarchList: json})
        })
      }else{
        fetch(config.api.staff.getPatriarch(this._studentId),{
          method:'GET',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken'),
          }
        }).then(res => res.json()).then((json)=>{
          fetch(config.api.staff.findPatriarch(""),{
            method:'GET',
            headers:{
              'from':'nodejs',
              'token':sessionStorage.getItem('accessToken'),
            }
          }).then(res => res.json()).then((list)=>{
            const xor = _.xorBy(list,json,'userId')
            const studentPatriarchList = json.concat(xor)
            this.setState({patriarchModalVisibility: visibility,studentPatriarchList})
          })
        })
      }
    }else{
      this.setState({patriarchModalVisibility: visibility});
    }
  },

  handleClassModalDisplay(visibility,key){
    if(visibility){
      this._studentId = this.props.workspace.get('data').get('result').get(key).get('studentId');
      fetch(config.api.staff.getStudentClass(this._studentId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then((json)=>{
        this.setState({classModalVisibility: visibility,studentClassList: json})
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
        formData.append('stuNum',values.stuNum)
        formData.append('stuName',values.stuName)
        formData.append('stuSex',values.stuSex)
        formData.append('phone',values.phone)
        formData.append('stuBirth',moment(values.birth).format("YYYY/MM/DD"))
        formData.append('address',values.address)
        formData.append('weChat',values.weChat)
        formData.append('qq',values.qq)
        formData.append('stuImg',this.state.imageUrl)
        const result = this.props.addStaff(formData,"student")
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
    this.props.getWorkspaceData('student',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  handleEditRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('studentId',this._currentRow.get('studentId'))
        formData.append('action',"edit")
        formData.append('stuNum',values.stuNum)
        formData.append('stuName',values.stuName)
        formData.append('stuSex',values.stuSex)
        formData.append('phone',values.phone)
        formData.append('stuBirth',moment(values.birth).format("YYYY/MM/DD"))
        formData.append('address',values.address)
        formData.append('weChat',values.weChat)
        formData.append('qq',values.qq)
        formData.append('userImg',this.state.imageUrl?this.state.imageUrl:"")
        const result = this.props.editStaff(formData,"student")
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
    const studentId = this.props.workspace.get('data').get('result').get(key).get('studentId')
    const that = this
    let formData = new FormData()
    formData.append('studentId',studentId)
    formData.append('action',"delete")
    confirm({
      title: '确定删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editStaff(formData,"student")
      },
      onCancel() {},
    });
  },

  handleImportRecord(){
    this.state.excelFile?this.props.importExcel(this.state.excelFile,"student"):null;
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
        'stuNum':this._currentRow.get('stuNum'),
        'stuName':this._currentRow.get('stuName'),
        'stuSex':this._currentRow.get('stuSex'),
        'phone':this._currentRow.get('phone'),
        'stuBirth':this._currentRow.get('stuBirth')?moment(this._currentRow.get('stuBirth')):'',
        'address':this._currentRow.get('address'),
        'weChat':this._currentRow.get('weChat'),
        'qq':this._currentRow.get('qq'),
      })
      this.setState({modalVisibility: visibility,modalType: 'edit', imageUrl: this._currentRow.get('stuImg')});
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
    // this.props.downloadExcel("student");
    fetch(config.api.staff.downloadExcel("student"),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
    }).then(res => res.blob()).then(res => {
      const url = window.URL.createObjectURL(res);
      this.setState({fileUrl: url}, () => {
        this.refs.studentExcel.click()
      })
    })
  },

  handleLoadPatriarch(value){
    console.log(value);
  },

  handleSetPatriarch(){

  },

  renderImportModal(){
    const {importModalVisibility} = this.state;
    return (
      <Modal title="批量导入" visible={importModalVisibility} onOk={this.handleImportRecord} onCancel={this.handleImportModalDisplay.bind(this,false)}>
        <div>
          <h3>导入步骤:</h3>
          <p>1. 点击
            <a onClick={this.handleDownloadExcel}>下载模板</a>
            <a ref="studentExcel" href={this.state.fileUrl} download="学生批量导入模板.xlsx" style={{display:'none'}}></a>
          </p>
          <p>2. 按模板要求完善导入人员的信息</p>
          <p>3. 选择该文件进行导入</p>
          <input type="file" onChange={this.handleImportFileChange} />
        </div>
      </Modal>
    )
  },

  renderModal(){
    const { getFieldDecorator } = this.props.form;
    const { modalType, modalVisibility, imageUrl } = this.state;
    const formItemLayout = {labelCol:{span:5},wrapperCol:{span:12}};
    return (
      <Modal width={850} title={modalType==="add"?"添加学生":"编辑学生"} visible={modalVisibility}
          onOk={modalType==="add"?this.handleAddRecord:this.handleEditRecord} onCancel={this.handleModalDispaly.bind(this,false,"")}
        >
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  label='学号'
                  {...formItemLayout}
                  key='stuNum'
                >
                {
                  getFieldDecorator('stuNum', {
                    rules: [{required: true,message: "学号不能为空"},{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && (value.length < 5 ||value.length > 20)){
                          errors.push(
                            new Error('学号应不少于5位，不超过20位')
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
                  key='stuName'
                >
                {
                  getFieldDecorator('stuName', {
                    rules: [{required: true,message: "姓名不能为空"},{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && value.length > 6){
                          errors.push(
                            new Error('姓名应不超过6个字')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input placeholder='输入不超过6个字'/>)
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="性别"
                  {...formItemLayout}
                  key='stuSex'
                >
                {
                  getFieldDecorator('stuSex',{initialValue:"M"})(
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
              <Col span={12}>
                <FormItem
                  label="出生日期"
                  {...formItemLayout}
                  key='stuBirth'
                >
                {
                  getFieldDecorator('stuBirth')(
                    <DatePicker style={{width: '100%'}} placeholder="选择出生日期" disabledDate={(current)=> current && current.valueOf() > Date.now()} />
                  )
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
              <Col span={12}>
                <FormItem
                  label="住址"
                  {...formItemLayout}
                  key='address'
                >
                {
                  getFieldDecorator('address', {initialValue: "",
                    rules: [{max:180, message: '输入不超过180个字' }],
                  })(<Input type="textarea" placeholder='输入不超过180个字' rows={3}/>)
                }
                </FormItem>
              </Col>
            </Row>
            <Row>
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

  renderPatriarchModal(){
    const {patriarchModalVisibility, studentPatriarchList,patriarchList} = this.state
    const editMode = this.props.userStyle == '15'
    const columns = editMode?[{
      title: '姓名',
      dataIndex: 'name',
    },{
      title: '电话',
      dataIndex: 'phone1',
    },{
      title: '常住地址',
      dataIndex: 'address',
    },{
      title: '关系',
      dataIndex: 'relation',
      render: (text,record) => {
        return (
          <Select style={{'width':80}} value={text} onChange={this.handleLoadPatriarch}>
            {
              relations.map((item,index)=>{
                return <Option key={item.code} value={item.name}>{item.name}</Option>
              })
            }
          </Select>
        )
      }
    }]
    :
    [{
      title: '姓名',
      dataIndex: 'name',
    },{
      title: '电话',
      dataIndex: 'phone1',
    },{
      title: '常住地址',
      dataIndex: 'address',
    },{
      title: '关系',
      dataIndex: 'relation',
    }];
    const data = studentPatriarchList.length>=0?studentPatriarchList.map((v,key) => {
      return {
        key: key,
        name: v.name,
        phone1: v.phone1,
        address: v.address,
        relation: v.relation||'无关系',
      }
    }):[];
    return (
      <Modal title={editMode?"设置学生家长":"学生家长"} visible={patriarchModalVisibility}
        onOk={this.handleSetPatriarch} onCancel={this.handlePatriarchModalDisplay.bind(null,false,"")}
      >
        <div>
          <Table pagination={false} columns={columns} dataSource={data} />
        </div>
      </Modal>
    )
  },

  renderClassModal(){
    const {studentClassList,classModalVisibility} = this.state
    const columns = [{
      title: '班级名称',
      dataIndex: 'className',
    },{
      title: '所属学校',
      dataIndex: 'schoolName',
    },{
      title: '所属年级',
      dataIndex: 'gradeName',
    }];
    const data = studentClassList.length>=0?studentClassList.map((v,key) => {
      return {
        key: key,
        className: v.className,
        schoolName: v.schoolName,
        gradeName: v.gradeName,
      }
    }):[];
    return (
      <Modal title="查看学生所在班级" visible={classModalVisibility}
        onOk={this.handleClassModalDisplay.bind(null,false,"")} onCancel={this.handleClassModalDisplay.bind(null,false,"")}
      >
        <div>
          <Table pagination={false} columns={columns} dataSource={data} />
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
          <Search style={{width:'260px'}} placeholder="请输入学生姓名" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
        </div>
        <div className={styles.body}>
          <TableComponent dataType="baseInfo" tableData={tableData} pageType="student" searchStr={this.state.searchStr}></TableComponent>
        </div>
        {this.renderModal()}
        {this.renderImportModal()}
        {this.renderClassModal()}
        {this.renderPatriarchModal()}
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu: state.get('menu'),
    workspace: state.get('workspace'),
    userStyle: state.get('user').get('userInfo').userStyle,
  }
}
function mapDispatchToProps(dispatch){
  return {
    getWorkspaceData: bindActionCreators(getWorkspaceData,dispatch),
    addStaff: bindActionCreators(addStaff,dispatch),
    editStaff: bindActionCreators(editStaff,dispatch),
    downloadExcel: bindActionCreators(downloadExcel,dispatch),
    importExcel: bindActionCreators(importExcel,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(StudentPage))
