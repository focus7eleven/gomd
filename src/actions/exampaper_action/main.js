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
export function getExampaper(type,search,currentPage,subjectId,gradeId){
  let realType = type;
  let isDraft = 0
  if(type === 'selfexampapercenter'){
    realType = 'showExamList.json'
  }else if(type==='draftpapercenter'){
    realType = 'showExamList.json'
    isDraft = 1
  }
  return {
    types:GET_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.exampaper.getTableData(realType,search,currentPage,subjectId,gradeId,isDraft),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then(res => ({mainData:res,otherMsg:{search,subjectId,gradeId}}))
    },
    shouldCallAPI:()=>{
      return type!='newexampaper' && isNaN(type)
    }
  }
}

//删除试卷
export function deletePaper(examId){
  let formData = new FormData()
  formData.append('examId',examId)
  return dispatch => {
    fetch(config.api.exampaper.deletePaper,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title=='Success'){
        dispatch({
          types:GET_TABLEDATA,
          callAPI:()=>{
            return fetch(config.api.exampaper.getTableData('showExamList.json','',1,'','',1),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'删除成功'});return {mainData:res,otherMsg:{search:'',subjectId:'',gradeId:''}}})
          }
        })
      }else{
        notification.error({message:'删除失败'})
      }
    })
  }
}

export const GET_FILTERED_TABLEDATA = actionNames('GET_FILTERED_TABLEDATA')
export function getFilteredTableData(type,search,currentPage,phaseCode="",subjectId="",termId="",draft=0){
  return {
    types:GET_FILTERED_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.exampaper.getTableData(type,search,currentPage,subjectId,gradeId,draft),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then(res => ({mainData:res,otherMsg:{search,currentPage,phaseCode,subjectId,termId}}))
    },
  }
}

// 获取筛选器选项
export const GET_GRADE_OPTIONS = actionNames('GET_GRADE_OPTIONS')
export const GET_SUBJECT_OPTIONS = actionNames('GET_SUBJECT_OPTIONS')
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
