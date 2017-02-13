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
import MicroCourseContainer from './containers/micro_course/MicroCourseContainer'
import PublicVideoPage from './containers/micro_course/PublicVideoPage'
import SchoolVideoPage from './containers/micro_course/SchoolVideoPage'
import TeacherVideoPage from './containers/micro_course/TeacherVideoPage'
import CollectionVideoPage from './containers/micro_course/CollectionVideoPage'
import HomeworkContainer from './containers/homework_center/HomeworkContainer'
import CreateHomeworkPage from './containers/homework_center/CreateHomework'
import ExampaperContainer from './containers/exampaper_center/ExampaperContainer'
import MyExampaperPage from './containers/exampaper_center/MyExampaperPage'
import CreateExampaper from './containers/exampaper_center/CreateExampaper'
import HomeworkLibPage from './containers/homework_center/HomeworkLibPage'

import VideoComponent from './components/video/VideoComponent'
import CourseTree from './components/tree/CourseTree'
import UEditor from './components/ueditor/Ueditor'
import MultipleChoiceQuestion from './components/table/exampaper/MultipleChoiceQuestion'
import NoteQuestion from './components/table/exampaper/NoteQuestion'
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
			</Route>
			<Route path='login' component={LoginContainer}></Route>

			<Route path='index' component={LoginControlHOC(MainContainer)}>
				{/* <IndexRedirect to='base-info/phase' component={PhasePage} /> */}
				{/* <Route path='base-info' component={BaseInfoContainer}> */}
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
					<Route path='detail/(:lessonId)' component={DetailContainer}>
						<IndexRoute component={DetailPage}/>
					</Route>
					<Route path='courseInfo' component={TeacherCoursePage} />
					<Route path='schoolCourse' component={SchoolCoursePage} />
				</Route>

				{/* 微课中心 */}
				<Route path=':second' component={MicroCourseContainer}>
					<Route path='areavideo' component={PublicVideoPage}></Route>
					<Route path='publicvideo' component={SchoolVideoPage}></Route>
					<Route path='teachervideo' component={TeacherVideoPage}></Route>
					<Route path='mycollection' component={CollectionVideoPage}></Route>
					<Route path='uncheckedvideo' component={CollectionVideoPage}></Route>
				</Route>

				{/* 作业中心 */}
				<Route path="homework_lib/:type" component={HomeworkLibPage}/>
				<Route path=':second' component={HomeworkContainer}>
					<Route path='sethomework' component={CreateHomeworkPage}></Route>
				</Route>

				{/* 题库机组卷 */}
				<Route path=':second' component={ExampaperContainer}>
					<Route path='selfexampapercenter' component={MyExampaperPage}></Route>
					<Route path='newexampaper' component={CreateExampaper}></Route>
				</Route>

			</Route>
		</Route>
	</Router>
)

export default routes
