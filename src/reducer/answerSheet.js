import {
  GET_TABLEDATA,
} from '../actions/answer_sheet/main'
import {fromJS} from 'immutable'
import _ from 'lodash'

const initialState = fromJS({
  data: [],
  loading: true,
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case GET_TABLEDATA[0]:
      return state.set('loading',true)
    case GET_TABLEDATA[1]:
      return state.set('data',fromJS(action.data)).set('loading',false)
    default:
      return state
  }
}
