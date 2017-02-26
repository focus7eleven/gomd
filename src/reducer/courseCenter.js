import {
  GET_TABLEDATA,
  GET_DETAILDATA,
  GET_GRADE_OPTIONS,
  GET_SUBJECT_OPTIONS,
  GET_VERSION_OPTIONS,
  GET_FILTERED_TABLEDATA,
} from '../actions/course_center/main'
import {fromJS} from 'immutable'
import _ from 'lodash'

const initialState = fromJS({
  data: [],
  courseDetail: [],
  loading: false,
  loadingDetail: true,
  gradeOptions: [],
  subjectOptions: [],
  versionOptions: [],
  otherMsg:fromJS({
    gradeOption: "",
    subjectOption: "",
    termOption: "",
    // versionOption: "",
  }),
})

export default (state = initialState,action)=>{
  switch (action.type) {
    case GET_TABLEDATA[0]:
      return state.set('loading',true)
    case GET_TABLEDATA[1]:
      return state.set('data',fromJS(action.data.mainData)).set('loading',false).set('otherMsg',fromJS(action.data.otherMsg))
    case GET_FILTERED_TABLEDATA[1]:
      return state.set('data',fromJS(action.data.mainData)).set('loading',false).set('otherMsg',fromJS(action.data.otherMsg))
    case GET_DETAILDATA[0]:
      return state.set('loadingDetail',true)
    case GET_DETAILDATA[1]:
      return state.set('courseDetail',fromJS(action.data)).set('loadingDetail',false)
    case GET_GRADE_OPTIONS[1]:
      return state.set('gradeOptions',action.data)
    case GET_SUBJECT_OPTIONS[1]:
      return state.set('subjectOptions',action.data)
    case GET_VERSION_OPTIONS[1]:
      return state.set('versionOptions',action.data)
    default:
      return state
  }
}
