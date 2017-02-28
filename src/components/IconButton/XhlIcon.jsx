import React from 'react';
import classNames from 'classnames';

import styles from './XhlIcon.scss';

export const XhlIcon = React.createClass({
    propTypes : {
        type: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
    },
    render() {
        const { type,className,children } = this.props;
        const classes = classNames("xhlicon","xhlicon-"+type,className);
        return (
            <i className={classes}>{children?children:null}</i>
        );
    }
});