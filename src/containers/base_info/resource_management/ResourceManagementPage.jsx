import React from 'react'
import styles from './ResourceManagementPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Col,Icon,Select,Input,Table,Button,Modal,Form} from 'antd'
import PermissionDic from '../../../utils/permissionDic'
import {getWorkspaceData,editResource,addResource,getAllResources,updateAuth} from '../../../actions/workspace'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../../reducer/menu'

const FormItem = Form.Item
const Search = Input.Search
const confirm = Modal.confirm
const Option = Select.Option;

const AuthModal = Form.create({
  // mapPropsToFields(props) {
  //   console.log("~~~:",props.auth);
  //   return {
  //     newAuthList: {value:props.auth},
  //   };
  // },
})(React.createClass({
  // 新增权限时，分配给组件的id，只增不减。
  _authId: 0,

  _authList: [],

  getInitialState(){
    return {
      modalVisibility: false,
      // 记录当前所有权限的组件id
      authIndex: [],
    }
  },

  componentWillReceiveProps(nextProps){
    if(!this.state.modalVisibility){
      const {form} = this.props;
      this._authId = nextProps.auth.length;
      let authIndex = [];
      this._authList = nextProps.auth;
      for(let i=1;i<=this._authId;i++){
        authIndex.push(i);
      }
      this.setState({modalVisibility:nextProps.visibility,authIndex})
    }
  },

  handleUpdateAuthList(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields();
    const formData = getFieldValue('newAuthList');
    let errors = [];
    for(let i=0;i<formData.length;i++){
      errors.push(getFieldError(`newAuthList[${i}].authName`))
      errors.push(getFieldError(`newAuthList[${i}].authUrl`))
    }
    errors = errors.reduce((cur,acc)=>{
      return cur||acc;
    })
    console.log(errors);
    if(!errors){
      this.props.updateAuth({
        jsonStr: JSON.stringify(formData),
        resourceId: this.props.resourceId
      })
      this.setState({
        modalVisibility: false
      })
    }
  },

  handleModalDispaly(visibility){
    this.setState({modalVisibility: visibility});
    this.props.onVisibilityChange();
  },

  handleAddResourceAuth(){
    this._authId = this._authId + 1;
    let authIndex = this.state.authIndex;
    authIndex.push(this._authId);
    this.setState({authIndex})
  },

  handleRemoveResourceAuth(a){
    const idx = this.state.authIndex.indexOf(a);
    this._authList = this._authList.filter((item,index)=> index !== idx);
    let authIndex = this.state.authIndex;
    authIndex = authIndex.filter(auth => auth !== a);
    this.setState({authIndex:authIndex});
  },

  render(){
    const {modalVisibility,authIndex} = this.state;
    const formItemLayout = {labelCol:{span:6},wrapperCol: {span:13}};
    const formItemWithoutLabelLayout = {wrapperCol: {span:13,offset:6}};
    const {getFieldDecorator,getFieldValue} = this.props.form;
    const resourceAuthItems = authIndex.map((auth, index) => {
      return (
        <FormItem
          {...(index===0?formItemLayout:formItemWithoutLabelLayout)}
          label={index===0?'权限':''}
          required={false}
          key={auth}
        >
          <Col span="10" style={{marginRight:"10px"}}>
            <FormItem>
              {getFieldDecorator(`newAuthList[${index}].authName`,{rules: [{ required: true, message: '请填写权限名称' }],initialValue: this._authList[index]?this._authList[index].authName:""})(
                <Input placeholder="名称"/>
              )}
            </FormItem>
          </Col>
          <Col span="10" style={{marginRight:"10px"}}>
            <FormItem>
              {getFieldDecorator(`newAuthList[${index}].authUrl`,{rules: [{ required: true, message: '请填写权限url' }],initialValue: this._authList[index]?this._authList[index].authUrl:""})(
                <Input placeholder="url"/>
              )}
            </FormItem>
          </Col>
          <Icon
            className={styles.deleteAuth}
            type="minus-circle-o"
            onClick={this.handleRemoveResourceAuth.bind(this,auth)}
          />
        </FormItem>
      );
    });
    return (
      <Modal title="资源权限" visible={modalVisibility}
        onOk={this.handleUpdateAuthList} onCancel={this.handleModalDispaly.bind(this,false)}
      >
        <Form>
          {resourceAuthItems}
          <FormItem
            label={authIndex.length===0?"权限":''}
            {...(authIndex.length===0?formItemLayout:formItemWithoutLabelLayout)}
          >
            <Button style={{width: "100%"}} type="dashed" onClick={this.handleAddResourceAuth}>
              <Icon type="plus" />
            </Button>
          </FormItem>
        </Form>
      </Modal>
    )
  },
}))


