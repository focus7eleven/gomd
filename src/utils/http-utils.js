/**
 * Created by wuyq on 2017/1/19.
 */

import {message,notification} from 'antd';

/* 将对象形式的参数转化为url形式的  */
export const getUrlParams = (objectParam) => {
  let paramArray = [];
  for (let key in objectParam) {
    if (objectParam[key] != null && objectParam[key] != "") {
      paramArray.push(key + "=" + encodeURIComponent(objectParam[key]));
    }
  }
  return paramArray.join("&");
}

export const httpFetchGetBlob = (url, params) => {
    if (params) {
        let paramsArray = [];
        //encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return fetch(url, {
        method: 'GET',
        headers: {
            'from': 'nodejs',
            'token': sessionStorage.getItem('accessToken'),
        },
    }).then(
        (response) => {
            if (response.ok) {
                return Promise.resolve(response.blob());
            } else {
                return Promise.reject({message:response.status, stack:response.statusText});
            }
        }
    ).catch(
        (error) => {
            notification.error({
                message:error.message,
                description:error.stack,
                duration:10,
            });
            return Promise.reject();
        }
    )
}

export const httpFetchGet = (url, params) => {
  if (params) {
    let paramsArray = [];
    //encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  return fetch(url, {
    method: 'GET',
    headers: {
      'from': 'nodejs',
      'token': sessionStorage.getItem('accessToken'),
    },
  }).then(
    (response) => {
      if (response.ok) {
        return Promise.resolve(response.json());
      } else {
        return Promise.reject({message:response.status, stack:response.statusText});
      }
    }
  ).catch(
    (error) => {
      notification.error({
        message:error.message,
        description:error.stack,
        duration:10,
      });
      return Promise.reject();
    }
  )
}

export const httpFetchPost = (url, formData) => {
  return fetch(url, {
      method: 'POST',
      headers: {
        'from': 'nodejs',
        'token': sessionStorage.getItem('accessToken'),
      },
      body: formData
    }).then(
      (response) => {
        if (response.ok) {
          return Promise.resolve(response.json());
        } else {
          return Promise.reject({message:response.status, stack:response.statusText});
        }
      }
    ).catch(
    (error) => {
      notification.error({
        message:error.message,
        description:error.stack,
        duration:10,
      });
      return Promise.reject();
    }
  )
}

export const objectToFormData = (obj) => {

}