import React, {PropTypes} from 'react'
import {Input,Button} from 'antd'
export const FileInput =  React.createClass({
    propTypes:{
        onChange: PropTypes.func.isRequired,
    },
    getInitialState(){
        return{
            multiple: true,
            btnValue: 'upload',
            className1: 'upload-button'
        };
    },

    handleChange(event){
        let target = event.target;
        let files = target.files;
        this.props.onChange(files)
    },

    render(){
        let className1 = this.state.className1;
        return (
            <div className={className1}>
                <Button type='primary'>{this.state.btnValue}</Button>
                <Input type="file" multiple={this.state.multiple} ref="fileInput" onChange={this.handleChange}
                />
            </div>
        )
    }
})