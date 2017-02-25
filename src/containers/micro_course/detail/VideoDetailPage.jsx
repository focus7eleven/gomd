import React from 'react'
import styles from './VideoDetailPage.scss'
import {Button} from 'antd'
import {likeVideo,collectVideo} from '../../../actions/micro_course/main'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const VideoDetailPage = React.createClass({
  getInitialState(){
    return {}
  },

  handleBack(){

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
    const type = this.props.description.like ? "nolike" : "like"
    let formData = new FormData()
    formData.append('videoId',this.props.id);
    this.props.likeVideo(formData,type)
  },

  handleCollect(){
    const type = this.props.description.collect ? "nocollect" : "collect"
    let formData = new FormData()
    formData.append('videoId',this.props.id);
    this.props.collectVideo(formData,type)
  },

  render(){
    const videoDetail = this.props.videoDetail
    console.log(videoDetail);
    return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>微课名称：{videoDetail.description.name}</div>
            <Button type='primary' onClick={this.handleBack}>返回</Button>
          </div>
          <div className={styles.body}>
            <div onClick={this.handlePlay}>
              {/* <video ref="player" poster={baseURL+'/'+this.props.coverUrl} className={styles.microVideo} id={this.props.id} controls>
                <source src={baseURL+'/'+this.props.videoUrl} type="video/mp4"/>
              </video> */}
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
