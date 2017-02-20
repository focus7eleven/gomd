import React from 'react'
import styles from './ExamElement.scss'
import {Icon} from 'antd'

const ExamElement = React.createClass({
  getDefaultProps(){
    return {
      text:'',
      onClick:()=>{},
      style:{},
    }
  },
  render(){
    return (
      <div className={styles.tag} style={this.props.style} onClick={this.props.onClick}>
        <span className={styles.content}><Icon type='plus' style={{color:'#FDAA29'}}/>{this.props.text}</span>
      </div>
    )
  }
})

export default ExamElement
