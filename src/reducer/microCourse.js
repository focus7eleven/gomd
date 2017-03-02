import {
  GET_VIDEO_DATA,
  GET_GRADE_OPTIONS,
  GET_SUBJECT_OPTIONS,
  GET_VERSION_OPTIONS,
  GET_FILTERED_VIDEO,
  LIKE_VIDEO,
  COLLECT_VIDEO,
  SET_DETAIL,
  GET_VIDEO_DETAIL,
} from '../actions/micro_course/main'
import {fromJS} from 'immutable'
import _ from 'lodash'

const initialState = fromJS({
  data: [],
  loading: false,
  gradeOptions: [],
  subjectOptions: [],
  versionOptions: [],
  loadingDetail: false,
  videoDetail: [],
})

export default (state = initialState,action)=>{
  let videoId, result, type
  switch (action.type) {
    case GET_VIDEO_DATA[0]:
      return state.set('loading',true)
    case GET_VIDEO_DATA[1]:
      return state.set('data',fromJS(action.data)).set('loading',false)
    case GET_FILTERED_VIDEO[1]:
      return state.set('data',fromJS(action.data))
    case GET_GRADE_OPTIONS[1]:
      return state.set('gradeOptions',action.data)
    case GET_SUBJECT_OPTIONS[1]:
      return state.set('subjectOptions',action.data)
    case GET_VERSION_OPTIONS[1]:
      return state.set('versionOptions',action.data)
    case GET_VIDEO_DETAIL[0]:
      return state.set('loadingDetail', true)
    case GET_VIDEO_DETAIL[1]:
      return state.set('videoDetail',fromJS(action.data)).set('loadingDetail', false)
    case LIKE_VIDEO:
      ({videoId,result,type} = action.payload);
      const newLikeType = type === 'like' ? true : false;
      return state.update('videoDetail', v => v.set('liked', newLikeType).set('likeCount',Number.parseInt(result)))
    case COLLECT_VIDEO:
      ({videoId,result,type} = action.payload);
      const newCollectType = type === 'collect' ? true : false;
      return state.update('videoDetail', v => v.set('collected', newCollectType).set('collectionCount',Number.parseInt(result)))
    case SET_DETAIL:
      const videoDetail = action.payload.data
      return state.set('videoDetail', videoDetail)
    default:
      return state
  }
}
