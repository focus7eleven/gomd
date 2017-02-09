import React from 'react'
import {Menu,Icon} from 'antd'
import {Motion,spring} from 'react-motion'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getMenu} from '../../actions/menu'
import styles from './NavigationMini.scss'
import logo from 'images/logo.png'
import ChangeUserDropDown from './ChangeUserDropdown'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const NavigationMini = React.createClass({
  getDefaultProps(){
    return {
      menu:[]
    }
  },
  getInitialState(){
    return {
      openMenu:false,
      showChangeUser:false,
    }
  },

  componentDidMount(){
    this.props.user.get('accessToken')||sessionStorage.getItem('accessToken')?this.props.getMenu(this.props.user.get('accessToken')):null
  },
  renderNavigate(menu){
    return menu.map( (v,key) => {
      if(!v.get('childResources')){
        return (
          <Menu.Item key={v.get('resourceName')}>{v.get('resourceName')}</Menu.Item>
        )
      }else{
        return (
          <SubMenu key={v.get('resourceName')} title={<span>{v.get('resourceName')}</span>}>
            {
              this.renderNavigate(v.get('childResources'))
            }
          </SubMenu>
        )
      }
    })
  },
  render(){
    return (
      <div className={styles.navigationMini}>
        {this.state.openMenu?<div className={styles.mask} onClick={()=>{this.setState({openMenu:false})}}></div>:null}
        <div className={styles.navigationToggle} >
          <Icon type="bars" onClick={()=>{this.setState({openMenu:true})}}/><div className={styles.decoration}><div className={styles.logo}><img src={logo}/></div>
          <div className={styles.avatar} onClick={(e)=>{this.setState({showChangeUser:this.state.showChangeUser?false:true});e.stopPropagation()}}>
            <img src='https://unsplash.it/25/25' /><span className={styles.nameDesc}>曹老师（任课老师）</span>{this.state.showChangeUser?<ChangeUserDropDown/>:null}
          </div>
        </div>
        </div>
        <Motion defaultStyle={{x: -240}} style={this.state.openMenu?{x:spring(0)}:{x:spring(-240)}}>
        {interpolatingStyle => (
          <div style={{left:interpolatingStyle.x+'px'}} className={styles.leftNavigation}>
            <Menu style={{ width: 240 ,height: '100%'}} mode="inline">
              {!this.props.menu.get('data').isEmpty()?this.renderNavigate(this.props.menu.get('data')):null}
            </Menu>
          </div>
        )}
        </Motion>
      </div>
    )
  }
})

function mapStateToProps(state) {
  return {
    menu:state.get('menu'),
    user:state.get('user'),
  }
}
function mapDispatchToProps(dispatch){
  return {
    getMenu:bindActionCreators(getMenu,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NavigationMini)
