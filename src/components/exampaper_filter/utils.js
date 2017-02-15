import config from '../../config'

//获取学科
export function getSubject(data){
  return fetch(config.api.courseCenter.getDistinctSubject,{
    method:'get',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    }
  }).then(res => res.json())
}

//获取年级
export function getGrade(data){
  console.log("---:>",data)
  return fetch(config.api.grade.getBySubject.get(data.subjectId),{
    method:'get',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    }
  }).then(res => res.json())
}

//修改试卷信息
export function setExamInfo(data){
  let formData = new FormData()
  formData.append('examId',data.examId)
  formData.append('name',data.name)
  formData.append('subjectId',data.subjectId)
  formData.append('term',data.term)
  formData.append('gradeId',data.gradeId)
  formData.append('oneAnswer',data.oneAnswer)
  formData.append('oneAnswerContent',data.oneAnswerContent)
  return fetch(config.api.exampaper.editExamInfo,{
    method:'post',
    headers:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}
