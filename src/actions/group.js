import {GET_WORKSPACEDATA} from './workspace'
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

export function editSubject(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('groupName',data.groupName)
    formData.append('groupDesc',data.groupDesc)
    formData.append('action',data.action)
    return fetch(config.api.group.edit,{
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
