import {combineReducers} from 'redux-immutablejs'
import menu from './menu'
import user from './user'
import workspace from './workspace'
import courseCenter from './courseCenter'
import microCourse from './microCourse'
import exampaper from './exampaper'

const reducer = combineReducers({
  menu,
  user,
  workspace,
  courseCenter,
  microCourse,
  exampaper,
})

export default reducer
