import React from 'react'
import styles from './CreateNewsPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Select,Button,DatePicker,Input,notification} from 'antd'
import Ueditor from '../../components/ueditor/Ueditor'
import ZTreeComponent from '../../components/ztree/ZTreeComponent'
import moment from 'moment'
import config from '../../config'
import {fromJS} from 'immutable'

const Option = Select.Option;

const NewsSVG = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 18 18">
    <image id="矢量智能对象" width="18" height="18" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfhAhwRBhLJxMZJAAAA3ElEQVQoz33SP0oDQRTH8c+ERSJYGBAsTSMIFt5At7DwCB7BQ7gigkU6W2+QI6SwMDZ6AUXL9EISsFBQ1mLWsLtO8ptiHm++7y8TitJKXQUy9M2XMlMiNDerXME+nrWyZ9W9J3fsyBbejd259woXJaEo9Zw4dajXKPNgaBhzRmiGjsKaA7yYGnizSxuKjomubRN9pfAHZc0W7aRG7NTsa49+fBm7SU8H59jw7RPcpiH4WFhn6XJLFaFLZeIsOquvIKXaCnJ54+nJ6P90XZsNaD21glEzsq1M9WdW6Reen0AqYaTBZAAAAABJRU5ErkJggg=="/>
  </svg>
)

const NotificationSVG = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="18" viewBox="0 0 16 18">
    <image id="矢量智能对象" width="16" height="18" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAQAAAD4MpbhAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfhAhwRCSn/VzOiAAAA70lEQVQoz4XRIUtDYRjF8d/cXRqYDJaZBgtitFgcIkuCSVYsgk24ScGFoW02k2AzG5bmikUsluGKGPwCA8W05FyY4U7fu+H0nw7nPTyc53kzdSmqLnDgOliZicC7PVxZCNbcj8qr6Wtq6qvJTweKuipiBQWxiq5iOpDX1lK16darGxta2smUJBDrOfdo0SEYOdITh5JPaqoG9lOFtzSsfE8o6VjSSC+kowQRyBlYN8mb3OSa04ym7zCDfwORHcs49vHL66nnTP0zKTODYWTX2h+Bh/RvlpXH6t5d6BCYdzJW28HMpu7zImvV0JnLYH4B9tcxGk6DoHwAAAAASUVORK5CYII="/>
  </svg>
)

const TaskSVG = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="18" viewBox="0 0 16 18">
    <image id="矢量智能对象" width="16" height="18" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAQAAAD4MpbhAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfhAhwRCBpZnGP1AAAA8klEQVQoz3XQPS9DARTG8d9tbrw0kZQQL5ORhJWB3SJedvEFDF4SEo36CmoSEYsv0EG6WEUinbvo2hCD0oWEoQya2+u6fc72nP85OecJCtracSKplvMgAnr1/wMmVEPXBqTpw5onQWjZhvcUoCQLIcqabXPRpsCV2w6Xic2sKnvVULbeMcMYkLfnEg/ySmnAtiqoGU5uKEZZkHPsJnlDs13w4stBtw05jGrEv/0F3mJO8DeOMM2MK57DtC0z3YARZyqW3LswlgR67KsZMmvFlKyaQ33g02lQ+Fb3bNddNDSnaNykQU0yHh2Zj7WpWJBX14IflAU3b66rgAEAAAAASUVORK5CYII="/>
  </svg>
)


