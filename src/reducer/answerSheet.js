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
  loadingDetail: false,
  answerSheetDetail: {},
  answerSheetQuestion: [],
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case GET_TABLEDATA[0]:
      return state.set('loading',true)
    case GET_TABLEDATA[1]:
      return state.set('data',fromJS(action.data)).set('loading',false)
    case GET_SHEET_DETAIL[0]:
      return state.set('loadingDetail',true)
    case GET_SHEET_DETAIL[1]:
      return state.set('answerSheetQuestion',action.data.question).set('answerSheetDetail',action.data.detail).set('loadingDetail',false)
    case GET_SHEET_QUESTION[0]:
      return state.set('loadingDetail',true)
    case GET_SHEET_QUESTION[1]:
      return state.set('answerSheetQuestion',action.data).set('loadingDetail',false)
    default:
      return state
  }
}
