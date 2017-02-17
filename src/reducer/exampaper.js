import {
  GET_TABLEDATA,
  GET_GRADE_OPTIONS,
  GET_SUBJECT_OPTIONS,
  GET_FILTERED_TABLEDATA,
} from '../actions/exampaper_action/main'
import {fromJS} from 'immutable'
import _ from 'lodash'

const initialState = fromJS({
  data: {},
  loading: true,
  gradeOptions: [],
  subjectOptions: [],
  versionOptions: [],
  otherMsg:fromJS({}),
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case GET_TABLEDATA[0]:
      return state.set('loading',true)
    case GET_TABLEDATA[1]:
      return state.set('data',fromJS(action.data.mainData||{})).set('loading',false).set('otherMsg',fromJS(action.data.otherMsg||{}))
    case GET_FILTERED_TABLEDATA[1]:
      return state.set('data',fromJS(action.data))
    case GET_GRADE_OPTIONS[1]:
      return state.set('gradeOptions',fromJS(action.data))
    case GET_SUBJECT_OPTIONS[1]:
      return state.set('subjectOptions',fromJS(action.data))
    default:
      return state
  }
}
