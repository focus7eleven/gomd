import React from 'react'

const mockData = {
    "id": "241101622128807936",
    "questionNo": 4,
    "examination": "",
    "parentId": "",
    "comment": "",
    "drawZone": null,
    "description": "",
    "difficulty": 0,
    "score": 1.0,
    "kind": "02",
    "mustanswer": true,
    "audioName": null,
    "videoName": null,
    "pdfName": null,
    "haveAudio": false,
    "haveVideo": false,
    "havePdf": false,
    "questionIndex": null,
    "updateDate": null,
    "creatorUserId": "031218647663209576",
    "ownerId": "031218647663209576",
    "subQuestion": "",
    "abilityId": null,
    "examinationPaperId": "241101416805044224",
    "optionPojoList": [{
        "id": "241101622195916800",
        "questionId": "241101622128807936",
        "content": "正确",
        "score": 0.0,
        "answer": false
    }, {
        "id": "241101622195916801",
        "questionId": "241101622128807936",
        "content": "错误",
        "score": 0.0,
        "answer": false
    }],
    "importDate": null,
    "select": false,
    "draft": false,
    "public": false
}
const JudgeQuestion = React.createClass({
  getDefaultProps(){
    return {
      questionInfo:fromJS(mockData)
    }
  },
  getInitialState(){
    answerList:this.props.questionInfo.get('optionPojoList')
  },
  getTableData(){
    const tableHeader = [{
      title:this.props.questionInfo.get('questionNo'),
      key:'num',
      className:styles.columns,
      width:50,
      render:(text,record)=>{
        return <div onClick={(e)=>{e.stopPropagation()}}><Radio checked={this.state.radioCheck==record.key} onClick={this.handleSetRightAnswer.bind(this,record.key)}></Radio></div>
      }
    },{
      title:this.renderQuestion(),
      dataIndex:'answer',
      key:'answer',
      render:(text,record) => (
        <div className={styles.question} onClick={()=>{}}>
        {
          this.state.editingAnswerItem[record.key]?<Ueditor onDestory={this.handleUpdateOption.bind(this,record.key)}/>:<span >{text||'输入选项内容'}</span>
        }
        {this.state.showScoreSetting?<div onClick={(e)=>{e.stopPropagation()}}><InputNumber min={0} defaultValue={0}
          value={this.state.answerList.getIn([record.key,'score'])}
          onChange={this.handleChangeScore.bind(this,record.key)}/></div>:null}
        </div>
      )
    },{
      title:<Icon type='close' onClick={this.props.destroy}/>,
      className:styles.columns,
      width:50,
      render:(text,record)=>{
        return <Icon type='close' onClick={this.handleDeleteAnswerItem.bind(this,record.key)}/>
      }
    }]
    const tableBody = this.state.answerList.map((v,k) => ({
      answer:v.get('content'),
      key:k,
    })).toJS()
    return {
      tableHeader,
      tableBody,
    }
  },
  render(){
    const tableData = this.getTableData()
    return (
      <div className={styles.multipleChoiceQuestion} >
        <div className={styles.tag}>
          <span className={styles.text}>{this.props.questionInfo.get('kind')=='01'?'单选题':'多选题'}</span>
        </div>
        <Table onRowClick={(record,index)=>{console.log("asdfasd");this.setState({
          editingAnswerItem:this.state.editingAnswerItem.map((v,k) => k==record.key?!v:v)})}} bordered dataSource={tableData.tableBody} columns={tableData.tableHeader} pagination={false}/>
        <div className={styles.moveButton}>
          <div>
          </div>
        </div>
        {
          this.state.showFooter?this.renderFooter():null
        }
      </div>
    )
  }
})
