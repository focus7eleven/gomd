import React,{PropTypes} from 'react'
import styles from './VideoComponent.scss'
import {Icon,Modal,Button,Tag} from 'antd'
import {baseURL} from '../../config'
import subjectColor from '../../utils/subjectColor'
import {checkVideo,likeVideo,collectVideo,setDetail} from '../../actions/micro_course/main'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const mockURL = 'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.mp4'

const VideoComponent = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  propTypes:{
    pageType: PropTypes.string.isRequired,
    description:PropTypes.shape({
      name:PropTypes.string,
      grade:PropTypes.string,
      subject:PropTypes.string,
      chapter:PropTypes.string,//章节
      playNums:PropTypes.number,//播放次数
      like: PropTypes.bool, //是否赞
      collect: PropTypes.bool, //是否收藏
      likeNums:PropTypes.number,//赞次数,
      collectNums:PropTypes.number,//收藏次数,
      school:PropTypes.string,
      term:PropTypes.string,
      textBookMenuName:PropTypes.string,
      info:PropTypes.string, // 内容简介
      teacher:PropTypes.string,
    }),//视频的描述信息
    videoUrl:PropTypes.string,
    coverUrl:PropTypes.string,
    id:PropTypes.string,
  },

  getInitialState(){
    return {
      tagColor: '',
      showVideoDetail: false,
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
    this.props.checkVideo(formdata)
  },

  handleShowModal(){
    // this.setState({showVideoDetail: true});
    // this.props.setDetail({description: this.props.description,videoUrl: this.props.videoUrl,coverUrl: this.props.coverUrl,id: this.props.id})
    this.context.router.push(`/index/resource_center/${this.props.pageType}/video_detail/${this.props.id}`)
  },

  handleCloseModal(){
    this.setState({showVideoDetail: false});
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

  renderModal(){
    const des = this.props.description;
    return (
      <Modal width={672} wrapClassName={styles.modalWrapper} title='微课内容' visible={this.state.showVideoDetail}
        onCancel={this.handleCloseModal} footer={null}
      >
        <div className={styles.detailContainer}>
          <div onClick={this.handlePlay}>
            <video ref="player" poster={baseURL+'/'+this.props.coverUrl} className={styles.microVideo} id={this.props.id} controls>
              <source src={baseURL+'/'+this.props.videoUrl} type="video/mp4"/>
            </video>
          </div>
          <div className={styles.videoInfo}>
            <div className={styles.infoTitle}>
              <div>{des.name}</div>
              <div>
                <span className={styles.like} onClick={this.handleLike}><Icon style={des.like?{color:'#F04134'}:null} type="like" />{des.likeNums}</span>
                <span className={styles.collect} onClick={this.handleCollect}><Icon style={des.collect?{color:'#F04134'}:null} type="heart" />{des.collect?"取消收藏":"收藏"}</span>
              </div>
            </div>
            <div style={{marginBottom:"18px"}}>
              <span className={styles.firstLine}><span>学科：</span>{des.subject}</span>
              <span className={styles.firstLine}><span>年级：</span>{des.grade}</span>
              <span className={styles.firstLineEnd}><span>学期：</span>{des.term}</span>
            </div>
            <div style={{marginBottom:"18px"}}>
              <span className={styles.firstLineEnd}><span>知识点：</span>{des.textBookMenuName}</span>
            </div>
            <div style={{marginBottom:"18px"}}>
              <span className={styles.firstLineEnd}><span>内容简介：</span>{des.info}</span>
            </div>
          </div>
        </div>
      </Modal>
    )
  },

  render(){
    return(
      <div className={styles.videoComponent}>
        <div className={styles.videoContainer}>
          <Tag className={styles.tag} color={this.state.tagColor}>{this.props.description.grade}|{this.props.description.subject}</Tag>

          <img style={{width:'100%',height:'100%'}} src={baseURL+'/'+this.props.coverUrl} onClick={this.handleShowModal}/>
          {/* <div className={styles.mask}>
            <span>{this.props.description.school}</span>
            <span>{this.props.description.teacher}</span>
          </div> */}
        </div>
        <div className={styles.description}>
          <div className={styles.top}>
            <span>{this.props.description.name}</span>
            <span>{this.props.description.chapter}</span>
          </div>
          <div className={styles.line}></div>
          <div className={styles.bottom}>
            {
              this.props.videoType==='check'?
              <div className={styles.operationButton}>
                <Button className={styles.editButton} type="primary" onClick={this.handleCheckVideo.bind(null,true)}>通过</Button>
                <Button className={styles.deleteButton} type="primary" onClick={this.handleCheckVideo.bind(null,false)}>驳回</Button>
              </div>
              :
              <div className={styles.info}>
                <span>播放：{this.props.description.playNums}</span>
                <span>{this.props.description.collectNums}人收藏</span>
              </div>
            }
          </div>
        </div>
        {/* {this.renderModal()} */}
      </div>
    )
  }
})

function mapStateToProps(state){
  return {}
}

function mapDispatchToProps(dispatch){
  return {
    checkVideo: bindActionCreators(checkVideo,dispatch),
    likeVideo: bindActionCreators(likeVideo,dispatch),
    collectVideo: bindActionCreators(collectVideo,dispatch),
    setDetail: bindActionCreators(setDetail,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(VideoComponent)
