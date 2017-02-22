import React from 'react'
import {Carousel} from 'antd'
import styles from './TeacherWelcomePage.scss'
import teacher1 from '../../public/images/teacher-index-background.png'

const TeacherWelcomePage = React.createClass({
  render(){
    return (
      <div className={styles.container}>
        <div>
          <Carousel>
            <div className={styles.carouselItem}>
              <img src={teacher1} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher1} />
            </div>
            <div className={styles.carouselItem}>
              <img src={teacher1} />
            </div>
          </Carousel>
        </div>
        <div>
        </div>
      </div>
    )
  }
})

export default TeacherWelcomePage
