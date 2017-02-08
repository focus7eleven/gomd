import {actionNames} from '../utils/action-utils'
import {fromJS} from 'immutable'
import config from '../config.js'

// 声明登录之后获取菜单的action操作
export const GET_MENU = 'GET_MENU'
export function getMenu(){
  return dispatch => {
    return fetch(config.api.menu.get,{
      method:'GET',
      headers:{
        'from' : 'nodejs',
        'token' : sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      dispatch({
        type:GET_MENU,
        payload:res
      })
    })
  }
}
