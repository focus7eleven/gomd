import {actionNames} from '../utils/action-utils'
import {GET_WORKSPACEDATA,getWorkspaceData} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addStaff(data,type){
  return dispatch => {
    return fetch(config.api.staff.addStaff(type),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData(type,'','','')).then(res => {notification.success({message:'添加成功'});return res})
      }else{
        notification.error({message:'添加失败',description: res.result});
        return "error";
      }
    })
  }
}

export function editStaff(data,type){
  return dispatch => {
    return fetch(config.api.staff.editStaff(type),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData(type,'','','')).then(res => {notification.success(data.get('action')=='edit'?{message:'编辑成功'}:{message:'删除成功'});return res});
      }else{
        notification.error({message:'失败',description:'编辑失败'})
        return "error";
      }
    })
  }
}

export function editPatriarch(data){
  return dispatch => {
    return fetch(config.api.staff.editPatriarch,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('student','','','')).then(res => {notification.success({message:'编辑成功'});return res});
      }else{
        notification.error({message:'失败',description:'编辑失败'})
        return "error";
      }
    })
  }
}

export const GET_ALL_AREAS = actionNames('GET_ALL_AREAS')

export function getAllAreas(){
  return {
    types:GET_ALL_AREAS,
    callAPI:()=>{
      return fetch(config.api.staff.getAllAreas,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}

export function downloadExcel(type){
  return dispatch => {
    return fetch(config.api.staff.downloadExcel(type),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
    }).then(res => res.blob()).then(res => {
      let link=document.createElement('a');
      link.href=window.URL.createObjectURL(res);
      if(type==="officer"){
        link.download="科员批量导入模板.xlsx";
      }else if(type==="teacher"){
        link.download="教师批量导入模板.xlsx";
      }else if(type==="student"){
        link.download="学生批量导入模板.xlsx";
      }
      link.id='xlsxFile'
      link.click();
      // document.getElementById('xlsxFile').remove();
    })
  }
}

export function importExcel(data,type){
  return dispatch => {
    let formData = new FormData()
    formData.append("attach",data)
    return fetch(config.api.staff.importExcel(type),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData(type,'','','')).then(res => {notification.success({message:'导入成功'});return res})
      }else{
        notification.error({message:'失败',description:'导入失败'})
      }
    })
  }
}

export function setTeacherRole(data){
  return dispatch => {
    return fetch(config.api.staff.setTeacherRole,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('teacher','','','')).then(res => {notification.success({message:'设置成功'});return res})
      }else{
        notification.error({message:'失败',description:res.result})
      }
    })
  }
}
