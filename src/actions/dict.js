import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addDict(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('dictStyle',data.dictStyle)
    formData.append('styleDesc',data.styleDesc)
    formData.append('dictName',data.dictName)
    formData.append('dictCode',data.dictCode)
    return fetch(config.api.dict.post,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('dict','','',''),{
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

export function editDict(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('dictStyle',data.dictStyle)
    formData.append('styleDesc',data.styleDesc)
    formData.append('dictName',data.dictName)
    formData.append('dictCode',data.dictCode)
    formData.append('action',data.action)
    formData.append('dictId',data.dictId)
    return fetch(config.api.dict.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('dict','','',''),{
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
