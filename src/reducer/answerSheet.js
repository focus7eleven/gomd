import {
  GET_TABLEDATA,
  GET_SHEET_DETAIL,
  GET_SHEET_QUESTION,
} from '../actions/answer_sheet/main'
import {fromJS} from 'immutable'
import _ from 'lodash'

const initialState = fromJS({
  data: [],
  loading: false,
  answerSheetDetail: {},
  answerSheetQuestion: [],
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case GET_TABLEDATA[0]:
      return state.set('loading',true)
    case GET_TABLEDATA[1]:
      return state.set('data',fromJS(action.data)).set('loading',false)
    case GET_SHEET_DETAIL[1]:
      return state.set('answerSheetDetail',action.data)
    case GET_SHEET_QUESTION[1]:
      return state.set('answerSheetQuestion',action.data)
    default:
      return state
  }
}
