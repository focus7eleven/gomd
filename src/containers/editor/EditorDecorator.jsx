import {CompositeDecorator, Entity} from 'draft-js'
import React, {PropTypes} from 'react'
import styles from './EditorDecorator.scss'

const Link = React.createClass({
	handleClickLink(url) {
		const win = window.open(url,'_blank')
		win.focus()
	},
	render(){
		const {
			entityKey,
			children,
		} = this.props
		const {
			url,
		} = Entity.get(entityKey).getData()

		return (
			<a className={styles.link} onClick={()=>this.handleClickLink(url)}>{children}</a>
		)
	},
})

function findLinkEntities(contentBlock, callback) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity()
			return (
				entityKey !== null &&
				Entity.get(entityKey).getType() === 'LINK'
			)
		},
		callback
	)
}

const EditorDecorator = new CompositeDecorator([{
	strategy: findLinkEntities,
	component: Link,
}])

export default EditorDecorator
