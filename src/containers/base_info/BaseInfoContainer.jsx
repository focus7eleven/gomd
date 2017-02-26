import React from 'react'
import {Icon,Input,Table,Button,Modal,Form,Spin} from 'antd'
import styles from './BaseInfoContainer.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getWorkspaceData} from '../../actions/workspace'

const BaseInfoContainer = React.createClass({
  componentDidMount(){
    this.props.getWorkspaceData(this.props.location.pathname.split('/').slice(-1)[0],'','','')
  },

  componentWillReceiveProps(nextProps){
    if(!this.props.workspace.get('loading') && (nextProps.workspace.get('data').isEmpty() || (this.props.location.pathname != nextProps.location.pathname))){
      this.props.getWorkspaceData(nextProps.location.pathname.split('/').slice(-1)[0],'','','')
    }
  },

  render(){
    return this.props.workspace.get('loading') || this.props.menu.get('data').isEmpty()?<div className={styles.loading}><Spin size="large" /><div>努力加载中，请耐心等待！</div></div>:this.props.children
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
    getWorkspaceData:bindActionCreators(getWorkspaceData,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BaseInfoContainer)
