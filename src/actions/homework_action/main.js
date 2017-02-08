import {actionNames} from '../../utils/action-utils'
import {fromJS} from 'immutable'
import config from '../../config.js'
import {notification} from 'antd'
notification.config({
  top: window.screen.availHeight-200,
  duration: 3,
});

// 获取筛选器选项
export const GET_GRADE_OPTIONS = actionNames('GET_GRADE_OPTIONS')
export const GET_SUBJECT_OPTIONS = actionNames('GET_SUBJECT_OPTIONS')
export const GET_VERSION_OPTIONS = actionNames('GET_VERSION_OPTIONS')
export function getGradeOptions(){
  return {
    types: GET_GRADE_OPTIONS,
    callAPI:()=>{
      return fetch(config.api.courseCenter.getUserGrade,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}
export function getSubjectOptions(){
  return {
    types: GET_SUBJECT_OPTIONS,
    callAPI:()=>{
      return fetch(config.api.courseCenter.getDistinctSubject,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}
export function getVersionOptions(){
  return {
    types: GET_VERSION_OPTIONS,
    callAPI:()=>{
      return fetch(config.api.courseCenter.getCourseVersion,{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}
