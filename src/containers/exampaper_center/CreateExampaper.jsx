import React from 'react'
import styles from './CreateExampaper.scss'
import ExamElement from '../../components/tag/ExamElement'
import {Row,Col,Checkbox,Button,Icon,Input,notification} from 'antd'
import {List,fromJS} from 'immutable'
import config from '../../config'
import CreateExampaperFilter from '../../components/exampaper_filter/CreateExampaperFilter'
import MultipleChoiceQuestion from '../../components/table/exampaper/MultipleChoiceQuestion'
import NoteQuestion from '../../components/table/exampaper/NoteQuestion'
import ShortAnswerQuestion from '../../components/table/exampaper/ShortAnswerQuestion'
import NestingQuestion from '../../components/table/exampaper/NestingQuestion'

import {deleteQuestion,changeQuestionPosition,getNewExamId,getExistExamInfo,updateQuestion} from '../../components/table/exampaper/exampaper-utils'
const Search = Input.Search;

const mockNestingQuestion = {"id":"243122372377448448",'childQuestion':[
  {"id":"243122372377448448",'childQuestion':[],"questionNo":1,"examination":"","parentId":"","comment":"","drawZone":null,"description":"","difficulty":0,"score":1.0,"kind":"04","mustanswer":false,"audioName":null,"videoName":null,"pdfName":null,"haveAudio":false,"haveVideo":false,"havePdf":false,"questionIndex":null,"updateDate":null,"creatorUserId":"031218647663209576","ownerId":"031218647663209576","subQuestion":"","abilityId":null,"examinationPaperId":"243122347933044736","optionPojoList":null,"importDate":null,"select":false,"draft":false,"public":false}
],"questionNo":1,"examination":"","parentId":"","comment":"","drawZone":null,"description":"","difficulty":0,"score":1.0,"kind":"08","mustanswer":false,"audioName":null,"videoName":null,"pdfName":null,"haveAudio":false,"haveVideo":false,"havePdf":false,"questionIndex":null,"updateDate":null,"creatorUserId":"031218647663209576","ownerId":"031218647663209576","subQuestion":"","abilityId":null,"examinationPaperId":"243122347933044736","optionPojoList":null,"importDate":null,"select":false,"draft":false,"public":false}

const CreateExampaper = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getDefaultProps(){
    return {
      exerciseList:List(),
      type:'create'
    }
  },
  getInitialState(){
    return {
      examPaperId:'',//试卷的ID
      exerciseList:List(),//已经添加的试题的列表
      nestingQuestion:'',//当前正在编辑的嵌套题

      withAnswer:false,

    }
  },
  componentDidMount(){
    console.log("this.props.type:",this.context.router.params.examId)
    if(this.props.type=='create'){
      getNewExamId('','').then(res => {
        this.setState({
          examPaperId:res.examPaperId
        })
      })
    }else if(this.props.type=='edit'){
      getExistExamInfo(this.context.router.params.examId).then(res => {
        this.setState({
          examPaperId:this.context.router.params.examId,
          exerciseList:fromJS(res)
        })
      })
    }
  },
  //添加嵌套题目子题目
  handleAddSubQuestion(subjectQuestion){
    let index = this.state.exerciseList.findKey(v => v.get('id')==this.state.nestingQuestion)
    let question = this.state.exerciseList.get(index)
    let newQuestion = question.get('subQuestion')?question.set('subQuestion',question.get('subQuestion').push(fromJS(subjectQuestion))):question.set('subQuestion',fromJS([subjectQuestion]))
    this.setState({
      exerciseList:this.state.exerciseList.set(index,newQuestion)
    })
  },
  //添加选择题
  handleAddChoose(type){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('kind',type)
    formData.append('parentId',this.state.nestingQuestion)
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addChoose,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(!this.state.nestingQuestion){
        this.setState({
          exerciseList:this.state.exerciseList.push(fromJS(res))
        })
      }else{
        //正在编辑嵌套题
        this.handleAddSubQuestion(res)
      }

    })
  },
  //添加填空题
  handleAddNote(){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('parentId',this.state.nestingQuestion)
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addNote,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(!this.state.nestingQuestion){
        this.setState({
          exerciseList:this.state.exerciseList.push(fromJS(res))
        })
      }else{
        //正在编辑嵌套题
        this.handleAddSubQuestion(res)
      }
    })
  },
  //添加判断题
  handleAddJudge(){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('parentId',this.state.nestingQuestion)
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addJudge,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(!this.state.nestingQuestion){
        this.setState({
          exerciseList:this.state.exerciseList.push(fromJS(res))
        })
      }else{
        //正在编辑嵌套题
        this.handleAddSubQuestion(res)
      }
    })
  },
  //添加简答题，语文作文，英语作文
  handleAddShortAnswer(type){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('parentId',this.state.nestingQuestion)
    formData.append('date',new Date().toString())
    formData.append('kind',type)
    fetch(config.api.wordquestion.addShortAnswer,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(!this.state.nestingQuestion){
        this.setState({
          exerciseList:this.state.exerciseList.push(fromJS(res))
        })
      }else{
        //正在编辑嵌套题
        this.handleAddSubQuestion(res)
      }
    })
  },

  //添加标题
  handleAddTitle(){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addTitle,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(!this.state.nestingQuestion){
        this.setState({
          exerciseList:this.state.exerciseList.push(fromJS(res))
        })
      }else{
        //正在编辑嵌套题
        this.handleAddSubQuestion(res)
      }
    })
  },

  //删除题目
  handleDeleteQuestion(questionId){
    deleteQuestion({questionId})
    this.setState({
      exerciseList:this.state.exerciseList.filter(v => v.get('id')!=questionId),
      nestingQuestion:''
    })
  },

  //改变题目类型
  handleChangeQuestionType(questionId,type){
    let index = this.state.exerciseList.findKey(v => v.get('id')==questionId)
    updateQuestion({
      qid:questionId,
      examination:'',
      comment:'',
      description:'',
      difficulty:0,
      kind:type,
      drawZone:'',
      score:1,
    }).then(res => {
      this.setState({
        exerciseList:this.state.exerciseList.set(index,fromJS(res))
      })
    })
  },


