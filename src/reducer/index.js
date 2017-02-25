import {combineReducers} from 'redux-immutablejs'
import menu from './menu'
import user from './user'
import workspace from './workspace'
import courseCenter from './courseCenter'
import microCourse from './microCourse'
import examPaper from './examPaper'
import answerSheet from './answerSheet'

const reducer = combineReducers({
  menu,
  user,
  workspace,
  courseCenter,
  microCourse,
  examPaper,
  answerSheet,
})

export default reducer
