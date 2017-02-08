import {
  LOGIN_SUCCESS,
  LOGOUT,
  GET_USER_ROLES,
  GET_USER_INFO,
} from '../actions/user'
import {fromJS} from 'immutable'
import {notification} from 'antd'

const initialState = fromJS({
  isAuth:false,
  data:{},
  userId: 0,
  userRoles: [],
  userInfo: {},
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case LOGIN_SUCCESS:
      notification.success({
        message: '成功',
				description: '您已成功登录。',
      })
      return state.set('isAuth',action.isAuth).set('userId',action.userId)
    case LOGOUT:
      notification.success({
        message: '成功',
				description: '您已成功登出。',
      })
      return state.set('isAuth',false)
    case GET_USER_ROLES[1]:
      const userRoles = action.data.roles.filter((item)=>action.data.userRoleList.indexOf(item.roleId)>=0)
      return state.set('userRoles',userRoles)
    case GET_USER_INFO[1]:
      return state.set('userInfo',action.data)
    default:
      return state

  }
}
