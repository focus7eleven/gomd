import React from 'react'
import {Router, Route, browserHistory, IndexRoute, IndexRedirect} from 'react-router'
import AppContainer from './containers/AppContainer'
import AnnouncementEditor from './containers/editor/AnnouncementEditor'
import BaseInfoContainer from './containers/base_info/BaseInfoContainer'
import MainContainer from './containers/MainContainer'
import Navigation from './containers/navigation/Navigation'
import NavigationMini from './containers/navigation/NavigationMini'
import EduOutlinePage from './containers/base_info/edu_outline/EduOutline'
import LoginContainer from './containers/LoginContainer'
import Filter from './components/Filter'
import CourseFilterComponent from './components/course_filter/CourseFilterComponent'
import PhasePage from './containers/base_info/phase/PhasePage'
import GradePage from './containers/base_info/grade/GradePage'
import SubjectPage from './containers/base_info/subject/SubjectPage'
import {LoginControlHOC} from './enhancers/AccessControlContainer'
import DictPage from './containers/base_info/dict/DictPage'
import ResourceManagementPage from './containers/base_info/resource_management/ResourceManagementPage'
import OfficerPage from './containers/base_info/officer/OfficerPage'
import TeacherPage from './containers/base_info/teacher/TeacherPage'
import StudentPage from './containers/base_info/student/StudentPage'
import PatriarchPage from './containers/base_info/patriarch/PatriarchPage'
import RoleSettingPage from './containers/base_info/role_setting/RoleSettingPage'
import NormalGroupPage from './containers/base_info/normal_group/NormalGroupPage'
import MadeGroupPage from './containers/base_info/made_group/MadeGroupPage'
import DepartmentPage from './containers/base_info/department/DepartmentPage'
import SchoolDepartPage from './containers/base_info/school/SchoolDepartPage'
import ClassPage from './containers/base_info/class/ClassPage'
import GradeManagementPage from './containers/base_info/grade/GradeManagementPage'
import AreaPage from './containers/base_info/area/AreaPage'
import SchoolPage from './containers/base_info/school/SchoolPage'
import AreaDepartmentPage from './containers/base_info/department/AreaDepartmentPage'
import CreateClassPage from './containers/course_center/CreateClassPage'
import CourseCenterContainer from './containers/course_center/CourseCenterContainer'
import PublicCoursePage from './containers/course_center/PublicCoursePage'
import PublishedCoursePage from './containers/course_center/PublishedCoursePage'
import DetailContainer from './containers/course_center/detail/DetailContainer'
import DetailPage from './containers/course_center/detail/DetailPage'
import TeacherCoursePage from './containers/course_center/TeacherCoursePage'
import SchoolCoursePage from './containers/course_center/SchoolCoursePage'
import UncheckedCoursePage from './containers/course_center/UncheckedCoursePage'
import MicroCourseContainer from './containers/micro_course/MicroCourseContainer'
import PublicVideoPage from './containers/micro_course/PublicVideoPage'
//import CreateMicroVideoPage from './containers/micro_course/CreateMicroVideoPage'
import SchoolVideoPage from './containers/micro_course/SchoolVideoPage'
import TeacherVideoPage from './containers/micro_course/TeacherVideoPage'
import CollectionVideoPage from './containers/micro_course/CollectionVideoPage'
import UncheckVideoPage from './containers/micro_course/UncheckVideoPage'
import VideoDetailContainer from './containers/micro_course/detail/VideoDetailContainer'
import VideoDetailPage from './containers/micro_course/detail/VideoDetailPage'
import HomeworkContainer from './containers/homework_center/HomeworkContainer'
import CreateOrEditHomeworkPage from './containers/homework_center/CreateOrEditHomework'
import HomeworkUnchecked from './containers/homework_center/HomeworkUnchecked'
import ExampaperContainer from './containers/exampaper_center/ExampaperContainer'
import MyExampaperPage from './containers/exampaper_center/MyExampaperPage'
import CreateExampaper from './containers/exampaper_center/CreateExampaper'
import DisplayExampaper from './containers/exampaper_center/DisplayExampaper'
import HomeworkLibPage from './containers/homework_center/HomeworkLibPage'
import HomeworkDetailPage from './containers/homework_center/HomeworkDetailPage'
import HomeworkPublished from './containers/homework_center/HomeworkPublished'
import ExamPaperReviseResult from './containers/homework_center/ExamPaperReviseResult'
import UncheckedHomeworkPage from './containers/homework_center/UncheckedHomeworkPage'
import StudentHomeworkPage from './containers/homework_center/StudentHomeworkPage'
import AnswerHomeworkPage from './containers/homework_center/AnswerHomeworkPage';
import HomeworkAnswerResult from './containers/homework_center/HomeworkAnswerResultPage';
import CommentHomeworkPage from './containers/homework_center/CommentHomeworkPage';
import PigaiResultPage from './containers/homework_center/PigaiResultPage';

