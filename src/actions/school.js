import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'
import {actionNames} from '../utils/action-utils'

export const SEARCH_SCHOOL = actionNames('SEARCH_SCHOOL')
export function searchSchool(data){
  const {searchStr,currentPage,areaOption} = data
  return {
    types:SEARCH_SCHOOL,
    callAPI:()=>{
      return fetch(config.api.school.search(searchStr,currentPage,areaOption),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => ({mainData:res,otherMsg:{areaOption}}))
    }
  }
}

export function addSchool(data){
  return dispatch => {
    fetch(config.api.school.check.get(data.schoolName,data.schoolCode),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      console.log("res:",res)
      if(res.title =='Success'){
        return Promise.resolve()
      }else{
        return Promise.reject(new Error('名字重复'))
      }
    }).then(()=>{
      let formData = new FormData()
      formData.append('school_name',data.schoolName)
      formData.append('school_code',data.schoolCode)
      formData.append('admin_name',data.adminName)
      formData.append('admin_code',data.adminCode)
      formData.append('area_id',data.areaId)
      formData.append('phase_value',data.phaseValue)
      formData.append('school_desc',data.schoolDesc)
      formData.append('address',data.address)
      formData.append('remark',data.remark)
      return fetch(config.api.school.post,{
        method:'post',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        },
        body:formData
      }).then(res => res.json()).then(res => {
        if(res.title == 'Success'){
          return Promise.resolve()
        }else{
          return Promise.reject(new Error('添加失败'))
        }
      })
    }).then(()=>{
      dispatch({
        types:GET_WORKSPACEDATA,
        callAPI:()=>{
          return fetch(config.api.workspace.baseInfo.baseData.get('school','','','','pageByArea'),{
            method:'GET',
            headers:{
              'from':'nodejs',
              'token':sessionStorage.getItem('accessToken'),
            }
          }).then(res => res.json()).then(res => {notification.success({message:'添加成功'});return res})
        }
      })
    },err => {
      notification.error({message:err.toString()})
    })
  }
}

export function editSchool(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('school_name',data.schoolName)
    formData.append('school_code',data.schoolCode)
    formData.append('admin_name',data.adminName)
    formData.append('admin_code',data.adminCode)
    formData.append('area_id',data.areaId)
    formData.append('phase_value',data.phaseValue)
    formData.append('school_desc',data.schoolDesc)
    formData.append('address',data.address)
    formData.append('remark',data.remark)
    formData.append('school_id',data.schoolId)
    formData.append('action',data.action)
    fetch(config.api.school.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('school','','','','pageByArea'),{
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
