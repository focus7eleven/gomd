import {actionNames} from '../../utils/action-utils'
import {fromJS} from 'immutable'
import config from '../../config.js'
import {notification} from 'antd'

//获取表格数据
export const GET_TABLEDATA = actionNames('GET_TABLEDATA')
export function getTableData(type,search,currentPage){
  let realType = type;
  if(type === 'publicCourse'){
    realType = 'publicPage'
  }else if(type=='publishedCourse'){
    realType = 'publishedPage'
  }else if(type=='courseInfo'){
    realType = 'teacherPage'
  }else if(type=='schoolCourse'){
    realType = 'schoolPage'
  }else if(type=='uncheckCourse'){
    realType = 'uncheckPage'
  }
  return {
    types:GET_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.courseCenter.getTableData(realType,search,currentPage),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    },
    shouldCallAPI:()=>{
      return type!='newCourse' && isNaN(type)
    }
  }
}

export const GET_FILTERED_TABLEDATA = actionNames('GET_FILTERED_TABLEDATA')
export function getFilteredTableData(type,search,currentPage,phaseCode="",subjectId="",termId=""){
  return {
    types:GET_FILTERED_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.courseCenter.getTableData(type,search,currentPage,phaseCode,subjectId,termId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    },
  }
}

//获取课程的详细信息
export const GET_DETAILDATA = actionNames('GET_DETAILDATA')
export function getDetailData(lessonId){
  return {
    types:GET_DETAILDATA,
    callAPI:()=>{
      return fetch(config.api.courseCenter.detail(lessonId),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}

export const CHECK_COURSE = actionNames('CHECK_COURSE')
export function checkCourse(lessonId,result){
  return {
    types: CHECK_COURSE,
    callAPI:()=>{
      return fetch(config.api.courseCenter.checkCourse(lessonId,result),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then(res => {
        if(res.title==='Success'){
          notification.success({message:'审核成功'});
          return 'success'
        }else {
          notification.error({message: '审核失败',description: res.result});
          return 'error'
        }
      })
    }
  }
}

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
