import React from 'react'
import {Alert,Icon,Modal,Select,Button,Form,Input} from 'antd'
import styles from './ChangeUserDropdown.scss'
import {logout,getUserInfo,changeRole,editUser} from '../../actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {baseURL} from '../../config'
import config from '../../config'
import {getMenu} from '../../actions/menu'
import {actionNames} from '../../utils/action-utils'
import {fromJS} from 'immutable'
const Option = Select.Option

const FormItem = Form.Item;

const UserForm = React.createClass( {
  getInitialState(){
    return ({
      showUserInfo:true,
      imageUrl:'',
    })
  },
  showUserModal(){
    this.setState({showUserInfo:true});
  },
  hideUserModal() {
    this.setState({showUserInfo:false});
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
            console.log('create success!');
            this.setState({showUserInfo:false});
            <Alert message="修改成功" type="success" showIcon />;
          }
        })
  }
    });
  },
  handleAvatarChange(e){
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.addEventListener('load', () => this.setState({imageUrl:reader.result}));
    reader.readAsDataURL(file);
  },
  render(){
    const { getFieldDecorator } = this.props.form;
    const {user} = this.props;
    const { modalType, modalVisibility, imageUrl } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
        <Select className="icp-selector">
          <Option value="86">+86</Option>
        </Select>
    );

    return (
  <div>
    <Modal
        title="修改个人信息"
        //title={this.state.homeworkName}
        visible={this.state.showUserInfo && this.props.visible}
        onCancel={this.hideUserModal}
        onOk={this.handlePostUser}
        width="50%"
        footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handlePostUser}>
			保存
        </Button>,
        <Button key="return" type="primary" size="large" onClick={this.hideUserModal}>
			关闭
        </Button>,
      ]}>

        <FormItem
            label="上传头像"
            {...formItemLayout}
            key="upload"
        >
          <div className={styles.avatarUploader}>
            <div className={styles.imgContainer}>
              { imageUrl&&imageUrl.indexOf("base64")>=0 ? <img src={imageUrl} alt="" className={styles.avatar} /> : <img src={baseURL + "/" +user.headUrl} alt="" className={styles.avatar} />  }
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
          initialValue:this.props.user.userCode,
        })(
            <Input disabled={true}/>
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
          initialValue:this.props.user.email,
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
          initialValue:this.props.user.nickName,
        })(
            <Input />
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
          initialValue:this.props.user.realName,
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
          initialValue:this.props.user.sign,
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
          initialValue:this.props.user.phoneNum,
        })(
            <Input />
        )}
      </FormItem>

    </Modal>
  </div>)
  }
})
const UserFormModal = Form.create()(UserForm);
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
      showUserForm:false,
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

  handleLogout(){
    this.props.logout();
    this.context.router.push(`/login`);
  },

  handleRoleChange(value){
    this.setState({roleType: value});
  },
  showUserFormModal(){
    this.setState({showUserForm: true});
  },

  render(){


    const userInfo = this.props.user.get('userInfo')
    const currentRoleId = this.props.user.get('userRoles').length>0?this.props.user.get('userRoles').find((item)=>item.roleName === userInfo.userStyleName).role_type:[]
    return (
      <div className={styles.changeUser} onClick={(e)=>{e.stopPropagation()}}>
        <div className={styles.avatar}><img src = {baseURL+"/"+userInfo.headUrl}/></div>
        <div className={styles.name}>{userInfo.realName}</div>
        <div className={styles.division}></div>
        <div className={styles.menuList}>
          <div className={styles.item} onClick={this.showUserFormModal}><Icon type="user" />个人资料</div>
          <div className={styles.item}><Icon type="lock" />修改密码</div>
          <div className={styles.item} onClick={this.handleChangeRole}><Icon type="retweet" />更换角色</div>
          <div className={styles.item} onClick={this.handleLogout}><Icon type="logout" />退出</div>
        </div>
        <Modal wrapClassName={styles.modalWrapper} title='角色切换' visible={this.state.showRoleChange}
          onOk={this.handleConfirmRoleChange} onCancel={this.handleCancelRoleChange}
          width={300}
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
        <UserFormModal user={userInfo} visible={this.state.showUserForm}/>

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

export default connect(mapStateToProps,mapDispatchToProps)(ChangeUserDropDown)
