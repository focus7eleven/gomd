import React from 'react';
import {Radio, Tag, Table, Checkbox} from 'antd';

import styles from './AnswerHomeworkComponent.scss';
import {QUESTION_TYPE_NAME, addHttpPrefix} from './util';

export const ChoiceQuestion = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    type: React.PropTypes.string.isRequired,
    content:React.PropTypes.string.isRequired,
    options:React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    answer:React.PropTypes.number,
    onChange:React.PropTypes.func.isRequired
  },
  getInitialState() {
    return {
    };
  },
  getDefaultProps() {
    return {
    };
  },
  render() {
    const {index, type, content, options, answer} = this.props;
    const columns = [{
      title:(index+1)+".",
      dataIndex:'index',
      className:styles.indexTd,
      render:(t, r, i) => {
        if( type == '03' ) {
          return <Checkbox value={Math.pow(2,i)} checked={(answer & Math.pow(2,i)) == Math.pow(2,i)} onChange={(e)=>this.onChange(e)}></Checkbox>
        } else {
          return <Radio value={Math.pow(2,i)} checked={Math.pow(2,i) == answer} onChange={(e)=>this.onChange(e)}></Radio>
        }
      }
    },{
      title:<span dangerouslySetInnerHTML={{__html: addHttpPrefix(content)}}></span>,
      dataIndex:'content',
      render:(t) => {
        return <span dangerouslySetInnerHTML={{__html: addHttpPrefix(t)}}></span>
      }
    }];
    const dataSource = options.map((option,i) => {
      return {"index":i, "content":option};
    });
    return (
      <div>
        <Tag className={styles.tag}>{QUESTION_TYPE_NAME[type]}</Tag>
        <Table bordered={true} columns={columns} dataSource={dataSource} pagination={false} rowKey={(record)=>record.index}></Table>
      </div>
    );
  },
  onChange(e) {
    if( this.props.type == '03' ) {
      const checked = e.target.checked;
      const value = e.target.value;
      if( checked ) {
        this.props.onChange(this.props.answer | value);
      } else {
        this.props.onChange(this.props.answer ^ value)
      }
    } else {
      this.props.onChange(e.target.value);
    }
  }
});