//更新题目
  update(questionId,changedAttribute,changedContent){

    let index = this.state.exerciseList.findKey(v => v.get('id')==questionId)
    this.setState({
      exerciseList:this.state.exerciseList.setIn([index].concat(changedAttribute),changedContent)
    })
  },
//添加答案选项
  addOption(questionId,newOption){
    let index = this.state.exerciseList.findKey(v => v.get('id')==questionId)
    let newOptionPos = this.state.exerciseList.find(v => v.get('id')==questionId).get('optionPojoList').size
    this.setState({
      exerciseList:this.state.exerciseList.setIn([index,'optionPojoList',newOptionPos],fromJS(newOption))
    })
  },
//删除答案选项
  deleteOption(questionId,optionId){
    let index = this.state.exerciseList.findKey(v => v.get('id')==questionId)
    let questionOptions = this.state.exerciseList.find(v => v.get('id')==questionId)
    this.setState({
      exerciseList:this.state.exerciseList.setIn([index,'optionPojoList'],questionOptions.filter(v => v.get('id')!=optionId))
    })
  },
  //题目上移
  moveUp(questionId){
    let questionIndex = this.state.exerciseList.findKey(v => v.get('id')==questionId)
    let question = this.state.exerciseList.get(questionIndex)
    let preQuestion = this.state.exerciseList.get(questionIndex-1)
    changeQuestionPosition({
      moveDownQuestionId:preQuestion.get('id'),
      moveUpQuestionId:question.get('id'),
    })
    this.setState({
      exerciseList:this.state.exerciseList.set(questionIndex,preQuestion).set(questionIndex-1,question)
    })

  },
  //题目下移
  moveDown(questionId){
    let questionIndex = this.state.exerciseList.findKey(v => v.get('id')==questionId)
    let question = this.state.exerciseList.get(questionIndex)
    let nextQuestion = this.state.exerciseList.get(questionIndex+1)
    changeQuestionPosition({
      moveDownQuestionId:question.get('id'),
      moveUpQuestionId:nextQuestion.get('id'),
    })
    this.setState({
      exerciseList:this.state.exerciseList.set(questionIndex,nextQuestion).set(questionIndex+1,question)
    })

  },
  //发布试卷
  handlePublishExampaper(){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    fetch(config.api.exampaper.publishExamPaper,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      if(res.title=='Success'){
        this.context.router.push(`/index/question-exampaper/selfexampapercenter`)
      }else{
        notification.error({message:'发布失败'})
      }
    })
  },
  //导入书卷
  handleImportExampaper(e){
    let file = e.target.files[0]
    let fileReader = new FileReader()
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('file',file)
    fetch(config.api.wordquestion.uploadWord,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      notification.success({message:'上传成功'})
    })
  },
  //导入答案
  handleImportAnswer(e){

  },
  //添加嵌套题
  handleAddNestingQuestion(){
    if(!this.state.nestingQuestion){
      let formData = new FormData()
      formData.append('examId',this.state.examPaperId)
      formData.append('date',new Date().toString())
      fetch(config.api.wordquestion.addNest,{
        method:'post',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        },
        body:formData
      }).then(res => res.json()).then(res => {
        this.setState({
          nestingQuestion:res.id,
          exerciseList:this.state.exerciseList.push(fromJS(res))
        })
      })
    }else{
      //结束嵌套题
      this.setState({
        nestingQuestion:''
      })
    }

  },
  render(){
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Search
            placeholder="输入搜索条件"
            style={{ width: 200 }}
            onSearch={value => console.log(value)}
          /><CreateExampaperFilter examId={this.state.examPaperId}/>
        </div>
        <div className={styles.body}>
          <div className={styles.center}>
            <div className={styles.paperElement}>
              <Row type='flex' align='middle' justify='space-between'>
                <Col span={10}>
                  <ExamElement text='单选' onClick={this.handleAddChoose.bind(this,'1')}/>
                  <ExamElement text='多选' onClick={this.handleAddChoose.bind(this,'2')}/>
                  <ExamElement text='判断' onClick={this.handleAddJudge}/>
                  <ExamElement text='填空' onClick={this.handleAddNote}/>
                  <ExamElement text='简答（计算）' onClick={this.handleAddShortAnswer.bind(this,'05')}/>
                </Col>
                <Col span={8} style={{display:'flex',justifyContent:'flex-end',paddingRight:'10px',alignItems:'center'}}>
                  <Checkbox checked={this.state.widthAnswer} onChange={()=>{this.setState({widthAnswer:!this.state.widthAnswer})}}>对填空题和简答题统一上传标准答案</Checkbox>
                  <Button type='primary' disabled={!this.state.widthAnswer} onClick={()=>{this.refs.answerUploader.click()}}><Icon type='plus' />上传答案</Button>
                </Col>
              </Row>
              <Row type='flex' align='middle' justify='space-between' style={{marginTop:'10px'}}>
                <Col>
                  <ExamElement text='语文作文' onClick={this.handleAddShortAnswer.bind(this,'06')}/>
                  <ExamElement text='英语作文' onClick={this.handleAddShortAnswer.bind(this,'07')}/>
                  <ExamElement text='嵌套题' style={this.state.nestingQuestion?{backgroundColor:'#FC9E0A',borderColor:'#FC9E0A',color:'white'}:{}} onClick={this.handleAddNestingQuestion}/>
                  <ExamElement text='章节' onClick={this.handleAddTitle}/>
                </Col>
                <Col span={5} style={{display:'flex',justifyContent:'flex-end'}}>
                  <Button type='primary' style={{marginRight:'10px'}} onClick={()=>{this.refs.exampaperUploader.click()}}><Icon type='download'/>导入</Button>
                  <Button type='primary' style={{marginRight:'10px'}} onClick={this.handlePublishExampaper}><Icon type='plus'/>发布</Button>
                </Col>
              </Row>
            </div>
            <div className={styles.paperContent}>
            {
              this.state.exerciseList.map((v,k) => {
                if(v.get('kind')=='01'||v.get('kind')=='02'||v.get('kind')=='03'){
                  //单选
                  return <MultipleChoiceQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
                }else if(v.get('kind')=='04'){
                  //填空
                  return <NoteQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
                }else if(v.get('kind')=='05'||v.get('kind')=='06'||v.get('kind')=='07'){
                  //填空
                  return <ShortAnswerQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
                }else if(v.get('kind')=='08'){
                  //嵌套题
                  return <div>标题</div>
                }else if(v.get('kind')=='09'){
                  //嵌套题
                  return <NestingQuestion questionInfo={v} key={k} onDelete={this.handleDeleteQuestion} onUpdate={this.update} moveUp={this.moveUp} moveDown={this.moveDown}/>
                }else{
                  return null
                }
              })
            }
            </div>
          </div>

        </div>
        <input type='file' style={{display:'none'}} ref='exampaperUploader' onChange={this.handleImportExampaper}/>
        <input type='file' style={{display:'none'}} ref='answerUploader' onChange={this.handleImportAnswer}/>
      </div>
    )
  }
})

export default CreateExampaper
