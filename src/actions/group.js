import {GET_WORKSPACEDATA} from './workspace'
import {actionNames} from '../utils/action-utils'
import config from '../config.js'
import {notification} from 'antd'

export function addMadeGroup(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('groupName',data.groupName)
    formData.append('groupDesc',data.groupDesc)
    return fetch(config.api.group.addMadeGroup,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('group/made','','',''),{
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

export function editMadeGroup(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('groupId',data.groupId)
    formData.append('action',data.action)
    if(data.action=='edit'){
      formData.append('groupName',data.groupName)
      formData.append('groupDesc',data.groupDesc)
    }
    return fetch(config.api.group.editMadeGroup,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('group/made','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success(data.action=='edit'?{message:'编辑成功'}:{message:'删除成功'});return res})
          }
        })
      }else{
        notification.error({message:'失败',description:'操作失败'})
      }
    })
  }
}

export function editGroupStaff(data){
  return dispatch => {
    return fetch(config.api.staff.editGroupStaff,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('group/made','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'编辑成功'});return res})
          }
        })
      }else{
        notification.error({message:'编辑失败',description:res.result})
      }
    })
  }
}

export const GET_CURRENT_GROUP_MEMBER = actionNames('GET_CURRENT_GROUP_MEMBER')
export function getCurrentGroupMember(groupId){
  return {
    types: GET_CURRENT_GROUP_MEMBER,
    callAPI: () => {
      return fetch(config.api.group.getCurrentGroupMember(groupId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}
