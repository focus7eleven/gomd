import config from '../../../config'

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
