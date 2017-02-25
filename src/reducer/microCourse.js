import {
  GET_TABLEDATA,
  GET_GRADE_OPTIONS,
  GET_SUBJECT_OPTIONS,
  GET_VERSION_OPTIONS,
  GET_FILTERED_TABLEDATA,
  LIKE_VIDEO,
  COLLECT_VIDEO,
  SET_DETAIL,
} from '../actions/micro_course/main'
import {fromJS} from 'immutable'
import _ from 'lodash'

const initialState = fromJS({
  data: [],
  loading: true,
  gradeOptions: [],
  subjectOptions: [],
  versionOptions: [],
  videoDetail: {},
})

export default (state = initialState,action)=>{
  let videoId, result, type
  switch (action.type) {
    case GET_TABLEDATA[0]:
      return state.set('loading',true)
    case GET_TABLEDATA[1]:
      return state.set('data',fromJS(action.data)).set('loading',false)
    case GET_FILTERED_TABLEDATA[1]:
      return state.set('data',fromJS(action.data))
    case GET_GRADE_OPTIONS[1]:
      return state.set('gradeOptions',action.data)
    case GET_SUBJECT_OPTIONS[1]:
      return state.set('subjectOptions',action.data)
    case GET_VERSION_OPTIONS[1]:
      return state.set('versionOptions',action.data)
    case LIKE_VIDEO:
      ({videoId,result,type} = action.payload);
      const newLikeType = type === 'like' ? true : false;
      return state.updateIn(['data','result'],v => v.update(v.findIndex(v => v.get('id') == videoId), v => v.set('likeCount', Number.parseInt(result)).set('liked', newLikeType)))
    case COLLECT_VIDEO:
      ({videoId,result,type} = action.payload);
      const newCollectType = type === 'collect' ? true : false;
      return state.updateIn(['data','result'],v => v.update(v.findIndex(v => v.get('id') == videoId), v => v.set('collectionCount', Number.parseInt(result)).set('collected', newCollectType)))
    case SET_DETAIL:
      const videoDetail = action.payload.data
      return state.set('videoDetail', videoDetail)
    default:
      return state
  }
}
