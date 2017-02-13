import React from 'react'
import styles from './CreateExampaper.scss'
import ExamElement from '../../components/tag/ExamElement'
import {Row,Col,Checkbox,Button,Icon,Input} from 'antd'
import {List,fromJS} from 'immutable'
import config from '../../config'
import CourseFilterComponent from '../../components/course_filter/CourseFilterComponent'
import MultipleChoiceQuestion from '../../components/table/exampaper/MultipleChoiceQuestion'
import NoteQuestion from '../../components/table/exampaper/NoteQuestion'
const Search = Input.Search;
const CreateExampaper = React.createClass({
  getInitialState(){
    return {
      examPaperId:'',//试卷的ID
      exerciseList:List(),//已经添加的试题的列表

      withAnswer:false,

    }
  },
  componentDidMount(){
    let formData = new FormData()
    formData.append('subjectId','')
    formData.append('gradeId','')
    fetch(config.api.exampaper.createExam,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      this.setState({
        examPaperId:res.examPaperId
      })
    })
  },
  //添加选择题
  handleAddChoose(type){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('kind',type)
    formData.append('parentId','')
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addChoose,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      this.setState({
        exerciseList:this.state.exerciseList.push(fromJS(res))
      })
    })
  },
  //添加填空题
  handleAddNote(){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('parentId','')
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addNote,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      this.setState({
        exerciseList:this.state.exerciseList.push(fromJS(res))
      })
    })
  },
  //添加判断题
  handleAddJudge(){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('parentId','')
    formData.append('date',new Date().toString())
    fetch(config.api.wordquestion.addJudge,{
      method:'post',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      },
      body:formData
    }).then(res => res.json()).then(res => {
      this.setState({
        exerciseList:this.state.exerciseList.push(fromJS(res))
      })
    })
  },
  //添加简答题，语文作文，英语作文
  handleAddShortAnswer(type){
    let formData = new FormData()
    formData.append('examId',this.state.examPaperId)
    formData.append('parentId','')
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
      this.setState({
        exerciseList:this.state.exerciseList.push(fromJS(res))
      })
    })
  },


  render(){
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Search
            placeholder="输入搜索条件"
            style={{ width: 200 }}
            onSearch={value => console.log(value)}
          /><CourseFilterComponent />
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
                  <Button type='primary' disabled={!this.state.widthAnswer}><Icon type='plus' />上传答案</Button>
                </Col>
              </Row>
              <Row type='flex' align='middle' justify='space-between' style={{marginTop:'10px'}}>
                <Col>
                  <ExamElement text='语文作文' onClick={this.handleAddShortAnswer.bind(this,'06')}/>
                  <ExamElement text='英语作文' onClick={this.handleAddShortAnswer.bind(this,'07')}/>
                </Col>
                <Col span={5} style={{display:'flex',justifyContent:'flex-end'}}>
                  <Button type='primary' style={{marginRight:'10px'}}><Icon type='download'/>导入</Button>
                  <Button type='primary' style={{marginRight:'10px'}}><Icon type='plus'/>发布</Button>
                </Col>
              </Row>
            </div>
            <div className={styles.paperContent}>
            {
              this.state.exerciseList.map((v,k) => {
                if(v.get('kind')=='01'){
                  //单选
                  return <MultipleChoiceQuestion questionInfo={v} key={k}/>
                }else if(v.get('kind')=='03'){
                  //多选
                  return <MultipleChoiceQuestion questionInfo={v} key={k}/>
                }else if(v.get('kind')=='04'){
                  //填空
                  return <NoteQuestion questionInfo={v} key={k}/>
                }else{
                  return null
                }
              })
            }
            </div>
          </div>

        </div>
      </div>
    )
  }
})

export default CreateExampaper
