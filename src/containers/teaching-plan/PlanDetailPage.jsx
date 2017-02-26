import React from 'react'
import styles from './PlanDetailPage.scss'
import {connect} from 'react-redux'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select,Row,Col,Card,Tabs} from 'antd'
import {CustomTable} from '../../components/table/CustomTable';
import config from '../../config';
import {fromJS,Map,List} from 'immutable'
import {bindActionCreators} from 'redux'
import {getGradeOptions,getSubjectOptions,getVersionOptions} from '../../actions/homework_action/main'
const TabPane = Tabs.TabPane;
const PlanDetailPage = React.createClass({

    getInitialState(){
        return{
            subjectName:'',
            term:'',
            gradeName:'',
            version:'',
            year:'',
            weeks:'',
            planDetailStr:'',
            materialStr:'',
            teachingStr:'',
            studentDetail:'',

            modalVisiable:false,
            indexNotShow:[],
            schedules:[],

            gradeOptionList:[],
            termOptionList:[{key:"1",value:"上学期"},{key:"2",value:"下学期"}],
            subjectOptionList:[],
            versionOptionList:[],

        }
    },

    componentWillMount(){
        this.props.getGradeOptions();
        this.props.getSubjectOptions();
        this.props.getVersionOptions();
        //if(!this.props.menu.get('data').isEmpty()){
        //    this._currentMenu = findMenuInTree(this.props.menu.get('data'),this.state.type);
        //}
    },

    componentDidMount(){
        this.getPlanDetail();
    },
    getPlanDetail(){
        let teachingPlanID = this.props.params.planId;
        let url = config.api.teachingPlan.teachingPlanDetailUrl(teachingPlanID);
        fetch(url,{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(res => {
            let term = '上学期';
            if (res.term == '2'){
                term = '下学期';
            }
            if (res){
                this.setState({
                    subjectName:res.subject,
                    term:term,
                    gradeName:res.grade,
                    version:res.version_name,
                    year:res.year,
                    weeks:res.week,
                    planDetailStr:res.objective,
                    materialStr:res.textbook_analysis,
                    teachingStr:res.method,
                    studentDetail:res.student_analysis,
                })
            }
        })

    },

    getPlanSchedule(){
        let teachingPlanID = this.props.params.planId;
        let url = config.api.teachingPlan.teachingScheduleUrl(teachingPlanID);
        let indexNotShow = [];
        fetch(url,{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res => res.json()).then(res =>{
            if (res){
                let oldUnit='';
                let oldIndex = -1;
                res.map((value,index) =>{
                    if (value.unit != oldUnit){
                        oldUnit = value.unit;
                        oldIndex = index;
                        indexNotShow.push( {
                                key: index,
                                rowSpan:1,
                                colSpan:1,
                        });
                    }else {
                        let flag = 0;
                        indexNotShow.map((value) =>{
                            if (value.key == oldIndex){
                                value.rowSpan += 1;
                                flag = 1;
                            }
                        });
                            indexNotShow.push({
                                    key: index,
                                    rowSpan:0,
                                    colSpan:0,
                            });
                    }
                });
                this.setState({
                    modalVisiable:true,
                    indexNotShow:indexNotShow,
                    schedules:res,
                })

            }
        })
    },
    getTableHeader(){
        let header = fromJS([
            {title:'周次',dataIndex:'week_no',key:'week_no'},
            {title:'单元',dataIndex:'unit',
                render:(text,row,index) =>{
                    const obj = {
                        children: text,
                        props: {},
                    };
                    this.state.indexNotShow.map((value)=>{
                        if (value.key == index){
                            obj.props.rowSpan = value.rowSpan;
                            obj.props.colSpan = value.colSpan;
                        }
                    })
                    return obj;
                }

            },
            {title:'教学内容',dataIndex:'course',key:'course'},
            {title:'课时安排',dataIndex:'hours',key:'hours'}
        ]);
        return header.toJS();
    },
    handleClose(){
        this.setState({
            modalVisiable:false,
        })
    },

    render(){
        const cloumns = this.getTableHeader();
        return(
            <div className={styles.container}>
                <div className={styles.body}>
                    <div className={styles.subHeader}>
                        <h2>教学计划详情</h2>
                    </div>

                    <Row type='flex' gutter={8}>
                        <Col span={6}>
                            <Row gutter={8}>
                                <Card style={{height:'138px'}}
                                      title={<span><Icon type='appstore'/>学科（版本）</span>}
                                      bordered={true}>
                                    {this.state.subjectName}<br/>{this.state.version}
                                </Card>
                            </Row>
                            <Row gutter={8}>
                                <Card style={{height:'138px'}}
                                      title={<span><Icon type='appstore'/>年纪（学期）</span>}
                                      bordered={true}>
                                    {this.state.gradeName}<br/>{this.state.term}
                                </Card>
                            </Row>
                            <Row gutter={8}>
                                <Card style={{height:'138px'}}
                                      title={<span><Icon type='appstore'/>年份（教学周数）</span>}
                                      bordered={true}>
                                    {this.state.year}<br/>{this.state.weeks}
                                </Card>
                            </Row>
                        </Col>
                        <Col span={18}>
                            <Tabs defaultActiveKey="1" tabBarExtraContent={<Button type='primary' onClick={this.getPlanSchedule.bind(this)}>进度安排</Button>}>
                                <TabPane tab="教学目标及要求" key="1">
                                    <div className={styles.textArea}>{this.state.planDetailStr}</div>
                                </TabPane>
                                <TabPane tab="教材分析" key="2">
                                    <div className={styles.textArea}>{this.state.materialStr}</div>
                                </TabPane>
                                <TabPane tab="教学措施" key="3">
                                    <div className={styles.textArea}>{this.state.teachingStr}</div>
                                </TabPane>
                                <TabPane tab="学生情况分析" key="4">
                                    <div className={styles.textArea}>{this.state.studentDetail}</div>
                                </TabPane>
                            </Tabs>

                        </Col>

                    </Row>
                    <Row>
                        <Col span={24} style={{textAlign:'right'}}>
                            <Button type='primary' onClick={()=>{this.props.router.goBack()}} >返回</Button>
                        </Col>
                    </Row>

                </div>
                <Modal title='进度安排'
                    visible={this.state.modalVisiable}
                       onCancel={this.handleClose.bind(this)}
                       footer={[
                           <Button  type='primary' size='large' onClick={()=>{this.handleClose()}}>返回</Button>
                       ]}
                    >
                    <Table columns={cloumns}
                           dataSource={this.state.schedules}


                    />
                </Modal>

            </div>

        )
    }




});
function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getGradeOptions:bindActionCreators(getGradeOptions,dispatch),
        getSubjectOptions:bindActionCreators(getSubjectOptions,dispatch),
        getVersionOptions:bindActionCreators(getVersionOptions,dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanDetailPage)

