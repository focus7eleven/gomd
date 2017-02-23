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
        dispatch(getAnswerSheet('answersheet','',1)).then(res => {notification.success({message:'创建成功'});return res})
      }else{
        notification.error({message:'创建失败',description: res.result});
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
