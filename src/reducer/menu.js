import {
  GET_MENU,
} from '../actions/menu'

import {fromJS,List} from 'immutable'

const initMenu = fromJS({
  data:List()
})

export const findMenuInTree = (tree, targetURL) => tree.find(v => v.get('resourceUrl') == targetURL) || tree.reduce((reduction, v) => {
	return reduction || (v.get('childResources')?findMenuInTree(v.get('childResources'), targetURL):findMenuInTree(List(), targetURL)) || null
}, null)

// 根据三级菜单找到当前所处的菜单路径，用于面包屑的展示以及路径跳转。
export const findPath = (tree,targetURL) => {
  return tree.reduce((pre,cur) => {
    if(cur.get('childResources')){
      let childPath = findPath(cur.get('childResources'),targetURL)
      if(!childPath.isEmpty()){
        return pre.concat(List([cur])).concat(childPath)
      }else{
        return pre.concat(List())
      }
    }else{
      if(cur.get('resourceUrl') == targetURL){
        return pre.concat(List([cur]))
      }else{
        return pre.concat(List())
      }
    }
  },List())
}

export default (state=initMenu,action) => {
  switch (action.type) {
    case GET_MENU:
      // return state.set('data',fromJS(action.payload.slice(0,7)))
      return state.set('data',fromJS(action.payload.slice(0,8)))
    default:
      return state
  }
}
