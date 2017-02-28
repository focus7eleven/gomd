import React,{PropTypes} from 'react'
import styles from './CreateHomework.scss'
import {Row,Col,Select,Icon,Input,Radio,Form,Upload,Button,Table,Modal,notification} from 'antd'
import {fromJS,List,Map} from 'immutable'
import {FileInput} from '../../components/file_upload/FileInput'
import config from '../../config'
import menuRoutePath from '../../routeConfig';
const Option = Select.Option
const RadioGroup = Radio.Group;
const selectStyle={
  width:'100%'
}
const FormItem = Form.Item

const AnswersheetQuestion = React.createClass({
    propTypes:{
        onChange: PropTypes.func.isRequired,
    },
    getDefaultProps(){
        return{
            questions: [],
            type:'create',
        }
    },
    getInitialState () {
      return {
          localQuestions:[],
          answerFiles:List()
      }
    },
    componentWillReceiveProps(nextProps){
      console.log("componentWillReceiveProps") ;
      if (nextProps.type == 'create') {
          let tmpQuestions = nextProps.questions.map((question) => {
              var questionType = question.question_type;
              var num = question.question_num;
              let answers = [];

              if (questionType == "xuanze" || questionType == "panduan" || questionType == "duoxuan") {
                  for (let i = 0; i < num; i++) {
                      answers.push(0);
                  }
              } else {
                  // for (let i = 0; i < num;i++){
                  //     answers.push(0);
                  // }
              }
              return {
                  ...question,
                  answers,

              };
          })
          nextProps.onChange(tmpQuestions, this.state.answerFiles);
          this.setState({
              localQuestions: tmpQuestions
          })
      }else {
          nextProps.onChange(nextProps.questions, this.state.answerFiles);
          let nfileList = List();
          nextProps.questions.map(question=>{

              if (question.question_type == "xuanze" ||question.question_type == "duoxuan"||question.question_type == "panduan" ){

              }else {

                  if (question.answers && question.answers.length > 0){
                      nfileList = fromJS(question.answers.map(attach =>{
                          return{
                              name:attach,
                          }
                      }))
                  }
              }
          })
          this.setState({
              localQuestions: nextProps.questions,
              answerFiles:nfileList,
          })
      }
    },
    componentWillMount(){
      console.log("will");
        if (this.props.type == 'create') {
            let tmpQuestions = this.props.questions.map((question) => {
                var questionType = question.question_type;
                var num = question.question_num;
                let answers = [];

                if (questionType == "xuanze" || questionType == "panduan" || questionType == "duoxuan") {
                    for (let i = 0; i < num; i++) {
                        answers.push(0);
                    }
                } else {
                    // for (let i = 0; i < num;i++){
                    //     answers.push(0);
                    // }
                }
                return {
                    ...question,
                    answers,

                };
            })
            this.props.onChange(tmpQuestions, this.state.answerFiles);
            this.setState({
                localQuestions: tmpQuestions
            })
        }else {
            this.props.onChange(this.props.questions, this.state.answerFiles);
            let nfileList = List();
            this.props.questions.map(question=>{
                if (question.question_type == "xuanze" ||question.question_type == "duoxuan"||question.question_type == "panduan" ){

                }else {

                    if (question.answers && question.answers.length > 0){
                        nfileList = fromJS(question.answers.map(attach =>{
                            return{
                                name:attach,
                            }
                        }))
                    }
                }
            })
            this.setState({
                localQuestions: this.props.questions,
                answerFiles:nfileList,
            })
        }

    },


    handleRemoveFile(index){
        this.setState({
            answerFiles:this.state.answerFiles.remove(index)
        })
        this.props.onChange(this.state.localQuestions,this.state.answerFiles);

    },
    handleUploadChange(event){
        const files = event.target.files;
        let fileList = this.state.answerFiles;

        if( files && files.length > 0 ) {
            for( let i = 0; i < files.length; i++ ) {
                fileList = fileList.filter((file) => {
                    return file.name != files[i].name;
                });
                fileList = fileList.concat(files[i]);
                //fileList = fileList.set(files[i].name, files[i]);
            }
        }
        this.props.onChange(this.state.localQuestions,fileList);
        this.setState({
            answerFiles:fileList
        });
    },
    handleOptionBtnClick(question,questionIndex,answerIndex,answer){
        let tmp = this.state.localQuestions;
        var questionType = question.question_type;
        if (questionType == "duoxuan"){
            var oldAnswer = tmp[questionIndex].answers[answerIndex];
            if ((oldAnswer & answer) == answer){
                tmp[questionIndex].answers[answerIndex] = oldAnswer ^ answer;
            }else {
                tmp[questionIndex].answers[answerIndex] = oldAnswer | answer;
            }
        }else {
            tmp[questionIndex].answers[answerIndex] = answer;
        }
        this.props.onChange(tmp,this.state.answerFiles);

        this.setState({
            localQuestions:tmp
        })
    },

    render(){
        var ol = [];
        var olStyle = {
            listStyleType: "decimal",
            paddingLeft: "25px"
        };

        var hasSubject = false;
        this.state.localQuestions.forEach((question, index) =>{
            var title = question.question_title;
            var optionType = question.option_type;
            var questionType = question.question_type;
            var rows = [];

            //rows.push(<ol>);
            if (questionType == "xuanze" || questionType == "panduan" || questionType == "duoxuan") {
                var anwserText = [];
                var en_zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
                var shuzi = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
                var dui_cuo = ["对", "错", "", "", "", "", "", "", ""];
                var t_f = ["T", "F", "", "", "", "", "", "", ""];
                var gou_cha = ["√", "×", "", "", "", "", "", "", ""];
                if (optionType == "en_zimu"){
                    anwserText = en_zimu;
                }
                else if (optionType == "shuzi") {
                    anwserText = shuzi;
                }
                else if (optionType == "dui_cuo") {
                    anwserText = dui_cuo;
                }
                else if (optionType == "t_f") {
                    anwserText = t_f;
                }
                else if (optionType == "gou_cha") {
                    anwserText = gou_cha;
                } else {
                    anwserText = [];
                }

                var num = question.option_num;

                for (let i = 0; i < question.question_num ; i++){
                    var answer = question.answers[i];
                    rows.push(
                        <li style={{marginTop:"10px"}}>
                            { num > 0 && <Button type={((answer & 0x01) == 0x01)?"primary":""} style={{marginLeft:"10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x01)} >{anwserText[0]}</Button> }
                            { num > 1 && <Button type={((answer & 0x02) == 0x02)?"primary":""} style={{marginLeft:"10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x02)}>{anwserText[1]}</Button> }
                            { num > 2 && <Button type={((answer & 0x04) == 0x04)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x04)}>{anwserText[2]}</Button> }
                            { num > 3 && <Button type={((answer & 0x08) == 0x08)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x08)}>{anwserText[3]}</Button> }
                            { num > 4 && <Button type={((answer & 0x10) == 0x10)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x10)}>{anwserText[4]}</Button> }
                            { num > 5 && <Button type={((answer & 0x20) == 0x20)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x20)}>{anwserText[5]}</Button> }
                            { num > 6 && <Button type={((answer & 0x40) == 0x40)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x40)}>{anwserText[6]}</Button> }
                            { num > 7 && <Button type={((answer & 0x80) == 0x80)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x80)}>{anwserText[7]}</Button> }
                            { num > 8 && <Button type={((answer & 0x100) == 0x100)?"primary":""} style={{marginLeft: "10px"}}
                                                 onClick={this.handleOptionBtnClick.bind(this,question,index,i,0x100)}>{anwserText[8]}</Button> }

                        </li>

                    );
                }
                // question.answers.forEach(function(anwser){
                //
                // })
                ol.push(<p style={{marginTop:"10px"}}>{title}</p>);
                ol.push(<ol style={olStyle}>{rows}</ol>);
            }else {
                hasSubject = true;
            }
        });

        return (
            <div >
                {ol}
                <div style={{marginTop:'10px'}}>
                <Button type="primary"  style={(hasSubject?{}:{display:'none'})} onClick={this.handleUploadBtnClick}>上传答案</Button>
                <input type="file" multiple="multiple" style={{display:'none'}} ref="uploadInput" onChange={(e)=>this.handleUploadChange(e)}  />
                <div>
                    { this.state.answerFiles.size > 0 ?
                        this.state.answerFiles.toJS().map((file,index)=>{
                            return (<div key={index}>{index+1}.<span style={{fontSize:'14px'}}>{file.name}</span><Icon onClick={() => this.handleRemoveFile(index)}type="close-circle" style={{float:'right',textAlign:'center'}}/></div>)
                        }):""}

                </div>
            </div>
            </div>
        );
    },
    handleUploadBtnClick(){
        this.refs.uploadInput.click();
    },


})

const CreateOrEditHomeworkPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentWillMount(){
        console.log("componentWillMount:"+this.props.params.type);
      this.setState({
          type:this.props.params.type
      });

    },

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
          //获取作业详情
          if (this.props.params.type == 'edit'){
              console.log('homeworkId='+this.props.params.homeworkId)
              this.getHomeworkDetail(this.props.params.homeworkId);
          }

      })
    })
  },
    getHomeworkDetail(homeworkId){
        fetch(config.api.homework.getHomeworkDetail2(homeworkId),{
            method:'get',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken')
            }
        }).then(res =>res.json()).then(res =>{
            console.log("homework:"+res);
            let type = res.homeworkKind;
            if (type == 2){
                type = 0;
            }
            let nfileList = List();
            if (res.attachments && res.attachments.length > 0){
                nfileList = fromJS(res.attachments.map(attach =>{
                    return{
                        name:attach,
                    }
                }))
            }
            this.setState({
                subjectId:res.subject_id,
                gradeId:res.gradeId,
                term:res.term,
                version:res.textbook_version_id,
                textbookUnit:res.textbook_unit,
                textbookCourse:res.textbook_menu_id,
                fileList:nfileList,
                homeworkDesc:res.homework_desc,
                homeworkType:type,
                homeworkName:res.homework_name,
                examePaperId:res.examPaperId,
                answerSheetId:res.answersheet_id,
                homeworkId:res.homework_id,

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
        //附件
        fileList:List(),

      homeworkName:'',
        //描述
      demand:'',
      homeworkType:1,
        examePaperId:'',
        modalVisiability:false,
        answerSheetId:'',
        answersheetQuestions:[],
        subjectAnswerFiles:List(),
        type:'',

        //for edit
        subjectId:'',
        gradeId:'',
        term:'',
        version:"",
        textbookUnit:"",
        textbookCourse:"",
        homeworkKind:1,
        homeworkDesc:'',
        homeworkId:'',
        deleteAttachFile:[],


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

    handleCreateFormData:function(isSchool){

        console.log("create begin");
        const {getFieldsValue,getFieldValue,getFieldError,validateFields} = this.props.form
        const homeworkType = this.state.homeworkType;
        const fileList = this.state.fileList.toJS();
        const subjectFiles = this.state.subjectAnswerFiles.toJS();
        const answersheetQuestions = this.state.answersheetQuestions;
        const paperId = this.state.examePaperId;

        if (!homeworkType){
            if (!this.state.answersheetQuestions || this.state.answersheetQuestions.length <= 0){
                notification.open({
                    message:"错误提示",
                    description:"请设置正确答案！"
                })
                return;
            }
        }
        validateFields((err,values) => {
            let formData = new FormData()
            formData.append("type", homeworkType);
            formData.append("homeworkDesc", values.demand);
            formData.append("homeworkName", values.homework_name);
            formData.append("subjectId", values.subjectOption);
            formData.append("gradeId", values.gradeOption);
            formData.append("textbookTerm", values.termOption);
            formData.append("textbookVersion", values.versionOption);
            formData.append("textbookUnit", values.charpterOption);
            formData.append("textbookId", values.courseOption);
            // formData.append("attach",fileList[0].fileUrl);
            if (fileList && fileList.length > 0) {
                for (let i = 0; i < fileList.length; i++) {
                    formData.append("attach", fileList[i]);
                }
            }
            if (!homeworkType) {
                let answersheetObjectiveAnswer = [];
                answersheetQuestions.map((question, index) => {
                    answersheetObjectiveAnswer.push({
                        questinoId: question.answersheet_question_id,
                        answer: question.answers,
                    })
                })
                formData.append("answersheetObjectiveAnswer", JSON.stringify(answersheetObjectiveAnswer));
                if (subjectFiles && subjectFiles.length > 0) {
                    for (let i = 0; i < subjectFiles.length; i++) {
                        formData.append("answersheetSubjectiveAnswer", subjectFiles[i]);
                    }
                }


            }
            formData.append("homeworkKind", this.state.homeworkType);
            if (homeworkType) {
                formData.append("examPaperId", paperId);
            }
            var url = config.api.homework.teaCreateHomeworkUrl;
            if (this.state.type == 'edit') {
                url = config.api.homework.teaEditHomeworkUrl;
                formData.append("homeworkId",this.state.homeworkId);
                formData.append("deleteAttach",this.state.deleteAttachFile);
            } else{
                formData.append("isSchool", isSchool);
            }
            fetch(url,{
              method:'post',
                headers:{
                    'from':'nodejs',
                    'token':sessionStorage.getItem('accessToken')
                },
                body:formData

            }).then(res => res.json()).then(res =>{
                if(res.title == 'Success'){
                    console.log('create success!')
                    this.context.router.push(menuRoutePath['homework_self'].path)
                }
            })
        })



    },
  onChangeHomeworkType(e){

    this.setState({
      homeworkType: e.target.value,
    });
  },
    onChange(files){
      this.setState({
        fileList:this.state.fileList.concat(files)
      })
    },

    getTableData(){
      let data = [];
      if (this.state.homeworkType){
          data =   this.state.testpaperList.map((v,k) => (
            {key:v.get('examPaperId'),name:v.get('examPaperName')}
        ));
      }else {
          data = this.state.answersheetList.map((v,k) => (
            {key:v.get('answersheet_id'),name:v.get('answersheet_name') }
        ));
      }
      return data.toJS();
    },

    getRowStyle(record){
      if (this.state.homeworkType){
          if (this.state.examePaperId == record.key){
              return styles.tableDarkRow;
          }else {
              return styles.tableLightRow;
          }
      }else {
          if (this.state.answerSheetId == record.key){
              return styles.tableDarkRow;
          }else {
              return styles.tableLightRow;
          }
      }
    },

    handleTableRowClick(recond,index){
        if(this.state.homeworkType) {
            this.setState({
                examePaperId:recond.key
            })
        }else {
            this.setState({
                answerSheetId:recond.key
            })
        }



    },
    handleSetRightAnswerClick(){
      if (this.state.answerSheetId){
        this.handleModalDisplay(true)
      }else {
          // this.handleModalDisplay(false)
      }

    },
    handleUploadChange(event){
        const files = event.target.files;
        let fileList = this.state.fileList;

        if( files && files.length > 0 ) {
          for( let i = 0; i < files.length; i++ ) {
            fileList = fileList.filter((file) => {
              return file.name != files[i].name;
            });
            fileList = fileList.concat(files[i]);
            //fileList = fileList.set(files[i].name, files[i]);
          }
        }
        this.setState({
          fileList:fileList
        });
    },
   handleRemoveFile(name,index){
        if (this.state.type == 'edit'){
            this.setState({
                fileList:this.state.fileList.remove(index),
                deleteAttachFile:this.state.deleteAttachFile.concat(name),
            })
        }else {
            this.setState({
                fileList: this.state.fileList.remove(index)
            })
        }

   },

  render(){
       console.log("homeworkname="+this.state.homeworkName);
    const {getFieldDecorator} = this.props.form;
    const columns = [{title:'答题卡名称',dataIndex:'name'}];
    const dataSource = this.getTableData();
    const footer = () => (<Button type="primary" onClick={this.handleSetRightAnswerClick}>设置标准答案</Button>);
    return (
      <div className={styles.container} >
        <div className={styles.body}>
          <div className={styles.title1}>
            <span className={styles.text1}><Icon type='file-text' />作业</span>
          </div>

          <Form >
          <Row type='flex' gutter={16} className={styles.topRow}>
            <Col span={12} className={styles.leftCol}>
              <Row type='flex' gutter={16}>
                <Col span={12}>
                  <span>学科</span>
                  <FormItem>
                      {getFieldDecorator('subjectOption', {
                          rules: [{ required: true, message: '请选择学科' }],
                          initialValue:this.state.subjectId,
                      })(
                          <Select style={selectStyle} onChange={this.handleChangeSubject} >
                              {
                                  this.state.subjectList.map((v,k) => (
                                      <Option value={v.get('subject_id')} key={k} title={v.get('subject_name')}>{v.get('subject_name')}</Option>
                                  ))
                              }
                          </Select>
                      )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <span>年级</span>
                  <FormItem>
                      {getFieldDecorator('gradeOption', {
                          rules: [{ required: true, message: '请选择年级' }],
                          initialValue:this.state.gradeId,
                      })(
                          <Select style={selectStyle} >
                              {
                                  this.state.gradeList.map((v,k) => (
                                      <Option value={v.get('gradeId')} key={k} title={v.get('gradeName')}>{v.get('gradeName')}</Option>
                                  ))
                              }
                          </Select>
                      )}
                  </FormItem>
                </Col>
              </Row>
              <Row type='flex' gutter={8}>
                <Col span={12}>
                  <span>学期</span>
                  <FormItem>
                      {getFieldDecorator('termOption', {
                          rules: [{ required: true, message: '请选择学期' }],
                          initialValue:this.state.term,
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
                </Col>
                <Col span={12}>
                  <span>版本</span>
                  <FormItem>
                      {getFieldDecorator('versionOption', {
                          rules: [{ required: true, message: '请选择版本',initialValue: this.state.version}],
                          initialValue:this.state.version,
                      })(
                          <Select style={selectStyle} >
                              {
                                  this.state.versionList.map((v,k) => (
                                      <Option value={v.get('id')} key={k} title={v.get('text')}>{v.get('text')}</Option>
                                  ))
                              }

                          </Select>
                      )}
                  </FormItem>
                </Col>
              </Row>
              <div className={styles.itemBox}>
                <span>作业名称</span>
                <FormItem>
                    {getFieldDecorator('homework_name', {
                        rules: [{ required: true, message: '请填写名字' },{max:30,message:'输入不超过30个字'}],
                        initialValue:this.state.homeworkName,
                    })(
                        <Input type='textarea' placeholder='输入不超过30个字'rows={1}/>
                    )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span>章节</span>
                <FormItem>
                    {getFieldDecorator('charpterOption', {
                        rules: [{ required: true, message: '请选择章节' }],
                        initialValue:this.state.textbookUnit,
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
                <span>课程</span>
                <FormItem>
                    {getFieldDecorator('courseOption', {
                        rules: [{ required: true, message: '请选择课程' }],
                        initialValue:this.state.textbookCourse,
                    })(
                        <Select style={selectStyle}>
                            {
                                this.state.courseList.map((v,k) => (
                                    <Option value={v.get('textbook_menu_id')} key={k} title={v.get('course')}>{v.get('course')}</Option>
                                ))
                            }
                        </Select>
                    )}
                </FormItem>
              </div>
              <div className={styles.itemBox}>
                <span>要求</span>
                <FormItem>
                    {getFieldDecorator('demand', {
                        rules: [{ required: true, message: '请填写要求' },{max:200,message:'输入不超过200个字'}],
                        initialValue:this.state.homeworkDesc,
                    })(
                        <Input type='textarea'  placeholder='输入不超过200个字' rows={5}/>
                    )}
                </FormItem>
              </div>
              <div className={styles.inputContainer}>
                <Button type="primary">上传作业附件</Button>
                <Input type="file" multiple="multiple" onChange={this.handleUploadChange} />
              </div>
              <div>
                  { this.state.fileList.size > 0 ?
                      this.state.fileList.toJS().map((file,index)=>{
                          return (<div key={index}>{index+1}.<span style={{fontSize:'14px'}}>{file.name}</span><Icon onClick={() => this.handleRemoveFile(file.name,index)}type="close-circle" style={{float:'right',textAlign:'center'}}/></div>)
                      }):""}

              </div>
            </Col>
            <Col span={12} >
              <div className={styles.itemBox}>
                <span><Icon type='appstore'/>作业类型</span>
                <div>
                  <RadioGroup onChange={this.onChangeHomeworkType} value={this.state.homeworkType}>
                    <Radio value={1}>电子试卷</Radio>
                    <Radio value={0}>答题卡</Radio>
                  </RadioGroup>
                </div>
                <Table rowClassName={(record, index) =>this.getRowStyle(record) }
                    columns={columns} dataSource={dataSource} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} onRowClick={this.handleTableRowClick}
                footer={this.state.homeworkType?'':footer}/>

              </div>
            </Col>
          </Row>
            <Row type='flex' style={{marginTop:'10px'}}>

              <Col span={24} style={{textAlign:'right'}}>
                <Button type='primary' style={this.state.type == 'edit'?{display:'none'}:{} } onClick={this.handleCreateFormData.bind(this,1)}>保存为学校作业</Button>
                <Button type='primary' style={this.state.type == 'edit'?{display:'none'}:{marginLeft:'20px'} } onClick={this.handleCreateFormData.bind(this,0)}>保存为个人作业</Button>
                  <Button type='primary' style={this.state.type == 'edit'?{marginLeft:'20px'}:{display:'none'}} onClick={this.handleCreateFormData.bind(this,1)}>保存修改</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Modal
          title='设置标准答案'
          visible={this.state.modalVisiability}
          onOk={this.handleModalDisplay.bind(this,false)}
          onCancel={this.handleModalDisplay.bind(this,false)}
          footer={[
            <Button key="submit" type='primary' size='large' onClick={()=>{this.handleSaveBtnClick()}}>确定</Button>
          ]}

        >
          <div>
            <AnswersheetQuestion  questions={this.state.answersheetQuestions} type={this.state.type} onChange={(questions,files)=>{this.handleOptionOnChange(questions,files)}}/>
          </div>
        </Modal>
      </div>
    )
  },
    handleModalDisplay(visibility){
      if (visibility){
          console.log("answerSheetId:"+this.state.answerSheetId);
        fetch(config.api.answersheet.getQuestions(this.state.answerSheetId),{
          method:'GET',
            headers:{
                'from':'nodejs',
                'token':sessionStorage.getItem('accessToken'),
            }

        }).then(res => res.json()).then((json)=>{
            if (this.state.type == 'edit'){
                fetch(config.api.homework.lookupAnswerSheetAnwser(this.state.answerSheetId,this.state.homeworkId),{
                    method:'GET',
                    headers:{
                    'from':'nodejs',
                        'token':sessionStorage.getItem('accessToken'),
                    }
                }).then(res => res.json()).then((key) =>{
                    key.answersheetQuestions.map(value =>{
                        let answers = value.answers;
                        let newAnswers = [];
                        answers.map(answer =>{
                            if (answer.question_type == "xuanze" ||answer.question_type == "duoxuan"||answer.question_type == "panduan" ){
                                newAnswers.push(parseInt(answer.key));

                            }else {
                                var strings = answer.key.split('/');
                                var name = strings[strings.length - 1];
                                newAnswers.push(name);
                            }
                        })
                        value.answers = newAnswers;
                    });
                    this.setState({
                        modalVisiability: true,
                        answersheetQuestions: key.answersheetQuestions
                    })

                })
            }else {
                this.setState({
                    modalVisiability: true,
                    answersheetQuestions: json
                })
            }

        })

      }else {
        this.setState({
          modalVisiability:false
        });
      }

    },

    handleSaveBtnClick(){
        let isObjectiveFinish = true;
        let isSubjectFinish = true;
        for (var i = 0; i < this.state.answersheetQuestions.length;i++){
            var question = this.state.answersheetQuestions[i];
            var questionType = question.question_type;
            var num = question.question_num;
            if (questionType == "xuanze" || questionType == "panduan" || questionType == "duoxuan"){
                for (var i = 0;i< num;i++){
                    if (question.answers[i] == 0){
                        isObjectiveFinish = false;
                        break;
                    }
                }
            }else {
                if (!this.state.subjectAnswerFiles || this.state.subjectAnswerFiles.size == 0){
                    isSubjectFinish = false;
                }
            }
            if (!isObjectiveFinish ){
                break;
            }
        }
        if (!isObjectiveFinish){
            notification.open({
                message:'错误提示',
                description:'客观题答案未设置完全！',
                placement:'bottomRight'
            });
            return;
        }
        if (!isSubjectFinish){
            notification.open({
                message:'错误提示',
                description:'主观题答案未设置！',
                placement:'bottomRight'
            });
            return;
        }
        this.setState({
            modalVisiability:false
        })


    },
    handleOptionOnChange(questions,files){
        console.log('onChange');
        this.state.subjectAnswerFiles = files;
        this.state.answersheetQuestions = questions;
    }

})

export default Form.create()(CreateOrEditHomeworkPage)
