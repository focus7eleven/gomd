/**
 * Created by wuyq on 2017/1/24.
 */
import React from 'react'
import {Table, Select, Input} from 'antd'
import {List, Map} from 'immutable';

import styles from './CustomTable.scss'
import {httpFetchGet} from '../../utils/http-utils';

const Option = Select.Option;
const Search = Input.Search;

export const CustomTable = React.createClass({
    propTypes:{
        columns:React.PropTypes.array.isRequired,
        showIndex:React.PropTypes.bool,
        pageUrl:React.PropTypes.string.isRequired,
        filters:React.PropTypes.array,
    },
    getInitialState() {
        return {
            loading: false,

            currentPage: 1,
            pageShow: 10,
            filters: {},

            totalCount: 0,
            pageSize: 0,
            nowPage: 0,
            start: 0,
            result: []
        }
    },
    getDefaultProps() {
        return {
            showIndex:true,
            filters:[],
        }
    },
    componentDidMount() {
        if (this.state.result.length == 0) {
            const {filters} = this.props;
            this.setState(
                {filters: Object.assign(this.state.filters, this.getDefaultFilters(filters))},
                () => {
                    this.searchTableData();
                }
            );

        }
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.pageUrl != nextProps.pageUrl || nextProps.additionalParam != this.props.additionalParam ) {
            //url不一样了，需要重新获取数据
            this.setState(
                {filters: this.getDefaultFilters(nextProps.filters), currentPage: 1, result: []},
                () => {
                    const param = Map(this.state.filters).concat({
                        currentPage: 1,
                        pageShow: this.state.pageShow
                    }).toObject();
                    this.searchTableData2(nextProps.pageUrl, param);
                }
            );
        } else if (this.needUpdateFilter(this.props.filters, nextProps.filters)) {
            this.setState(
                {filters: Object.assign(this.state.filters, this.getDefaultFilters(nextProps.filters))},
                () => {
                    this.searchTableData();
                }
            );
        }
    },
    getDefaultFilters(filters) {
        let obj = {};
        if (filters) {
            filters.forEach(
                (filter) => {
                    if (filter.defaultValue) {
                        obj[filter.key] = filter.defaultValue;
                    }
                }
            );
        }
        return obj;
    },
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
                        {showAction ? <div></div> : <div></div>}
                        {showFilter ? <div className={styles.filterItems}>
                                {
                                    filters.map((filter) => {
                                        if (filter.type == "select") {
                                            return <Select key={filter.key} value={this.state.filters[filter.key] || ""}
                                                           className={styles.filterSelect}
                                                           onChange={(value) => this.handleFilterChange(filter.key, value)}>
                                                <Option value="">{filter.placeholder}</Option>
                                                {
                                                    filter.options.map((option) => {
                                                        return <Option value={option.key}
                                                                       key={option.key}>{option.value}</Option>
                                                    })
                                                }
                                            </Select>;
                                        } else if (filter.type == "input") {
                                            return <span className={styles.filterInput} key="searchSpan"><Search
                                                key={filter.key}
                                                placeholder={filter.placeholder}
                                                onSearch={(value) => this.handleFilterChange(filter.key, value)}></Search></span>;
                                        }
                                    })
                                }
                            </div> : <div></div>}
                    </div> : ""

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
    },
    handlePageChanged(page) {
        this.setState(
            {currentPage: page},
            () => this.searchTableData()
        );
    },
    handlePageSizeChanged(size) {
        this.setState(
            {pageShow: size},
            () => this.searchTableData()
        );
    },
    handleFilterChange(key, value) {
        let obj = {};
        obj[key] = value;
        let filters = Map(this.state.filters).merge(obj).toObject();
        this.setState(
            {filters: filters},
            () => {
                const param = Map(filters).concat({
                    currentPage: 1,
                    pageShow: this.state.pageShow
                }).toObject();
                this.searchTableData2(this.props.pageUrl, param);
            });

    },
    searchTableData() {
        const param = Map(this.state.filters).concat({
            currentPage: this.state.currentPage,
            pageShow: this.state.pageShow
        }).toObject();
        this.searchTableData2(this.props.pageUrl, param);
    },
    searchTableData2(pageUrl, param) {
        //const url = pageUrl + "?" + getUrlParams(param);
        this.setState({loading: true});

        const additionalParam = this.props.additionalParam ? this.props.additionalParam : {};
        const lastParam = Object.assign(param, additionalParam);

        httpFetchGet(pageUrl, lastParam)
            .then(pageResult => {
                this.setState({
                    loading: false,
                    result: pageResult.result,
                    totalCount: pageResult.totalCount,
                    pageSize: pageResult.pageShow,
                    nowPage: pageResult.nowPage,
                    start: pageResult.start,
                });
            }).catch(
            () => {
                this.setState({
                    loading: false,
                })
            }
        )
    },
    refreshTableData() {
        this.searchTableData();
    },
    needUpdateFilter(filter1, filter2) {
        if( filter1.length != filter2.length ) {
            return true;
        }
        let result = false;
        filter1.forEach(
            (v,i) => {
                if( v.key != filter2[i].key || v.defaultValue != filter2[i].defaultValue ) {
                    result = true;
                }
            }
        )

        return result;
    }
});
