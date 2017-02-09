import React from 'react'
import styles from './ExamElement.scss'
import {Icon} from 'antd'

const ExamElement = React.createClass({
  getDefaultProps(){
    return {
      text:'',
      onClick:()=>{}
    }
  },
  render(){
    return (
      <div className={styles.tag} onClick={this.props.onClick}>
        <span className={styles.content}><Icon type='plus' style={{color:'#FDAA29'}}/>{this.props.text}</span>
      </div>
    )
  }
})

export default ExamElement