import NotifyContainer from './containers/notify_center/NotifyContainer'
import NotificationLibPage from './containers/notify_center/NotificationLibPage'
import NotificationDetail from './containers/notify_center/NotificationDetail'
import TaskDetail from './containers/notify_center/TaskDetail'
import EduInfoDetail from './containers/notify_center/EduInfoDetail'
import CreateNewsPage from './containers/notify_center/CreateNewsPage'

import VideoComponent from './components/video/VideoComponent'
import CourseTree from './components/tree/CourseTree'
import UEditor from './components/ueditor/Ueditor'
import MultipleChoiceQuestion from './components/table/exampaper/MultipleChoiceQuestion'
import NoteQuestion from './components/table/exampaper/NoteQuestion'

import AnswerSheetContainer from './containers/answer_sheet/AnswerSheetContainer'
import CreateAnswerSheetPage from './containers/answer_sheet/CreateAnswerSheetPage'
import AnswerSheetPage from './containers/answer_sheet/AnswerSheetPage'
import EditSheetContainer from './containers/answer_sheet/EditSheetContainer'
import EditAnswerSheetPage from './containers/answer_sheet/EditAnswerSheetPage'
import WelcomPageContainer from './containers/index_homepage/WelcomePageContainer'

import TeachingPlanContainer from './containers/teaching-plan/TeachingPlanContainer'
import KindergartenPage from './containers/teaching-plan/KindergartenPage'
import PlanDetailPage from './containers/teaching-plan/PlanDetailPage'
import ZTreeComponent from './components/ztree/ZTreeComponent'

