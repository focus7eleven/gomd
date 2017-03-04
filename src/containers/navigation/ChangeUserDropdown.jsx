import React from 'react'
import {Alert,Icon,Modal,Select,Button,Form,Input} from 'antd'
import styles from './ChangeUserDropdown.scss'
import {logout,getUserInfo,changeRole,editUser} from '../../actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {baseURL} from '../../config'
import config from '../../config'
import security from '../../utils/security'
import {getMenu} from '../../actions/menu'
import {actionNames} from '../../utils/action-utils'
import {fromJS} from 'immutable'
import {notification} from 'antd'
const Option = Select.Option

const FormItem = Form.Item;

// 导航栏右侧的用户个人信息展示框
const ChangeUserDropDown = React.createClass({
  contextTypes:{
    router: React.PropTypes.object,
  },

  getInitialState(){
    return ({
      showRoleChange: false,
      roleType: -1,
      showUserInfo:false,
      showChangePass:false,
      imageUrl:'',
      required:false,
    })
  },
  componentDidMount(){
    window.addEventListener('click',this.handleWindowEvent1)
  },
  componentWillUnmount(){
    window.removeEventListener('click',this.handleWindowEvent1)
  },
  componentDidUpdate(prevProps, prevState){
    if(this.state.showRoleChange){
      //对话框打开
      window.removeEventListener('click',this.handleWindowEvent1)
    }else{
      //对话框关闭
      window.addEventListener('click',this.handleWindowEvent1)
    }
  },
  handleWindowEvent1(){
    //this.props.onClose()
  },
  handleChangeRole(){
    this.setState({
      showRoleChange:true
    })
  },
  handleCancelRoleChange(){
    this.setState({
      showRoleChange:false
    })
  },
  handleAvatarChange(e){
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.addEventListener('load', () => this.setState({imageUrl:reader.result}));
    reader.readAsDataURL(file);
  },
  handlePostUser(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('addArea','');
        formData.append('userCode',values.userCode);
        formData.append('email',values.email);
        formData.append('nickName',values.nickName);
        formData.append('realName',values.realName);
        formData.append('sign',values.sign);
        formData.append('phoneNum',values.phoneNum);
        formData.append('headUrl',this.state.imageUrl)
        var url = config.api.user.edit;
        fetch(url,{
          method:'post',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          },
          body:formData

        }).then(res => res.json()).then(res =>{
          if(res.title == 'Success'){
            sessionStorage.setItem('accessToken',res.resultData)
            notification.success({message:'修改成功'})
            this.setState({showUserInfo:false})
            return res;
          } else {
            notification.error({message:'修改失败'})
            return res;
          }
        })
      }
    });
  },
  handleConfirmRoleChange(){
    let formData = new FormData()
    formData.append('roleType',this.state.roleType);
    this.props.changeRole(formData).then((res)=>{
      if(res.title==='Success'){
        this.context.router.push(`/index`);
        this.props.getMenu()
        this.props.getUserInfo()
        this.setState({
          showRoleChange:false
        })
      }
    })
  },
  showUserModal(){
    this.setState({required:false})
    this.setState({showUserInfo:true});
  },
  hideUserModal() {
    this.setState({showUserInfo:false});
  },
  handleChangePass() {
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    fetch(config.api.key.get,{
      headers:{
        'from':'nodejs'
      },
      method:'get'
    }).then(res => res.json()).then( res => {
          let publicKey = security.RSAUtils.getKeyPair(res.exponent,'',res.modulus)
          console.log(publicKey)
      validateFields((err, values) => {
        if (!err) {
          let oldPassword = security.RSAUtils.encryptedString(publicKey,values.oldPassword)
          let newPassword = security.RSAUtils.encryptedString(publicKey,values.newPassword)
          let formData = new FormData()
          formData.append('oldPassword',oldPassword)
          formData.append('newPassword',newPassword)
          var url = config.api.user.changePass;
          fetch(url,{
            method:'post',
            headers:{
              'from':'nodejs',
              'token':sessionStorage.getItem('accessToken')
            },
            body:formData

          }).then(res => res.json()).then(res =>{
            if(res.title == 'Success'){
              console.log('create success!');
              this.setState({showChangePass:false});
              notification.success({message:'修改成功！请重新登录！'})
              this.props.logout();
              this.context.router.push(`/login`);
            } else {
              notification.error({message:'原密码错误！'})
            }
          })
        }
      });
          //let oldPassword = security.RSAUtils.encryptedString(publicKey,oldPassword)
          //let newPassword = security.RSAUtils.encryptedString(publicKey,newPassword)
          //let formData = new FormData()
          //formData.append('oldPassword',oldPassword)
          //formData.append('newPassword',newPassword)
    })
  },
  hidePassModal() {
    this.setState({showChangePass:false})
  },
  showPassModal() {
    this.setState({required:true})
    this.setState({showChangePass:true})
  },
  checkConfirm (rule, value, callback){
  const form = this.props.form;
  if (value && value !== form.getFieldValue('newPassword')) {
    callback('两次密码输入不一致!');
  } else {
    callback();
  }
},
  renderChangePassWord(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (<div>
      <Modal
      title='修改密码'
      visible={this.state.showChangePass}
      onOk={this.handleChangePass}
      onCancel={this.hidePassModal}
      width="40%"
      maskClosable={false}
      >
        <Form>
        <FormItem
            {...formItemLayout}
            label="原密码"
            hasFeedback
        >
          {getFieldDecorator('oldPassword', {
            rules: [ {
              required: this.state.required, message: '请输入原密码!',
            }],
          })(
              <Input  type="password"/>
          )}
        </FormItem>

        <FormItem
            {...formItemLayout}
            label="新密码"
            hasFeedback
        >
          {getFieldDecorator('newPassword', {
            rules: [ {
              required: this.state.required , message: '请输入新密码!',
            }],
          })(
              <Input  type="password"/>
          )}
        </FormItem>

        <FormItem
            {...formItemLayout}
            label="确认密码"
            hasFeedback
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: this.state.required, message: '请输入确认密码',
            },{
              validator: this.checkConfirm,
            }],
          })(
              <Input  type="password"/>
          )}
        </FormItem>
  </Form>

      </Modal>

    </div>);
  },
  renderUserModal(userInfo){
    const { getFieldDecorator } = this.props.form;
    const { imageUrl } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
        <div>
          <Modal
              title="修改个人信息"
              //title={this.state.homeworkName}
              visible={this.state.showUserInfo}
              onCancel={this.hideUserModal}
              onOk={this.handlePostUser}
              width="50%" maskClosable={false}
          >
        <Form>
            <FormItem
                label="上传头像"
                {...formItemLayout}
                key="upload"
            >
              <div className={styles.avatarUploader}>
                <div className={styles.imgContainer}>
                  { imageUrl&&imageUrl.indexOf("base64")>=0 ? <img src={imageUrl} alt="" className={styles.avatar} /> : <img src={baseURL + "/" +userInfo.headUrl} alt="" className={styles.avatar} />  }
                </div>
                <div className={styles.inputContainer}>
                  <Icon type="plus" />
                  <Input type="file" onChange={this.handleAvatarChange} />
                </div>
              </div>
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="用户名"
                hasFeedback
            >
              {getFieldDecorator('userCode', {
                rules: [ {
                  required: true, message: '请输入用户名!',
                }],
                initialValue:userInfo.userCode,
              })(
                  <Input disabled={true}/>
              )}
            </FormItem>

            <FormItem
                {...formItemLayout}
                label="真名"
                hasFeedback
            >
              {getFieldDecorator('realName', {
                rules: [ {
                  required: false, message: '请输入真名!',
                }],
                initialValue:userInfo.realName,
              })(
                  <Input />
              )}
            </FormItem>

            <FormItem
                {...formItemLayout}
                label="昵称"
                hasFeedback
            >
              {getFieldDecorator('nickName', {
                rules: [{
                  required: false, message: '请输入昵称',
                }],
                initialValue:userInfo.nickName,
              })(
                  <Input />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="邮箱"
                hasFeedback
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '邮箱格式不正确!',
                }, {
                  required: true, message: '请输入邮箱',
                }],
                initialValue:userInfo.email,
              })(
                  <Input />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="电话"
                hasFeedback
            >
              {getFieldDecorator('phoneNum', {
                rules: [{
                  required: false, message: '请输入电话号码',
                }],
                initialValue:userInfo.phoneNum,
              })(
                  <Input />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="签名"
                hasFeedback
            >
              {getFieldDecorator('sign', {
                rules: [{
                  required: false, message: '请输入签名',
                }],
                initialValue:userInfo.sign,
              })(
                  <Input />
              )}
            </FormItem>
        </Form>

          </Modal>
        </div>)
  },
  handleLogout(){
    this.props.logout();
    this.context.router.push(`/login`);
  },

  handleRoleChange(value){
    this.setState({roleType: value});
  },

  render(){


    const userInfo = this.props.user.get('userInfo')
    const currentRoleId = this.props.user.get('userRoles').length>0?this.props.user.get('userRoles').find((item)=>item.roleName === userInfo.userStyleName).role_type:[]
    return (
        <div>
          <div className={styles.changeUser} onClick={(e)=>{e.stopPropagation()}} onMouseLeave={(this.state.showRoleChange || this.state.showUserInfo || this.state.showChangePass) ? null:this.props.onClose}>
            <div className={styles.avatar}><img src = {baseURL+"/"+userInfo.headUrl}/></div>
            <div className={styles.name}>{userInfo.realName}</div>
            <div className={styles.division}></div>
            <div className={styles.menuList}>
              <div className={styles.item} onClick={this.showUserModal}><Icon type="user" />个人资料</div>
              <div className={styles.item} onClick={this.showPassModal}><Icon type="lock" />修改密码</div>
              <div className={styles.item} onClick={this.handleChangeRole}><Icon type="retweet" />更换角色</div>
              <div className={styles.item} onClick={this.handleLogout}><Icon type="logout" />退出</div>
            </div>
          </div>
          <Modal wrapClassName={styles.modalWrapper} title='角色切换' visible={this.state.showRoleChange}
                 onOk={this.handleConfirmRoleChange} onCancel={this.handleCancelRoleChange}
                 width={300}
                 maskClosable={false}
          >
            <div className={styles.roleChangeContent}>
              <div className={styles.selsctWrapper}>
                <span>角色：</span>
                <Select size="large" defaultValue={currentRoleId} onChange={this.handleRoleChange} style={{ width: 200 }}>
                  {
                    this.props.user.get('userRoles').map((item,index)=>{
                      return <Option key={index} value={item.role_type}>{item.roleName}</Option>
                    })
                  }
                </Select>
              </div>
            </div>
          </Modal>
          {this.renderUserModal(userInfo)}
          {this.renderChangePassWord()}
          </div>
    )
  }
})

function mapStateToProps(state) {
  return {
    user:state.get('user')
  }
}

function mapDispatchToProps(dispatch){
  return {
    logout:bindActionCreators(logout,dispatch),
    changeRole: bindActionCreators(changeRole,dispatch),
    getUserInfo:bindActionCreators(getUserInfo,dispatch),
    getMenu:bindActionCreators(getMenu,dispatch),
    editUser:bindActionCreators(editUser,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(ChangeUserDropDown))
