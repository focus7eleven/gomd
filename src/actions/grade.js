import {actionNames} from '../utils/action-utils'
import {GET_WORKSPACEDATA,getWorkspaceData} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addGrade(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('gradeName',data.gradeName)
    formData.append('phaseCode',data.phaseCode)
    formData.append('gradeNickName',data.gradeNickName)
    return fetch(config.api.grade.post,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('grade','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'添加成功'});return res})
          }
        })
      }
    })
  }
}

export function editGrade(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('gradeName',data.gradeName)
    formData.append('phaseCode',data.phaseCode)
    formData.append('gradeNickName',data.gradeNickName)
    formData.append('action',data.action)
    formData.append('gradeId',data.gradeId)
    return fetch(config.api.grade.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('grade','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success(data.action=='edit'?{message:'编辑成功'}:{message:'删除成功'});return res})
          }
        })
      }
    })
  }
}

export const GET_GRADE_TEACHER_LIST = actionNames('GET_GRADE_TEACHER_LIST')

export function getGradeTeacherList(data){
  return {
    types:GET_GRADE_TEACHER_LIST,
    callAPI:()=>{
      return fetch(config.api.grade.getGradeTeacherList,{
        method:'POST',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
        body:data
      }).then(res => res.json())
    }
  }
}

export function setGradeLeader(data){
  return dispatch => {
    return fetch(config.api.grade.setGradeLeader,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('gradeSet','','','')).then(res => {notification.success({message:'设置成功'});return res})
      }else{
        notification.error({message:'设置失败',description: res.result});
        return "error";
      }
    })
  }
}
