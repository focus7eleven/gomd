import React from 'react'
import styles from './PatriarchPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Row,Col,Upload,Select,DatePicker,Icon,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {editStaff,addStaff,getWorkspaceData} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../../reducer/menu'
import moment from 'moment'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm
const Option = Select.Option;
moment.locale('zh-cn');

const PatriarchPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  getInitialState(){
    return {
      searchStr: "",
      modalType: "",
      modalVisibility: false,
      imageUrl: "",
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'patriarch')
    }
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
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
      dataIndex: 'cid',
      key: 'cid',
      className:styles.tableColumn,
    },{
      title: '电话1',
      dataIndex: 'phone1',
      key: 'phone1',
      className:styles.tableColumn,
    },{
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
      className:styles.tableColumn,
    },{
      title: '常住地址',
      dataIndex: 'address',
      key: 'address',
      className:styles.tableColumn,
    },{
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
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

  handleAddRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('name',values.name)
        formData.append('cid',values.cid)
        formData.append('sex',values.sex)
        formData.append('phone1',values.phone1)
        formData.append('phone2',values.phone2)
        formData.append('phone3',values.phone3)
        formData.append('birth',moment(values.birth).format("YYYY/MM/DD"))
        formData.append('address',values.address)
        formData.append('email',values.email)
        formData.append('userImg',this.state.imageUrl?this.state.imageUrl:"")
        const result = this.props.addStaff(formData,"patriarch")
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
    this.props.getWorkspaceData('patriarch',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  handleEditRecord(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('userId',this._currentRow.get('userId'))
        formData.append('action',"edit")
        formData.append('name',values.name)
        formData.append('cid',values.cid)
        formData.append('sex',values.sex)
        formData.append('phone1',values.phone1)
        formData.append('phone2',values.phone2)
        formData.append('phone3',values.phone3)
        formData.append('birth',moment(values.birth).format("YYYY/MM/DD"))
        formData.append('address',values.address)
        formData.append('email',values.email)
        formData.append('userImg',this.state.imageUrl?this.state.imageUrl:"")
        const result = this.props.editStaff(formData,"patriarch")
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
        that.props.editStaff(formData,"patriarch")
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
        'name':this._currentRow.get('name'),
        'cid':this._currentRow.get('cid'),
        'sex':this._currentRow.get('sex'),
        'phone1':this._currentRow.get('phone1'),
        'phone2':this._currentRow.get('phone2'),
        'phone3':this._currentRow.get('phone3'),
        'birth':this._currentRow.get('birth')?moment(this._currentRow.get('birth')):'',
        'email':this._currentRow.get('email'),
        'address':this._currentRow.get('address'),
      })
      this.setState({imageUrl: this._currentRow.get('userImg'), modalVisibility: visibility,modalType: 'edit'});
    }
  },

  handleAvatarChange(e){
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.addEventListener('load', () => this.setState({imageUrl: reader.result}));
    reader.readAsDataURL(file);
  },

  renderModal(){
    const { getFieldDecorator } = this.props.form;
    const { modalType, modalVisibility } = this.state;
    const formItemLayout = {labelCol:{span:5},wrapperCol:{span:12}};
    return (
      <Modal width={850} title={modalType==="add"?"添加家长":"编辑家长"} visible={modalVisibility}
          onOk={modalType==="add"?this.handleAddRecord:this.handleEditRecord} data-visible={false} data-modaltype="" onCancel={this.handleModalDispaly}
        >
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  label="姓名"
                  {...formItemLayout}
                  key='name'
                >
                {
                  getFieldDecorator('name', {
                    rules: [{required: true,message: "姓名不能为空"},{
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        if(value && value.length > 10){
                          errors.push(
                            new Error('姓名应不超过10个字')
                          )
                        }
                        callback(errors);
                      }
                    }],
                  })(<Input placeholder='输入不超过10个字'/>)
                }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="身份证"
                  {...formItemLayout}
                  key='cid'
                >
                {
                  getFieldDecorator('cid', {
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
            </Row>
            <Row>
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
              <Col span={12}>
                <FormItem
                  label="电话1"
                  {...formItemLayout}
                  key='phone1'
                >
                {
                  getFieldDecorator('phone1', {
                    rules: [{required: true,message: "电话1不能为空"},{
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
              <Col span={12}>
                <FormItem
                  label="电话3"
                  {...formItemLayout}
                  key='phone3'
                >
                {
                  getFieldDecorator('phone3', {
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
              <Col span={12}>
                <FormItem
                  label="上传头像"
                  {...formItemLayout}
                  key="upload"
                >
                  <div className={styles.avatarUploader}>
                    <div className={styles.imgContainer}>
                      { this.state.imageUrl&&this.state.imageUrl.indexOf("base64")>=0 ? <img src={this.state.imageUrl} alt="" className={styles.avatar} /> : "" }
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
              <Button data-visible={true} data-modaltype="add" type="primary" className={styles.operationButton} onClick={this.handleModalDispaly}>
                新建
              </Button>:null
            }
          </div>
          <Search style={{width:'260px'}} placeholder="请输入家长姓名" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
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
                      this.props.getWorkspaceData('patriarch',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
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
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(PatriarchPage))
