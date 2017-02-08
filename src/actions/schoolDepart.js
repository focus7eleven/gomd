import {actionNames} from '../utils/action-utils'
import {GET_WORKSPACEDATA,getWorkspaceData} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addSchoolDepart(data){
  return dispatch => {
    return fetch(config.api.schoolDepart.addSchoolDepart,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('schoolDepart','','','')).then(res => {notification.success({message:'添加成功'});return res})
      }else{
        notification.error({message:'添加失败',description: res.result});
        return "error";
      }
    })
  }
}

export function editSchoolDepart(data){
  return dispatch => {
    return fetch(config.api.schoolDepart.editSchoolDepart,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('schoolDepart','','','')).then(res => {notification.success(data.get('action')=='edit'?{message:'编辑成功'}:{message:'删除成功'});return res});
      }else{
        notification.error({message:'失败',description:'编辑失败'})
        return "error";
      }
    })
  }
}

export const GET_SCHOOL_USERLIST = actionNames('GET_SCHOOL_USERLIST')

export function getSchoolUserList(data){
  return {
    types:GET_SCHOOL_USERLIST,
    callAPI:()=>{
      return fetch(config.api.schoolDepart.getSchoolUserList,{
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

export const GET_LEADER_LIST = actionNames('GET_LEADER_LIST')

export function getLeaderList(departmentId,filter){
  return {
    types: GET_LEADER_LIST,
    callAPI:()=>{
      return fetch(config.api.schoolDepart.getLeaderList(departmentId,filter),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}
export const GET_MEMBER_LIST = actionNames('GET_MEMBER_LIST')

export function getMemberList(departmentId,filter){
  return {
    types:GET_MEMBER_LIST,
    callAPI:()=>{
      return fetch(config.api.schoolDepart.getMemberList(departmentId,filter),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}

export function setStaff(data,type){
  return dispatch => {
    return fetch(config.api.schoolDepart.setStaff(type),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('schoolDepart','','','')).then(res => {notification.success({message:'设置成功'});return res})
      }else{
        notification.error({message:'设置失败',description: res.result});
        return "error";
      }
    })
  }
}
