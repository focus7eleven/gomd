import React from 'react'
import styles from './VideoDetailPage.scss'
import {Card,Icon,Button} from 'antd'
import {likeVideo,collectVideo} from '../../../actions/micro_course/main'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {baseURL} from '../../../config'

const VideoDetailPage = React.createClass({
  getInitialState(){
    return {}
  },

  handleBack(){
    this.props.router.goBack()
  },

  handlePlay(){
    if(this._played){
      this._played = false
      this.refs.player.pause()
    }else{
      this._played = true
      this.refs.player.play()
    }
  },

  handleLike(){
    const type = this.props.videoDetail.liked ? "nolike" : "like"
    let formData = new FormData()
    formData.append('videoId',this.props.videoDetail.id);
    this.props.likeVideo(formData,type)
  },

  handleCollect(){
    const type = this.props.videoDetail.collected ? "nocollect" : "collect"
    let formData = new FormData()
    formData.append('videoId',this.props.videoDetail.id);
    this.props.collectVideo(formData,type)
  },

  render(){
    const videoDetail = this.props.videoDetail
    console.log(videoDetail);
    return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>
              微课名称：{videoDetail.name}
              <div>
                <span className={styles.like} onClick={this.handleLike}><Icon style={videoDetail.liked?{color:'#F04134'}:null} type="like" />{videoDetail.likeCount}</span>
                <span className={styles.collect} onClick={this.handleCollect}><Icon style={videoDetail.collected?{color:'#F04134'}:null} type="heart" />{videoDetail.collected?"取消收藏":"收藏"}</span>
              </div>
            </div>
            <Button type='primary' onClick={this.handleBack}>返回</Button>
          </div>
          <div className={styles.body}>
            <div onClick={this.handlePlay} className={styles.videoContainer}>
              <video ref="player" poster={baseURL+'/'+videoDetail.coverUrl} className={styles.video} id={videoDetail.id} controls>
                <source src={baseURL+'/'+videoDetail.url} type="video/mp4"/>
              </video>
            </div>
            <div className={styles.videoInfo}>
              <div className={styles.horiLayout}>
                <Card className={styles.card} title={<span><Icon type='appstore'/>学科</span>} bordered={true}>
                  {videoDetail.subjectName}
                </Card>
                <Card className={styles.card} title={<span><Icon type='appstore'/>年级</span>} bordered={true}>
                  {videoDetail.gradeName}
                </Card>
                <Card className={styles.card} title={<span><Icon type='appstore'/>学期</span>} bordered={true}>
                  {videoDetail.textbookMenuTerm}
                </Card>
              </div>
              <div className={styles.horiLayout}>
                <Card className={styles.card} title={<span><Icon type='appstore'/>知识点</span>} bordered={true}>
                  {videoDetail.textBookMenuName}
                </Card>
              </div>
              <div className={styles.horiLayout}>
                <Card className={styles.card} title={<span><Icon type='appstore'/>内容简介</span>} bordered={true}>
                  {videoDetail.description}
                </Card>
              </div>
            </div>
          </div>
        </div>
    )
  }
})

function mapStateToProps(state){
  const videoDetail = state.get('microCourse').get('videoDetail')
  return{
    videoDetail,
  }
}
function mapDispatchToProps(dispatch){
  return {
    likeVideo: bindActionCreators(likeVideo,dispatch),
    collectVideo: bindActionCreators(collectVideo,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(VideoDetailPage)
