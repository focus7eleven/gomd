import React from 'react'
import {Icon,Modal,Select} from 'antd'
import styles from './ChangeUserDropdown.scss'
import {logout,getUserInfo,changeRole} from '../../actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {baseURL} from '../../config'
import {getMenu} from '../../actions/menu'
const Option = Select.Option

// 导航栏右侧的用户个人信息展示框
const ChangeUserDropDown = React.createClass({
  contextTypes:{
    router: React.PropTypes.object,
  },

  getInitialState(){
    return ({
      showRoleChange: false,
      roleType: -1,
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
    this.props.onClose()
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

  render(){
    const userInfo = this.props.user.get('userInfo')
    const currentRoleId = this.props.user.get('userRoles').length>0?this.props.user.get('userRoles').find((item)=>item.roleName === userInfo.userStyleName).role_type:[]
    return (
      <div className={styles.changeUser} onClick={(e)=>{e.stopPropagation()}}>
        <div className={styles.avatar}><img src = {baseURL+"/"+userInfo.headUrl}/></div>
        <div className={styles.name}>{userInfo.realName}</div>
        <div className={styles.division}></div>
        <div className={styles.menuList}>
          <div className={styles.item}><Icon type="user" />个人资料</div>
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
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangeUserDropDown)