const routes = (
	<Router history={browserHistory}>
		<Route path="/" component={AppContainer}>
			<Route path="test">
				<Route path="cf" component={CourseFilterComponent}></Route>
				<Route path="editor" component={AnnouncementEditor}></Route>
				<Route path='navigation' component={Navigation}></Route>
				<Route path='navigation-mini' component={NavigationMini}></Route>
				<Route path='edu-outline' component={EduOutlinePage}></Route>
				<Route path='filter' component={Filter}></Route>
				<Route path='videoComponent' component={VideoComponent}></Route>
				<Route path='coursetree' component={CourseTree}></Route>
				<Route path='ueditor' component={UEditor}></Route>
				<Route path='multipleChoiceQuestion' component={MultipleChoiceQuestion}></Route>
				<Route path='noteQuestion' component={NoteQuestion}></Route>
				<Route path='ztreecomponent' component={ZTreeComponent}></Route>
			</Route>
			<Route path='login' component={LoginContainer}></Route>

			<Route path='index' component={LoginControlHOC(MainContainer)}>
				{/* <IndexRedirect to='base-info/phase' component={PhasePage} /> */}
				{/* <Route path='base-info' component={BaseInfoContainer}> */}
				<IndexRedirect to='welcome'/>
				<Route path='welcome' component={WelcomPageContainer}/>
				<Route path=':second' component={BaseInfoContainer}>
					{/* <IndexRedirect to='phase'/> */}

					{/* 基础数据 */}
					<Route path='phase' component={PhasePage}></Route>
					<Route path='grade' component={GradePage}></Route>
					<Route path='subject' component={SubjectPage}></Route>

					{/* 人员管理 */}
					<Route path='officer' component={OfficerPage}></Route>
					<Route path='teacher' component={TeacherPage}></Route>
					<Route path='student' component={StudentPage}></Route>
					<Route path='patriarch' component={PatriarchPage}></Route>

					{/* 通用设置 */}
					<Route path='dict' component={DictPage}></Route>
					<Route path='resource' component={ResourceManagementPage}></Route>
					<Route path='role' component={RoleSettingPage}></Route>

					{/* 教育大纲 */}
					<Route path='textbook'>
						<IndexRoute component={EduOutlinePage}/>
					</Route>

					{/* 群组管理 */}
					<Route path='normalgroup' component={NormalGroupPage}></Route>
					<Route path='madegroup' component={MadeGroupPage}></Route>

					<Route path='cityDepartment' component={DepartmentPage}></Route>
					<Route path='areaDepartment' component={AreaDepartmentPage}></Route>
					<Route path='area' component={AreaPage}></Route>
					<Route path='schoolDepart' component={SchoolDepartPage}></Route>
					<Route path='classes' component={ClassPage}></Route>
					<Route path='school' component={SchoolPage}></Route>
					<Route path='gradeSet' component={GradeManagementPage}></Route>
				</Route>
				{/*<Route path='notice_mgr' component={NoticeManagerContainer} />*/}

				{/* 课程中心 */}

				<Route path=':second' component={CourseCenterContainer}>
					<Route path='publicCourse' component={PublicCoursePage}></Route>
					<Route path='newCourse' component={CreateClassPage}></Route>
					<Route path='publishedCourse' component={PublishedCoursePage}></Route>
					<Route path='(:type)/detail/(:lessonId)' component={DetailContainer}>
						<IndexRoute component={DetailPage}/>
					</Route>
					<Route path='courseInfo' component={TeacherCoursePage} />
					<Route path='schoolCourse' component={SchoolCoursePage} />
					<Route path='uncheckCourse' component={UncheckedCoursePage} />
				</Route>
                {/* 教学计划及总结*/}
                <Route path=':second' component={TeachingPlanContainer}>
					<Route path='plan/:type' component={KindergartenPage}/>
					<Route path='planDetail/:planId' component={PlanDetailPage}/>
					{/*<Route path='primarySchool' component={}/>*/}
					{/*<Route path='juniorHighSchool' component={}/>*/}
					{/*<Route path='seniorMiddleSchool' component={}/>*/}
				</Route>


				{/* 微课中心 */}
				<Route path=':second' component={MicroCourseContainer}>
					<Route path='areavideo' component={PublicVideoPage}></Route>
					<Route path='publicvideo' component={SchoolVideoPage}></Route>
					<Route path='teachervideo' component={TeacherVideoPage}></Route>
					<Route path='mycollection' component={CollectionVideoPage}></Route>
					<Route path='uncheckedvideo' component={UncheckVideoPage}></Route>
					<Route path='(:type)/video_detail/(:videoId)' component={VideoDetailContainer}>
						<IndexRoute component={VideoDetailPage} />
					</Route>
					{/*<Route path='createvideo' component={CreateMicroVideoPage}></Route>*/}
				</Route>

				{/* 作业中心 */}
				<Route path=':second' component={HomeworkContainer}>
					<Route path='sethomework(/:type)(/:homeworkId)' component={CreateOrEditHomeworkPage}></Route>
                    <Route path='homework' component={HomeworkPublished}></Route>
                    <Route path="check_results/:homeworkClassId" component={ExamPaperReviseResult}></Route>
					<Route path="homework_lib/:type" component={HomeworkLibPage}/>{/* 公共作业，学校作业，教师个人作业 */}
					<Route path="homework_detail/:homeworkId" component={HomeworkDetailPage}/>{/* 作业详情 */}
					<Route path="homework_my_unchecked" component={UncheckedHomeworkPage}/>{/* 自己提交给别人审核的作业 */}
					<Route path='homework_unchecked' component={HomeworkUnchecked}></Route>{/* 需要我审核的作业 */}
					<Route path="stu_homework" component={StudentHomeworkPage}></Route>{/* 学生我的作业 */}
					<Route path="answer_homework" component={AnswerHomeworkPage}></Route>{/* 学生-答卷/订正 */}
					<Route path="homework_answer_result" component={HomeworkAnswerResult}></Route>{/* 学生-查看结果 */}
					<Route path="comment_homework" component={CommentHomeworkPage}></Route>{/* 老师-批改答题/批改订正 */}
					<Route path="pigai_enarticle_results" component={PigaiResultPage}></Route>{/* 老师-查看英语作文批改结果 */}

				</Route>

                {/*资讯中心*/}
                <Route path=':second' component={NotifyContainer}>
                    <Route path='setnotification' component={CreateNewsPage}></Route>
                    <Route path='settask' component={CreateNewsPage}></Route>
                    <Route path='neweduinfo' component={CreateNewsPage}></Route>
                    <Route path='notify_lib/:type' component={NotificationLibPage}></Route>
                    <Route path="showNotificationDetail/:notificationId" component={NotificationDetail}></Route>{/* 通知详情 */}
                    <Route path="showTaskDetail/:taskId" component={TaskDetail}></Route>{/* 任务详情 */}
                    <Route path="showEduInfoDetail/:eduinfoId" component={EduInfoDetail}></Route>{/* 资讯详情 */}
                </Route>

				{/* 题库机组卷 */}
				<Route path=':second' component={ExampaperContainer}>
					<Route path='selfexampapercenter' >
						<IndexRoute component={MyExampaperPage}/>
						<Route path='displayExampaper/(:examId)' component={DisplayExampaper}></Route>
					</Route>
					<Route path='newexampaper' component={CreateExampaper}></Route>
					<Route path='editExampaper/(:examId)' component={()=><CreateExampaper type='edit'/>}></Route>
					<Route path='displayExampaper/(:examId)' component={DisplayExampaper}></Route>
					<Route path='draftpapercenter' component={(props)=><MyExampaperPage type='draft' {...props}/>}></Route>
				</Route>

				{/* 答题卡 */}
				<Route path=':second' component={AnswerSheetContainer}>
					<Route path='addAnswersheet' component={CreateAnswerSheetPage}></Route>
					<Route path='answersheet' component={AnswerSheetPage}></Route>
					<Route path='answersheet/editAnswersheet/(:sheetId)' component={EditSheetContainer}>
						<IndexRoute component={EditAnswerSheetPage} />
					</Route>
				</Route>

			</Route>
		</Route>
	</Router>
)

export default routes
