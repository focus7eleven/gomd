import React from 'react'
import {List,fromJS} from 'immutable'
import {Icon} from 'antd'
import styles from './CourseTree.scss'

const treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
    children:[{
      label: 'Child Node1',
      value: '0-0-1-1',
      key: '0-0-1-1',
      children:[],
    }],
  }, {
    label: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
    children:[{
      label: 'Child Node1',
      value: '0-0-2-1',
      key: '0-0-2-1',
      children:[],
    }],
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children:[{
    label: 'Child Node1',
    value: '0-1-1',
    key: '0-1-1',
    children:[],
  }],
}];
const INITX=0,INITY=0,deltaX=20,deltaY=30
const unfoldIcon = (props) => (
  <div className={styles.icon} onClick={props.onClick}><Icon style={{color:'white'}} type='plus'/></div>
)
const foldIcon = (props) => (
  <div className={styles.icon} onClick={props.onClick}><Icon style={{color:'white'}} type='minus'/></div>
)
const CourseTree = React.createClass({
  getDefaultProps(){
    return {
      treeData:fromJS(treeData)
    }
  },
  getInitialState(){
    return {
      openedList:List(['0-0']),
    }
  },

  calculatePos(tree){
    let result = List()
    let rank = 0
    let openedList = this.state.openedList
    function walk(tree,result,rank){
      tree.forEach(treeNode => {
        let opened = openedList.find(v => v==treeNode.get('value'))
        if(opened){
          let x = INITX + rank*deltaX
          let y = INITY + result.size*deltaY
          result = result.push(fromJS({
            x,
            y,
            opened,
            ...treeNode.toJS(),
          }))
          result = walk(treeNode.get('children'),result,rank+1)
        }else{
          let x = INITX + rank*deltaX
          let y = INITY + result.size*deltaY
          result = result.push(fromJS({
            x,
            y,
            opened,
            ...treeNode.toJS(),
          }))
        }
      })
      return result
    }
    return walk(tree,result,rank)
  },
  //展开
  handleUnFold(value){
    this.setState({
      openedList:this.state.openedList.push(value)
    })
  },
  //收起
  handleFold(value){
    this.setState({
      openedList:this.state.openedList.filter(v => v!=value)
    })
  },
  renderNode(v){
    if(v.get('children').isEmpty()){
      //没有子目录
      return <span>{v.get('label')}</span>
    }else{
      //有子目录
      return v.get('opened')?<span>{foldIcon({onClick:this.handleFold.bind(this,v.get('value'))})}{v.get('label')}</span>:
      <span>{unfoldIcon({onClick:this.handleUnFold.bind(this,v.get('value'))})}{v.get('label')}</span>
    }
  },
  render(){
    const styleList = this.calculatePos(this.props.treeData)
    return (
      <div className={styles.container}>
      {
        styleList.map((v,k)=>(
          <div className={styles.treeNode} style={{top:v.get('y'),left:v.get('x')}} key={k}>
          {
            this.renderNode(v)
          }
          </div>
        ))
      }
      </div>
    )
  }
})

export default CourseTree
