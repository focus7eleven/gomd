import React from 'react'
import styles from './CreateNewsPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

// setnotification
// neweduinfo
// settask
const CreateNewsPage = React.createClass({
  getInitialState(){
    return {
      pageType: 'setnotification',
    }
  },

  componentWillMount(){
    const pageType = this.props.location.pathname.split('/').slice(-1)[0];
    this.setState({pageType})
  },

  componentWillReceiveProps(nextProps){
    const pageType = nextProps.location.pathname.split('/').slice(-1)[0];
    this.setState({pageType})
  },

  getPageName(){
    switch (this.state.pageType) {
      case 'setnotification':
        return '通知'
        break;
      case 'settask':
        return '任务'
        break;
      case 'neweduinfo':
        return '资讯'
        break;
      default:
        return '通知'
    }
  },

  render(){
    return (
      <div className={styles.container}>
        <div className={styles.header}>{this.getPageName()}</div>
        <div className={styles.body}></div>
      </div>
    )
  }
})


function mapStateToProps(state){
  return{}
}
function mapDispatchToProps(dispatch){
  return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateNewsPage)
