import React from 'react'
import styles from './MultipleChoiceQuestion.scss'
import {List,fromJS} from 'immutable'
import {Table} from 'antd'
const MultipleChoiceQuestion = React.createClass({
  getInitialState(){
    return {
      answerList:List()
    }
  },
  render(){
    return(
      <div className={styles.multipleChoiceQuestion}>
        <Table />
      </div>
    )
  }
})
