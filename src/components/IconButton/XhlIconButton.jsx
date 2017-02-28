import React from 'react';
import classNames from 'classnames';

import {XhlIcon} from './XhlIcon';
import styles from './XhlIconButton.scss';

export const XhlIconButton = React.createClass({
    propTypes : {
        icon: React.PropTypes.string.isRequired,
        onClick:React.PropTypes.func,
        className: React.PropTypes.string,
        type:React.PropTypes.string,
    },
    render() {
        const { icon,className,onClick,children,type } = this.props;

        //const kids = kids?" "+children:null;

        const classes = classNames("ant-btn",type?"ant-btn-"+type:null, "ant-btn-icon-only",className);
        return (
            <button type="button" className={classes} ref="xhlButton"
                    onClick={(e)=>onClick(e)}
                    onMouseUp={()=>this.handleMouseUp()}>
                <XhlIcon type={icon}></XhlIcon>{children?" "+children:null}
            </button>
        )
    },
    handleMouseUp() {
        this.refs.xhlButton.blur();
    }
});