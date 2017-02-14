/**
 * Created by wuyq on 2017/1/24.
 */
import React from 'react'
import {Table,Select,Input} from 'antd'
import {List, Map} from 'immutable';

import styles from './CustomTable.scss'
import {getUrlParams} from '../../utils/http-utils';

const Option = Select.Option;
const Search = Input.Search;

export class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,

      currentPage: 1,
      pageShow: 10,
      filters:{},

      totalCount: 0,
      pageSize: 0,
      nowPage: 0,
      start: 0,
      result: []
    };
  }

  componentDidMount() {
    if (this.state.result.length == 0) {
      this.searchTableData();
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.pageUrl != nextProps.pageUrl) {
      //url不一样了，需要重新获取数据
      this.setState(
        {filters:{},currentPage:1,result:[]},
        () => {
          const param = Map(this.state.filters).concat({
            currentPage: 1,
            pageShow: this.state.pageShow
          }).toObject();
          this.searchTableData2(nextProps.pageUrl, param);
        }
      );
    }
  }

  render() {
    let columns = List(this.props.columns);
    let filters = this.props.filters;
    let actions = this.props.actions;

    let dataSource = List(this.state.result);

    if (this.props.showIndex == true) {
      columns = columns.insert(0, {title: '序号', dataIndex: 'rowIndex', key: 'rowIndex'});
      if (dataSource.size > 0) {
        dataSource = dataSource.map((value, index) => {
          return {
            key: index,
            rowIndex: index + 1 + this.state.start,
            ...(value)
          }
        });
      }
    }
    columns = columns.map((value) => {
      if (value.className == null) {
        value.className = styles.tableColumn;
      }
      return value;
    });
    columns = columns.toJS();
    dataSource = dataSource.toJS();
    const pagination = {
      total: this.state.totalCount,
      pageSize: this.state.pageSize,
      current: this.state.nowPage,
      onChange: (page) => {
        this.handlePageChanged(page)
      },
      showQuickJumper: true,
      onShowSizeChange: (current, size) => {
        this.handlePageSizeChanged(size)
      }
    };


    const showFilter = (filters && filters.length > 0) || false;
    const showAction = (actions && actions.length > 0) || false;
    const showHeader = (showFilter || showAction);

    return (
      <div className={styles.container}>
        {showHeader ? <div className={styles.header}>
            {showAction? <div></div>: <div></div>}
            {showFilter ? <div className={styles.filterItems}>
                {
                  filters.map((filter) => {
                    if (filter.type == "select") {
                      return <Select key={filter.key} value={this.state.filters[filter.key]||""} style={{marginLeft: 10}} onChange={(value)=> this.handleSelectChange(filter.key,value)}>
                        <Option value="">{filter.placeholder}</Option>
                        {
                          filter.options.map((option) => {
                            return <Option value={option.key} key={option.key}>{option.value}</Option>
                          })
                        }
                      </Select>;
                    } else if (filter.type == "input") {
                      return <Search key={filter.key} style={{width: 260, marginLeft: 10}}
                                     placeholder={filter.placeholder}></Search>;
                    }
                  })
                }
              </div> : <div></div>}
          </div> :""

        }

        <div className={styles.wrapper}>
          <Table rowClassName={(record, index) => index % 2 ? styles.tableDarkRow : styles.tableLightRow}
                 bordered
                 columns={columns} dataSource={dataSource} loading={this.state.loading}
                 pagination={pagination}>
          </Table>
          <div className={styles.tableMsg}>
            当前条目{this.state.start + 1}-{this.state.start + this.state.pageSize}/总条目{this.state.totalCount}</div>
        </div>
      </div>
    );
  }

  handlePageChanged(page) {
    this.setState(
      {currentPage: page},
      () => this.searchTableData()
    );
  }

  handlePageSizeChanged(size) {
    this.setState(
      {pageShow: size},
      () => this.searchTableData()
    );
  }

  handleSelectChange(key,value) {
    let obj = {};
    obj[key] = value;
    let filters = Map(this.state.filters).merge(obj).toObject();
    this.setState(
      {filters:filters},
      () => {
        const param = Map(filters).concat({
          currentPage: 1,
          pageShow: this.state.pageShow
        }).toObject();
        this.searchTableData2(this.props.pageUrl, param);
      });

  }

  searchTableData() {
    const param = Map(this.state.filters).concat({
      currentPage: this.state.currentPage,
      pageShow: this.state.pageShow
    }).toObject();;
    this.searchTableData2(this.props.pageUrl, param);
  }

  searchTableData2(pageUrl, param) {
    const url = pageUrl + "?" + getUrlParams(param);
    this.setState({loading: true});
    fetch(url, {
      method: 'GET',
      headers: {
        'from': 'nodejs',
        'token': sessionStorage.getItem('accessToken'),
      }
    }).then(res => res.json()).then(pageResult => {
      this.setState({
        loading: false,
        result: pageResult.result,
        totalCount: pageResult.totalCount,
        pageSize: pageResult.pageShow,
        nowPage: pageResult.nowPage,
        start: pageResult.start,
      });
    })
  }

  refreshTableData() {
    this.searchTableData();
  }
}
