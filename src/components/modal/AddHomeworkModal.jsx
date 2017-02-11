import React from 'react'
import {Modal,Row,Col,Select,Input,Form,Table,DatePicker} from 'antd'
import config from '../../config'
import {List,fromJS} from 'immutable'
import styles from './AddHomeworkModal.scss'
const Option = Select.Option
const FormItem = Form.Item
const Search = Input.Search
const RangePicker = DatePicker.RangePicker

const AddHomeworkModal = React.createClass({
  getDefaultProps(){
    return {
      onSubmit:()=>{},
      onCancel:()=>{},
      currentSubject:'',
    }
  },
  getInitialState(){
    return {
      homeworkList:List(),
      subjectList:List(),
      versionList:List(),
    }
  },
  componentDidMount(){
    Promise.all([
      fetch(config.api.homework.course.existHomework(this.props.currentSubject),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()),
    ]).then(result => {
      this.setState({
        homeworkList: fromJS(result[0])
      })
    }).catch(error => {

    })
  },
  onChangeTimeRange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    Promise.all([
      fetch(config.api.homework.course.searchHomework(this.props.currentSubject,dateStrings[0],dateStrings[1]),{
        method:'get',
        headers:{
          'from':'nodejs',
          'token':sessionStorage.getItem('accessToken')
        }
      }).then(res => res.json()),
    ]).then(result => {
      this.setState({
        homeworkList: fromJS(result[0])
      })
    }).catch(error => {

    })
  },
  getTableData(){
    return this.state.homeworkList.isEmpty()?[]:this.state.homeworkList.get('result').map((v,k) => v.set('key',v.get('homework_id')).set('num',k)).toJS()
  },
  render(){
    const microClassTypeList =fromJS([{id:'1',text:'公共微课'},{id:'2',text:'学校微课'},{id:'3',text:'个人微课'}])
    const termList = fromJS([{id:'1',text:'上学期'},{id:'2',text:'下学期'}])
    const {getFieldDecorator} = this.props.form
    const tableData = this.getTableData()
    const tableColumn = [{
      title:'序号',
      dataIndex:'num',
      key:'num',
    },{
      title:'布置日期',
      dataIndex:'create_dt',
      key:'create_dt',
    },{
      title:'作业名称',
      dataIndex:'homework_name',
      key:'homework_name',
    },{
      title:'班级群组',
      dataIndex:'target_name',
      key:'target_name',
    },{
      title:'创建人',
      dataIndex:'create_user_name',
      key:'create_user_name',
    },{
      title:'完成期限',
      dataIndex:'finish_time',
      key:'finish_time'
    },{
      title:'学科',
      dataIndex:'subject',
      key:'subject'
    }]
    return (
      <Modal title="添加微课" visible={true} onOk={()=>{this.props.onSubmit(this.state.selectedHomeworks)}} onCancel={this.props.onCancel} width={850}>
        <div>
          <div className={styles.filters}>
            <Form>
              <Row gutter={8}>
                <Col span={10}>
                  <FormItem>
                  {getFieldDecorator('timerange',{
                    rules:[{required:true,message:'输入时间'}]
                  })(
                  <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onChange={this.onChangeTimeRange}
                  />
                  )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <Search size="large"
                    placeholder="输入搜索条件"
                    onSearch={value => console.log(value)}
                  />
                </Col>
                <Col span={6}>
                  <div className={styles.homeworkSum}><span>共{this.state.homeworkList.get('result').size}条作业</span></div>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.table}>
          <Table rowSelection={{
            onChange:(selectedRowKeys,selectedRows)=>{
              let selectedHomeworks = selectedRowKeys.reduce((pre,cur)=>{
                return pre.push(this.state.homeworkList.get('result').find(v => v.get('homework_id')==cur).set('type','homework'))
              },List())
              this.setState({
                selectedHomeworks:selectedHomeworks
              })
            }
          }} columns={tableColumn} dataSource ={tableData}/>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Form.create()(AddHomeworkModal)
