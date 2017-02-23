import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ROLE_PATRIARCH,ROLE_TEACHER,ROLE_STUDENT} from '../../constant'
import TeacherWelcomePage from './TeacherWelcomePage'

const WelcomPageContainer = React.createClass({
  render(){
    console.log("--->:",this.props.user.get('userInfo'))
    switch (this.props.user.get('userInfo').userStyle) {
      case ROLE_PATRIARCH:
        return <div>官员</div>
        break;
      case ROLE_TEACHER:
        return <TeacherWelcomePage />
        break;
      case ROLE_STUDENT:
        return <div>学生</div>
        break;
      default:
        return <div>错误</div>
        break;
    }
  }
})
function mapStateToProps(state){
  return {
    user:state.get('user')
  }
}

function mapDispatchToProps(dispatch){
  return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(WelcomPageContainer)
