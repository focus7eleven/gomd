import React from 'react';
import VideoFilterComponent from '../../components/microvideo_filter/VideoFilterComponent'
import styles from './VideoCreatePage.scss'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {addVideo,getTableData} from '../../actions/micro_course/main'
import {Select,Pagination,Menu,Input,Button,Modal,Form,Row,Col,Icon,notification} from 'antd'
import TreeComponent from '../../components/tree/TreeComponent'
import CourseTree from '../../components/tree/CourseTree'
import VideoComponent from '../../components/video/VideoComponent'
import {fromJS,Map,List} from 'immutable'
import {findMenuInTree} from '../../reducer/menu'
import config from '../../config'
import menuRoutePath from '../../routeConfig'

const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option;

const VideoCreatePage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount(){
        console.log('componentDidMount ');
        const {setFieldsValue} = this.props.form;
        fetch(config.api.courseCenter.getDistinctSubject,{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(res => {
            //获取学科列表
            this.setState({
                subjectList: fromJS(res),
                subjectName: res[0]['subject_name'],
            })
            setFieldsValue({
                subjectOption: res[0]['subject_id']
            })
            let subjectId = res[0]['subject_id']

            //根据学科获取年级列表,获取版本列表

            return Promise.all([
                fetch(config.api.grade.getBySubject.get(res[0]['subject_id']), {
                    method: 'get',
                    headers: {
                        'from': 'nodejs',
                        'token': sessionStorage.getItem('accessToken')
                    }
                }).then(res => res.json()),
                fetch(config.api.select.json.get('', '', '', 'JKS', ''), {
                    method: 'get',
                    headers: {
                        'from': 'nodejs',
                        'token': sessionStorage.getItem('accessToken')
                    }
                }).then(res => res.json())
            ]).then(res => {
                //获取年级列表
                this.setState({
                    gradeList: fromJS(res[0]),
                    versionList: fromJS(res[1]),
                })
                setFieldsValue({
                    gradeOption: res[0][0].gradeId,
                    versionOption: res[1][0].id
                })
                return {
                    gradeId: res[0][0].gradeId,
                    versionId: res[1][0].id,
                    subjectId,
                }
            }).then(result => {
                const {subjectId, gradeId, versionId} = result
                //根据subjectId，gradeId获取章节列表
                fetch(config.api.textbook.getUnitBySubjectAndGrade(subjectId, gradeId), {
                    method: 'get',
                    headers: {
                        'from': 'nodejs',
                        'token': sessionStorage.getItem('accessToken')
                    }
                }).then(res => res.json()).then(res => {
                    //获取章节列表
                    this.setState({
                        charpterList: fromJS(res),
                    })
                    setFieldsValue({
                        charpterOption: res[0],
                    })
                    //根绝章节获取响应的课程
                    fetch(config.api.textbook.getTextBookByCondition(subjectId, gradeId, versionId, '上学期', res[0]), {
                        method: 'get',
                        headers: {
                            'from': 'nodejs',
                            'token': sessionStorage.getItem('accessToken')
                        }
                    }).then(res => res.json()).then(res => {
                        this.setState({
                            courseList: fromJS(res),
                            courseName: res[0]['course']
                            // courseOption:''
                        })
                        setFieldsValue({
                            courseOption: '',
                            termOption: '上学期',
                            homeworkName: '',
                        })
                    })
                })
            })
        })
        if (this.props.params.microId != undefined){
            let videoId = this.props.params.microId;
            fetch(config.api.microvideo.getVideoDetailById(videoId),{
                method: 'get',
                headers: {
                    'from': 'nodejs',
                    'token': sessionStorage.getItem('accessToken')
                }
            }).then(res => res.json()).then(res =>{
                let fileName = res.url.split('/').slice(-1)[0];
                this.setState({
                    subjectId:res.subjectId,
                    gradeId:res.gradeId,
                    textbookMenuId:res.textbookMenuId,
                    termValue: res.textbookMenuTerm,
                    videoDesc:res.description,
                    videoName:res.name,
                    versionId:res.versionId,
                    fileName:fileName,
                    isEdit:1,

                })
                this.handleFetchTextbook(res.subjectId,res.gradeId,res.versionId,res.textbookMenuTerm);

            });
        }



    },
    getInitialState(){
        console.log('getInitialState ');
        return{
            videoFile: null,
            textbook: [],
            canSelectTextbook: true,
            subjectList:List(),
            courseList:List(),
            charpterList:List(),
            versionList:List(),
            gradeList:List(),
            gradeId: '',
            subjectId: '',
            versionId: '',
            termValue: '',
            type:'',
            videoId:'',
            videoName:'',
            videoDesc:'',
            fileName:'',
            isEdit:0,
        }
    },

    handleFileChange(e){
        const file = e.target.files[0];
        this.setState({videoFile: file});
    },
    handleEdit(){
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
                formData.append("id",this.props.params.microId);
                formData.append("action",'edit');
                let url = config.api.microvideo.edit;
                fetch(url,{
                    method:'post',
                    headers:{
                        'from':'nodejs',
                        'token':sessionStorage.getItem('accessToken')
                    },
                    body:formData
                }).then(res => res.json()).then(res =>{
                    if (res.title == 'Success'){
                        this.context.router.push(menuRoutePath['toVideoShow'].path)
                    }else {
                        notification.error({message:'修改失败',description: res.result});
                    }
                })


            }
        });
    },
    handlePostVideo(){
        if(this.state.isEdit){
            this.handleEdit()
        }else {
            const {getFieldsValue, getFieldValue, getFieldError, validateFields} = this.props.form
            validateFields((err, values) => {
                if (!err) {
                    let formData = new FormData()
                    formData.append('addArea', '');
                    formData.append('name', values.name);
                    formData.append('description', values.description);
                    formData.append('subjectId', values.subjectId);
                    formData.append('gradeId', values.gradeId);
                    formData.append('textbookMenuId', values.textbookMenuId);
                    formData.append('file', this.state.videoFile);
                    const result = this.props.addVideo(formData, "getTeacher")
                    let visibility = true;
                    result.then((res) => {
                        if (res !== "error") {
                            this.context.router.push(menuRoutePath['toVideoShow'].path)
                        } else {
                            notification.error({message: '新增失败', description: res.result});

                        }
                    })

                }
            });
        }
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

    render(){
        const isEdit = this.state.isEdit;
        console.log("isEdit ="+isEdit);
        const fileFiled =isEdit?(<span>{this.state.videoName}</span>)
            :(<Input className={styles.videoFile} type="file" onChange={this.handleFileChange} />);

        const gradeOptions = this.state.gradeList.toJS();
       const subjectOptions = this.state.subjectList.toJS();
       const versionOptions = this.state.versionList.toJS();
        const {getFieldDecorator} = this.props.form;
        const {showAddVideoModal,textbook,canSelectTextbook} = this.state;
        const formItemLayout = {labelCol:{span:8},wrapperCol:{span:12}};
        return (
            <div className={styles.container}>
                <div className={styles.body}>
                <div className={styles.title1}>
                    <span className={styles.text1}><Icon type='file-text' />微课</span>
                </div>
                    <div className={styles.topRow}>
                        <div>
                            <Form>
                            <FormItem
                                label='年级'
                                {...formItemLayout}
                                key='gradeId'
                            >
                                {
                                    getFieldDecorator('gradeId', {
                                        rules: [{required: true, message: '请选择年级'}],
                                        initialValue: this.state.gradeId,
                                    })(
                                        <Select
                                            style={{width:'100%'}}
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
                            </Form>
                        </div>
                        <div>
                            <Form>
                            <FormItem
                                label='学科'
                                {...formItemLayout}
                                key='subjectId'
                            >
                                {
                                    getFieldDecorator('subjectId', {
                                        rules: [{required: true, message: '请选择学科'}],
                                        initialValue: this.state.subjectId,
                                    })(
                                        <Select
                                            style={{width:'100%'}}
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
                            </Form>
                        </div>
                        <div>
                            <FormItem
                                label='学期'
                                {...formItemLayout}
                                key='termValue'
                            >
                                {
                                    getFieldDecorator('termValue', {
                                        rules: [{required: true, message: '请选择学期'}],
                                        initialValue: this.state.termValue,
                                    })(
                                        <Select
                                            style={{width:'100%'}}
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
                        </div>
                        <div>
                            <FormItem
                                label='版本'
                                {...formItemLayout}
                                key='versionId'
                            >
                                {
                                    getFieldDecorator('versionId', {
                                        rules: [{required: true, message: '请选择版本'}],
                                        initialValue: this.state.versionId,
                                    })(
                                        <Select
                                            style={{width:'100%'}}
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
                        </div>
                    </div>
                    <div className={styles.secondRow}>
                        <div>
                        <Form>
                        <FormItem
                            label='章节课程'
                            labelCol={{span:4}}
                            wrapperCol={{span:18}}
                            key='textbookMenuId'
                        >
                            {
                                getFieldDecorator('textbookMenuId', {
                                    rules: [{required: true, message: '请选择章节课程'}],
                                    initialValue: this.state.textbookMenuId,
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
                        <div>
                            <Form>
                                <FormItem
                                    label='视频名称'
                                    labelCol={{span:4}}
                                    wrapperCol={{span:18}}
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
                                            initialValue:this.state.videoName
                                        })(<Input placeholder='输入不超过30个字'/>)
                                    }
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                <div>
                    <Form>
                        <FormItem
                            label='视频文件'
                            labelCol={{span:2}}
                            wrapperCol={{span:4}}
                            // {...formItemLayout}
                            key='file'
                        >
                            {
                                getFieldDecorator('file', {
                                    rules: [{ required: true, message: '请填写学科名称' }],
                                })(
                                     fileFiled)
                            }
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            label='简介'
                            labelCol={{span:2}}
                            wrapperCol={{span:21}}
                            // {...formItemLayout}
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
                                    initialValue:this.state.videoDesc
                                })(<Input type="textarea" placeholder='输入不超过150个字' rows={3}/>)
                            }
                        </FormItem>
                    </Form>
                </div>
                <Row>
                    <Col span={23} style={{textAlign:'right'}}>
                        <Button type='primary'  onClick={()=>this.handlePostVideo()}>保存微课</Button>
                    </Col>
                </Row>
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
        addVideo:bindActionCreators(addVideo,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(VideoCreatePage))
