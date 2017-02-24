import React from 'react'
import {Carousel,Button} from 'antd'
import styles from './TeacherWelcomePage.scss'
import teacher1 from '../../public/images/teacher-index-background.png'
import teacher2 from '../../public/images/teacher2-index-background.png'
import teacher3 from '../../public/images/teacher3-index-background.png'
import teacher4 from '../../public/images/teacher4-index-background.png'
import teacher5 from '../../public/images/teacher5-index-background.png'
import teacher6 from '../../public/images/teacher6-index-background.png'

import createHomework from '../../public/images/create-homework.png'
import publishHomework from '../../public/images/publish-homework.png'
import checkHomework from '../../public/images/check-homework.png'
import checkResult from '../../public/images/check-result.png'
import downloadAPP from '../../public/images/download-app.png'

const TeacherWelcomePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  handleCreateHomework(){
    this.context.router.push(`/index/homework/sethomework`)
  },
  handlePublishHomework(){
    this.context.router.push(`/index/homework/homework`)
  },
  handleCheckHomework(){
    this.context.router.push('/index/homework/homework')
  },
  handleCheckResult(){
    this.context.router.push('/index/homework/homework')
  },
  render(){
    return (
      <div className={styles.container}>
        <div>
          <Carousel autoplay>
            <div className={styles.carouselItem}>
              <img src={teacher1} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher2} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher3} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher4} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher5} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher6} />
            </div>
          </Carousel>
        </div>
        <div className={styles.hotkey}>
          <div className={styles.buttonGroup}>
            <div className={styles.item}>
              <img src={createHomework} />
              <Button className={styles.button} onClick={this.handleCreateHomework}>创建作业</Button>
            </div>
            <div className={styles.item}>
              <img src={publishHomework} />
              <Button className={styles.button} onClick={this.handlePublishHomework}>发布作业</Button>
            </div>
            <div className={styles.item}>
              <img src={checkHomework} />
              <Button className={styles.button} onClick={this.handleCheckHomework}>批改作业</Button>
            </div>
            <div className={styles.item}>
              <img src={checkResult} />
              <Button className={styles.button} onClick={this.handleCheckResult}>查阅结果</Button>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.content}>
              <div className={styles.left}>
                <img src={downloadAPP}/>
                <span>教师移动端APP(安卓手机/苹果手机/安卓平板/苹果平板)</span>
              </div>
              <a>点击下载></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default TeacherWelcomePage
