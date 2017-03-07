import React from 'react'
import VideoFilterComponent from '../../components/microvideo_filter/VideoFilterComponent'
import styles from './SchoolVideoPage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {addVideo,getTableData} from '../../actions/micro_course/main'
import {Select,Pagination,Menu,Input,Button,Modal,Form} from 'antd'
import TreeComponent from '../../components/tree/TreeComponent'
import CourseTree from '../../components/tree/CourseTree'
import VideoComponent from '../../components/video/VideoComponent'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../reducer/menu'
import config from '../../config'

const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option;

const SchoolVideoPage = React.createClass({
  _currentMenu:Map({
    authList:List()
  }),

  componentWillMount(){
    if(!this.props.menu.get('data').isEmpty()){
      this._currentMenu = findMenuInTree(this.props.menu.get('data'),'publicvideo')
    }
  },

  getInitialState(){
    return {
      searchStr:'',
      currentTab: "hot",
      showAddVideoModal: false,
      videoFile: null,
      gradeId: '',
      subjectId: '',
      versionId: '',
      termValue: '',
      textbook: [],
      canSelectTextbook: true,
    }
  },

  handleSearchVideo(value){
    this.props.getTableData('public',value,this.props.microCourse.get('data').get('nowPage'));
  },

  handleClickMenu(e) {
    console.log('click ', e);
    this.setState({
      currentTab: e.key,
    });
  },

  handlePageChanged(pageNumber){
    this.props.getTableData('public','',pageNumber);
  },

  handlePostVideo(){
    const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let formData = new FormData()
        formData.append('addArea','');
        formData.append('name',values.name);
        formData.append('description',values.description);
        formData.append('subjectId',values.subjectId);
        formData.append('gradeId',values.gradeId);
        formData.append('textbookMenuId',values.textbookMenuId);
        formData.append('file',this.state.videoFile);
        const result = this.props.addVideo(formData,"getTeacher")
        let visibility = true;
        result.then((res)=>{
          if(res!=="error"){
            visibility = false;
          }
        })
        this.setState({showAddVideoModal: visibility});
      }
    });
  },

  handleShowAddVideoModal(){
    this.setState({showAddVideoModal: true});
  },

  handleHideAddVideoModal(){
    this.setState({showAddVideoModal: false});
  },

  handleFileChange(e){
    const file = e.target.files[0];
    this.setState({videoFile: file});
  },

  handleFetchTextbook(subjectId,gradeId,versionId,termValue){
    this.setState({canSelectTextbook:false})
    fetch(config.api.textbook.getTextBookByCondition(subjectId,gradeId,versionId,termValue),{
      method:'GET',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken'),
      }
    }).then(res => res.json()).then(res=>{
      this.setState({textbook: res,canSelectTextbook: true});
    })
  },

  handleGradeChange(value){
    this.props.form.setFieldsValue({'textbookMenuId':''})
    const {subjectId,versionId,termValue} = this.state;
    this.handleFetchTextbook(subjectId,value,versionId,termValue)
    this.setState({gradeId: value})
  },

  handleTermChange(value){
    this.props.form.setFieldsValue({'textbookMenuId':''})
    const {subjectId,versionId,gradeId} = this.state;
    this.handleFetchTextbook(subjectId,gradeId,versionId,value)
    this.setState({termValue: value})
  },

  handleVersionChange(value){
    this.props.form.setFieldsValue({'textbookMenuId':''})
    const {subjectId,gradeId,termValue} = this.state;
    this.handleFetchTextbook(subjectId,gradeId,value,termValue)
    this.setState({versionId: value})
  },

  handleSubjectChange(value){
    this.props.form.setFieldsValue({'textbookMenuId':''})
    const {gradeId,versionId,termValue} = this.state;
    this.handleFetchTextbook(value,gradeId,versionId,termValue)
    this.setState({subjectId: value})
  },


  renderModal(){
    const gradeOptions = this.props.microCourse.get('gradeOptions')
    const subjectOptions = this.props.microCourse.get('subjectOptions')
    const versionOptions = this.props.microCourse.get('versionOptions')
    const {getFieldDecorator} = this.props.form;
    const {showAddVideoModal,textbook,canSelectTextbook} = this.state;
    const formItemLayout = {labelCol:{span:5},wrapperCol:{span:12}};
    return (
      <Modal title="添加微课视频" visible={showAddVideoModal}
          onOk={this.handlePostVideo} onCancel={this.handleHideAddVideoModal}
        >
        <div>
          <Form>
            <FormItem
              label='微视频名称'
              {...formItemLayout}
              key='name'
            >
            {
              getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写微视频名称' },{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if(value.length > 30){
                      errors.push(
                        new Error('微视频名称应不超过30个字')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input placeholder='输入不超过30个字'/>)
            }
            </FormItem>
          </Form>
          <Form>
            <FormItem
              label='微视频文件'
              {...formItemLayout}
              key='file'
            >
            {
              getFieldDecorator('file', {
                rules: [{ required: true, message: '请填写学科名称' }],
              })(<Input className={styles.videoFile} type="file" onChange={this.handleFileChange} />)
            }
            </FormItem>
          </Form>
          <Form>
            <FormItem
              label='简介'
              {...formItemLayout}
              key='description'
            >
            {
              getFieldDecorator('description', {
                rules: [{
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if(value.length > 150){
                      errors.push(
                        new Error('简介应不超过150个字')
                      )
                    }
                    callback(errors);
                  }
                }],
              })(<Input type="textarea" placeholder='输入不超过150个字' rows={3}/>)
            }
            </FormItem>
            <FormItem
              label='年级'
              {...formItemLayout}
              key='gradeId'
            >
            {
              getFieldDecorator('gradeId', {
                rules: [{required: true, message: '请选择年级'}],
                initialValue: "",
              })(
                <Select
                  optionFilterProp="children"
                  onChange={this.handleGradeChange}
                >
                  <Option value="">请选择</Option>
                  {
                    gradeOptions.map((item,index)=>{
                      return <Option value={item.gradeId} key={index}>{item.gradeName}</Option>
                    })
                  }
                </Select>
              )
            }
            </FormItem>
            <FormItem
              label='学科'
              {...formItemLayout}
              key='subjectId'
            >
            {
              getFieldDecorator('subjectId', {
                rules: [{required: true, message: '请选择学科'}],
                initialValue: "",
              })(
                <Select
                  optionFilterProp="children"
                  onChange={this.handleSubjectChange}
                >
                  <Option value="">请选择</Option>
                  {
                    subjectOptions.map((item,index)=>{
                      return <Option value={item.subject_id} key={item.subject_id}>{item.subject_name}</Option>
                    })
                  }
                </Select>
              )
            }
            </FormItem>
            <FormItem
              label='学期'
              {...formItemLayout}
              key='termValue'
            >
            {
              getFieldDecorator('termValue', {
                rules: [{required: true, message: '请选择学期'}],
                initialValue: "",
              })(
                <Select
                  optionFilterProp="children"
                  onChange={this.handleTermChange}
                >
                  <Option value="">请选择</Option>
                  <Option value="上学期">上学期</Option>
                  <Option value="下学期">下学期</Option>
                </Select>
              )
            }
            </FormItem>
            <FormItem
              label='版本'
              {...formItemLayout}
              key='versionId'
            >
            {
              getFieldDecorator('versionId', {
                rules: [{required: true, message: '请选择版本'}],
                initialValue: "",
              })(
                <Select
                  optionFilterProp="children"
                  onChange={this.handleVersionChange}
                >
                  <Option value="">请选择</Option>
                  {
                    versionOptions.map((item,index)=>{
                      return <Option value={item.id} key={item.id}>{item.text}</Option>
                    })
                  }
                </Select>
              )
            }
            </FormItem>
            <FormItem
              label='章节课程'
              {...formItemLayout}
              key='textbookMenuId'
            >
            {
              getFieldDecorator('textbookMenuId', {
                rules: [{required: true, message: '请选择章节课程'}],
                initialValue: "",
              })(
                <Select
                  optionFilterProp="children"
                  disabled={!canSelectTextbook}
                >
                  <Option value="">请选择</Option>
                  {
                    textbook.map((item,index)=>{
                      return <Option value={item.textbook_menu_id} key={item.textbook_menu_id}>{item.name}</Option>
                    })
                  }
                </Select>
              )
            }
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  },

  render(){
    const data = this.props.microCourse.get('data');
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            {
              this._currentMenu.get('authList').find((v)=>v.get('authName')=='新增') ?
              <Button data-action="add" type="primary" className={styles.operationButton} onClick={this.handleShowAddVideoModal}>
                新建
              </Button>:null
            }
          </div>
          <div className={styles.right}>
            <VideoFilterComponent pageType="area"></VideoFilterComponent>
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
                <Menu.Item key="newest">
                  最新
                </Menu.Item>
              </Menu>
              <div className={styles.videoPanel}>
                {
                  data.get('result').map((item,index)=>{
                    let description = {};
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
                      <VideoComponent pageType="publicvideo" description={description} videoUrl={item.get('url')} coverUrl={item.get('coverUrl')} id={item.get('id')}></VideoComponent>
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
        {this.renderModal()}
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
    addVideo:bindActionCreators(addVideo,dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(SchoolVideoPage))
