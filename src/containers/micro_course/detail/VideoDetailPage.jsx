import React,{propTypes} from 'react'
import styles from './VideoDetailPage.scss'

const VideoDetailPage = React.createClass({
  propTypes: {
    description: PropTypes.object.isRequired,
  },

  getInitialState(){
    return {}
  },

  render(){
    return (
      <div className={styles.container}>
        <div className={styles.header}></div>

      </div>
    )
  }
})

export default VideoDetailPage
