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
    header:{
      'from':'nodejs',
      'token':sessionStorage.getItem('accessToken')
    },
    body:formData
  }).then(res => res.json())
}
