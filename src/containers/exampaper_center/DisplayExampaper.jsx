import React from 'react'
import {getExistExamInfo,getExampaperInfo} from '../../components/table/exampaper/exampaper-utils'
import styles from './DisplayExampaper.scss'
import {fromJS} from 'immutable'
import ChoiceQuestion from '../../components/table/exampaper/display/ChoiceQuestion'
const DisplayExampaper = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    return {
      exampaperInfo:fromJS({}),
      exerciseList:fromJS([]),
      examPaperId:'',
    }
  },
  componentDidMount(){
    getExistExamInfo(this.context.router.params.examId).then(res => {
      this.setState({
        examPaperId:this.context.router.params.examId,
        exerciseList:fromJS(res)
      })
    })
    getExampaperInfo(this.context.router.params.examId).then(res => {
      this.setState({
        exampaperInfo:fromJS(res.examPaperInfo)
      })
    })
  },
  render(){

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.exampaperName}>{this.state.exampaperInfo.get('name')}</div>
          <div>
            <span>{this.state.exampaperInfo.get('subject_name')}|</span>
            <span>{this.state.exampaperInfo.get('gradeName')}|</span>
            <span>{this.state.exampaperInfo.get('term')}|</span>
            <span>创建时间：{this.state.exampaperInfo.get('createTime')}|</span>
          </div>
        </div>
        <div className={styles.body}>
        {
          this.state.exerciseList.map((v,k)=>{
            if(v.get('kind')=='01'||v.get('kind')=='02'||v.get('kind')=='03'){
              //单选
              return <ChoiceQuestion questionInfo={v} key={k}/>
            }else if(v.get('kind')=='04'){
              //填空
              return <ChoiceQuestion questionInfo={v} key={k}/>;
            }else if(v.get('kind')=='05'||v.get('kind')=='06'||v.get('kind')=='07'){
              //简答题
              return <ChoiceQuestion questionInfo={v} key={k}/>;
            }else if(v.get('kind')=='08'){
              //title
              return null;
            }else if(v.get('kind')=='09'){
              //嵌套题
              return null;
            }else{
              return null
            }
          })
        }
        </div>
      </div>
    )
  }
})

export default DisplayExampaper
