import React from 'react'
import VideoFilterComponent from '../../components/microvideo_filter/VideoFilterComponent'
import styles from './UncheckVideoPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getTableData} from '../../actions/micro_course/main'
import {Pagination,Menu,Input,Button} from 'antd'
import CourseTree from '../../components/tree/CourseTree'
import VideoComponent from '../../components/video/VideoComponent'

const Search = Input.Search

const UncheckVideoPage = React.createClass({
  getInitialState(){
    return {
      searchStr:'',
      currentTab: "hot",
    }
  },

  handleSearchVideo(value){
    this.props.getTableData('unchecked',value,this.props.microCourse.get('data').get('nowPage'));
  },

  handleClickMenu(e) {
    this.setState({
      currentTab: e.key,
    });
  },

  handlePageChanged(pageNumber){
    this.props.getTableData('unchecked','',pageNumber);
  },

  render(){
    const data = this.props.microCourse.get('data');
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div></div>
          <div className={styles.right}>
            <VideoFilterComponent pageType="unchecked"></VideoFilterComponent>
            <Search style={{width: '260px'}} placeholder="请输入微课名称" value={this.state.searchStr} onChange={(e)=>{this.setState({searchStr:e.target.value})}} onSearch={this.handleSearchVideo}/>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.treeContainer}>
            <CourseTree></CourseTree>
          </div>
          <div className={styles.videoContainer}>
            <div className={styles.videoList}>
              {/* 微课列表 */}
              <Menu
                onClick={this.handleClickMenu}
                selectedKeys={[this.state.currentTab]}
                mode="horizontal"
                className={styles.menu}
              >
                <Menu.Item key="hot">
                  热门
                </Menu.Item>
                <Menu.Item key="recommend">
                  推荐
                </Menu.Item>
                <Menu.Item key="newest">
                  最新
                </Menu.Item>
              </Menu>
              <div className={styles.videoPanel}>
                {
                  data.get('result').map((item,index)=>{
                    let description = {};
                    description.name = item.get('name');
                    description.grade = item.get('gradeName');
                    description.subject = item.get('subjectName');
                    description.chapter = item.get('textbookMenuCourse');
                    description.playNums = item.get('playCount');
                    description.like = item.get('liked');
                    description.collect = item.get('collected');
                    description.likeNums = item.get('likeCount');
                    description.collectNums = item.get('collectionCount');
                    description.school = item.get('schoolName');
                    description.term = item.get('textbookMenuTerm');
                    description.textBookMenuName = item.get('textBookMenuName');
                    description.info = item.get('description');
                    description.teacher = 'teacher';
                    return <div key={index}>
                      <VideoComponent videoType="check" description={description} videoUrl={item.get('url')} coverUrl={item.get('coverUrl')} id={item.get('id')}></VideoComponent>
                    </div>
                  })
                }
              </div>
            </div>
            <div className={styles.videoPagination}>
              <span>当前条目 {data.get('start')} - {data.get('pageShow')} / 总条目 {data.get('totalCount')}</span>
              <div>
                <Pagination showQuickJumper defaultCurrent={data.get('nowPage')} total={data.get('totalCount')} pageSize={12} onChange={this.handlePageChanged} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

function mapStateToProps(state){
  return{
    menu:state.get('menu'),
    microCourse:state.get('microCourse')
  }
}

function mapDispatchToProps(dispatch){
  return {
    getTableData:bindActionCreators(getTableData,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(UncheckVideoPage)
