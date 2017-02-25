import {actionNames} from '../utils/action-utils'
import {fromJS} from 'immutable'
import config from '../config.js'
import {notification} from 'antd'
notification.config({
  duration: 3,
  placement: 'bottomRight',
  bottom: 10,
});
//获取表格数据
export const GET_WORKSPACEDATA = actionNames('GET_WORKSPACEDATA')

export function getWorkspaceData(type,currentPage,pageShow,search,suffix='page'){
  let realType = type;
  if(type==="normalgroup"){
    realType='group/normal'
  }
  if(type==="madegroup"){
    realType='group/made'
  }
  if(type==="classes"){
    realType='class'
  }
  if(type=='school'){
    suffix='pageByArea'
  }
  if(type=='gradeSet'){
    return {
      types:GET_WORKSPACEDATA,
      callAPI:()=>{
        return fetch(config.api.workspace.baseInfo.baseData.getWithUrl('grade/pageBySchool?search=&currentPage=1'),{
          method:'GET',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken'),
          }
        }).then(res => res.json())
      }
    }
  }
  return {
    types:GET_WORKSPACEDATA,
    callAPI:()=>{
      return fetch(config.api.workspace.baseInfo.baseData.get(realType,currentPage,pageShow,search,suffix),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}

//添加一个新的学段，添加成功后再获取一遍数据
export function addPhase(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('phase_code',data.phaseCode)
    formData.append('phase_name',data.phaseName)
    formData.append('remark',data.remark)
    return fetch(config.api.phase.post,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData,
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('phase','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => {notification.success({message:'添加成功'});return res.json()})
          }
        })
      }else{
        notification.error({message:'添加失败',description:'网络错误'})
      }
    })
  }
}

//编辑一个新的学段，添加成功后再获取一遍数据
export function editPhase(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('phase_code',data.phaseCode)
    formData.append('phase_name',data.phaseName)
    formData.append('remark',data.remark)
    formData.append('action','edit')
    return fetch(config.api.phase.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData,
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('phase','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => {notification.success({message:'编辑成功'});res.json()})
          }
        })
      }else{
        notification.error({message:'修改失败',description:'网络错误'})
      }
    })
  }
}
//删除一个新的学段，添加成功后再获取一遍数据
export function deletePhase(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('phase_code',data.phaseCode)
    formData.append('phase_name',data.phaseName)
    formData.append('remark',data.remark)
    formData.append('action','delete')
    return fetch(config.api.phase.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData,
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('phase','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'删除成功'});return res})
          }
        })
      }else{
        notification.error({message:'删除失败',description:'网络错误'})
      }
    })
  }
}
//添加学段对应的学科
export function addPhaseSubject(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('phaseCode',data.phaseCode)
    data.subjectIds.forEach(v => {
      formData.append('subjectIds[]',v)
    })
    return fetch(config.api.phase.subjectList.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title=='Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('phase','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'添加成功'});return res})
          }
        })
      }else{
        notification.error({message:'添加失败',description:'网络错误'})
      }
    })
  }
}


export const addGrade = require('./grade').addGrade
export const editGrade = require('./grade').editGrade
export const GET_GRADE_TEACHER_LIST = require('./grade').GET_GRADE_TEACHER_LIST
export const getGradeTeacherList = require('./grade').getGradeTeacherList
export const setGradeLeader = require('./grade').setGradeLeader

export const addSubject = require('./subject').addSubject
export const editSubject = require('./subject').editSubject

export const addDict = require('./dict').addDict
export const editDict = require('./dict').editDict

export const editRoleDesc = require('./role').editRoleDesc
export const addRole = require('./role').addRole
export const editRole = require('./role').editRole


export const addTextbook = require('./textbook').addTextbook
export const editTextbook = require('./textbook').editTextbook
export const deleteTextbook = require('./textbook').deleteTextbook
export const searchTextbook = require('./textbook').searchTextbook
export const SEARCH_TEXTBOOK = require('./textbook').SEARCH_TEXTBOOK

export const addResource = require('./resource').addResource
export const editResource = require('./resource').editResource
export const getAllResources = require('./resource').getAllResources
export const updateAuth = require('./resource').updateAuth
export const GET_ALL_RESOURCES = require('./resource').GET_ALL_RESOURCES

export const addMadeGroup = require('./group').addMadeGroup

export const GET_ALL_AREAS = require('./staff').GET_ALL_AREAS
export const getAllAreas = require('./staff').getAllAreas
export const addStaff = require('./staff').addStaff
export const editStaff = require('./staff').editStaff
export const downloadExcel = require('./staff').downloadExcel
export const importExcel = require('./staff').importExcel
export const setTeacherRole = require('./staff').setTeacherRole

export const addDepartment = require('./department').addDepartment
export const editDepartment = require('./department').editDepartment
export const addOffice = require('./department').addOffice
export const addMember = require('./department').addMember

export const addArea = require('./area').addArea
export const editArea = require('./area').editArea

export const addSchoolDepart = require('./schoolDepart').addSchoolDepart
export const editSchoolDepart = require('./schoolDepart').editSchoolDepart
export const GET_SCHOOL_USERLIST = require('./schoolDepart').GET_SCHOOL_USERLIST
export const getSchoolUserList = require('./schoolDepart').getSchoolUserList
export const GET_LEADER_LIST = require('./schoolDepart').GET_LEADER_LIST
export const getLeaderList = require('./schoolDepart').getLeaderList
export const GET_MEMBER_LIST = require('./schoolDepart').GET_MEMBER_LIST
export const getMemberList = require('./schoolDepart').getMemberList
export const setStaff = require('./schoolDepart').setStaff

export const addClass = require('./class').addClass
export const editClass = require('./class').editClass
export const GET_PHASE_LIST = require('./class').GET_PHASE_LIST
export const getPhaseList = require('./class').getPhaseList
export const GET_GRADE_LIST = require('./class').GET_GRADE_LIST
export const getGradeList = require('./class').getGradeList
export const GET_CLASS_LEADER_LIST = require('./class').GET_CLASS_LEADER_LIST
export const getClassLeaderList = require('./class').getClassLeaderList
export const setClassLeader = require('./class').setClassLeader
export const GET_CLASS_SUBJECT = require('./class').GET_CLASS_SUBJECT
export const getClassSubject = require('./class').getClassSubject
export const GET_CLASS_SUBJECT_TEACHER = require('./class').GET_CLASS_SUBJECT_TEACHER
export const getClassSubjectTeacher = require('./class').getClassSubjectTeacher
export const setClassTeacher = require('./class').setClassTeacher
export const GET_STUDENT_FOR_CLASS = require('./class').GET_STUDENT_FOR_CLASS
export const getStudent = require('./class').getStudent
export const FIND_STUDENT = require('./class').FIND_STUDENT
export const findStudent = require('./class').findStudent
export const setStudent = require('./class').setStudent

export const searchSchool = require('./school').searchSchool
export const SEARCH_SCHOOL = require('./school').SEARCH_SCHOOL
export const addSchool = require('./school').addSchool
export const editSchool = require('./school').editSchool
