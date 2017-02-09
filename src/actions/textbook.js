import {GET_WORKSPACEDATA} from './workspace'
import config from '../config.js'
import {notification} from 'antd'
import {actionNames} from '../utils/action-utils'

export function addTextbook(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('phase_code',data.phaseCode)
    formData.append('grade_id',data.gradeId)
    formData.append('subject_id',data.subjectId)
    formData.append('textbook_term',data.term)
    formData.append('textbook_year',data.year)
    formData.append('textbook_version',data.version)
    formData.append('textbook_name',data.comment)
    return fetch(config.api.textbook.post,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch({
          types:GET_WORKSPACEDATA,
          callAPI:()=>{
            return fetch(config.api.workspace.baseInfo.baseData.get('textbook','','',''),{
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

export function editTextbook(data){
  return dispatch => {
    let phaseForm = new FormData()
    phaseForm.append('table','textbook')
    phaseForm.append('column','phase_code')
    phaseForm.append('val',data.phaseCode)
    phaseForm.append('pk',data.textbookId)
    phaseForm.append('pkname','textbook_id')
    let phasePermission = fetch(config.api.select.change.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:phaseForm
    }).then(res => res.json())
    let gradeForm = new FormData()
    gradeForm.append('table','textbook')
    gradeForm.append('column','grade_id')
    gradeForm.append('val',data.gradeId)
    gradeForm.append('pk',data.textbookId)
    gradeForm.append('pkname','textbook_id')
    let gradePermission = fetch(config.api.select.change.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:gradeForm
    }).then(res => res.json())
    let versionForm = new FormData()
    versionForm.append('table','textbook')
    versionForm.append('column','textbook_version')
    versionForm.append('val',data.versionId)
    versionForm.append('pk',data.textbookId)
    versionForm.append('pkname','textbook_id')
    let versionPermission = fetch(config.api.select.change.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:versionForm
    }).then(res => res.json())
    let subjectForm = new FormData()
    subjectForm.append('table','textbook')
    subjectForm.append('column','subject_id')
    subjectForm.append('val',data.subjectId)
    subjectForm.append('pk',data.textbookId)
    subjectForm.append('pkname','textbook_id')
    let subjectPermission = fetch(config.api.select.change.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:subjectForm
    }).then(res => res.json())
    let otherForm = new FormData()
    otherForm.append('textbook_id',data.textbookId)
    otherForm.append('textbook_term',data.term)
    otherForm.append('textbook_year',data.year)
    otherForm.append('action','edit')
    let otherPermission = fetch(config.api.textbook.update,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:otherForm
    }).then(res => res.json())
    return Promise.all([phasePermission,gradePermission,versionPermission,subjectPermission]).then(results => {

    })
  }
}

export function deleteTextbook(data){
  return dispatch => {
    let formData = new FormData()
    formData.append('textbook_id',data.textbookId)
    formData.append('action','delete')
    return fetch(config.api.textbook.update,{
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
            return fetch(config.api.workspace.baseInfo.baseData.get('textbook','','',''),{
              method:'GET',
              headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
              }
            }).then(res => res.json()).then(res => {notification.success({message:'删除成功'});return res})
          }
        })
      }
    })
  }
}

export const SEARCH_TEXTBOOK = actionNames('SEARCH_TEXTBOOK')
export function searchTextbook(data){
  const {searchStr,currentPage,phaseOption,gradeOption,subjectOption} = data
  return {
    types:SEARCH_TEXTBOOK,
    callAPI:()=>{
      return fetch(config.api.textbook.search.get(searchStr,currentPage,phaseOption,gradeOption,subjectOption),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then(res => ({mainData:res,otherMsg:{phaseOption,gradeOption,subjectOption}}))
    }
  }
}
