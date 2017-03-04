import React from 'react'
import styles from './CreateExampaper.scss'
import ExamElement from '../../components/tag/ExamElement'
import {Row, Col, Checkbox, Button, Icon, Input, notification, Spin, Tag} from 'antd'
import {List, fromJS} from 'immutable'
import config from '../../config'
import CreateExampaperFilter from '../../components/exampaper_filter/CreateExampaperFilter'
import MultipleChoiceQuestion from '../../components/table/exampaper/MultipleChoiceQuestion'
import NoteQuestion from '../../components/table/exampaper/NoteQuestion'
import ShortAnswerQuestion from '../../components/table/exampaper/ShortAnswerQuestion'
import NestingQuestion from '../../components/table/exampaper/NestingQuestion'
import QuestionTitle from '../../components/table/exampaper/QuestionTitle'
import {setExamInfo} from '../../components/exampaper_filter/utils'
import {
    deleteQuestion,
    changeQuestionPosition,
    getNewExamId,
    getExampaperInfo,
    updateQuestion
} from '../../components/table/exampaper/exampaper-utils'
const Search = Input.Search;
import {ueEventEmitter} from '../../components/ueditor/UeEventEmitter';
import {isChoiceQuestion,addHttpPrefixAndImageWidth} from '../../components/answer_homework/util';

const CreateExampaper = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getDefaultProps(){
        return {
            type: 'create'
        }
    },
    getInitialState(){
        return {
            examPaperId: '',//试卷的ID
            oneAnswer:0,
            oneAnswerContent:"",
            exerciseList: List(),//已经添加的试题的列表
            nestingQuestion: '',//当前正在编辑的嵌套题

            withAnswer: false,
            uploadingExampaper: false,//正在上传试卷
            uploadingAnswer: false,//正在上传答案,

            examPaperName:'', //试卷名称
            subjectId:'',
            gradeId:'',
            version:'',
            term:'',

        }
    },
    componentDidMount(){
        if (this.props.type == 'create') {
            getNewExamId('', '').then(res => {
                this.setState({
                    examPaperId: res.examPaperId
                })
            })
        } else if (this.props.type == 'edit') {
            getExampaperInfo(this.context.router.params.examId).then(res => {
                this.setState({
                    examPaperId: this.context.router.params.examId,
                    exerciseList: fromJS(res.wordQuestions),
                    examPaperName:res.examPaperInfo.name,
                    subjectId:res.examPaperInfo.subjectId,
                    gradeId:res.examPaperInfo.gradeId,
                    version:res.examPaperInfo.version,
                    term:res.examPaperInfo.term,
                    oneAnswer:res.examPaperInfo.one_answer,
                    oneAnswerContent:res.examPaperInfo.one_answer_content,
                })
            })
        }
    },
    //添加嵌套题目子题目
    handleAddSubQuestion(subjectQuestion){
        let index = this.state.exerciseList.findKey(v => v.get('id') == this.state.nestingQuestion)
        let question = this.state.exerciseList.get(index)
        let newQuestion = question.get('subQuestion') ? question.set('subQuestion', question.get('subQuestion').push(fromJS(subjectQuestion))) : question.set('subQuestion', fromJS([subjectQuestion]))
        this.setState({
            exerciseList: this.state.exerciseList.set(index, newQuestion)
        })
    },
    //添加选择题
    handleAddChoose(type){
        let formData = new FormData()
        formData.append('examId', this.state.examPaperId)
        formData.append('kind', type)
        formData.append('parentId', this.state.nestingQuestion)
        formData.append('date', new Date().toString())
        fetch(config.api.wordquestion.addChoose, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            if (!this.state.nestingQuestion) {
                this.setState({
                    exerciseList: this.state.exerciseList.push(fromJS(res))
                })
            } else {
                //正在编辑嵌套题
                this.handleAddSubQuestion(res)
            }

        })
    },
    //添加填空题
    handleAddNote(){
        let formData = new FormData()
        formData.append('examId', this.state.examPaperId)
        formData.append('parentId', this.state.nestingQuestion)
        formData.append('date', new Date().toString())
        fetch(config.api.wordquestion.addNote, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            if (!this.state.nestingQuestion) {
                this.setState({
                    exerciseList: this.state.exerciseList.push(fromJS(res))
                })
            } else {
                //正在编辑嵌套题
                this.handleAddSubQuestion(res)
            }
        })
    },
    //添加判断题
    handleAddJudge(){
        let formData = new FormData()
        formData.append('examId', this.state.examPaperId)
        formData.append('parentId', this.state.nestingQuestion)
        formData.append('date', new Date().toString())
        fetch(config.api.wordquestion.addJudge, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            if (!this.state.nestingQuestion) {
                this.setState({
                    exerciseList: this.state.exerciseList.push(fromJS(res))
                })
            } else {
                //正在编辑嵌套题
                this.handleAddSubQuestion(res)
            }
        })
    },
    //添加简答题，语文作文，英语作文
    handleAddShortAnswer(type){
        let formData = new FormData()
        formData.append('examId', this.state.examPaperId)
        formData.append('parentId', this.state.nestingQuestion)
        formData.append('date', new Date().toString())
        formData.append('kind', type)
        fetch(config.api.wordquestion.addShortAnswer, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            if (!this.state.nestingQuestion) {
                this.setState({
                    exerciseList: this.state.exerciseList.push(fromJS(res))
                })
            } else {
                //正在编辑嵌套题
                this.handleAddSubQuestion(res)
            }
        })
    },

    //添加标题
    handleAddTitle(){
        let formData = new FormData()
        formData.append('examId', this.state.examPaperId)
        formData.append('date', new Date().toString())
        fetch(config.api.wordquestion.addTitle, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            if (!this.state.nestingQuestion) {
                this.setState({
                    exerciseList: this.state.exerciseList.push(fromJS(res))
                })
            } else {
                //正在编辑嵌套题
                this.handleAddSubQuestion(res)
            }
        })
    },

    //删除题目
    handleDeleteQuestion(questionId){
        deleteQuestion({questionId})
        this.setState({
            exerciseList: this.state.exerciseList.filter(v => v.get('id') != questionId),
            nestingQuestion: ''
        })
    },

    //改变题目类型
    handleChangeQuestionType(questionId, type){
        let index = this.state.exerciseList.findKey(v => v.get('id') == questionId);

        this.setState((previousState)=> {
            const question = previousState.exerciseList.get(index);
            updateQuestion({
                qid: questionId,
                examination: question.get('examination'),
                comment: question.get('comment'),
                description: question.get('description'),
                difficulty: question.get('difficulty'),
                kind: type,
                drawZone: question.get('drawZone'),
                score: question.get('score'),
            }).then(res => {
                res.resultData.optionPojoList = res.resultData.optionPojoList || [];
                //console.log(this.state.exerciseList.set(index, fromJS(res.resultData)).toJS());
                //this.state.exerciseList = this.state.exerciseList.set(index, fromJS(res.resultData));
                //this.forceUpdate();
                this.setState((previousState)=> {
                    return {...previousState, exerciseList:previousState.exerciseList.set(index, fromJS(res.resultData))};
                });
            })
            return {...previousState, exerciseList:previousState.exerciseList.setIn([index,'kind'], type)};
        });
    },

    handleDeleteQuestion(questionId){
        deleteQuestion({questionId})
        this.setState({
            exerciseList: this.state.exerciseList.filter(v => v.get('id') != questionId)
        })
    },

