import React from 'react';
import {Button} from 'antd';

import {httpFetchGetBlob} from '../../utils/http-utils';
import styles from './XhlDownloadButton.scss';

export const XhlDownloadButton = React.createClass({
    propTypes: {
        url:React.PropTypes.string.isRequired,
        filename:React.PropTypes.string.isRequired,
        className:React.PropTypes.string,
    },
    getInitialState() {
        return {
            blobUrl:"",
        }
    },
    render() {
        const {filename,children,className,url,...others} = this.props;
        const {blobUrl} = this.state;

        return (
            <div className={styles.container}>
                <Button className={className} {...others}
                    onClick={()=>{this.handleDownload(url)}}
                >{children?children:null}</Button>
                <a className={styles.hideA}
                    ref="downloadRef" href={blobUrl} download={filename}></a>
            </div>
        );
    },
    handleDownload(url) {
        httpFetchGetBlob(url,{})
            .then(blobData => {
                let url = window.URL.createObjectURL(blobData);
                this.setState({
                    blobUrl:url
                },() => {
                    this.refs.downloadRef.click();
                })
            })
            .catch(()=>{})
    }
});