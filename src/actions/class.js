import {actionNames} from '../utils/action-utils'
import {GET_WORKSPACEDATA,getWorkspaceData} from './workspace'
import config from '../config.js'
import {notification} from 'antd'

export function addClass(data){
  return dispatch => {
    return fetch(config.api.class.addClass,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('class','','','')).then(res => {notification.success({message:'添加成功'});return res})
      }else{
        notification.error({message:'添加失败',description: res.result});
        return "error";
      }
    })
  }
}

export function editClass(data){
  return dispatch => {
    return fetch(config.api.class.editClass,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('class','','','')).then(res => {notification.success(data.get('action')=='edit'?{message:'编辑成功'}:{message:'删除成功'});return res});
      }else{
        notification.error({message:'失败',description:'编辑失败'})
        return "error";
      }
    })
  }
}

export const GET_PHASE_LIST = actionNames('GET_PHASE_LIST')

export function getPhaseList(){
  return {
    types:GET_PHASE_LIST,
    callAPI:()=>{
      return fetch(config.api.phase.phaseList.get,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}

export const GET_GRADE_LIST = actionNames('GET_GRADE_LIST')

export function getGradeList(phaseId){
  return {
    types:GET_GRADE_LIST,
    callAPI:()=>{
      return fetch(config.api.grade.getGradeList(phaseId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}

export const GET_CLASS_LEADER_LIST = actionNames('GET_CLASS_LEADER_LIST')

export function getClassLeaderList(classId){
  return {
    types: GET_CLASS_LEADER_LIST,
    callAPI:()=>{
      return fetch(config.api.class.getClassLeaderList(classId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}

export function setClassLeader(data){
  return dispatch => {
    return fetch(config.api.class.setClassLeader,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('classes','','','')).then(res => {notification.success({message:'设置成功'});return res})
      }else{
        notification.error({message:'设置失败',description: res.result});
        return "error";
      }
    })
  }
}

export function setClassTeacher(data){
  return dispatch => {
    return fetch(config.api.class.setClassTeacher,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('classes','','','')).then(res => {notification.success({message:'设置成功'});return res})
      }else{
        notification.error({message:'设置失败',description: res.result});
        return "error";
      }
    })
  }
}

export function setStudent(data){
  return dispatch => {
    return fetch(config.api.class.setStudent,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getWorkspaceData('classes','','','')).then(res => {notification.success({message:'设置成功'});return res})
      }else{
        notification.error({message:'设置失败',description: res.result});
        return "error";
      }
    })
  }
}

export const GET_CLASS_SUBJECT = actionNames('GET_CLASS_SUBJECT')

export function getClassSubject(classId){
  return {
    types: GET_CLASS_SUBJECT,
    callAPI:()=>{
      return fetch(config.api.class.getClassSubject(classId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}

export const GET_CLASS_SUBJECT_TEACHER = actionNames('GET_CLASS_SUBJECT_TEACHER')

export function getClassSubjectTeacher(classId){
  return {
    types: GET_CLASS_SUBJECT_TEACHER,
    callAPI:()=>{
      return fetch(config.api.class.getClassSubjectTeacher(classId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}

export const GET_STUDENT_FOR_CLASS = actionNames('GET_STUDENT_FOR_CLASS')
export const FIND_STUDENT = actionNames('FIND_STUDENT')

export function getStudent(classId){
  return {
    types: GET_STUDENT_FOR_CLASS,
    callAPI:()=>{
      return fetch(config.api.class.getStudent(classId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}

export function findStudent(filter){
  return {
    types: FIND_STUDENT,
    callAPI:()=>{
      return fetch(config.api.class.findStudent(filter),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        },
      }).then(res => res.json())
    }
  }
}