//更新题目
    update(questionId, changedAttribute, changedContent){
        let index = this.state.exerciseList.findKey(v => v.get('id') == questionId)
        //this.state.exerciseList = this.state.exerciseList.setIn([index].concat(changedAttribute), changedContent);
        //this.forceUpdate();
        this.setState((previousState)=> {
            const question = previousState.exerciseList.get(index).setIn(changedAttribute,changedContent);
            updateQuestion({
                qid: questionId,
                examination: question.get('examination'),
                comment: question.get('comment'),
                description: question.get('description'),
                difficulty: question.get('difficulty'),
                kind: question.get('kind'),
                drawZone: question.get('drawZone'),
                score: question.get('score'),
            })
            return {...previousState, exerciseList:previousState.exerciseList.setIn([index].concat(changedAttribute), changedContent)};
        });

    },
//添加答案选项
    addOption(questionId, newOption){
        let index = this.state.exerciseList.findKey(v => v.get('id') == questionId)
        let newOptionPos = this.state.exerciseList.find(v => v.get('id') == questionId).get('optionPojoList').size
        this.setState({
            exerciseList: this.state.exerciseList.setIn([index, 'optionPojoList', newOptionPos], fromJS(newOption))
        })
    },
//删除答案选项
    deleteOption(questionId, optionId){
        let index = this.state.exerciseList.findKey(v => v.get('id') == questionId)
        let questionOptions = this.state.exerciseList.find(v => v.get('id') == questionId)
        this.setState({
            exerciseList: this.state.exerciseList.setIn([index, 'optionPojoList'], questionOptions.filter(v => v.get('id') != optionId))
        })
    },
    //题目上移
    moveUp(questionId){
        let questionIndex = this.state.exerciseList.findKey(v => v.get('id') == questionId)
        let question = this.state.exerciseList.get(questionIndex)
        let preQuestion = this.state.exerciseList.get(questionIndex - 1)
        changeQuestionPosition({
            moveDownQuestionId: preQuestion.get('id'),
            moveUpQuestionId: question.get('id'),
        })
        this.setState({
            exerciseList: this.state.exerciseList.set(questionIndex, preQuestion.set('questionNo', question.get('questionNo'))).set(questionIndex - 1, question.set('questionNo', preQuestion.get('questionNo')))
        })

    },
    //题目下移
    moveDown(questionId){
        let questionIndex = this.state.exerciseList.findKey(v => v.get('id') == questionId)
        let question = this.state.exerciseList.get(questionIndex)
        let nextQuestion = this.state.exerciseList.get(questionIndex + 1)
        changeQuestionPosition({
            moveDownQuestionId: question.get('id'),
            moveUpQuestionId: nextQuestion.get('id'),
        })
        this.setState({
            exerciseList: this.state.exerciseList.set(questionIndex, nextQuestion.set('questionNo', question.get('questionNo'))).set(questionIndex + 1, question.set('questionNo', nextQuestion.get('questionNo')))
        })

    },
    exampaperInfoCheck() {
        const {
            examPaperName,subjectId,gradeId,version,term
        } = this.state;
        let result = true;
        let message = [];
        if( examPaperName == null || examPaperName.length == 0 ) {
            result =  false;
            message.push("请输入试卷名称!");
        }
        if( subjectId == null || subjectId.length == 0){
            result =  false;
            message.push("请选择学科!");
        }
        if( gradeId == null || gradeId.length == 0){
            result =  false;
            message.push("请选择年级!");
        }
        if( version == null || version.length == 0){
            result =  false;
            message.push("请选择版本!");
        }
        if( term == null || term.length == 0){
            result =  false;
            message.push("请选择学期!");
        }

        this.state.exerciseList.forEach(
            (question) => {
                console.log(question.toJS())
                if( question.get("examination") == null || question.get("examination") == "" ) {
                    result =  false;
                    message.push("请设置第"+question.get("questionNo")+"题的题目内容!");
                }
                if( isChoiceQuestion(question.get("kind")) ) {//选择题 看看有没有勾选答案
                    if( question.get("optionPojoList") ) {
                        question.get("optionPojoList").forEach(
                            (option,optionIndex) => {
                                if( option.get("content") == null || option.get("content") == "" ) {
                                    result =  false;
                                    message.push("请设置第"+question.get("questionNo")+"题第"+(optionIndex+1)+"选项内容!");
                                }
                            }
                        );
                        if( question.get("optionPojoList").filter((option)=>option.get("answer")).size == 0 ) {
                            result =  false;
                            message.push("请设置第"+question.get("questionNo")+"题标准答案!");
                        }
                    } else {
                        result =  false;
                        message.push("请设置第"+question.get("questionNo")+"题选项!");
                    }
                } else {
                    if( this.state.oneAnswer == 1 ) {
                        if( this.state.oneAnswerContent == "" ) {
                            result =  false;
                            message.push("请对主观题上传统一标准答案!");
                        }
                    }
                }
            }
        );
        if( !result ) {
            notification.error({
                duration:10,
                message:"无法发布",
                description: (
                    <div>
                        {message.map(
                            (m) => {
                                return <div>{m}</div>;
                            }
                        )}
                    </div>)
            });
        }
        return result;
    },
    //发布试卷
    handlePublishExampaper(){
        if( this.exampaperInfoCheck() ) {
            let formData = new FormData()
            formData.append('examId', this.state.examPaperId)
            fetch(config.api.exampaper.publishExamPaper, {
                method: 'post',
                headers: {
                    'from': 'nodejs',
                    'token': sessionStorage.getItem('accessToken')
                },
                body: formData
            }).then(res => res.json()).then(res => {
                if (res.title == 'Success') {
                    this.context.router.push(`/index/question-exampaper/selfexampapercenter`)
                } else {
                    notification.error({message: '发布失败'})
                }
            })
        }
    },
    //导入书卷
    handleImportExampaper(e){
        this.setState({
            uploadingExampaper: true
        })
        let file = e.target.files[0]
        let fileReader = new FileReader()
        let formData = new FormData()
        formData.append('examId', this.state.examPaperId)
        formData.append('file', file)
        fetch(config.api.wordquestion.uploadWord, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            notification.success({message: '上传成功'})
            this.setState({
                exerciseList: this.state.exerciseList.concat(fromJS(res)),
                uploadingExampaper: false,
            })
        })
    },
    //导入答案
    handleImportAnswer(e){
        if( e.target.files == null || e.target.files.length == 0 ) {
            return;
        }
        this.setState({
            uploadingAnswer: true,
        });
        let formData = new FormData();
        formData.append('examPaperId', this.state.examPaperId);
        for( let i = 0; i < e.target.files.length; i++ ) {
            formData.append('oneAnswerFiles', e.target.files[i]);
        }
        fetch(config.api.exampaper.uploadStandardAnswer, {
            method: 'post',
            headers: {
                'from': 'nodejs',
                'token': sessionStorage.getItem('accessToken')
            },
            body: formData
        }).then(res => res.json()).then(res => {
            notification.success({message: '上传成功'})
            this.setState({
                uploadingAnswer: false,
                oneAnswer:1,
                oneAnswerContent:res.resultData,
            })
        })
    },
    //添加嵌套题
    handleAddNestingQuestion(){
        if (!this.state.nestingQuestion) {
            let formData = new FormData()
            formData.append('examId', this.state.examPaperId)
            formData.append('date', new Date().toString())
            fetch(config.api.wordquestion.addNest, {
                method: 'post',
                headers: {
                    'from': 'nodejs',
                    'token': sessionStorage.getItem('accessToken')
                },
                body: formData
            }).then(res => res.json()).then(res => {
                this.setState({
                    nestingQuestion: res.id,
                    exerciseList: this.state.exerciseList.push(fromJS(res))
                })
            })
        } else {
            //结束嵌套题
            this.setState({
                nestingQuestion: ''
            })
        }

    },
    updateSelect(obj) {
        this.setState({
            ...obj
        },()=>{this.handleUpdateExampaperInfo()})
    },
    //修改试卷名称
    handleUpdateExampaperName(e){
        this.setState({
            examPaperName: e.target.value,
        },()=>{
            this.handleUpdateExampaperInfo();
        })
    },
    handleUpdateExampaperInfo() {
        const {
            subjectId,
            gradeId,
            term,
            version,
            examPaperName,
        } = this.state;

        setExamInfo({
            examId: this.state.examPaperId,
            name: examPaperName,
            subjectId: subjectId,
            term: term,
            gradeId: gradeId,
            version: version,
            oneAnswer: 0,
            oneAnswerContent: '',
        })
    },
    render(){
        return (
            <div className={styles.container} onClick={() => {
                ueEventEmitter.emitEvent('closeUE')
            }}>
                <div className={styles.header}>
                    <Input
                        placeholder="试卷名称"
                        style={{width: 200}}
                        onBlur={this.handleUpdateExampaperName}
                        onChange={(e)=>{this.setState({examPaperName:e.target.value})}}
                        value={this.state.examPaperName}
                    />
                    <CreateExampaperFilter ref='filters' name={this.state.examPaperName}
                                           examId={this.state.examPaperId}
                                           subjectOption={this.state.subjectId}
                                           gradeOption={this.state.gradeId}
                                           termOption={this.state.term}
                                           versionOption={this.state.version}
                                           updateSelect={this.updateSelect}
                    />
                </div>
                <div className={styles.body}>
                    <div className={styles.center}>
                        <div className={styles.paperElement}>
                            <Row type='flex' align='middle' justify='space-between'>
                                <Col span={10}>
                                    <ExamElement text='单选' onClick={this.handleAddChoose.bind(this, '1')}/>
                                    <ExamElement text='多选' onClick={this.handleAddChoose.bind(this, '2')}/>
                                    <ExamElement text='判断' onClick={this.handleAddJudge}/>
                                    <ExamElement text='填空' onClick={this.handleAddNote}/>
                                    <ExamElement text='简答（计算）' onClick={this.handleAddShortAnswer.bind(this, '05')}/>
                                </Col>
                                <Col span={8} style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    paddingRight: '10px',
                                    alignItems: 'center'
                                }}>
                                    <Checkbox checked={this.state.oneAnswer==1} onChange={() => {
                                        this.setState({oneAnswer: this.state.oneAnswer==1?0:1})
                                    }}>对填空题和简答题统一上传标准答案</Checkbox>
                                    <Button type='primary' disabled={this.state.oneAnswer==0} onClick={() => {
                                        this.refs.answerUploader.click()
                                    }}>{<span><Icon type='plus'/>上传答案</span>}</Button>
                                </Col>
                            </Row>
                            <Row type='flex' align='middle' justify='space-between' style={{marginTop: '10px'}}>
                                <Col>
                                    <ExamElement text='语文作文' onClick={this.handleAddShortAnswer.bind(this, '06')}/>
                                    <ExamElement text='英语作文' onClick={this.handleAddShortAnswer.bind(this, '07')}/>
                                    <ExamElement text='嵌套题' style={this.state.nestingQuestion ? {
                                            backgroundColor: '#FC9E0A',
                                            borderColor: '#FC9E0A',
                                            color: 'white'
                                        } : {}} onClick={this.handleAddNestingQuestion}/>
                                    <ExamElement text='章节' onClick={this.handleAddTitle}/>
                                </Col>
                                <Col span={5} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button type='primary' style={{marginRight: '10px'}} onClick={() => {
                                        this.refs.exampaperUploader.click()
                                    }}>{(<span><Icon type='download'/>导入</span>)}</Button>
                                    <Button type='primary' style={{marginRight: '10px'}}
                                            onClick={this.handlePublishExampaper}><Icon type='plus'/>发布</Button>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.paperContent} onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            {
                                this.state.uploadingExampaper ? <div className={styles.loading}>
                                        <div><Spin size='large'/>努力加载中，请你耐心等待</div>
                                    </div> : this.state.exerciseList.map((v, k) => {
                                        if (v.get('kind') == '01' || v.get('kind') == '02' || v.get('kind') == '03') {
                                            //单选
                                            return <MultipleChoiceQuestion questionInfo={v} key={k}
                                                                           onDelete={this.handleDeleteQuestion}
                                                                           onUpdate={this.update} moveUp={this.moveUp}
                                                                           moveDown={this.moveDown}
                                                                           onChangeQuestionType={this.handleChangeQuestionType}/>
                                        } else if (v.get('kind') == '04') {
                                            //填空
                                            return <NoteQuestion questionInfo={v} key={k}
                                                                 onDelete={this.handleDeleteQuestion}
                                                                 onUpdate={this.update} moveUp={this.moveUp}
                                                                 moveDown={this.moveDown}
                                                                 onChangeQuestionType={this.handleChangeQuestionType}/>
                                        } else if (v.get('kind') == '05' || v.get('kind') == '06' || v.get('kind') == '07') {
                                            //简答
                                            return <ShortAnswerQuestion questionInfo={v} key={k}
                                                                        onDelete={this.handleDeleteQuestion}
                                                                        onUpdate={this.update} moveUp={this.moveUp}
                                                                        moveDown={this.moveDown}
                                                                        onChangeQuestionType={this.handleChangeQuestionType}/>
                                        } else if (v.get('kind') == '08') {
                                            //title
                                            return <QuestionTitle questionInfo={v} key={k} onUpdate={this.update}
                                                                  onDelete={this.handleDeleteQuestion}
                                                                  onChangeQuestionType={this.handleChangeQuestionType}/>
                                        } else if (v.get('kind') == '09') {
                                            //嵌套题
                                            return <NestingQuestion questionInfo={v} key={k}
                                                                    onDelete={this.handleDeleteQuestion}
                                                                    onUpdate={this.update} moveUp={this.moveUp}
                                                                    moveDown={this.moveDown}
                                                                    onChangeQuestionType={this.handleChangeQuestionType}/>
                                        } else {
                                            return null
                                        }
                                    })
                            }
                        </div>
                    </div>
                    {this.state.oneAnswerContent==null||this.state.oneAnswerContent==""?null:(
                            <div>
                                <Tag>上传的标准答案一览</Tag>
                                <div dangerouslySetInnerHTML={{__html: addHttpPrefixAndImageWidth(this.state.oneAnswerContent,600)}}></div>
                            </div>
                        )}

                </div>
                <input type='file' style={{display: 'none'}} ref='exampaperUploader'
                       onChange={this.handleImportExampaper}/>
                <input type='file' style={{display: 'none'}} ref='answerUploader' multiple="multiple" onChange={this.handleImportAnswer}/>
            </div>
        )
    }
})

export default CreateExampaper
