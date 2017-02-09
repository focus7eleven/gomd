import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addSubject(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('subject_name',data.subjectName)
    formData.append('subject_short_name',data.subjectShortName)
    formData.append('remark',data.remark)
    return fetch(config.api.subject.post,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('subject','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'添加成功'});return res})
          }
        })
      }else{
        notification.error({message:'失败',description:'添加失败'})
      }
    })
  }
}

export function editSubject(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('subject_name',data.subjectName)
    formData.append('subject_short_name',data.subjectShortName)
    formData.append('remark',data.remark)
    formData.append('action',data.action)
    formData.append('subject_id',data.subjectId)
    return fetch(config.api.subject.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('subject','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success(data.action=='edit'?{message:'编辑成功'}:{message:'删除成功'});return res})
          }
        })
      }else{
        notification.error({message:'失败',description:'编辑失败'})
      }
    })
  }
}
