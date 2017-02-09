import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function editRoleDesc(data){
  return dispatch=>{
    let formData = new FormData()
    formData.append('text',data.text)
    formData.append('table',data.table)
    formData.append('column',data.column)
    formData.append('pk',data.pk)
    formData.append('pkv',data.pkv)
    fetch(config.api.role.desc.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('role','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'修改成功'});return res})
          }
        })
      }
    })
  }
}

export function addRole(data){
  return dispatch=>{
    let formData = new FormData()
    formData.append('roleName',data.roleName)
    formData.append('roleDesc',data.roleDesc)
    formData.append('range_code',data.rangeCode)
    fetch(config.api.role.post,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('role','','',''),{
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

export function editRole(data){
  return dispatch=>{
    let formData = new FormData()
    formData.append('roleName',data.roleName)
    formData.append('roleId',data.roleId)
    formData.append('action',data.action)
    fetch(config.api.role.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('role','','',''),{
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
