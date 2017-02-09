import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addDepartment(data,type){
  return dispatch => {
    let url = type=='area'?config.api.department.areaDepartment.post:config.api.department.post
    let formData = new FormData()
    formData.append('areaId',data.areaId)
    formData.append('departmentName',data.departmentName)
    formData.append('function',data._function)
    formData.append('phone',data.phone)
    formData.append('remark',data.remark)
    return fetch(url,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get(type=='area'?'areaDepartment':'cityDepartment','','',''),{
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

export function editDepartment(data,type){
  let formData = new FormData()
  let url = type=='area'?config.api.department.areaDepartment.update:config.api.department.update
  formData.append('departmentId',data.departmentId)
  formData.append('areaId',data.areaId)
  formData.append('departmentName',data.departmentName)
  formData.append('function',data._function)
  formData.append('phone',data.phone)
  formData.append('remark',data.remark)
  formData.append('action',data.action)
  return dispatch => {
    return fetch(url,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get(type=='area'?'areaDepartment':'cityDepartment','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success(data.action=='delete'?{message:'删除成功'}:{message:'编辑成功'});return res})
          }
        })
      }
    })
  }
}

export function addOffice(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('departmentId',data.departmentId)
    formData.append('leaderId',data.leaderId)
    formData.append('action',data.action)
    fetch(config.api.department.areaDepartment.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('cityDepartment','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'编辑成功'});return res})
          }
        })
      }
    })
  }
}

export function addMember(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('departmentId',data.departmentId)
    formData.append('addList',data.addList)
    fetch(config.api.department.areaDepartment.officer.edit,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('cityDepartment','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'编辑成功'});return res})
          }
        })
      }
    })
  }
}
