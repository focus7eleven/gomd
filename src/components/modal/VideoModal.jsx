import React from 'react'
import styles from './VideoModal.scss'
import {Modal} from 'antd'
import {baseURL} from '../../config'

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

  render(){
    const videoDetail = this.props.videoDetail
    console.log(videoDetail);
    return (
      <Modal width={672} wrapClassName={styles.modalWrapper} title='视频详情' visible={true}
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
              {/* <div>
                <span className={styles.like} onClick={this.handleLike}><Icon style={des.like?{color:'#F04134'}:null} type="like" />{des.likeNums}</span>
                <span className={styles.collect} onClick={this.handleCollect}><Icon style={des.collect?{color:'#F04134'}:null} type="heart" />{des.collect?"取消收藏":"收藏"}</span>
              </div> */}
            </div>
            <div style={{marginBottom:"18px"}}>
              <span className={styles.firstLine}><span>学科：</span>{videoDetail.subjectName}</span>
              <span className={styles.firstLine}><span>年级：</span>{videoDetail.gradeName}</span>
              <span className={styles.firstLineEnd}><span>学期：</span>{videoDetail.textbookMenuTerm}</span>
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

export default VideoModal
