import config from '../../../config'

export const QUESTION_TYPE = [{
  id:'01',
  text:'单选题',
},{
  id:'02',
  text:'判断题',
},{
  id:'03',
  text:'多选题',
},{
  id:'04',
  text:'判断题',
},{
  id:'05',
  text:'简答（计算题）',
},{
  id:'06',
  text:'语文作文',
},{
  id:'07',
  text:'英语作文',
},{
  id:'08',
  text:'嵌套题',
},]

//更新答案
export function updateOption(data){
  let formData = new FormData()
  formData.append('optionId',data.optionId)
  formData.append('content',data.content)
  formData.append('score',data.score)
  formData.append('isAnswer',data.isAnswer)
  return fetch(config.api.wordquestion.updateOption,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//更新题目
export function updateQuestion(data){
  let formData = new FormData()
  formData.append('qid',data.qid)
  formData.append('examination',data.examination)
  formData.append('comment',data.comment)
  formData.append('description',data.description)
  formData.append('difficulty',data.difficulty)
  formData.append('kind',data.kind)
  formData.append('drawZone',data.drawZone)
  formData.append('score',data.score)
  return fetch(config.api.wordquestion.updateQuestion,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//删除答案选项
export function deleteOption(data){
  let formData = new FormData()
  formData.append('optionId',data.optionId)
  return fetch(config.api.wordquestion.deleteOption,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//添加答案选项
export function addOption(data){
  let formData = new FormData()
  formData.append('questionId',data.questionId)
  formData.append('questionKind',data.questionKind)
  return fetch(config.api.wordquestion.addOption,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//设定题目分值
export function setScore(data){
  let formData = new FormData()
  formData.append('questionId',data.questionId)
  formData.append('score',data.score)
  return fetch(config.api.wordquestion.setScore,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//删除题目
export function deleteQuestion(data){
  let formData = new FormData()
  formData.append('questionId',data.questionId)
  return fetch(config.api.wordquestion.deleteQuestion,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//改变题目的顺序
export function changeQuestionPosition(data){
  let formData = new FormData()
  formData.append('moveDownQuestionId',data.moveDownQuestionId)
  formData.append('moveUpQuestionId',data.moveUpQuestionId)
  return fetch(config.api.wordquestion.changeQuestionPosition,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//获取一个新的examId
export function getNewExamId(subjectId,gradeId){
  let formData = new FormData()
  formData.append('subjectId',subjectId)
  formData.append('gradeId',gradeId)
  return fetch(config.api.exampaper.createExam,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}

//获取已存在的试卷的详情
export function getExistExamInfo(examId){
  return fetch(config.api.exampaper.showExamQuestions(examId),{
    method:'get',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    }
  }).then(res => res.json())
}
