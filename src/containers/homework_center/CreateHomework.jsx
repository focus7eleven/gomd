import React from 'react'
import styles from './CreateHomework.scss'
import {Row,Col,Select,Icon,Input,Radio,Form} from 'antd'
import {fromJS,List} from 'immutable'
import config from '../../config'
const Option = Select.Option
const RadioGroup = Radio.Group;
const selectStyle={
  width:'100%'
}
const FormItem = Form.Item

const CreateHomeworkPage = React.createClass({
  componentDidMount(){
    const {setFieldsValue} = this.props.form
    fetch(config.api.courseCenter.getDistinctSubject,{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      //获取学科列表
      this.setState({
        subjectList:fromJS(res),
      })
      setFieldsValue({
        subjectOption:res[0]['subject_id']
      })

      //根据学科获取年级列表,获取版本列表
      let subjectId = res[0]['subject_id']
      return Promise.all([
        fetch(config.api.grade.getBySubject.get(res[0]['subject_id']),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json()),
        fetch(config.api.select.json.get('','','','JKS',''),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json())
      ]).then(res => {
        //获取年级列表
        this.setState({
          gradeList:fromJS(res[0]),
          versionList:fromJS(res[1]),
        })
        setFieldsValue({
          gradeOption:res[0][0].gradeId,
          versionOption:res[1][0].id
        })
        return {
          gradeId:res[0][0].gradeId,
          versionId:res[1][0].id,
          subjectId,
        }
      })
    }).then(result => {
      const {subjectId,gradeId,versionId} = result
      //根据subjectId，gradeId获取章节列表
      fetch(config.api.textbook.getUnitBySubjectAndGrade(subjectId,gradeId),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => {
        //获取章节列表
        this.setState({
          charpterList:fromJS(res),
        })
        setFieldsValue({
          charpterOption:res[0],
        })
        //根绝章节获取响应的课程
        fetch(config.api.textbook.getTextBookByCondition(subjectId,gradeId,versionId,'上学期',res[0]),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json()).then(res =>{
          this.setState({
            courseList:fromJS(res),
            // courseOption:''
          })
          setFieldsValue({
            courseOption:'',
            termOption:'上学期',
            homeworkName:'',
          })
        })
        //获取试卷列表
        fetch(config.api.exampaper.showExamSelectList(subjectId,gradeId,'上学期'),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json()).then(res => {
          this.setState({
            testpaperList:fromJS(res)
          })
        })
        //获取答题卡列表
        fetch(config.api.answersheet.getAll,{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json()).then(res => {
          this.setState({
            answersheetList:fromJS(res)
          })
        })
      })
    })
  },
  getInitialState(){
    return {
      subjectList:List(),
      termList:fromJS([{id:'上学期',text:'上学期'},{id:'下学期',text:'下学期'}]),
      gradeList:List(),
      versionList:List(),
      charpterList:List(),
      courseList:List(),
      testpaperList:List(),
      answersheetList:List(),

      homeworkName:'',
      demand:'',
      homeworkType:1,

    }
  },
  handleChangeSubject(value){
    const {getFieldsValue,setFieldsValue} = this.props.form
    const {subjectOption,termOption,versionOption} = getFieldsValue(['subjectOption','termOption','versionOption'])
    console.log("--->:",subjectOption,termOption,versionOption)
    //根据学科获取年级列表
    fetch(config.api.grade.getBySubject.get(subjectOption),{
      method:'get',
      headers:{
        'from':'nodejs',
        'token':sessionStorage.getItem('accessToken')
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        gradeList:fromJS(res)
      })
      setFieldsValue({
        gradeOption:res[0].gradeId
      })

      let gradeOption = res[0].gradeId
      //获取章节列表
      fetch(config.api.textbook.getUnitBySubjectAndGrade(subjectOption,gradeOption),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()).then(res => {
        this.setState({
          charpterList:fromJS(res)
        })
        setFieldsValue({
          charpterOption:res[0]
        })
        let charpterOption = res[0]
        //获取课程列表
        fetch(config.api.textbook.getTextBookByCondition(subjectOption,gradeOption,versionOption,termOption,charpterOption),{
          method:'get',
          headers:{
            'from':'nodejs',
            'token':sessionStorage.getItem('accessToken')
          }
        }).then(res => res.json()).then(res => {
          this.setState({
            courseList:fromJS(res)
          })
          setFieldsValue({
            courseOption:''
          })
          //获取电子试卷
          fetch(config.api.exampaper.showExamSelectList(subjectOption,gradeOption,termOption),{
            method:'get',
            headers:{
              'from':'nodejs',
              'token':sessionStorage.getItem('accessToken')
            }
          }).then(res => res.json()).then(res => {
            this.setState({
              testpaperList:fromJS(res)
            })
          })
          //获取答题卡
          fetch(config.api.answersheet.getAll,{
            method:'get',
            headers:{
              'from':'nodejs',
              'token':sessionStorage.getItem('accessToken')
            }
          }).then(res => res.json()).then(res => {
            this.setState({
              answersheetList:fromJS(res)
            })
          })
        })
      })
    })
  },
  onChangeHomeworkType(e){
    this.setState({
      homeworkType: e.target.value,
    });
  },
  render(){
    const {getFieldDecorator} = this.props.form
    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <Form>
          <Row type='flex' gutter={8}>
            <Col span={8} style={{borderRight:'1px solid #cccccc'}}>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>学科</span>
                <FormItem>
                {getFieldDecorator('subjectOption', {
                  rules: [{ required: true, message: '请选择学科' }],
                })(
                  <Select style={selectStyle} onChange={this.handleChangeSubject}>
                  {
                    this.state.subjectList.map((v,k) => (
                      <Option value={v.get('subject_id')} key={k} title={v.get('subject_name')}>{v.get('subject_name')}</Option>
                    ))
                  }
                  </Select>
                )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>年级</span>
                <FormItem>
                {getFieldDecorator('gradeOption', {
                  rules: [{ required: true, message: '请选择年级' }],
                })(
                  <Select style={selectStyle}>
                  {
                    this.state.gradeList.map((v,k) => (
                      <Option value={v.get('gradeId')} key={k} title={v.get('gradeName')}>{v.get('gradeName')}</Option>
                    ))
                  }
                  </Select>
                )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>学期</span>
                <FormItem>
                {getFieldDecorator('termOption', {
                  rules: [{ required: true, message: '请选择学期' }],
                })(
                  <Select style={selectStyle}>
                  {
                    this.state.termList.map((v,k) => (
                      <Option value={v.get('id')} key={k} title={v.get('text')}>{v.get('text')}</Option>
                    ))
                  }
                  </Select>
                )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>名称</span>
                <FormItem>
                {getFieldDecorator('homeworkName', {
                  rules: [{ required: true, message: '请填写名字' },{max:30,message:'输入不超过30个字'}],
                })(
                  <Input placeholder='输入不超过30个字'/>
                )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>版本</span>
                <FormItem>
                {getFieldDecorator('versionOption', {
                  rules: [{ required: true, message: '请选择版本' }],
                })(
                  <Select style={selectStyle}>
                  {
                    this.state.versionList.map((v,k) => (
                      <Option value={v.get('id')} key={k} title={v.get('text')}>{v.get('text')}</Option>
                    ))
                  }

                  </Select>
                )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>章节</span>
                <FormItem>
                {getFieldDecorator('charpterOption', {
                  rules: [{ required: true, message: '请选择章节' }],
                })(
                  <Select style={selectStyle}>
                  {
                    this.state.charpterList.map((v,k) => (
                      <Option value={k.toString()} key={k} title={v}>{v}</Option>
                    ))
                  }
                  </Select>
                )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>课程</span>
                <FormItem>
                {getFieldDecorator('courseOption', {
                  rules: [{ required: true, message: '请选择课程' }],
                })(
                  <Select style={selectStyle}>
                  {
                    this.state.courseList.map((v,k) => (
                      <Option value={k.toString()} key={k} title={v.get('course')}>{v.get('course')}</Option>
                    ))
                  }
                  </Select>
                )}
                </FormItem>
              </div>
            </Col>
            <Col span={8} style={{borderRight:'1px solid #cccccc'}}>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>要求</span>
                <FormItem>
                {getFieldDecorator('demand', {
                  rules: [{ required: true, message: '请填写要求' },{max:200,message:'输入不超过200个字'}],
                })(
                  <Input type='textarea' placeholder='输入不超过200个字' rows={10}/>
                )}
                </FormItem>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>作业类型</span>
                <div>
                  <RadioGroup onChange={this.onChangeHomeworkType} value={this.state.homeworkType}>
                    <Radio value={1}>电子试卷</Radio>
                    <Radio value={0}>答题卡</Radio>
                  </RadioGroup>
                </div>
                <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Select style={selectStyle} placeholder={this.state.homeworkType?'选择电子试卷':'选择答题卡'}>
                  {
                    this.state.homeworkType?this.state.testpaperList.map((v,k) => (
                      <Option  value={v.get('examPaperId')} key={k} title={v.get('examPaperName')}>{v.get('examPaperName')}</Option>
                    )):this.state.answersheetList.map((v,k) => (
                      <Option value={v.get('answersheet_id')} key={k} title={v.get('answersheet_name')}>{v.get('answersheet_name')}</Option>
                    ))
                  }
                  </Select>
                )}
                </FormItem>
              </div>
            </Col>
          </Row>
          </Form>
        </div>
      </div>
    )
  }
})

export default Form.create()(CreateHomeworkPage)
