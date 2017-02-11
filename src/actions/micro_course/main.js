import {actionNames} from '../../utils/action-utils'
import {fromJS} from 'immutable'
import config from '../../config.js'
import {notification} from 'antd'
notification.config({
  top: window.screen.availHeight-200,
  duration: 3,
});

//获取表格数据
export const GET_TABLEDATA = actionNames('GET_TABLEDATA')
export function getTableData(type,search,currentPage){
  let realType = type;
  if(type === 'areavideo'){
    realType = 'area'
  }else if(type=='publicvideo'){
    realType = 'public'
  }else if(type=='teachervideo'){
    realType = 'getTeacher'
  }else if(type=='mycollection'){
    realType = 'collection'
  }
  return {
    types:GET_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.microvideo.getTableData(realType,search,currentPage),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    },
  }
}

export const GET_FILTERED_TABLEDATA = actionNames('GET_FILTERED_TABLEDATA')
export function getFilteredTableData(type,currentPage,subjectId,gradeId,textbookId,search,term,version){
  return {
    types:GET_FILTERED_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.microvideo.get(type,currentPage,subjectId,gradeId,textbookId,search,term,version),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    },
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

export function addVideo(data,type){
  return dispatch => {
    return fetch(config.api.microvideo.addVideo,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getTableData(type,'',1)).then(res => {notification.success({message:'添加成功'});return res})
      }else{
        notification.error({message:'添加失败',description: res.result});
        return "error";
      }
    })
  }
}
