import {actionNames} from '../../utils/action-utils'
import {fromJS} from 'immutable'
import config from '../../config.js'
import {notification} from 'antd'

//获取表格数据
export const GET_TABLEDATA = actionNames('GET_TABLEDATA')
export function getAnswerSheet(type,search,currentPage){
  return {
    types:GET_TABLEDATA,
    callAPI:()=>{
      return fetch(config.api.answersheet.getTableData(type,search,currentPage),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    },
  }
}

export function createAnswerSheet(data){
  return dispatch => {
    return fetch(config.api.answersheet.create,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        notification.success({message:'创建成功'})
        return 'success'
        // dispatch(getAnswerSheet('answersheet','',1)).then(res => {notification.success({message:'创建成功'});return res})
      }else{
        notification.error({message:'创建失败',description: res.result});
        return "error";
      }
    })
  }
}

export function saveAnswerSheet(data){
  return dispatch => {
    return fetch(config.api.answersheet.editSheetQuestion,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: data
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        notification.success({message:'保存成功'})
        return 'success'
        // dispatch(getAnswerSheet('answersheet','',1)).then(res => {notification.success({message:'保存成功'});return res})
      }else{
        notification.error({message:'保存失败',description: res.result});
        return "error";
      }
    })
  }
}

export function downloadSheet(id){
  return dispatch => {
    return fetch(config.api.answersheet.download(id),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
    }).then(res => res.blob()).then(res => {
      let link=document.createElement('a');
      link.href=window.URL.createObjectURL(res);
      link.download="答题卡"+ id + ".pdf";
      link.id='pdfFile'
      link.click();
      // document.getElementById('pdfFile').remove();
    })
  }
}

export function editAnswerSheet(id,type,name=''){
  let formData = new FormData()
  formData.append('answersheet_id',id)
  formData.append('action',type)
  if(type==='edit'){
    formData.append('answersheet_name',name)
  }
  return dispatch => {
    return fetch(config.api.answersheet.edit,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: formData
    }).then(res => res.json()).then(res => {
      if(res.title == 'Success'){
        dispatch(getAnswerSheet('answersheet','',1)).then(res => {notification.success(type==='edit'?{message:'编辑成功'}:{message:'删除成功'});return res})
      }else{
        notification.error(type==='edit'?{message:'编辑失败',description: res.result}:{message:'删除失败',description: res.result});
        return "error";
      }
    })
  }
}

// 获取答题卡详情
export const GET_SHEET_DETAIL = actionNames('GET_SHEET_DETAIL')
export function getSheetDetail(id){
  return {
    types:GET_SHEET_DETAIL,
    callAPI:()=>{
      return fetch(config.api.answersheet.getAnswerSheet(id),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json()).then(res => {
        return fetch(config.api.answersheet.getAnswerSheetQuestion(id),{
          method:'GET',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken'),
          }
        }).then(res2 => res2.json()).then(res2 => ({detail: res, question: res2}))
      })
    }
  }
}

// 获取答题卡问题详情
export const GET_SHEET_QUESTION = actionNames('GET_SHEET_QUESTION')
export function getSheetQuestion(id){
  return {
    types:GET_SHEET_QUESTION,
    callAPI:()=>{
      return fetch(config.api.answersheet.getAnswerSheetQuestion(id),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}

export const GET_ADDUCTION = 'GET_ADDUCTION'
export function getAdduction(id){
  let formData = new FormData()
  formData.append('answersheetId',id)
  return dispatch => {
    return fetch(config.api.answersheet.getAdduction,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
      body: formData
    }).then(res => res.json()).then(res => {
      if(res==0){
        return false
      }else{
        return true
      }
    })
  }
}

export const CHECK_SHEET_NAME = actionNames('CHECK_SHEET_NAME')
export function checkSheetName(name){
  return {
    types: CHECK_SHEET_NAME,
    callAPI:()=>{
      return fetch(config.api.answersheet.checkSheetName(name),{
        method:'GET',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken'),
        }
      }).then(res => res.json())
    }
  }
}
