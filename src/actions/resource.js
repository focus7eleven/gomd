import {actionNames} from '../utils/action-utils'
import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addResource(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('jsonStr',data.jsonStr)
    return fetch(config.api.resource.addResource,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('resource','','',''),{
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

export function editResource(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('resourceId',data.resourceId)
    formData.append('action',data.action)
    if(data.action==="edit"){
      formData.append('resourceName',data.resourceName)
      formData.append('resourceUrl',data.resourceUrl)
      formData.append('resourceOrder',data.resourceOrder)
      formData.append('resourceDesc',data.resourceDesc)
      formData.append('parentId',data.parentId)
    }
    // formData.append('authList',data.authList)
    return fetch(config.api.resource.editResource,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('resource','','',''),{
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

export const GET_ALL_RESOURCES = actionNames('GET_ALL_RESOURCES')

export function getAllResources(){
  return {
    types:GET_ALL_RESOURCES,
    callAPI:()=>{
      return fetch(config.api.resource.getAllResources,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
    }).then(res => res.json())
    }
  }
}

export function updateAuth(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('jsonStr',data.jsonStr)
    formData.append('resourceId',data.resourceId)
    return fetch(config.api.resource.updateAuth,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('resource','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'修改成功'});return res})
          }
        })
      }else{
        notification.error({message:'失败',description:'修改失败'})
      }
    })
  }
}
