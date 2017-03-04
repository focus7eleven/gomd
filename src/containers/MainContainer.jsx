import React from 'react'
import styles from './MainContainer.scss'
import {Breadcrumb} from 'antd'
import Navigation from './navigation/Navigation'
import NavigationMini from './navigation/NavigationMini'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import schoolLogo from 'images/school.png'
import teacherLogo from 'images/teacher.png'
import studentLogo from 'images/student.png'
import {List,fromJS} from 'immutable'
import {findPath} from '../reducer/menu'
import {ueEventEmitter} from '../components/ueditor/UeEventEmitter'
const MainContainer = React.createClass({
  getInitialState(){
    return {
      currentPath:List()
    }
  },

  getDefaultProps(){
    return {
      schoolInfo: {
        schoolName: "连云港高中B",
        teacherNum: 45,
        studentNum: 750,
      }
    }
  },
  componentWillReceiveProps(nextProps){
    let menuUrl = nextProps.location.pathname.split('/').slice(-1)[0]
    let path = !nextProps.menu.get('data').isEmpty()?findPath(nextProps.menu.get('data'),menuUrl):List()
    let temp = nextProps.location.pathname.split('/').slice(-2)[0]
    if(temp == 'detail' || temp == 'video_detail'){
      let menuUrl2 = nextProps.location.pathname.split('/').slice(-3)[0]
      let path2 = !nextProps.menu.get('data').isEmpty()?findPath(nextProps.menu.get('data'),menuUrl2):List()
      const tail = temp === 'detail' ? '课程内容' : '微课内容'
      this.setState({
        currentPath:path2.map(v => v.get('resourceName')).concat([tail])
      })
    }else if(temp=='displayExampaper'){
      let menuUrl2 = nextProps.location.pathname.split('/').slice(-3)[0]
      let path2 = !nextProps.menu.get('data').isEmpty()?findPath(nextProps.menu.get('data'),menuUrl2):List()
      this.setState({
        currentPath:path2.map(v => v.get('resourceName')).concat(['试卷内容'])
      })
    }else if(temp=='editAnswersheet'){
      let menuUrl2 = nextProps.location.pathname.split('/').slice(-3)[0]
      let path2 = !nextProps.menu.get('data').isEmpty()?findPath(nextProps.menu.get('data'),menuUrl2):List()
      this.setState({
        currentPath:path2.map(v => v.get('resourceName')).concat(['编辑答题卡'])
      })
    }else{
      this.setState({
        currentPath:path.map(v => v.get('resourceName'))
      })
    }
  },
  render(){
    const {schoolInfo} = this.props;
    return (
      <div className={styles.container}>
        {/* 当页面宽度小于1024px时，会加载NavigationMini这个导航栏*/}
        <div className={styles.navigation}>
          <Navigation></Navigation>
        </div>
        <div className={styles.navigationMini}>
          <NavigationMini></NavigationMini>
        </div>
        {
          this.props.children ?this.props.location.pathname=='/index/welcome'?(
            this.props.children
          ):(<div className={styles.workspace} onClick={()=>{ueEventEmitter.emitEvent('closeUE')}}>
              <div className={styles.mainPanel}>
                { /* 顶部的学校信息 */}
                <div className={styles.header}>
                  <Breadcrumb separator=">">
                    {
                      this.state.currentPath.map((item)=><Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>)
                    }
                  </Breadcrumb>
                  <div className={styles.schoolInfo}>
                    <span className={styles.school}><img src={schoolLogo}/>{schoolInfo.schoolName}</span>
                    <div className={styles.teacherNumContainer}>
                      <img src={teacherLogo} />
                      <div className={styles.teacherNum}>
                        <span>{schoolInfo.teacherNum}</span>
                        <span>教师人数</span>
                      </div>
                    </div>
                    <div className={styles.teacherNumContainer}>
                      <img src={studentLogo} />
                      <div className={styles.teacherNum}>
                        <span>{schoolInfo.studentNum}</span>
                        <span>学生人数</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.schoolInfoMini}>
                    <span className={styles.school}><img src={schoolLogo}/>{schoolInfo.schoolName}</span>
                  </div>
                </div>
                {/* 内容显示区域 */}
                <div className={styles.body}>
                  <div className={styles.innerContainer}>
                    {this.props.menu.get('data')?this.props.children:null}
                  </div>
                </div>
              </div>
            </div>)
            :
            null
          }
      </div>
    )
  }
})
function mapStateToProps(state) {
  return {
    menu:state.get('menu')
  }
}

function mapDispatchToProps(dispatch){
  return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(MainContainer)
