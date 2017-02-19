import React from 'react'
import styles from './NestingQuestion.scss'
import {Row,Col} from 'antd'
const NestingQuestion = React.createClass({
  render(){
    return (
      <div className={styles.noteQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>填空题</span>
        </div>
        <div className={styles.questionContainer}>
          <Row>
            <Col span={24}>
              <div className={styles.questionNo}>
              {
                this.props.questionInfo.get('questionNo')
              }
              </div>
              <div className={styles.questionContent} onClick={this.handleEditQuestion}>
              {
                this.state.editingQuestion?<div><Ueditor/></div>:<div>{this.state.question}</div>
              }
              {
                this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
                  value={this.state.score}
                  onChange={this.handleChangeScore}/></div>:null
              }
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            </Col>
          </Row>
        </div>
        <div className={styles.moveButton}>
          <div>
          </div>
        </div>
        {
          this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})
