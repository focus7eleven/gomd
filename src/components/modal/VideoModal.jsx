import React from 'react'
import styles from './VideoModal.scss'
import {Icon,Modal} from 'antd'
import {baseURL} from '../../config'
import {likeVideo,collectVideo} from '../../actions/micro_course/main'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const VideoModal = React.createClass({
  handleCloseModal(){
    this.refs.player.pause()
    this.props.onCancel();
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
    const type = this.props.videoDetail.get('liked') ? "nolike" : "like"
    let formData = new FormData()
    formData.append('videoId',this.props.videoDetail.get('id'));
    this.props.likeVideo(formData,type)
  },

  handleCollect(){
    const type = this.props.videoDetail.get('collected') ? "nocollect" : "collect"
    let formData = new FormData()
    formData.append('videoId',this.props.videoDetail.get('id'));
    this.props.collectVideo(formData,type)
  },

  render(){
    const videoDetail = this.props.videoDetail.toJS()
    return (
      <Modal width={672} wrapClassName={styles.modalWrapper} title='微课内容' visible={true}
        onCancel={this.handleCloseModal} footer={null}
      >
        <div className={styles.detailContainer}>
          <div onClick={this.handlePlay}>
            <video ref="player" poster={baseURL+'/'+videoDetail.coverUrl} className={styles.microVideo} id={videoDetail.id} controls>
              <source src={baseURL+'/'+videoDetail.url} type="video/mp4"/>
            </video>
          </div>
          <div className={styles.videoInfo}>
            <div className={styles.infoTitle}>
              <div>{videoDetail.name}</div>
              <div style={{flexShrink:0}}>
                <span className={styles.like} onClick={this.handleLike}><Icon style={videoDetail.liked?{color:'#F04134'}:null} type="like" />{videoDetail.likeCount}</span>
                <span className={styles.collect} onClick={this.handleCollect}><Icon style={videoDetail.collected?{color:'#F04134'}:null} type="heart" />{videoDetail.collected?"取消收藏":"收藏"}</span>
              </div>
            </div>
            <div style={{marginBottom:"18px"}}>
              <span className={styles.firstLine}><span>学科（版本）：</span>{videoDetail.subjectName+"（"+videoDetail.versionName+"）"}</span>
              <span className={styles.firstLineEnd}><span>年级（学期）：</span>{videoDetail.gradeName+"（"+videoDetail.textbookMenuTerm+"）"}</span>
            </div>
            <div style={{marginBottom:"18px"}}>
              <span className={styles.firstLineEnd}><span>知识点：</span>{videoDetail.textBookMenuName}</span>
            </div>
            <div style={{marginBottom:"25px"}}>
              <span className={styles.firstLineEnd}><span>内容简介：</span>{videoDetail.description}</span>
            </div>
          </div>
        </div>
      </Modal>
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

export default connect(mapStateToProps,mapDispatchToProps)(VideoModal)
