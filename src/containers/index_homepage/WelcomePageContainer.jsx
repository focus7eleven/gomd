import React from 'react'
import {connect} from 'react-redux'
import Slider from 'react-slick'
import {Button} from 'antd';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';


import {ROLE_TEACHER, ROLE_STUDENT,ROLE_AREA_RES_MGR,
    ROLE_AREA_INFO_MGR,ROLE_AREA_LEADER,ROLE_AREA_OFFICER,
    ROLE_AREA_RES_CHECK,ROLE_AREA_PRICE_CHECK,
    ROLE_SCHOOL_RES_CHECK,ROLE_SCHOOL_INFO_MGR} from '../../constant'

import carouse1 from '../../public/images/welcome/carouse1.png';
import carouse2 from '../../public/images/welcome/carouse2.png';
import carouse3 from '../../public/images/welcome/carouse3.png';
import carouse4 from '../../public/images/welcome/carouse4.png';
import carouse5 from '../../public/images/welcome/carouse5.png';
import carouse6 from '../../public/images/welcome/carouse6.png';

import createHomeworkImg from  '../../public/images/welcome/action_img/create_homework.png';
import assignHomeworkImg from  '../../public/images/welcome/action_img/assign_homework.png';
import viewCommentHomeworkTeaImg from  '../../public/images/welcome/action_img/view_comment_homework_tea.png';
import commentHomeworkImg from  '../../public/images/welcome/action_img/comment_homework.png';

import textbookImg from  '../../public/images/welcome/action_img/public_lesson.png';
import publicLessonImg from  '../../public/images/welcome/action_img/public_lesson.png';
import publicHomeworkImg from  '../../public/images/welcome/action_img/public_homework.png';
import publicVideoImg from  '../../public/images/welcome/action_img/public_video.png';

import learnLessonImg from  '../../public/images/welcome/action_img/learn_lesson.png';
import viewVideoImg from  '../../public/images/welcome/action_img/view_video.png';
import doHomeworkImg from  '../../public/images/welcome/action_img/do_homework.png';
import wrongQuestionsImg from  '../../public/images/welcome/action_img/wrong_questions.png';

import cityDepartmentImg from  '../../public/images/welcome/action_img/city_department.png';
import areaImg from  '../../public/images/welcome/action_img/area.png';
import schoolImg from  '../../public/images/welcome/action_img/school.png';
import officerImg from  '../../public/images/welcome/action_img/officer.png';

import teachingSummaryViewImg from  '../../public/images/welcome/action_img/teaching_summary_view.png';

import uncheckCourseImg from  '../../public/images/welcome/action_img/uncheck_course.png';
import uncheckedHomeworkImg from  '../../public/images/welcome/action_img/unchecked_homework.png';
import uncheckedVideoImg from  '../../public/images/welcome/action_img/unchecked_video.png';

import teacherImg from  '../../public/images/welcome/action_img/teacher.png';
import studentImg from  '../../public/images/welcome/action_img/student.png';
import patriarchImg from  '../../public/images/welcome/action_img/patriarch.png';

import downloadAPP from '../../public/images/download-app.png'

import styles from './WelcomPageContainer.scss';

const WelcomPageContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            carouses: [carouse1, carouse2, carouse3, carouse4, carouse5, carouse6],
            actions:{
                createHomework:{imgSrc:createHomeworkImg,routeUrl:"/index/resource_center/sethomework",name:"创建作业"},
                assignHomework:{imgSrc:assignHomeworkImg,routeUrl:"/index/homework/homework_lib/homework_self",name:"布置作业"},
                commentHomework:{imgSrc:commentHomeworkImg,routeUrl:"/index/teaching_center/homework",name:"批改作业"},
                viewCommentHomeworkTea:{imgSrc:viewCommentHomeworkTeaImg,routeUrl:"/index/teaching_center/homework",name:"查阅结果"},
                textbook:{imgSrc:textbookImg,routeUrl:"/index/base_info/textbook",name:"教学大纲"},
                publicLesson:{imgSrc:publicLessonImg,routeUrl:"/index/resource_center/publicCourse",name:"公共课程"},
                publicHomework:{imgSrc:publicHomeworkImg,routeUrl:"/index/homework/homework_lib/homework_area",name:"公共作业"},
                publicVideo:{imgSrc:publicVideoImg,routeUrl:"/index/resource_center/areavideo",name:"公共微课"},
                learnLesson:{imgSrc:learnLessonImg,routeUrl:"/index/teaching_center/courseInfoStu",name:"学课程"},
                viewVideo:{imgSrc:viewVideoImg,routeUrl:"/index/resource_center/myvideo",name:"看微课"},
                doHomework:{imgSrc:doHomeworkImg,routeUrl:"/index/teaching_center/stu_homework",name:"做作业"},
                wrongQuestions:{imgSrc:wrongQuestionsImg,routeUrl:"/index/welcome",name:"错题本"},                 /**目前没做**/
                cityDepartment:{imgSrc:cityDepartmentImg,routeUrl:"/index/base_info/cityDepartment",name:"机关科室"},
                area:{imgSrc:areaImg,routeUrl:"/index/base_info/area",name:"辖区县局"},
                school:{imgSrc:schoolImg,routeUrl:"/index/base_info/school",name:"辖区学校"},
                officer:{imgSrc:officerImg,routeUrl:"/index/base_info/officer",name:"科员管理"},
                teachingSummaryView:{imgSrc:teachingSummaryViewImg,routeUrl:"/index/teaching_center/teachingSummaryView",name:"教学计划"},
                uncheckCourse:{imgSrc:uncheckCourseImg,routeUrl:"/index/resource_center/uncheckCourse",name:"待审核课程"},
                uncheckedHomework:{imgSrc:uncheckedHomeworkImg,routeUrl:"/index/resource_center/homework_unchecked",name:"待审核作业"},
                uncheckedVideo:{imgSrc:uncheckedVideoImg,routeUrl:"/index/resource_center/uncheckedvideo",name:"待审核微课"},
                teacher:{imgSrc:teacherImg,routeUrl:"/index/base_info/teacher",name:"教师管理"},
                student:{imgSrc:studentImg,routeUrl:"/index/base_info/student",name:"学生管理"},
                patriarch:{imgSrc:patriarchImg,routeUrl:"/index/base_info/patriarch",name:"家长管理"},
            }
        }
    },

    render(){
        const carouses = this.props.carouses;
        const sliderSettings = {
            dots: true,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
        };
        const actions = this.getActionButtons(this.props.user.get('userInfo').userStyle);

        return (
            <div className={styles.container}>
                <div className={styles.sliderContainer}>
                    <Slider {...sliderSettings}>
                        {carouses.map(
                            (carouseImg,index) => {
                                return (
                                    <div key={index} className={styles.carouselItem}>
                                        <img src={carouseImg}/>
                                    </div>
                                )
                            }
                        )}
                    </Slider>
                </div>
                <div className={styles.hotkey}>
                    <div className={styles.buttonGroup}>
                        {actions.map(
                            (action,index) => {
                                return (
                                    <div key={index} className={styles.item} onClick={()=>{this.context.router.push(action.routeUrl)}}>
                                        <img src={action.imgSrc}/>
                                        <Button className={styles.button} >{action.name}</Button>
                                    </div>
                                );
                            }
                        )}
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
    },
    getActionButtons(userStyle) {
        const {createHomework,assignHomework,commentHomework,viewCommentHomeworkTea} = this.props.actions;
        const {textbook,publicLesson,publicHomework,publicVideo} = this.props.actions;
        const {learnLesson,viewVideo,doHomework,wrongQuestions} = this.props.actions;
        const {cityDepartment,area,school,officer} = this.props.actions;
        const {teachingSummaryView} = this.props.actions;
        const {uncheckCourse,uncheckedHomework,uncheckedVideo} = this.props.actions;
        const {teacher,student,patriarch} = this.props.actions;

        switch (userStyle) {
            case ROLE_TEACHER:
                return [createHomework,assignHomework,commentHomework,viewCommentHomeworkTea];
                break;
            case ROLE_AREA_RES_MGR:
                return [textbook,publicLesson,publicHomework,publicVideo];
                break;
            case ROLE_STUDENT:
                return [learnLesson,viewVideo,doHomework,wrongQuestions];
                break;
            case ROLE_AREA_INFO_MGR:
            case ROLE_AREA_LEADER:
                return [cityDepartment,area,school,officer];
                break;
            case ROLE_AREA_OFFICER:
                return [teachingSummaryView,publicLesson,publicHomework,publicVideo];
                break;
            case ROLE_AREA_RES_CHECK:
            case ROLE_AREA_PRICE_CHECK:
            case ROLE_SCHOOL_RES_CHECK:
                return [uncheckCourse,uncheckedHomework,uncheckedVideo];
                break;
            case ROLE_SCHOOL_INFO_MGR:
                return [teacher,student,patriarch,officer];
                break;
            default:
                return [];
                break;
        }
    }
})
function mapStateToProps(state) {
    return {
        user: state.get('user')
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomPageContainer)
