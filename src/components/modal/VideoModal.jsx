import React from 'react'
import styles from './VideoModal.scss'
import plyr from 'plyr'
import {Modal} from 'antd'

const mockURL = 'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.mp4'
const VideoModal = React.createClass({
  getDefaultProps(){
    return {
      onClose:()=>{},
      onOK:()=>{},
      videoUrl:mockURL,
    }
  },
  componentDidMount(){
    var player = plyr.setup('#player');
  },
  componentWillUnMount(){
    var player = plyr.get('#player')
    player.destroy()
  },
  render(){
    return (
      <Modal title='s' visible={true} wrapClassName={styles.modal} onCancel={()=>{this.props.onCancel()}}>
        <div className={styles.video}>
          <video id='#player' controls>
            <source src={this.props.videoUrl} type="video/mp4"/>
          </video>
        </div>
      </Modal>
    )
  }
})

export default VideoModal
