import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addArea(data){
  console.log("data",data)
  return dispatch => {
    let formData = new FormData()
    formData.append('areaName',data.areaName)
    formData.append('admin_name',data.adminName)
    formData.append('admin_code',data.adminCode)
    formData.append('parentId',data.parentId)
    formData.append('address',data.address)
    formData.append('website',data.website)
    formData.append('remark',data.remark)
    fetch(config.api.area.post,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('area','','',''),{
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

export function editArea(data){
  return dispatch=>{
    let formData = new FormData()
    formData.append('areaId',data.areaId)
    formData.append('areaName',data.areaName)
    formData.append('address',data.address)
    formData.append('website',data.website)
    formData.append('action',data.action)
    fetch(config.api.area.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('area','','',''),{
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
