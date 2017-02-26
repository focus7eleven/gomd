import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ROLE_PATRIARCH,ROLE_TEACHER,ROLE_STUDENT} from '../../constant'
import TeacherWelcomePage from './TeacherWelcomePage'
import StudentWelcomePage from './StudentWelcomePage'

const WelcomPageContainer = React.createClass({
  render(){
    switch (this.props.user.get('userInfo').userStyle) {
      case ROLE_PATRIARCH:
        return (<div>暂无官员</div>)
        break;
      case ROLE_TEACHER:
        return <TeacherWelcomePage />
        break;
      case ROLE_STUDENT:
        return <StudentWelcomePage />
        break;
      default:
        return <div>暂无该身份的欢迎页</div>
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
