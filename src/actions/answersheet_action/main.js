/**
 * Created by wuyq on 2017/2/10.
 */
import config from '../../config';

export function downloadAnswersheet(homeworkId){
  return dispatch => {
    return fetch(config.api.homework.downloadAnswersheet(homeworkId),{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      },
    }).then(res => res.blob()).then(res => {
      let linkId = 'answersheetPdf_' + homeworkId;

      let link=document.createElement('a');
      link.href=window.URL.createObjectURL(res);
      link.download="答题卡_"+homeworkId+".pdf";
      link.id=linkId;
      link.click();
    })
  }
}