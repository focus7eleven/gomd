import React,{PropTypes} from 'react'
import styles from './VideoComponent.scss'
import {Button,Tag} from 'antd'
import plyr from 'plyr'
import 'plyr/dist/plyr.css'
import {baseURL} from '../../config'
import subjectColor from '../../utils/subjectColor'
import {getTableData,checkVideo} from '../../actions/micro_course/main'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const mockURL = 'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.mp4'

const VideoComponent = React.createClass({
  propTypes:{
    description:PropTypes.shape({
      name:PropTypes.string,
      grade:PropTypes.string,
      subject:PropTypes.string,
      chapter:PropTypes.string,//章节
      playNums:PropTypes.number,//播放次数
      collectNums:PropTypes.number,//收藏次数,
      school:PropTypes.string,
      teacher:PropTypes.string,
    }),//视频的描述信息
    videoUrl:PropTypes.string,
    coverUrl:PropTypes.string,
    id:PropTypes.string,
  },

  getInitialState(){
    return {
      tagColor: '',
    }
  },

  getDefaultProps(){
    return {
      description:{
        name: "test",
        grade:'七年级',
        subject:'物理',
        chapter:'分子结构',
        playNums:100,
        collectNums:74,
        school:'光明小学',
        teacher:'张老师',
      },
      videoUrl:mockURL,
      coverUrl:baseURL+'/'+'microVideo/213844661528301568/1.jpg',
      id:'1',
    }
  },

  componentWillReceiveProps(nextProps){
    const tagColor = subjectColor[nextProps.description.subject]?subjectColor[nextProps.description.subject]:'#aaa7b5';
    this.setState({tagColor});
  },

  handlePlay(){
    console.log("this",this.refs.player)
    if(this._played){
      this._played = false
      this.refs.player.pause()
    }else{
      this._played = true
      this.refs.player.play()
    }
  },

  handleCheckVideo(value){
    console.log(this.props.id);
    let formdata = new FormData();
    formdata.append("videoId",this.props.id);
    formdata.append("pass",value);
  },

  render(){
    return(
      <div className={styles.videoComponent}>
        <div className={styles.videoContainer} onClick={this.handlePlay}>
          <Tag className={styles.tag} color={this.state.tagColor}>{this.props.description.grade}|{this.props.description.subject}</Tag>
          <video ref="player" poster={baseURL+'/'+this.props.coverUrl} className={styles.microVideo} id={this.props.id} controls>
            <source src={baseURL+'/'+this.props.videoUrl} type="video/mp4"/>
          </video>
          <div className={styles.mask}>
            <span>{this.props.description.school}</span>
            <span>{this.props.description.teacher}</span>
          </div>
        </div>
        <div className={styles.description}>
          <div className={styles.top}>
            {/* <span>{this.props.description.grade}</span>
            <span>{this.props.description.subject}</span> */}
            <span>{this.props.description.name}</span>
            <span>{this.props.description.chapter}</span>
          </div>
          <div className={styles.line}></div>
          <div className={styles.bottom}>
            {
              this.props.videoType==='check'?
              <div className={styles.operationButton}>
                <Button className={styles.editButton} type="primary" onClick={this.handleCheckVideo.bind(true)}>通过</Button>
                <Button className={styles.deleteButton} type="primary" onClick={this.handleCheckVideo.bind(false)}>驳回</Button>
              </div>
              :
              <div className={styles.info}>
                <span>播放：{this.props.description.playNums}</span>
                <span>{this.props.description.collectNums}人收藏</span>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
})

function mapStateToProps(state){
  return {}
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getTableData,dispatch),
    checkVideo:bindActionCreators(checkVideo,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(VideoComponent)