const ResourceManagementPage = React.createClass({
  _authId: 0,

  _currentMenu: Map({authList:List()}),

  _singleAuth: [],

  _singleResourceId: '',

  _currentRow: {},

  getInitialState(){
    return {
      searchStr: "",
      modalVisibility: false,
      modalType: "",
      authModal: false,
    }
  },

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'resource')
    }
    this.props.getAllResources();
  },

  getTableData(){
    let tableHeader = List()
    let tableBody = List()
    let authList = this._currentMenu.get('authList')
    tableHeader = fromJS([{
      title: '资源名称',
      dataIndex: 'resourceName',
      key: 'resourceName',
      className:styles.tableColumn,
    },{
      title: '资源url',
      dataIndex: 'resourceUrl',
      key: 'resourceUrl',
      className:styles.tableColumn,
    },{
      title: '资源描述',
      dataIndex: 'resourceDesc',
      key: 'resourceDesc',
      className:styles.tableColumn,
    },{
      title: '权重',
      dataIndex: 'resourceOrder',
      key: 'resourceOrder',
      className:styles.tableColumn,
    },{
      title: '权限',
      dataIndex: 'auth',
      key: 'auth',
      className:styles.tableColumn,
      render:(text,record) => {
        return (
          <div>
            <Button className={styles.authList} shape="circle" icon="bars" onClick={this.handleUpdateAuth.bind(this,record)}/>
          </div>
        )
      }
    },{
      title: '父资源',
      dataIndex: 'parentName',
      key: 'parentName',
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
              <Button className={styles.editButton} type="primary" onClick={this.handleModalDispaly.bind(this,true,record.key)}>编辑</Button>
              <Button className={styles.deleteButton} type="primary" onClick={this.handleDeleteResource.bind(this,record.key)}>删除</Button>
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

  handleUpdateAuth(record){
    this._singleAuth = record.authList;
    this._singleResourceId = record.resourceId;
    this.setState({authModal:true});
  },

  handleAddResource(){
    const {getFieldsValue,getFieldValue,getFieldError} = this.props.form
    if(getFieldValue('resourceName') && !(getFieldError('resourceName') || getFieldError('resourceOrder') || getFieldError('resourceDesc') || getFieldError('resourceUrl'))){
      const obj = getFieldsValue();
      delete obj['newAuth'];
      const str = JSON.stringify(obj);
      console.log(str);
      this.props.addResource({
        jsonStr: str
      })
      this.setState({
        modalVisibility:false
      })
    }
  },

  handleEditResource(){
    const {validateFields,getFieldsValue,getFieldValue,getFieldError} = this.props.form
    validateFields();
    if(getFieldValue('resourceName') && !(getFieldError('resourceName') || getFieldError('resourceOrder') || getFieldError('resourceUrl') || getFieldError('resourceDesc'))){
      const obj = getFieldsValue();
      console.log(obj);
      this.props.editResource({
        resourceId: this._currentRow.get('resourceId'),
        resourceName: obj.resourceName,
        resourceUrl: obj.resourceUrl,
        resourceOrder: obj.resourceOrder,
        resourceDesc: obj.resourceDesc,
        parentId: obj.parentId,
        action: 'edit',
      })
      this.setState({
        modalVisibility:false
      })
    }
  },

  handleDeleteResource(key){
    const that = this
    const currentRow = this.props.workspace.get('data').get('result').get(key)
    confirm({
      title: '确定删除这条记录吗？',
      content: '删除后不可恢复',
      onOk() {
        that.props.editResource({
          resourceId:currentRow.get('resourceId'),
          action:'delete'
        })
      },
      onCancel() {},
    });
  },

  handleModalDispaly(visibility,type){
    if(type==='add'){
      this.props.form.resetFields();
      this._authId=0;
      this.setState({modalVisibility: visibility,modalType: type});
    }else if(type===""){
      this.setState({modalVisibility: visibility,modalType: type});
    }else{
      const {setFieldsValue} = this.props.form
      this._currentRow = this.props.workspace.get('data').get('result').get(type)
      console.log(this._currentRow.toJS());
      setFieldsValue({
        'resourceName':this._currentRow.get('resourceName'),
        'resourceUrl':this._currentRow.get('resourceUrl'),
        'resourceOrder':this._currentRow.get('resourceOrder'),
        'resourceDesc':this._currentRow.get('resourceDesc'),
        'parentId':this._currentRow.get('parentId'),
      })
      this.setState({modalVisibility: visibility,modalType: 'edit'});
    }
  },

  handleAddResourceAuth(){
    this._authId++;
    const {form} = this.props;
    const newAuth = form.getFieldValue('newAuth');
    const nextAuth = newAuth.concat(this._authId);
    // const newAuth = form.getFieldValue('newAuthList');
    // const nextAuth = newAuth.concat(this._authId);
    form.setFieldsValue({newAuth: nextAuth});
  },

  handleRemoveResourceAuth(a){
    // this._authId--;
    const {form} = this.props;
    const newAuth = form.getFieldValue('newAuth');
    form.setFieldsValue({newAuth: newAuth.filter(auth => auth !== a)});
  },

  handleSearchStrChanged(e){
    this.setState({searchStr:e.target.value})
  },

  //搜索框输入的change事件
  handleSearchTableData(value){
    this.props.getWorkspaceData('resource',this.props.workspace.get('data').get('nowPage'),this.props.workspace.get('data').get('pageShow'),value)
  },

  renderModal(){
    const formItemLayout = {labelCol:{span:6},wrapperCol: {span:13}};
    const formItemWithoutLabelLayout = {wrapperCol: {span:13,offset:6}};
    const {getFieldDecorator,getFieldValue} = this.props.form;
    const {modalType, modalVisibility} = this.state;
    getFieldDecorator('newAuth', { initialValue: [] });
    const newAuth = getFieldValue('newAuth');
    const resourceAuthItems = newAuth.map((auth, index) => {
      return (
        <FormItem
          {...(index===0?formItemLayout:formItemWithoutLabelLayout)}
          label={index===0?'权限':''}
          required={false}
          key={auth}
        >
          <Col span="10" style={{marginRight:"10px"}}>
            <FormItem>
              {getFieldDecorator(`newAuthList[${index}].authName`)(
                <Input placeholder="名称"/>
              )}
            </FormItem>
          </Col>
          <Col span="10" style={{marginRight:"10px"}}>
            <FormItem>
              {getFieldDecorator(`newAuthList[${index}].authUrl`)(
                <Input placeholder="url"/>
              )}
            </FormItem>
          </Col>
          <Icon
            className={styles.deleteAuth}
            type="minus-circle-o"
            onClick={this.handleRemoveResourceAuth.bind(this,auth)}
          />
        </FormItem>
      );
    });
    return (
      <Modal title={modalType==="add"?"添加资源":"编辑资源"} visible={modalVisibility}
          onOk={modalType==="add"?this.handleAddResource:this.handleEditResource} onCancel={this.handleModalDispaly.bind(this,false,"")}
        >
        <div>
          <Form>
            {
              <FormItem
                label='资源名称'
                {...formItemLayout}
                key='resourceName'
              >
              {
                getFieldDecorator('resourceName', {
                  rules: [{ required: true, message: '请填写资源名称' },{
                    validator(rule, value, callback, source, options) {
                      var errors = [];
                      if(value.length > 30){
                        errors.push(
                          new Error('资源名称应不超过30个字')
                        )
                      }
                      callback(errors);
                    }
                  }],
                })(<Input placeholder='输入不超过30个字'/>)
              }
              </FormItem>
            }
            <FormItem
              label="资源url"
              {...formItemLayout}
              key='resourceUrl'
            >
            {
              getFieldDecorator('resourceUrl', {
                rules: [{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if(value.length > 60){
                      errors.push(
                        new Error('资源url应不超过60个字')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input placeholder='输入不超过60个字'/>)
            }
            </FormItem>
            {
              <FormItem
                label="资源描述"
                {...formItemLayout}
                key='resourceDesc'
              >
              {
                getFieldDecorator('resourceDesc', {
                  rules: [{max:200, message: '输入不超过200个字' }],
                })(<Input type="textarea" placeholder='输入不超过200个字' rows={3}/>)
              }
              </FormItem>
            }
            {modalType=="add"?resourceAuthItems:null}
            {
              modalType=="add"?
              <FormItem
                label={newAuth.length===0?"权限":''}
                {...(newAuth.length===0?formItemLayout:formItemWithoutLabelLayout)}
              >
                <Button style={{width: "100%"}} type="dashed" onClick={this.handleAddResourceAuth}>
                  <Icon type="plus" />
                </Button>
              </FormItem>:null
            }
            {
              <FormItem
                label="父资源"
                {...formItemLayout}
                key='parentId'
              >
              {
                getFieldDecorator('parentId')(
                  <Select
                    showSearch
                    placeholder="选择一个父资源"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.props.workspace.get('allResourcesList').map((item)=>{
                        return <Option value={item.resourceId} key={item.resourceId}>{item.resourceName}</Option>
                      })
                    }
                  </Select>
                )
              }
              </FormItem>
            }
            <FormItem
              label="权重"
              {...formItemLayout}
              key='resourceOrder'
            >
            {
              getFieldDecorator('resourceOrder', {
                rules: [{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if(value > 99 || value < 0 || !Number.isInteger(Number.parseFloat(value)) ){
                      errors.push(
                        new Error('权重应是小于100的整数')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input min="0" step="1" type="number" placeholder='1~2位数字'/>)
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
    const {authModal,modalVisibility} = this.state

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {
            this._currentMenu.get('authList').find((v)=>v.get('authName')=='增加') ?
            <Button type="primary" className={styles.operationButton} onClick={this.handleModalDispaly.bind(this,true,"add")}>
              新建
            </Button>:null
          }
          <Search style={{width: '260px'}} placeholder="请输入资源名称" value={this.state.searchStr} onChange={this.handleSearchStrChanged} onSearch={this.handleSearchTableData} />
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
                      this.props.getWorkspaceData('resource',page,this.props.workspace.get('data').get('pageShow'),this.state.searchStr)
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
        <AuthModal auth={this._singleAuth} resourceId={this._singleResourceId} visibility={authModal} updateAuth={this.props.updateAuth} onVisibilityChange={()=>this.setState({authModal:false})}></AuthModal>
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
    addResource: bindActionCreators(addResource,dispatch),
    getAllResources: bindActionCreators(getAllResources,dispatch),
    updateAuth: bindActionCreators(updateAuth,dispatch),
    editResource: bindActionCreators(editResource,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(ResourceManagementPage))
