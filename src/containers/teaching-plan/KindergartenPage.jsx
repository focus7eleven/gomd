import React from 'react'
import {fromJS,Map,List} from 'immutable'
import styles from './KindergartenPage.scss'
import {connect} from 'react-redux'
import {Icon,Input,Table,Button,Modal,Form,Spin,Select,Row,Col} from 'antd'
import {CustomTable} from '../../components/table/CustomTable';
import config from '../../config';
import menuRoutePath from '../../routeConfig';

const KindergartenPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    _currentMenu:Map({
        authList:List()
    }),
    componentWillMount(){
        if(!this.props.menu.get('data').isEmpty()){
            this._currentMenu = findMenuInTree(this.props.menu.get('data'),'teaching_plan')
            console.log('componentWillMount');
        }
    },
    getDefaultProps(){
        return {}
    },
    getInitialState(){
        return {
            subjectOptionList:[],
            versionOptionList:[],
            yearOptionList:[],
            type:'',
            pageUrl:'',
            modalVisiable:false,
            unitOptions:[],
            courseOptions:[],
            textBookMenus:[],
            summaryStr:'',

        }
    },
    componentWillMount(){
      this.state.type = this.props.params.type;

    },

    getParamByType(){
      let url = '';
      let type = this.state.type;
      let additionParams = {isPublic:'yes',phaseCode:11};
      if (type == 'kindergarten'){
          additionParams.phaseCode = 11;
      }else if (type == 'primarySchool') {
          additionParams.phaseCode = 21;
      }else if (type == 'juniorHighSchool'){
          additionParams.phaseCode = 31;
      }else if (type == 'seniorMiddleSchool'){
          additionParams.phaseCode = 34;
      }
      return additionParams;

    },

    render(){
        let additionParams = this.getParamByType();
        let columns = this.getTableHeader();
        let units = this.state.textBookMenus.map(value =>{
            <Option key={value.unit}>{value.unit}</Option>
        });
        let filters = [
            {key:'subject',type:'select',placeholder:'所有学科',options:this.state.subjectOptionList},
            {key:'version',type:'select',placeholder:'所有版本',options:this.state.versionOptionList},
            {key:'year',type:'select',placeholder:'所有年份',options:this.state.yearOptionList},
        ]

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                </div>
                <div className={styles.body}>
                    <CustomTable columns={columns}
                                 showIndex={true}
                                 filters={filters}
                                 additionalParam={additionParams}
                                 pageUrl={config.api.teachingPlan.teachingPlanPageUrl}></CustomTable>
                </div>
                <Modal
                    title='总结详情'
                visible ={this.state.modalVisiable}
                onCancel={this.handleClose.bind(this)}
                footer={[
                    <Button  type='primary' size='large' onClick={()=>{this.handleClose()}}>返回</Button>
                ]}
                >
                    <div>
                        <Row gutter={8}>
                            <Col span={12}>
                            </Col>
                            <Col span={12}>
                            </Col>
                        </Row>
                        <Row>
                        </Row>
                    </div>

                </Modal>
            </div>
        )

    },

    handleClickSummary(record){
        fetch(config.api.teachingPlan.ordedTextbookmenuUrl(record.subject_id,record.grade_id,record.termString,record.version),
            {
                method:'get',
                headers:{
                    'from':'nodejs',
                    'token':sessionStorage.getItem('accessToken')
                }
            }).then(res => res.json()).then(textbookMenu =>{
                console.log(textbookMenu);
                for (var key in textbookMenu){
                    console.log(key+":"+textbookMenu[key].unit);
                }


        })
    },
    getSummaryDetail(textbookMenuId){
        fetch(config.api.teachingPlan.summaryDetailUrl(textbookMenuId),
            {
                method:'get',
                headers:{
                    'from':'nodejs',
                    'token':sessionStorage.getItem('accessToken')
                }
            }
        ).then(res => res.json()).then(detail =>{
            this.setState({
                summaryStr:detail,

            })
        })
    },

    handleClose(){
      this.setState({
          modalVisiable:false,
      })
    },

    gotoPlanDetail(record){
        console.log('gotoPlanDetail')
        this.context.router.push(menuRoutePath['planDetail'].path+record.teaching_plan_id);

    },
    gotoSummaryDetail(record){
        console.log('gotoSummaryDetail')
        this.handleClickSummary(record);

    },

    getTableHeader(){
        let tableHeader = fromJS([
            {title:'年级',dataIndex:'grade',key:'grade'},
            {title:'学科',dataIndex:'subject',key:'subject'},
            {title:'学期',dataIndex:'termString',key:'termString'},
            {title:'版本',dataIndex:'version_name',key:'version_name'},
            {title:'发布人',dataIndex:'publisherName',key:'publisherName'},
            {title:'年份',dataIndex:'year',key:'year'},
            {title:'创建时间',dataIndex:'createdString',key:'createdString'},
            {title:'状态',dataIndex:'type_name',key:'type_name'},
            {title:'计划详情',dataIndex:'planDetail',key:'planDetail',
            render:(text,record) =>{
                return (
                    <Icon type="link" onClick={this.gotoPlanDetail.bind(this,record)} />
                )
            }},
            {title:'总结详情',dataIndex:'summaryDetail',key:'summaryDetail',
                render:(text,record) =>{
                return (
                    <Icon type="link" onClick={this.gotoSummaryDetail.bind(this,record)}/>
                )
            }},
            {title:'发布',dataIndex:'action',key:'action',
            render:(text,record) =>{
                return (
                    <div>
                        <Button type='primary'>发布</Button>
                        <Button type='danger'>删除</Button>
                    </div>
                )
            }},

        ])
        return tableHeader.toJS();
    }
})

function mapStateToProps(state){
    return{
        menu:state.get('menu'),
    }
}
function mapDispatchToProps(dispatch){
    return {
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(KindergartenPage))