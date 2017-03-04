import React from 'react'
import styles from './MultipleChoiceQuestion.scss'
import {fromJS} from 'immutable'
import {Table, Icon, Input, Radio, Select, Row, Col, Button, Rate, InputNumber, Checkbox} from 'antd'
import Ueditor from '../../ueditor/Ueditor'
import {updateOption, updateQuestion, deleteOption, addOption, QUESTION_TYPE} from './exampaper-utils'
import {addHttpPrefix} from '../../answer_homework/util'
import {QUESTION_HEIGHT, OPTION_HEIGHT} from './constant';

const Option = Select.Option
const MultipleChoiceQuestion = React.createClass({
    getDefaultProps(){
        return {
            questionInfo: fromJS({}),//题目的详细信息
            moveUp: () => {
            },//上移
            moveDown: () => {
            },//下移
            onDelete: () => {
            },//销毁该题目
            onChangeQuestionType: () => {
            },//改变题目类型
        }
    },
    getInitialState(){
        return {
            editingQuestion: false,//是否编辑题目
            editingAnswerItem: [false, false, false, false],//编辑答案选项
            radioCheck: -1,//选择题的答案
            showFooter: false,//显示添加额外信息面板
            showScoreSetting: false,//显示设定分数的组件
            comment: '',//备注
            description: '',//描述
        }
    },
    componentDidMount(){
        window.addEventListener('click', this.handleWindowEvent)
    },
    componentWillUnmount(){
        window.removeEventListener('click', this.handleWindowEvent)
    },
    getTableData(){
        const questionType = this.props.questionInfo.get('kind')
        let selectComponent = null
        switch (questionType) {
            case '01'://单选
                selectComponent = (record) => (
                    <Radio checked={this.props.questionInfo.getIn(['optionPojoList', record.key, 'answer'])}
                           onClick={this.handleSetRightAnswer.bind(this, record.key)}
                            ></Radio>)
                break;
            case '02'://判断
                selectComponent = (record) => (
                    <Radio checked={this.props.questionInfo.getIn(['optionPojoList', record.key, 'answer'])}
                           onClick={this.handleSetRightAnswer.bind(this, record.key)}></Radio>)
                break;
            case '03'://多选
                selectComponent = (record) => (
                    <Checkbox checked={this.props.questionInfo.getIn(['optionPojoList', record.key, 'answer'])}
                              onChange={this.handleSetRightAnswer.bind(this, record.key)}/>)
                break;
            default:
                selectComponent = null
        }
        const tableHeader = [{
            title: this.props.questionInfo.get('questionNo'),
            key: 'num',
            className: styles.columnsNo,
            width: 50,
            render: (text, record) => {
                return <div onClick={(e) => {
                    e.stopPropagation()
                }}>{selectComponent(record)}</div>
            }
        }, {
            title: this.renderQuestion(),
            dataIndex: 'answer',
            key: 'answer',
            className: styles.columns,
            render: (text, record) => {
                return (
                    <div className={styles.question}>
                        {
                            this.state.editingAnswerItem[record.key] ?
                                <Ueditor name={this.props.questionInfo.getIn(['optionPojoList', record.key, 'id'])}
                                         initialContent={text}
                                         onDestory={this.handleUpdateOption.bind(this, record.key)}
                                         initialHeight={OPTION_HEIGHT}/> :
                                <span dangerouslySetInnerHTML={{__html: addHttpPrefix(text) || '请输入选项内容'}}></span>
                        }
                        {this.state.showScoreSetting ? <div onClick={(e) => {
                                e.stopPropagation()
                            }}><InputNumber min={0} defaultValue={0}
                                            value={this.props.questionInfo.getIn(['optionPojoList', record.key, 'score'])}
                                            onChange={this.handleChangeScore.bind(this, record.key)}/></div> : null}
                    </div>
                )
            }
        }, {
            title: <Icon type='close' style={{cursor:'pointer'}} onClick={(e) => {
                e.stopPropagation();
                this.props.onDelete(this.props.questionInfo.get('id'))
            }}/>,
            className: styles.columnsNo,
            width: 50,
            render: (text, record) => {
                return <div onClick={(e) => {
                    e.stopPropagation()
                }}><Icon style={{cursor:'pointer'}} type='close' onClick={this.handleDeleteAnswerItem.bind(this, record.key)}/></div>
            }
        }]
        const tableBody = this.props.questionInfo.get('optionPojoList').map((v, k) => ({
            answer: v.get('content'),
            key: k,
        })).toJS()
        return {
            tableHeader,
            tableBody,
        }
    },
    //确定正确的答案
    handleSetRightAnswer(key, e){
        updateOption({
            optionId: this.props.questionInfo.getIn(["optionPojoList", key, 'id']),
            content: this.props.questionInfo.getIn(["optionPojoList", key, 'content']),
            score: this.props.questionInfo.getIn(["optionPojoList", key, 'score']),
            isAnswer: this.props.questionInfo.get('kind') == '03'?!this.props.questionInfo.getIn(["optionPojoList", key, 'answer']):true,
        }).then(res => {
            if (this.props.questionInfo.get('kind') == '03') {
                //多选题
                //console.log(this.props.questionInfo.getIn(['optionPojoList', key, 'answer']), this.props.questionInfo.get('optionPojoList').setIn([key, 'answer'], !this.props.questionInfo.getIn(['optionPojoList', key, 'answer'])).toJS())
                let newOptions = this.props.questionInfo.get('optionPojoList').setIn([key, 'answer'], !this.props.questionInfo.getIn(['optionPojoList', key, 'answer']))
                this.props.onUpdate(this.props.questionInfo.get('id'), ['optionPojoList'], newOptions)
            } else {
                //单选，判断
                //如果之前选中了其他选项，要把其他选项置为非答案
                this.props.questionInfo.get('optionPojoList').filter(v=>v.get('answer')).forEach(
                    (option) => {
                        updateOption({
                            optionId: option.get('id'),
                            content: option.get('content'),
                            score: option.get('score'),
                            isAnswer: false
                        })
                    }
                )

                let newOptions = this.props.questionInfo.get('optionPojoList').map(v => v.set('answer', false)).setIn([key, 'answer'], true)
                this.props.onUpdate(this.props.questionInfo.get('id'), ['optionPojoList'], newOptions)
            }
        })
    },
    //修改题目
    handleUpdateQuestion( value){
        updateQuestion({
            qid: this.props.questionInfo.get('id'),
            examination: value,
            comment: this.props.questionInfo.get('comment'),
            description: this.props.questionInfo.get('description'),
            difficulty: this.props.questionInfo.get('difficulty'),
            kind: this.props.questionInfo.get('kind'),
            drawZone: '',
            score: this.props.questionInfo.get('score'),
        })
        this.props.onUpdate(this.props.questionInfo.get('id'), ['examination'], value)
        this.setState({
            editingQuestion: false
        });
    },
    //添加备注
    handleUpdateComment(value){
        updateQuestion({
            qid: this.props.questionInfo.get('id'),
            examination: this.props.questionInfo.get('examination'),
            comment: value,
            description: this.props.questionInfo.get('description'),
            difficulty: this.props.questionInfo.get('difficulty'),
            kind: this.props.questionInfo.get('kind'),
            drawZone: '',
            score: this.props.questionInfo.get('score'),
        })
        this.props.onUpdate(this.props.questionInfo.get('id'), ['comment'], value)
        this.setState({
            editingComment: false
        });
    },
    //添加描述
    handleUpdateDescription(value){
        updateQuestion({
            qid: this.props.questionInfo.get('id'),
            examination: this.props.questionInfo.get('examination'),
            comment: this.props.questionInfo.get('comment'),
            description: value,
            difficulty: this.props.questionInfo.get('difficulty'),
            kind: this.props.questionInfo.get('kind'),
            drawZone: '',
            score: this.props.questionInfo.get('score'),
        })
        this.props.onUpdate(this.props.questionInfo.get('id'), ['description'], value)
        this.setState({
            editingDescription: false
        });
    },
    //修改答案选项.
    handleUpdateOption(key, value){
        updateOption({
            optionId: this.props.questionInfo.get('optionPojoList').get(key).get('id'),
            content: value,
            score: this.props.questionInfo.getIn(['optionPojoList', key, 'score']),
            isAnswer: this.props.questionInfo.getIn(['optionPojoList', key, 'answer'])
        })
        this.props.onUpdate(this.props.questionInfo.get('id'), ['optionPojoList', key, 'content'], value)

        let editingAnswerItem = this.state.editingAnswerItem;
        editingAnswerItem[key] = false;
        //this.state.editingAnswerItem = editingAnswerItem;
        //this.forceUpdate();
        this.setState({
            editingAnswerItem: editingAnswerItem
        });
    },
    //删除答案选项
    handleDeleteAnswerItem(key){
        deleteOption({
            optionId: this.props.questionInfo.getIn(['optionPojoList', key]).get('id')
        })
        let newOptions = this.props.questionInfo.get('optionPojoList').filter((v, k) => k != key)
        this.props.onUpdate(this.props.questionInfo.get('id'), ['optionPojoList'], newOptions)
    },
    handleWindowEvent(){
        this.setState({
            // editingQuestion:false,
            // editingAnswerItem:this.state.editingAnswerItem.map(v => false),
            // showFooter:false,
            showScoreSetting: false,
        })
    },
    //设定分值
    handleSetScore(){
        this.setState({
            showScoreSetting: !this.state.showScoreSetting
        })
    },
    //修改分值
    handleChangeScore(key, value){
        updateOption({
            optionId: this.props.questionInfo.getIn(['optionPojoList', key, 'id']),
            content: this.props.questionInfo.getIn(['optionPojoList', key, 'content']),
            score: value,
            isAnswer: this.props.questionInfo.getIn(['optionPojoList', key, 'answer']),
        })
        this.props.onUpdate(this.props.questionInfo.get('id'), ['optionPojoList', key, 'score'], value)
    },
    //添加答案选项
    handleAddAnswerItem(){
        addOption({
            questionId: this.props.questionInfo.get('id'),
            questionKind: this.props.questionInfo.get('kind')
        }).then(res => {
            let newOptions = this.props.questionInfo.get('optionPojoList').push(fromJS(res))
            this.props.onUpdate(this.props.questionInfo.get('id'), ['optionPojoList'], newOptions)
        })
    },
    //设定难度
    handlerSetHardness(value){
        updateQuestion({
            qid: this.props.questionInfo.get('id'),
            examination: this.props.questionInfo.get('examination'),
            comment: this.props.questionInfo.get('comment'),
            description: this.props.questionInfo.get('description'),
            difficulty: value,
            kind: this.props.questionInfo.get('kind'),
            drawZone: '',
            score: this.props.questionInfo.get('score'),
        })
        this.props.onUpdate(this.props.questionInfo.get('id'), ['difficulty'], value)
    },
    //添加注解
    handleAddComment(){

    },
    renderQuestion(){
        return (
            <div className={styles.question} onClick={(e) => {
                e.stopPropagation();
                this.setState({editingQuestion: !this.state.editingQuestion,showFooter: !this.state.showFooter})
            }}>
                {
                    this.state.editingQuestion ? <Ueditor name={this.props.questionInfo.get('id')}
                                                          initialContent={this.props.questionInfo.get('examination') || '请输入题目内容'}
                                                          onDestory={this.handleUpdateQuestion}
                                                          initialHeight={QUESTION_HEIGHT}/> : <span
                            dangerouslySetInnerHTML={{__html: addHttpPrefix(this.props.questionInfo.get('examination')) || '请输入题目内容'}}></span>
                }
            </div>
        )
    },
    renderFooter(){
        return (
            <div className={styles.footer} onClick={(e) => {
                e.stopPropagation()
                this.setState({
                  editingComment:false,
                  editingDescription:false
                })
            }}>
                <Row>
                    {
                        this.props.questionInfo.get('kind') != '02' ? <Col span={6}>
                                <Button onClick={this.handleAddAnswerItem}>添加备选</Button>
                            </Col> : null
                    }
                    <Col span={6}>
                        <Select value={this.props.questionInfo.get('kind')} style={{width: '200px'}} onFocus={() => {
                            window.removeEventListener('click', this.handleWindowEvent)
                        }} onBlur={() => {
                            window.addEventListener('click', this.handleWindowEvent)
                        }}
                                onChange={(value) => this.props.onChangeQuestionType(this.props.questionInfo.get('id'), value)}>
                            {
                                QUESTION_TYPE.map(v => (
                                    <Option value={v.id} title={v.text} key={v.id}>{v.text}</Option>
                                ))
                            }
                        </Select>
                    </Col>
                    <Col span={6}>
                        难度：<Rate value={this.props.questionInfo.get('difficulty')} onChange={this.handlerSetHardness}/>
                    </Col>
                    <Col>
                        <Button onClick={this.handleSetScore}>设定分值</Button>
                    </Col>
                </Row>
                <Row >
                    <Col span={10}>
                        <span onClick={(e)=>{e.stopPropagation();this.setState({
                          editingComment:!this.state.editingComment
                        })}}>注解：</span>{
                          this.state.editingComment?<Ueditor
                                  name={this.props.questionInfo.getIn(['id'])+'comment'}
                                  initialContent={this.props.questionInfo.get('comment')||'添加备注'}
                                  onDestory={this.handleUpdateComment}
                                  initialHeight={OPTION_HEIGHT}/>:<span dangerouslySetInnerHTML={{__html: addHttpPrefix(this.props.questionInfo.get('comment')) || '请输入题目内容'}}></span>
                        }
                    </Col>
                    <Col span={10} offset={2}>
                        <span onClick={(e)=>{e.stopPropagation();this.setState({
                          editingDescription:!this.state.editingDescription
                        })}}>描述：</span>{
                          this.state.editingDescription?<Ueditor
                                  name={this.props.questionInfo.getIn(['id'])+'description'}
                                  initialContent={this.props.questionInfo.get('description')||'添加描述'}
                                  onDestory={this.handleUpdateDescription}
                                  initialHeight={OPTION_HEIGHT}/>:<span dangerouslySetInnerHTML={{__html: addHttpPrefix(this.props.questionInfo.get('description')) || '请输入描述内容'}}></span>
                        }
                    </Col>
                </Row>
            </div>
        )
    },
    render(){
        const tableData = this.getTableData()
        let questionTypeName = ''
        switch (this.props.questionInfo.get('kind')) {
            case '01':
                questionTypeName = '单选题'
                break;
            case '02':
                questionTypeName = '判断题'
                break;
            case '03':
                questionTypeName = '多选题'
                break;
            default:
                questionTypeName = ''
        }
        return (
            <div className={styles.multipleChoiceQuestion} onClick={(e)=>{e.stopPropagation()}}>
                <div className={styles.tag}>
                    <span className={styles.text}>{questionTypeName}</span>
                </div>
                <Table onRowClick={(record, index) => {
                    this.setState({
                        editingAnswerItem: this.state.editingAnswerItem.map((v, k) => k == record.key ? !v : v)
                    })
                }
                } bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
                <div className={styles.moveButton}>
                    {this.props.questionInfo.get('questionNo') == 1 ? null : <Button onClick={(e) => {
                            this.props.moveUp(this.props.questionInfo.get('id'))
                        }}><Icon style={{cursor:'pointer'}} type="caret-up"/></Button>}
                    <Button onClick={(e) => {
                        this.props.moveDown(this.props.questionInfo.get('id'))
                    }}><Icon style={{cursor:'pointer'}} type="caret-down"/></Button>
                </div>
                {
                    this.renderFooter()
                }
            </div>
        )
    }
})

export default MultipleChoiceQuestion
