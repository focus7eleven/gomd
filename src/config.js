import _ from 'underscore'

export const baseURL = "http://139.224.194.45:8080"
// const baseURL = "http://127.0.0.1:8080"

// App config the for development and deployment environment.
const isProduction = process.env.NODE_ENV === "production"

const config = _.extend({
	// common config
	debug: !isProduction,
},{
	// dev config
	api:{
		key:{
			get:`${baseURL}/key`
		},
		permission:{
			tree:{
				get:`${baseURL}/resource/tree`
			},
			list:{
				get:(roleId)=>`${baseURL}/role/resource/list?roleId=${roleId}`
			},
			set:{
				update:`${baseURL}/role/resource/set`
			}
		},
		select:{
			json:{
				get:(selectid,selectname,table,selectstyle,selectcompareid)=>`${baseURL}/select.json?selectid=${selectid}&selectname=${selectname}&table=${table}&selectstyle=${selectstyle}&selectcompareid=${selectcompareid}`
			},
			change:{
				update:`${baseURL}/select/change`
			}
		},
		user:{
			login:{
				post:`${baseURL}/LoginWithToken`
			},
			logout:{
				post:`${baseURL}/account/logout`
			},
			role: {
				get: (userId) => `${baseURL}/user/role/get?userId=${userId}`,
				roleType: `${baseURL}/account/changeRoleWithToken`,
			},
			info: {
				getUserId: `${baseURL}/getuserid`,
				getInfo: `${baseURL}/session`,
			},
		},
		menu:{
			get:`${baseURL}/getMenuWithTreeFormat`
		},
		workspace:{
			baseInfo:{
				baseData:{
					get:(type,currentPage,pageShow,search,suffix='page') => `${baseURL}/${type}/${suffix}?currentPage=${currentPage}&search=${search}&pageShow=${pageShow}`,
					getWithUrl: (url) => `${baseURL}/${url}`,
				}
			}
		},
		phase:{
			post:`${baseURL}/phase/add`,
			update:`${baseURL}/phase/edit`,
			phaseList:{
				get:`${baseURL}/phase/phaseList`,
			},
			subjectList:{
				get:(phaseCode)=>`${baseURL}/phase/subject?phaseCode=${phaseCode}`,
				update:`${baseURL}/phase/subject/set`
			}
		},
		subject:{
			post: `${baseURL}/subject/add`,
			update: `${baseURL}/subject/edit`,
			subjectList:{
				get:`${baseURL}/subject/list`
			}
		},
		grade:{
			post:`${baseURL}/grade/add`,
			update:`${baseURL}/grade/edit`,
			getGradeList: (phaseId) => `${baseURL}/grade/gradeList?phaseId=${phaseId}`,
			getGradeTeacherList: `${baseURL}/teacher/all`,
			setGradeLeader: `${baseURL}/grade/assignLeader`,
			getBySubject:{
				get:(subjectId) => `${baseURL}/grade/getBySubject?subjectId=${subjectId}`
			},
		},
		dict:{
			post:`${baseURL}/dict/add`,
			update:`${baseURL}/dict/edit`,
		},
		role:{
			desc:{update:`${baseURL}/memo/update`},
			post:`${baseURL}/role/add`,
			update:`${baseURL}/role/edit`
		},
		textbook:{
			post:`${baseURL}/textbook/add`,
			update:`${baseURL}/textbook/edit`,
			import: `${baseURL}/textbook/import`,
			search:{
				get:(searchStr,currentPage,phaseId,gradeId,subjectId)=>`${baseURL}/textbook/page?search=${searchStr}&currentPage=${currentPage}&phaseId=${phaseId}&gradeId=${gradeId}&subjectId=${subjectId}`
			},
			menulist:{
				get:(textbookId)=>`${baseURL}/textbook/menulist.json?textbook_id=${textbookId}`,
				delete:`${baseURL}/textbook/menudel`,
			},
			getTextBookByCondition:(subjectId,gradeId,version,term,unit='')=>`${baseURL}/textbook/getTextBookByCondition?subjectId=${subjectId}&gradeId=${gradeId}&version=${version}&term=${term}&unit=${unit}`,
			getUnitBySubjectAndGrade:(subjectId,gradeId)=>`${baseURL}/textbook/getUnitBySubjectAndGrade?subjectId=${subjectId}&gradeId=${gradeId}`,
		},
		resource: {
			getAllResources: `${baseURL}/resource/list`,
			// form data {jsonStr:"",resourceId:""}
			updateAuth: `${baseURL}/resource/updateauth`,
			// form data {*resourceName,resourceUrl,resourceDesc,parentId,logo,resourceOrder,authList}
			addResource: `${baseURL}/resource/add`,
			editResource: `${baseURL}/resource/edit`,
		},
		group: {
			addMadeGroup: `${baseURL}/group/add`,
			editMadeGroup: `${baseURL}/group/edit`,
			getByTeacherForHomework:`${baseURL}/group/getByTeacherForHomework`,
		},
		staff: {
			addStaff: (type) => `${baseURL}/${type}/add`,
			editStaff: (type) => `${baseURL}/${type}/edit`,
			// 增加科员时，获取所有教育局列表
			getAllAreas: `${baseURL}/area/getChildrenAreaList`,
			downloadExcel: (type) => `${baseURL}/${type}/downloadModal`,
			importExcel: (type) => `${baseURL}/${type}/importExcel`,
			getTeacherRole: (userId) => `${baseURL}/user/role/getbycode?userId=${userId}&userStyle=15`,
			getTeacherClass: (userId) => `${baseURL}/class/listClass?userId=${userId}`,
			getStudentClass: (studentId) => `${baseURL}/student/getStuClassByStudentId?studentId=${studentId}`,
			// 设置教师角色
			setTeacherRole: `${baseURL}/user/role/setting`,
		},
		department: {
			post:`${baseURL}/cityDepartment/add`,
			update:`${baseURL}/cityDepartment/edit`,
			areaDepartment:{
				post:`${baseURL}/areaDepartment/add`,
				update:`${baseURL}/areaDepartment/edit`,
				officer:{
					edit:`${baseURL}/areaDepartment/officer/edit`
				},
				listOfficersByDepartmentId:{
					get:(departmentId)=>`${baseURL}/areaDepartment/listOfficersByDepartmentId?departmentId=${departmentId}`
				}
			}
		},
		area: {
			post:`${baseURL}/area/add`,
			update:`${baseURL}/area/edit`,
			children:{
				get:`${baseURL}/area/getChildrenAreaList`
			},
			list:{
				get:`${baseURL}/area/list`
			}
		},
		schoolDepart: {
			addSchoolDepart: `${baseURL}/schoolDepart/add`,
			editSchoolDepart: `${baseURL}/schoolDepart/edit`,
			getSchoolUserList: `${baseURL}/schoolDepart/userList`,
			getLeaderList: (departmentId,filter) => `${baseURL}/schoolDepart/leaderList?deparmentId=${departmentId}&filter=${filter}`,
			getMemberList: (departmentId,filter) => `${baseURL}/schoolDepart/memberList?deparmentId=${departmentId}&filter=${filter}`,
			setStaff: (type) => `${baseURL}/schoolDepart/set${type}`,
		},
		class: {
			addClass: `${baseURL}/class/add`,
			editClass: `${baseURL}/class/edit`,
			getClassLeaderList: (classId) => `${baseURL}/class/classTeacher?classId=${classId}`,
			setClassLeader: `${baseURL}/class/classTeacher`,
			getClassSubject: (classId) => `${baseURL}/subject/class?classId=${classId}`,
			getClassSubjectTeacher: (classId) => `${baseURL}/class/subjectTeacher?classId=${classId}`,
			setClassTeacher: `${baseURL}/class/teacher/edit`,
			getStudent: (classId) => `${baseURL}/student/listInClass?classId=${classId}`,
			findStudent: (filter) => `${baseURL}/student/find?filter=${filter}`,
			setStudent: `${baseURL}/class/student/edit`,
		},
		school:{
			search:(search,currentPage,areaSelectId)=>`${baseURL}/school/pageByArea?search=${search}&currentPage=${currentPage}&areaSelectId=${areaSelectId}`,
			check:{
				get:(schoolName,schoolCode) => `${baseURL}/school/checkSchool?schoolName=${schoolName}&schoolCode=${schoolCode}`
			},
			post:`${baseURL}/school/add`,
			update:`${baseURL}/school/edit`,
			phase:{
				get:(target)=>`${baseURL}/school/phases/${target}`
			}
		},
		officer:{
			list:{
				get:(departmentId,filter='')=>`${baseURL}/officer/list?departmentId=${departmentId}&filter=${filter}`
			},
			find:{
				get:(name,areaId)=>`${baseURL}/officer/find?name=${name}&areaId=${areaId}`
			}
		},
		courseCenter:{
			getTableData: (type,search,currentPage,phaseCode="",subjectId="",termId="") => `${baseURL}/lesson/get/${type}?search=${search}&currentPage=${currentPage}&phaseCode=${phaseCode}&subjectId=${subjectId}&termId=${termId}`,
			getDetailData: (type,lessonId) => `${baseURL}/lesson/get/${type}?lesson_id=${lessonId}`,
			getDistinctSubject: `${baseURL}/class/distinctsubject`,
			getCourseVersion: `${baseURL}/select?selectstyle=JKS`,
			getUserGrade: `${baseURL}/grade/getUserGrade`,
			detail:(lessonId) => `${baseURL}/lesson/get/detail_new?lesson_id=${lessonId}`,
			checkCourse: (lessonId,result) => `${baseURL}/lesson/check?lessonId=${lessonId}&pass=${result}`,
		},
		teachingPlan:{
			course:{
				schedules:(subjectId,gradeId,term,version)=>`${baseURL}/teachingPlan/course/schedules?subjectId=${subjectId}&gradeId=${gradeId}&term=${term}&version=${version}`
			}
		},
		lesson:{
			lastChapterTime:(scheduleId,hourNo)=>`${baseURL}/lesson/lastChapterTime?teaching_schedule_id=${scheduleId}&hour_no=${hourNo}`,
			create:`${baseURL}/lesson/create`,
			publish:`${baseURL}/lesson/publish`,
		},
		microvideo:{
			get:(type,currentPage,subjectId,gradeId,textbookId,search,term,version)=>`${baseURL}/microvideo/${type}?currentPage=${currentPage}&subjectId=${subjectId}&gradeId=${gradeId}&textbookMenuId=${textbookId}&search=${search}&term=${term}&version=${version}`,
			getVideoDetailById:(videoId)=>`${baseURL}/microvideo/getVideoDetailById?videoId=${videoId}`,
			getTableData: (type,search,currentPage) => `${baseURL}/microvideo/${type}?search=${search}&currentPage=${currentPage}`,
			addVideo: `${baseURL}/microvideo/add`,
			checkVideo: `${baseURL}/microvideo/check`,
			likeVideo: (type) => `${baseURL}/microvideo/${type}`,
			collectVideo: (type) => `${baseURL}/microvideo/${type}`,
		},
		homework:{
			course:{
				existHomework:(subjectId,type='1')=>`${baseURL}/homework/course/existHomework?subjectId=${subjectId}&type=${type}`,
				searchHomework:(subjectId,startTime,endTime,knowledgeId='',type='1')=>`${baseURL}/homework/course/existHomework?subjectId=${subjectId}&startTime=${startTime}&endTime=${endTime}&knowledgeId=${knowledgeId}&type=${type}`,
			},
			getHomeworkDetail:(homeworkId)=>`${baseURL}/homework/getHomeworkDetail?homeworkId=${homeworkId}`,
      getHomeworkDetail2:(homeworkId)=>`${baseURL}/homework/getHomeworkDetail2?homeworkId=${homeworkId}`,
			getHomeworkClass: (homeworkId) => `${baseURL}/homework/getClasses?homeworkId=${homeworkId}`,
      //公共作业
      areaHomeworkPageUrl:`${baseURL}/homework/area/homeworkLibPage`,
      //学校作业
      schoolHomeworkPageUrl:`${baseURL}/homework/school/homeworkLibPage`,
      //教师个人作业
      selfHomeworkPageUrl:`${baseURL}/homework/self/homeworkLibPage`,
      //已发布作业
      publishedHomeworkPageUrl:`${baseURL}/homework/page`,
			//教师获取未审核的作业
      teaUnCheckHomeworkPageUrl:`${baseURL}/homework/getTeaUncheckedHomework`,
      teaDeleteHomeworkUrl:`${baseURL}/homework/delete`,
		  //待审核作业
		  homeworkUncheckedUrl:`${baseURL}/homework/getUncheckedHomework`,
		  checkHomeworkUrl:`${baseURL}/homework/checkHomework`,

		},
		exampaper:{
			showExamSelectList:(subjectId,gradeId,term)=>`${baseURL}/exampaper/showExamSelectList?subjectId=${subjectId}&gradeId=${gradeId}&term=${term}`,
			getTableData:(type,search,currentPage,subjectId='',gradeId='',isDraft=0)=>`${baseURL}/exampaper/${type}?search=${search}&currentPage=${currentPage}&subjectId=${subjectId}&gradeId=${gradeId}&isDraft=${isDraft}`,
			createExam:`${baseURL}/exampaper/createExam`,
			deletePaper:`${baseURL}/exampaper/deleteExam`,
			publishExamPaper:`${baseURL}/exampaper/publishExamPaper`,
			editExamInfo:`${baseURL}/exampaper/editExamInfo`,
			showExamQuestions:(examId)=>`${baseURL}/exampaper/showExamQuestions?examId=${examId}`
		},
		answersheet:{
			getAll:`${baseURL}/answersheet/getAll`,
			getTableData: (type, search, currentPage) => `${baseURL}/${type}/page?search=${search}&currentPage=${currentPage}`,
			create: `${baseURL}/answersheet/add`,
			download: (id) => `${baseURL}/answersheet/answersheetview?answersheet_id=${id}`,
		},
		wordquestion:{
			addChoose:`${baseURL}/wordquestion/addChoose`,
			addNote:`${baseURL}/wordquestion/addNote`,
			addJudge:`${baseURL}/wordquestion/addJudge`,
			addShortAnswer:`${baseURL}/wordquestion/addShortAnswer`,
			updateOption:`${baseURL}/wordquestion/updateOption`,
			updateQuestion:`${baseURL}/wordquestion/updateQuestion`,
			deleteOption:`${baseURL}/wordquestion/deleteOption`,
			addOption:`${baseURL}/wordquestion/addOption`,
			setScore:`${baseURL}/wordquestion/setScore`,
			deleteQuestion:`${baseURL}/wordquestion/deleteQuestion`,
			changeQuestionPosition:`${baseURL}/wordquestion/changeQuestionPosition`,
			uploadWord:`${baseURL}/wordquestion/uploadWord`,
			addNest:`${baseURL}/wordquestion/addNest`,
			addTitle:`${baseURL}/wordquestion/addTitle`,
		}
	}
})

export default config
