import React from 'react'
import {connect} from 'react-redux'
import {getTableData} from '../../actions/homework_action/main'
const TeachingPlanContainer = React.createClass({
    componentDidMount(){
    },

    componentWillReceiveProps(nextProps){

    },

    render(){
        return this.props.children
    }
})
function mapStateToProps(state){
    return{
    }
}

function mapDispatchToProps(dispatch){
    return {
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeachingPlanContainer)