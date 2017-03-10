import _ from 'underscore'

export const baseURL = "http://139.224.194.45:8080"
// export const baseURL = "http://192.168.168.187:8080"
// export const baseURL = "http://127.0.0.1:8080"

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
				getCurrentRole: `${baseURL}/role/getCurrentRole`,
			},
			info: {
				getUserId: `${baseURL}/getuserid`,
				getInfo: `${baseURL}/session`,
			},
	   		edit:`${baseURL}/account/edit`,
			changePass:	`${baseURL}/account/pwd`,
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
			getAllGroupByType:`${baseURL}/group/getAllGroupByType`,
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
			// 获取学生家长
			getPatriarch: (studentId) => `${baseURL}/patriarch/listPatriarchsByStudent?studentId=${studentId}`,
			findPatriarch: (name) => `${baseURL}/patriarch/find?name=${name}`,
			editPatriarch: `${baseURL}/student/patriarch/editnew`,
			getGroupStaff: (type,filter) => `${baseURL}/${type}/findWithAdd?filter=${filter}&addList=`,
			editGroupStaff: `${baseURL}/group/users/edit`,
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
			get:(type,currentPage,subjectId='',gradeId='',textbookId='',search='',term='',version='')=>`${baseURL}/microvideo/${type}?currentPage=${currentPage}&subjectId=${subjectId}&gradeId=${gradeId}&textbookMenuId=${textbookId}&search=${search}&term=${term}&version=${version}`,
			getVideoDetailById:(videoId)=>`${baseURL}/microvideo/getVideoDetailById?videoId=${videoId}`,
			getTableData: (type,search,currentPage) => `${baseURL}/microvideo/${type}?search=${search}&currentPage=${currentPage}`,
			addVideo: `${baseURL}/microvideo/add`,
			checkVideo: `${baseURL}/microvideo/check`,
			likeVideo: (type) => `${baseURL}/microvideo/${type}`,
			collectVideo: (type) => `${baseURL}/microvideo/${type}`,
			edit:`${baseURL}/microvideo/edit`,
		},
		homework:{
			course:{
				existHomework:(subjectId,type='1')=>`${baseURL}/homework/course/existHomework?subjectId=${subjectId}&type=${type}`,
				searchHomework:(subjectId,startTime,endTime,knowledgeId='',type='1')=>`${baseURL}/homework/course/existHomework?subjectId=${subjectId}&startTime=${startTime}&endTime=${endTime}&knowledgeId=${knowledgeId}&type=${type}`,
			},
      getHomeworkDetail: (homeworkId) => `${baseURL}/homework/getHomeworkDetail?homeworkId=${homeworkId}`,
      getHomeworkDetail2: (homeworkId) => `${baseURL}/homework/getHomeworkDetail2?homeworkId=${homeworkId}`,
      getHomeworkClass: (homeworkId) => `${baseURL}/homework/getClasses?homeworkId=${homeworkId}`,

     //   老师查看作文批改结果->获得answersheetQuestionID
	  getAnswersheetQuestionId: `${baseURL}/answersheet/getEnCompositionQuestion`,
			//   老师查看作文批改结果->根据作文key获得作文内容
			getArticleContent: (articleKey) => `${baseURL}/pigai_api/get_analyze_result?key=${articleKey}`,

			//公共作业
      areaHomeworkPageUrl: `${baseURL}/homework/area/homeworkLibPage`,
      //学校作业
      schoolHomeworkPageUrl: `${baseURL}/homework/school/homeworkLibPage`,
      //教师个人作业
      selfHomeworkPageUrl: `${baseURL}/homework/self/homeworkLibPage`,
			//布置作业
            assignHomeworkUrl:`${baseURL}/homework/setHomework`,
      //已发布作业
      publishedHomeworkPageUrl: `${baseURL}/homework/page`,
			pubDeleteHomeworkUrl: `${baseURL}/homework/delHomeworkClass`,
      //教师获取未审核的作业
      teaUnCheckHomeworkPageUrl: `${baseURL}/homework/getTeaUncheckedHomework`,
			//删除作业
      teaDeleteHomeworkUrl: `${baseURL}/homework/delete`,
			//创建作业
			teaCreateHomeworkUrl:`${baseURL}/homework/add`,
			//修改作业
			teaEditHomeworkUrl:`${baseURL}/homework/edit`,

      //待审核作业
      homeworkUncheckedUrl: `${baseURL}/homework/getUncheckedHomework`,
      checkHomeworkUrl: `${baseURL}/homework/checkHomework`,

      //学生：我的作业
      studentHomeworkPageUrl: `${baseURL}/homework/get/byStudentId`,
      downloadAnswersheet: (homeworkId) => `${baseURL}/homework/downloadAnswersheetPdf?homeworkId=${homeworkId}`,
			answerHomework: {
				getPaperAndAnswer:(homeworkClassId) => `${baseURL}/homework/getPaperAndAnswer?homeworkClassId=${homeworkClassId}`,
                getPaperAndAnswerWithKey:(homeworkClassId) => `${baseURL}/homework/getPaperAndAnswerWithKey?homeworkClassId=${homeworkClassId}`,
        		uploadAnswer: `${baseURL}/exampaper/uploadAnswerNew`,
				submitHomework:`${baseURL}/homework/submitExamPaperHomework`,
			},
			commentHomework: {
				getExampaperAndStudentAnswer: (homeworkClassId,answerType) => `${baseURL}/homework/getPaperAndAnswerWithTea?homeworkClassId=${homeworkClassId}&answerType=${answerType}`,
                uploadCorrectResultForImage: `${baseURL}/exampaper/uploadCorrectResultForImage`,
				uploadCommentResult: `${baseURL}/exampaper/uploadCorrectResult`,
			},
	  //查看答题卡答案
	  lookupAnswerSheetAnwser:(anwsersheetId, homeworkId) => `${baseURL}/answersheet/answersheetkey?answersheetId=${anwsersheetId}&homeworkId=${homeworkId}`,
	  //查看批改结果
	  checkResultByQuestion:(homeworkClassId) => `${baseURL}/homework/getPaperAndAnswerTeaByQuestion?homeworkClassId=${homeworkClassId}`,
	  checkResultByStudents:(homeworkClassId) => `${baseURL}/homework/getPaperAndAnswerTeaByStu?homeworkClassId=${homeworkClassId}`,
			getStudentPigaiSummary: `${baseURL}/pigai_api/page_student_pigai_summary`,
		},
		notify:{
			//添加通知
			add:`${baseURL}/notification/add`,
            //收到的通知
            receiveNotifyUrl:  `${baseURL}/notification/page`,
            //发送的通知
			myNotifyUrl: `${baseURL}/notification/my/page`,
            //待处理通知
			undoNotifyUrl:   `${baseURL}/notification/undo/page`,
			//通知详情
			showNotificationUrl:(notificationId , userId) => `${baseURL}/notification/detail?notificationId=${notificationId}&userId=${userId}`,

			//已处理任务
            receiveTaskUrl:  `${baseURL}/task/page`,
            //发送的任务
            myTaskUrl: `${baseURL}/task/my/page`,
            //待处理任务
            undoTaskUrl:   `${baseURL}/task/undo/page`,
			//任务详情
            showTaskUrl:(taskId , userId) => `${baseURL}/task/detail?taskId=${taskId}&userId=${userId}`,
            getSubmitListUrl:(taskId) => `${baseURL}/task/listTaskSubmit?taskId=${taskId}`,
            getNotSubmitListUrl:(taskId) => `${baseURL}/task/listTaskNotSubmit?taskId=${taskId}`,
            showReturnDetailUrl:(taskId,userId) => `${baseURL}/task/showReturnDetail?taskId=${taskId}&userId=${userId}`,


			//市直动态
			cityEduInfoUrl: `${baseURL}/eduinfo/citypage`,
			//校园采风
			schoolEduInfoUrl:`${baseURL}/eduinfo/schoolpage`,
			//班级剪影
			classEduInfoUrl:`${baseURL}/eduinfo/classpage`,
			//资讯详情
            showEduInfoUrl:(eduinfoId, userId) => `${baseURL}/eduinfo/detail/${eduinfoId}?loginUserId=${userId}`,
			//提交任务人数-下载回复
            downloadResponse: (taskId) => `${baseURL}/task/downloadContent?taskId=${taskId}`,
			//提交任务人数-下载附件
            downloadAttachment: (taskId) => `${baseURL}/task/downloadAttachments?taskId=${taskId}`,

		},
		exampaper:{
			showExamSelectList:(subjectId,gradeId,term,version)=>`${baseURL}/exampaper/showExamSelectList?subjectId=${subjectId}&gradeId=${gradeId}&term=${term}&version=${version}`,
			getTableData:(type,search,currentPage,subjectId='',gradeId='',isDraft=0)=>`${baseURL}/exampaper/${type}?search=${search}&currentPage=${currentPage}&subjectId=${subjectId}&gradeId=${gradeId}&isDraft=${isDraft}`,
			createExam:`${baseURL}/exampaper/createExam`,
			deletePaper:`${baseURL}/exampaper/deleteExam`,
			publishExamPaper:`${baseURL}/exampaper/publishExamPaper`,
			editExamInfo:`${baseURL}/exampaper/editExamInfo`,
			showExamQuestions:(examId)=>`${baseURL}/exampaper/showExamQuestions?examId=${examId}`,
			uploadStandardAnswer:`${baseURL}/exampaper/uploadStandardAnswer`,
			viewExamPaperData:(examId)=>`${baseURL}/exampaper/viewExamPaperData?examPaperId=${examId}`,
		},
		answersheet:{
			getAll:`${baseURL}/answersheet/getAll`,
			//获取答题卡的所有question（设置真确答案）
			getQuestions:(anwsersheetId) =>`${baseURL}/answersheet/getAnswersheetQuestionDetail?answersheetId=${anwsersheetId}`,
			getTableData: (type, search, currentPage) => `${baseURL}/${type}/page?search=${search}&currentPage=${currentPage}`,
			create: `${baseURL}/answersheet/add`,
			download: (id) => `${baseURL}/answersheet/answersheetview?answersheet_id=${id}`,
			edit: `${baseURL}/answersheet/edit`,
			getAnswerSheet: (id) => `${baseURL}/answersheet/getAnswersheetDetail?answersheetId=${id}`,
			getAnswerSheetQuestion: (id) => `${baseURL}/answersheet/getAnswersheetQuestionDetail?answersheetId=${id}`,
			editSheetQuestion: `${baseURL}/answersheet/editNew`,
			getAdduction: `${baseURL}/answersheet/getAdduction`,
			checkSheetName: (name) => `${baseURL}/answersheet/checkanswersheetname?answersheet_name=${name}`,
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
		},
		//教学计划和总结
		teachingPlan:{
			teachingPlanPageUrl:`${baseURL}/teachingPlan/get/bykindergartenPage.json`,
			teachingPlanDetailUrl:(teachingPlanId)=>`${baseURL}/teachingPlan/get/detail?teachingPlanId=${teachingPlanId}`,
			teachingScheduleUrl:(teachingPlanId)=>`${baseURL}/teachingPlan/get/schedules?planId=${teachingPlanId}`,
			ordedTextbookmenuUrl:(subjectId,gradeId,term,version)=>`${baseURL}/teachingPlan/get/ordedTextbookmenu?subjectId=${subjectId}&gradeId=${gradeId}&term=${term}&version=${version}`,
			summaryDetailUrl:(textbookMenuId)=>`${baseURL}/teachingPlan/get/summarize?textbookMenuId=${textbookMenuId}`,
			course:{
				schedules:(subjectId,gradeId,term,version)=>`${baseURL}/teachingPlan/course/schedules?subjectId=${subjectId}&gradeId=${gradeId}&term=${term}&version=${version}`
			},
			uploadSummaryUrl:(textbookMenuId,summaryStr)=>`${baseURL}/teachingPlan/upload/summarize?textbookMenuId=${textbookMenuId}&summarize=${summaryStr}`
		},
		task:{
			add:`${baseURL}/task/add`,
		},
		news:{
			add:`${baseURL}/eduinfo/add`,
		}

	}
})

export default config
