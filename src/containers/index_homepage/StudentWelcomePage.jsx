import React from 'react'
import {Carousel,Button} from 'antd'
import styles from './TeacherWelcomePage.scss'
import student1 from '../../public/images/student-index-background.png'

import doHomework from '../../public/images/do-homework.png'
import errorBook from '../../public/images/error-book.png'
import mircoVideo from '../../public/images/micro-video.png'
import course from '../../public/images/check-result.png'
import downloadAPP from '../../public/images/download-app.png'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const StudentWelcomePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  handleCourse(){
    this.context.router.push(`/index/course-center/schoolCourse`)
  },
  handleMicroVideo(){
    this.context.router.push(`/index/microvideo-mgr/areavideo`)
  },
  handleDoHomework(){
    this.context.router.push('/index/homework/homework')
  },
  handleError(){
    this.context.router.push('/index/homework/homework')
  },
  render(){
    const settings = {
      dots: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
    }
    return (
      <div className={styles.container}>
        <div className={styles.sliderContainer}>
          <Slider {...settings}>
            <div className={styles.carouselItem}>
              <img src={student1} />
            </div>
            <div className={styles.carouselItem}>
              <img src={student1} />
            </div>
            <div className={styles.carouselItem}>
              <img src={student1} />
            </div>
          </Slider>
        </div>
        <div className={styles.hotkey}>
          <div className={styles.buttonGroup}>
            <div className={styles.item}>
              <img src={course} />
              <Button className={styles.button} onClick={this.handleCourse}>学课程</Button>
            </div>
            <div className={styles.item}>
              <img src={mircoVideo} />
              <Button className={styles.button} onClick={this.handleMicroVideo}>看微课</Button>
            </div>
            <div className={styles.item}>
              <img src={doHomework} />
              <Button className={styles.button} onClick={this.handleDoHomework}>做作业</Button>
            </div>
            <div className={styles.item}>
              <img src={errorBook} />
              <Button className={styles.button} onClick={this.handleError}>错题本</Button>
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

export default StudentWelcomePage
