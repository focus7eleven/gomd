import React from 'react'
import {Tree} from 'antd'
import styles from './TreeComponent.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const TreeNode = Tree.TreeNode;

const TreeComponent = React.createClass({
  getInitialState(){
    return {}
  },

  getDefaultProps() {
    return {
      keys: ['0-0-0', '0-0-1'],
    };
  },

  onSelect(info) {
    console.log('selected', info);
  },

  render(){
    return (
      <Tree className={styles.container} showLine onSelect={this.onSelect}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-0" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0"/>
            <TreeNode title="leaf" key="0-0-0-1"/>
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title="sss" key="0-0-1-0" />
          </TreeNode>
        </TreeNode>
        <TreeNode title="parent 2" key="0-1">
          <TreeNode title="parent 2-0" key="0-1-0">
            <TreeNode title="leaf" key="0-1-0-0"/>
            <TreeNode title="leaf" key="0-1-0-1"/>
          </TreeNode>
          <TreeNode title="parent 2-1" key="0-1-1">
            <TreeNode title="sss" key="0-1-1-0" />
          </TreeNode>
        </TreeNode>
      </Tree>
    )
  }
})

function mapStateToProps(state){
  return{
  }
}

function mapDispatchToProps(dispatch){
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TreeComponent)
