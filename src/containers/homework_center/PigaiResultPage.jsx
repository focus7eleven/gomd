/**
 * Created by huaxia on 2017/2/23.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {Row,Col,Input,Button,Modal} from 'antd';
import config from '../../config';
import {fromJS} from 'immutable';
import permissionDic from '../../utils/permissionDic';
import {CustomTable} from '../../components/table/CustomTable';
import styles from './PigaiResultPage.scss';


const PigaiResultlPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            defaultvalue:"",
            pageUrl:"",
            homeworkClassId:"",
            homeworkId:"",
            answersheetId:"",
            shouxieVisible:false,
            shuziVisible:false,
            answersheetQuestions:[],
            shouxieImgUrl:"",
            shuziContent:"",
            finish_time:"",
            create_dt:"",
            homework_name:"",
        }
    },
    getDefaultProps() {
        return {}
    },
    componentWillMount() {
        //获取AnswersheetQuestionId
        const answersheetId = this.props.location.state.answersheetId;
        const homeworkClassId = this.props.location.state.homeworkClassId;
        const homeworkId = this.props.location.state.homeworkId;
        const finish_time = this.props.location.state.finish_time;
        const create_dt = this.props.location.state.create_dt;
        const homework_name = this.props.location.state.homework_name;
        const target_name = this.props.location.state.target_name;
        this.getAnswerSheetQuestion(answersheetId,homeworkClassId,homeworkId,finish_time,create_dt,homework_name,target_name);
    },
    render() {

        let additionParams = {
            answersheetId:this.state.answersheetId,
            homeworkClassId:this.state.homeworkClassId,
            homeworkId:this.state.homeworkId,
        };
        const columns = this.getTableHeader();

        const filters = [
            {key:"answersheetQuestionId", type:"select",options:this.state.answersheetQuestions,defaultValue:this.state.defaultvalue },
        ];

        return (
            <div> {/* 过滤+表格+分页 */}
                <div className={styles.header}>
                    <span>{this.state.homework_name}(班级:{this.state.target_name} / 布置时间:{this.state.create_dt} / 完成时间:{this.state.finish_time})</span>
                </div>

                <CustomTable columns={columns} showIndex={true} pageUrl={this.state.pageUrl}
                             filters={filters} additionalParam={additionParams}></CustomTable>

                <Modal title="手写内容" visible={this.state.shouxieVisible} footer={null} onCancel={this.shouxiehandleCancel}>
                    <img src={this.state.shouxieImgUrl} />
                </Modal>

                <Modal title="数字内容" visible={this.state.shuziVisible} footer={null} onCancel={this.shuzihandleCancel}>
                    <textarea readonly="readonly" value={this.state.shuziContent}></textarea>
                </Modal>
            </div>

        );
    },

    getTableHeader() {
        let tableHeader = fromJS([
            {title: '学号', dataIndex: 'stuNum', key: 'stuNum'},
            {title: '姓名', dataIndex: 'stuName', key: 'stuName'},
            {title:'总分(人工阅)',dataIndex: 'answersheetScore', key: 'answersheetScore'},
            {title:'总分(机阅)',children: [{title:'初始得分',dataIndex:'initial_total_score',key:'initial_total_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        return  record.results[0].score
                    }else{
                        return '-';
                    }
                }
            },{title:'最终得分',dataIndex:'terminal_total_score',key:'terminal_total_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        return  record.results[record.results.length-1].score
                    }else{
                        return '-';
                    }
                }
            }]
            },
            {title:'词汇(机阅)',children: [{title:'初始得分',dataIndex:'initial_vocabulary_score',key:'initial_vocabulary_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        if(record.results[0].score_cat!=null){
                            return  record.results[0].score_cat[1].score
                        }else{
                            return '-'
                        }
                    }else{
                        return '-';
                    }
                }
            },{title:'最终得分',dataIndex:'terminal_vocabulary_score',key:'terminal_vocabulary_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        if(record.results[record.results.length-1].score_cat!=null){
                            return  record.results[record.results.length-1].score_cat[1].score
                        }else{
                            return '-'

                        }
                    }else{
                        return '-';
                    }
                }
            }]
            },
            {title:'句子(机阅)',children: [{title:'初始得分',dataIndex:'initial_sentence_score',key:'initial_sentence_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        if(record.results[0].score_cat!=null){
                            return  record.results[0].score_cat[2].score
                        }else{
                            return '-'
                        }
                    }else{
                        return '-';
                    }
                }
            },{title:'最终得分',dataIndex:'terminal_sentence_score',key:'terminal_sentence_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        if(record.results[record.results.length-1].score_cat!=null){
                            return  record.results[record.results.length-1].score_cat[2].score
                        }else{
                            return '-'
                        }
                    }else{
                        return '-';
                    }
                }
            }]
            },
            {title:'结构(机阅)',children: [{title:'初始得分',dataIndex:'initial_framework_score',key:'initial_framework_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        if(record.results[0].score_cat!=null){
                            return  record.results[0].score_cat[3].score
                        }else{
                            return '-'
                        }
                    }else{
                        return '-';
                    }
                }
            },{title:'最终得分',dataIndex:'terminal_framework_score',key:'terminal_framework_score',
                render: (text, record) => {
                    if(record.results.length>0){
                        if(record.results[record.results.length-1].score_cat!=null){
                            return  record.results[record.results.length-1].score_cat[3].score
                        }else{
                            return '-'
                        }
                    }else{
                        return '-';
                    }
                }
            }]
            },
            {title: '批改次数', dataIndex: 'correct_count', key: 'correct_count',
                render: (text, record) => {

                        return  record.results.length

                }
            },

            {   //“操作”
                title: permissionDic['view'], dataIndex: 'view', key: 'view',
                render: (text, record) => {
                    return (
                        <span className={styles.ButtonGroup}>
                            {record.results.length >0?<Button type="primary"  onClick={()=>this.showshouxieModal(record.answersheetAnswer)}>手写内容</Button>:null}
                            {record.results.length>0? <Button type="primary"  onClick={()=>this.showshuziModal(record.results[record.results.length-1].key)}>数字内容</Button>:null}

                        </span>
                    );
                }
            }
        ]);


        return tableHeader.toJS();
    },

    getSearchUrl(type) {
        let url = "";
        url = config.api.homework.getStudentPigaiSummary;
        return url;
    },

    getAnswerSheetQuestion(answersheetId,homeworkClassId,homeworkId,finish_time,create_dt,homework_name,target_name) {
        let formData = new FormData()
        formData.append('answersheetId',answersheetId)
        fetch(config.api.homework.getAnswersheetQuestionId,{
            method:'post',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            },
            body:formData
        }).then(res => res.json()).then(res => {

            this.setState({
                defaultvalue:res[0].answersheet_question_id,
                answersheetQuestions: res.map((answersheetQuestion) => {
                    return { key: answersheetQuestion.answersheet_question_id, value: answersheetQuestion.question_title};
                }),
                pageUrl:this.getSearchUrl(),
                answersheetId:answersheetId,
                homeworkClassId:homeworkClassId,
                homeworkId:homeworkId,
                finish_time:finish_time,
                create_dt:create_dt,
                homework_name:homework_name,
                target_name:target_name,
            })
        })
    },

    showshouxieModal(imgUrl) {
        this.setState({
            shouxieVisible: true,
            shouxieImgUrl:imgUrl,
        });
    },

    showshuziModal(articleKey) {
        fetch(config.api.homework.getArticleContent(articleKey),{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            },
        }).then(res => res.json()).then(res => {

            this.setState({
                shouxieVisible: true,
                shouxieContent:res.content,
            })
        })
    },

    shouxiehandleCancel(content) {
        this.setState({
            shouxieVisible: false,
        });
    },

    shuzihandleCancel() {
        this.setState({
            shuziVisible: false,
        });
    },


});

function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PigaiResultlPage)