// setnotification
// neweduinfo
// settask
const CreateNewsPage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      pageType: 'setnotification',
      title: '',
      deadline: moment(),
      treeData:fromJS({})
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
  componentDidMount(){
    fetch(config.api.group.getAllGroupByType,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        treeData:fromJS(res)
      })
    })
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

  getLogo(){
    switch (this.state.pageType) {
      case 'setnotification':
        return <NotificationSVG></NotificationSVG>
        break;
      case 'settask':
        return <TaskSVG></TaskSVG>
        break;
      case 'neweduinfo':
        return <NewsSVG></NewsSVG>
        break;
      default:
        return <NewsSVG></NewsSVG>
    }
  },

  handleTitleChange(e){
    this.setState({
      title:e.target.value
    })
  },

  handleDeadlineChange(value, dateString){
    console.log(value);
    console.log(dateString);
    this.setState({
      deadline:value,
      deadlineString:dateString,
    })
  },

  handleSaveNews(){
    console.log("this.props.pageType",this.state.pageType)
    if(this.state.pageType=='setnotification'){
      //通知
      let formData = new FormData()
      formData.append('title',this.state.title)
      formData.append('content',this.refs.notice.getData())
      formData.append('group_ids',this.refs.treeData.getCheckedData().filter(v => !isNaN(v.get('id'))).map(v => v.get('id')).toJS().join())
      formData.append('ueditor_textarea_editorValue',this.refs.notice.getData())
      formData.append('available',1)
      fetch(config.api.notify.add,{
        method:'post',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        },
        body:formData
      }).then(res => res.json()).then(res => {
        if(res.title=='Success'){
          this.context.router.push(`/index/notify-mgr/notify_lib/mynotification`)
        }else{
          notification.error({message:res.result})
        }

      })
    }else if(this.state.pageType=='settask'){
      //新建任务
      let formData = new FormData()
      formData.append('title',this.state.title)
      formData.append('finish_time',this.state.deadlineString)
      formData.append('content',this.refs.notice.getData())
      formData.append('group_ids',this.refs.treeData.getCheckedData().filter(v => !isNaN(v.get('id'))).map(v => v.get('id')).toJS().join())
      formData.append('ueditor_textarea_editorValue',this.refs.notice.getData())
      formData.append('available',1)
      fetch(config.api.task.add,{
        method:'post',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        },
        body:formData
      }).then(res => res.json()).then(res => {
        if(res.title=='Success'){
          this.context.router.push(`/index/notify-mgr/notify_lib/mytask`)
        }else{
          notification.error({message:res.result})
        }
      })
    }else if(this.state.pageType=='neweduinfo'){
      //新建资讯
      let formData = new FormData()
      formData.append('title',this.state.title)
      formData.append('eduInfoStyle','03')
      formData.append('content',this.refs.news.getData())
      formData.append('draftFlag','')
      formData.append('editorValue',this.refs.news.getData())
      fetch(config.api.news.add,{
        method:'post',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        },
        body:formData
      }).then(res => res.json()).then(res => {
        if(res.title=='Success'){
          this.context.router.push(`/index/notify-mgr/notify_lib/classeduinfo`)
        }else{
          notification.error({message:res.result})
        }

      })
    }
  },

  renderNoSplit(){
    const {pageType,deadline,title} = this.state
    return (
      <div>
        <div className={styles.newsTitle}>
          <div className={styles.verticalLayout}>
            <span>标题</span>
            <Input value={title} onChange={this.handleTitleChange} style={{width: 500}} placeholder="输入不超过30个字" type="primary"/>
          </div>
          <div className={styles.verticalLayout}>
            <span>类别</span>
            <Select style={{ width: 210 }}>
              <Option value="1/4">1/4</Option>
              <Option value="1/3">1/3</Option>
              <Option value="1/2">1/2</Option>
            </Select>
          </div>
        </div>
        <div className={styles.verticalLayout}>
          <span>正文</span>
          {/* Insert UEditor Here */}
          <Ueditor name='news' ref='news'/>
        </div>
      </div>
    )
  },

  render(){
    const {pageType,deadline,title} = this.state
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.pageType}>
            {this.getLogo()}
            {this.getPageName()}
          </div>
        </div>
        <div className={styles.body}>
          {
            pageType === 'neweduinfo'?
            <div className={styles.noSplit}>
              {this.renderNoSplit()}
            </div>
            :
            <div className={styles.split}>
              <div className={styles.left}>
                <div className={styles.horizontalLayout}>
                  <div className={styles.verticalLayout} style={pageType==='setnotification'?{width: '100%'}:null}>
                    <span>标题</span>
                    <Input value={title} onChange={this.handleTitleChange} style={pageType==='settask'?{width: 500}:{width: '100%'}} placeholder="输入不超过30个字" type="primary"/>
                  </div>
                  {
                    pageType === 'settask' ?
                    <div className={styles.verticalLayout}>
                      <span>截至时间</span>
                      <DatePicker
                        style={{width: 210}}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="请选择截至时间"
                        value={deadline}
                        onChange={this.handleDeadlineChange}
                      />
                    </div>:null
                  }
                </div>
                <div className={styles.verticalLayout}>
                  <span>正文</span>
                  {/* Insert UEditor Here */}
                  <div className={styles.ueditorContainer}>
                    <Ueditor name='notice' ref='notice'/>
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.verticalLayout}>
                  <span>选择群组</span>
                  {/* Insert Ztree Here */}
                  <div>
                    {!this.state.treeData.isEmpty()?<ZTreeComponent ref='treeData' treeData={this.state.treeData}/>:null}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        <div className={styles.footer}>
          <Button type="primary" onClick={this.handleSaveNews}>发送</Button>
        </div>
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
