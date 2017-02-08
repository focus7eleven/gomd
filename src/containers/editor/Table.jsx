import React, {PropTypes} from 'react'
import {Entity} from 'draft-js'
import _ from 'underscore'
import styles from './Table.scss'
import {toArray,fromJS} from 'immutable'

const Table = React.createClass({
	componentWillMount(){
		this.setState({
			tableData:fromJS(this.props.blockProps.tableData)
		})
	},

	componentWillReceiveProps(nextProps){
		this.setState({
			tableData:fromJS(nextProps.blockProps.tableData)
		})
	},

	handleGridChange(row,col,e){
		const entityKey = this.props.block.getEntityAt(0)

		const tableData = fromJS(this.state.tableData).setIn([row,col],e.target.value)
		this.setState({
			tableData
		})
	},

	handleGridBlur(){
		const entityKey = this.props.block.getEntityAt(0)

		Entity.mergeData(
			entityKey,
			{data:this.state.tableData.toJS()}
		)
		this.props.blockProps.onFinishEdit(this.props.block.getKey())
	},

	// Render
	renderGrid(row, col,data) {
		const {
			tableData,
			onFinishEdit,
			onStartEdit,
		} = this.props.blockProps

		const blockKey = this.props.block.getKey()

		const test = tableData.toJS()


		return <td key={col} className={styles.grid}><input style={{fontWeight: row?'normal':'bold'}} onChange={(e)=>{this.handleGridChange(row,col,e)}} value={this.state.tableData.getIn([row,col])}  onFocus={()=>{onStartEdit(blockKey)}} onBlur={this.handleGridBlur} type="text"/></td>
	},
	render() {
		const entity = Entity.get(this.props.block.getEntityAt(0))
		const {
			columnCount,
			rowCount,
		} = entity.getData()
		const entityData = this.state.tableData
		return <table className={styles.container}>
			<tbody>
				{
					_.map(_.range(rowCount), row => (
						 <tr key={row}>
							{
								_.map(_.range(columnCount), column => this.renderGrid(row, column,entityData))
							}
						 </tr>
					))
				}
			</tbody>
		</table>
	}
})

export default Table
