import React, {PropTypes} from 'react'
import {Modal,Button,Row,Col,Tooltip,Input,Icon} from 'antd'
import {BLOCK_TYPES, INLINE_STYLES, COLOR_STYLE_MAP} from './constant'
import {RichUtils,EditorState,Modifier,Entity,AtomicBlockUtils,CharacterMetadata,ContentBlock,ContentState,genKey,SelectionState} from 'draft-js'
import TableComponent from './Table'
import styles from './EditorControl.scss'
import classNames from 'classnames'
import _ from 'underscore'
import {List,Repeat,Map,fromJS} from 'immutable'

const headlineIconStyle = {
	fontSize: '26px',
	fontWeight: '300',
	width: '24px',
	height: '23px',
	lineHeight: '23px',
	marginRight: '10px',
}
const normalIconStyle = {
	fontSize: '18px',
	marginRight: '14px',
	fontWeight: '500',
	width: '24px',
	height: '23px',
	lineHeight: '23px',
}

const getToolTipTitle = function(type){
	switch (type) {
		case 'simuicon-h1':
			return '大标题';
		case 'simuicon-h2':
			return '中标题';
		case 'simuicon-h3':
			return '小标题';
		case 'simuicon-formatequote':
			return '引用';
		case 'simuicon-codeblock':
			return '代码';
		case 'simuicon-formatebold':
			return '加粗';
		case 'simuicon-formateitalic':
			return '倾斜';
		default:
			return '其他';
	}
}

export const inlineStyleMap = {...COLOR_STYLE_MAP}
const blockDataStyleMap = {
	textAlignment: {
		center: 'alignment-center',
		left: 'alignment-left',
		right: 'alignment-right',
	}
}
export const getBlockStyle = (block) => {
	const blockDataClassName = block.getData().reduce((reduction, v, k) => {
		if (blockDataStyleMap[k]) {
			reduction.push(blockDataStyleMap[k][v])
		}
		return reduction
	}, [])

	switch (block.getType()) {
		case 'blockquote':
			return classNames(blockDataClassName, 'RichEditor-blockquote')
		case 'unstyled':
			return classNames(blockDataClassName, 'Main-body')
		default:
			return classNames(blockDataClassName)
	}
}

export const getBlockRender = function(block) {

	if (block.getType() === 'atomic') {
		const entityType = Entity.get(block.getEntityAt(0)).getType()
		const entityData = Entity.get(block.getEntityAt(0)).getData()
		switch (entityType) {
			case 'MEDIA':
				return {
					component: PhotoComponent,
					editable: false,
				}
			case 'table':
				return {
					component: TableComponent,
					editable: false,
					props: {
						tableData:fromJS(entityData.data),
						onStartEdit: (blockKey) => {
							this.setState({
								liveEdits: this.state.liveEdits.set(blockKey)
							})
						},
						onFinishEdit: (blockKey) => {
							this.setState({
								liveEdits: this.state.liveEdits.remove(blockKey)
							})
						},
					}
				}
			default:
				return null
		}
	} else {
		return null
	}
}

const PhotoComponent = (props) => {
	const entity = Entity.get(props.block.getEntityAt(0))
	const {src} = entity.getData()
	const type = entity.getType()

	return (
		<div style={{"textAlign":"center"}}>
			<img className={styles.insertPhoto} src={src}/>
		</div>
	)
}

const BlockStyleButton = React.createClass({
	propTypes: {
		editorState: React.PropTypes.object.isRequired,
		type: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired,
		isMarkDownMode: React.PropTypes.bool,
	},

	handleClick(e) {
		e.preventDefault()
		if(this.props.isMarkDownMode){
			let text = ""
			switch (this.props.type) {
				case BLOCK_TYPES.h1:
					text = "# "
					break
				case BLOCK_TYPES.h2:
					text = "## "
					break
				case BLOCK_TYPES.h3:
					text = "### "
					break
				case BLOCK_TYPES.blockquote:
					text = "> "
					break
				case BLOCK_TYPES.code:
					text = "```"
					break
				default:
					text = "# "
			}
			let blocks = this.props.editorState.getCurrentContent().getBlockMap();
			const targetRange = this.props.editorState.getSelection();
			const blockKey = targetRange.getStartKey();
			let newContentState
			let newEditorState
			if(text !== "```"){
				const currentText = text + blocks.get(blockKey).getText();
				const newBlock = new ContentBlock({
					key: blockKey,
					type: 'unstyled',
					text: currentText,
					characterList: List(Repeat(CharacterMetadata.create(), currentText.length)),
				});
				blocks = blocks.set(blockKey,newBlock);
				newContentState = ContentState.createFromBlockArray(blocks.toArray());
				newEditorState = EditorState.createWithContent(newContentState);
			}else{
				const preBlock = new ContentBlock({
					key: genKey(),
					type: 'unstyled',
					text: text,
					characterList: List(Repeat(CharacterMetadata.create(), 3))
				});
				const afterBlock = new ContentBlock({
					key: genKey(),
					type: 'unstyled',
					text: text,
					characterList: List(Repeat(CharacterMetadata.create(), 3))
				});
				let blocksArray = blocks.toArray();
				let newBlocksArray = [];
				for(let b of blocksArray){
					if(b.getKey()!=blockKey){
						newBlocksArray.push(b)
					}else{
						newBlocksArray.push(preBlock);
						newBlocksArray.push(b)
						newBlocksArray.push(afterBlock);
					}
				}
				newContentState = ContentState.createFromBlockArray(newBlocksArray);
				newEditorState = EditorState.createWithContent(newContentState);
				newEditorState = EditorState.forceSelection(newEditorState,targetRange);
			}
			this.props.onChange(newEditorState);
		}else{
			this.props.onChange(RichUtils.toggleBlockType(
				this.props.editorState,
				this.props.type.style,
			))
		}
	},

	render() {
		const {
			editorState,
			type,
			isMarkDownMode,
		} = this.props
		const selection = editorState.getSelection()
		const blockType = editorState
			.getCurrentContent()
			.getBlockForKey(selection.getStartKey())
			.getType()

		const iconClassName = {
			[styles.blockStyleButton]: true,
			[styles.activeBlockStyleButton]: blockType === type.style,
			[type.label]: true,
		}

		return (
			<Tooltip overlayClassName={styles.tooltip} placement='top' title={getToolTipTitle(type.label)}>
				<span onMouseDown={this.handleClick} className={classNames(iconClassName)}></span>
			</Tooltip>
		)
	},
})

const InlineStyleButton = React.createClass({
	propTypes: {
		editorState: React.PropTypes.object.isRequired,
		type: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired,
		isMarkDownMode: React.PropTypes.bool.isRequired,
	},

	handleClick(e) {
		e.preventDefault()
		if(this.props.isMarkDownMode){
			let text = ""
			switch (this.props.type) {
				case INLINE_STYLES.bold:
					text = "**"
					break
				case INLINE_STYLES.italic:
					text = "_"
					break
				default:
					text = "**"
			}
			const targetRange = this.props.editorState.getSelection();
			const start = targetRange.getStartOffset();
			const end = targetRange.getEndOffset();
			const startBlockKey = targetRange.getStartKey();
			const endBlockKey = targetRange.getEndKey();
			const contentState = this.props.editorState.getCurrentContent();
			let newContentState
			let newTargetRange
			if(start === end && startBlockKey === endBlockKey){
				// Insert ** or _
				newContentState = Modifier.insertText(
					contentState,
					targetRange,
					text+text
				)
				newTargetRange = targetRange.merge({anchorOffset:end+text.length,focusOffset:end+text.length});
			}else{
				// Wrap selection with ** or _
				if(startBlockKey === endBlockKey){
					const selectedText = contentState.getBlockMap().get(startBlockKey).getText().slice(start,end);
					newContentState = Modifier.replaceText(
						contentState,
						targetRange,
						text+selectedText+text
					)
					newTargetRange = targetRange.merge({anchorOffset:end+text.length,focusOffset:end+text.length});
				}else{
					// Select more than one block
					const blocksArray = contentState.getBlockMap().toArray();
					let renderText
					let renderSelection
					let startToRender = false;
					blocksArray.forEach((b,i,a) => {
						if(b.getKey() == startBlockKey){
							startToRender = true;
							renderText = b.getText().slice(start)
							const emptySelection = SelectionState.createEmpty(b.getKey());
							renderSelection = emptySelection.merge({anchorOffset: start, focusOffset: b.getText().length, isBackward: false, hasFocus: false, anchorKey: b.getKey(), focusKey: b.getKey()})
							newContentState = Modifier.replaceText(
								contentState,
								renderSelection,
								text+renderText+text
							)
							if(targetRange.getIsBackward()){
								newTargetRange = renderSelection.merge({anchorOffset: start+text.length, focusOffset: start+text.length})
							}
						}else if(startToRender && b.getKey() != endBlockKey){
							renderText = b.getText();
							const emptySelection = SelectionState.createEmpty(b.getKey());
							renderSelection = emptySelection.merge({anchorOffset: 0, focusOffset: b.getText().length, isBackward: false, hasFocus: false, anchorKey: b.getKey(), focusKey: b.getKey()})
							newContentState = Modifier.replaceText(
								newContentState,
								renderSelection,
								text+renderText+text
							)
						}else if(b.getKey() == endBlockKey){
							startToRender = false;
							renderText = b.getText().slice(0,end);
							const emptySelection = SelectionState.createEmpty(b.getKey());
							renderSelection = emptySelection.merge({anchorOffset: 0, focusOffset: end, isBackward: false, hasFocus: false, anchorKey: b.getKey(), focusKey: b.getKey()})
							newContentState = Modifier.replaceText(
								newContentState,
								renderSelection,
								text+renderText+text
							)
							if(!targetRange.getIsBackward()){
								newTargetRange = renderSelection.merge({anchorOffset: end+text.length, focusOffset: end+text.length})
							}
						}
					})
				}
			}
			let newEditorState = EditorState.createWithContent(newContentState);
			newEditorState = EditorState.forceSelection(newEditorState,newTargetRange);
			this.props.onChange(newEditorState);
		}else{
			this.props.onChange(RichUtils.toggleInlineStyle(
				this.props.editorState,
				this.props.type.style,
			))
		}
	},

	render() {
		const {
			editorState,
			type,
		} = this.props
		const currentStyle = editorState.getCurrentInlineStyle()

		const iconClassName = {
			[styles.blockStyleButton]: true,
			[styles.activeBlockStyleButton]: currentStyle.has(type.style),
			[type.label]: true,
		}

		return(
			<Tooltip overlayClassName={styles.tooltip} placement='top' title={getToolTipTitle(type.label)}>
				<span onMouseDown={this.handleClick} className={classNames(iconClassName)}></span>
			</Tooltip>
		)
	},
})

const InlineColorButton = React.createClass({
	propTypes: {
		editorState: React.PropTypes.object.isRequired,
		label: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired,
		style: React.PropTypes.string.isRequired,
		afterToggle: React.PropTypes.func.isRequired,
	},

	handleToggle(e) {
		e.preventDefault();
		const {editorState} = this.props;
		const toggledColor = this.props.style;
		const selection = editorState.getSelection();

		// Allow one color at a time. Turn off all active colors.
		const nextContentState = Object.keys(COLOR_STYLE_MAP)
			.reduce((contentState, color) => {
				return Modifier.removeInlineStyle(contentState, selection, color)
			}, editorState.getCurrentContent());

		const nextSelection = selection.merge({
			anchorOffset: selection.getFocusOffset(),
			hasFocus: true,
		});

		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			'change-inline-style'
		);

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				// return RichUtils.toggleInlineStyle(state, color);
				if(Object.keys(COLOR_STYLE_MAP).indexOf(color)<0){
					if(!state.getCurrentInlineStyle().has(color)){
						state = RichUtils.toggleInlineStyle(state, color);
					}
				}else{
					state = RichUtils.toggleInlineStyle(state, color);
				}
				return state;
			}, nextEditorState);
		}

		// If the color is being toggled on, apply it.
		if (!currentStyle.has(toggledColor)) {
			nextEditorState = RichUtils.toggleInlineStyle(
				nextEditorState,
				toggledColor
			);
		}

		this.props.onChange(nextEditorState);
		this.props.afterToggle();
	},


	render() {
		return (
			<div className={styles.colorSpan} style={{"backgroundColor":COLOR_STYLE_MAP[this.props.style].color}} onMouseDown={this.handleToggle}></div>
		)
	}
})

const ColorPickerIcon = React.createClass({
	propTypes: {
		editorState: PropTypes.object.isRequired,
	},

	render() {
		const {
			editorState,
		} = this.props;

		const currentInlineStyle = editorState.getCurrentInlineStyle();

		const intersect = currentInlineStyle.intersect(Object.keys(COLOR_STYLE_MAP));

		const color = intersect.size ? COLOR_STYLE_MAP[intersect.first()].color : "#4a4a4a";

		return (
			<svg width="14px" height="14px" viewBox="147 8 18 18" version="1.1">
		    <g id="ic_format_color_text" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(147.000000, 8.000000)">
					<g id="colorIconGroup">
					  <polygon id="shapeAbove" points="0 0 18 0 18 18 0 18"></polygon>
					  <polygon id="shapeBelow" fill={color} points="0 15 18 15 18 18 0 18"></polygon>
					  <path d="M8.25,2.25 L4.125,12.75 L5.8125,12.75 L6.6525,10.5 L11.34,10.5 L12.18,12.75 L13.8675,12.75 L9.75,2.25 L8.25,2.25 L8.25,2.25 Z M7.215,9 L9,4.2525 L10.785,9 L7.215,9 L7.215,9 Z" id="形状" fill="#4A4A4A"></path>
					</g>
		    </g>
			</svg>
		)
	}
})

const TableModal = React.createClass({
	PropTypes:{
		visibility:PropTypes.bool,
		onOK:PropTypes.func,
		onCancel:PropTypes.func
	},
	getInitialState(){
		return {
			rowInputVal:2,
			colInputVal:4
		}
	},
	handleOK(){
		let row,col;
		row = this.state.rowInputVal
		col = this.state.colInputVal
		this.props.onOK(row,col);
	},
	handleCancel(){
		this.props.onClose();
	},
	render(){
		return (
			<div className={styles.tableModal} onClick={(e)=>{console.log("dfdf");e.preventDefault();e.stopPropagation()}}>
				<div className={styles.modalContent}>
					<div className={styles.inputItem}><div className={styles.label}>行数量:</div><Input value={this.state.rowInputVal}   onChange={(e)=>{this.setState({rowInputVal:e.target.value})}}/></div>
					<div className={styles.inputItem}><div className={styles.label}>列数量:</div><Input value={this.state.colInputVal}  onChange={(e)=>{this.setState({colInputVal:e.target.value})}} /></div>
				</div>
				<div className={styles.modalFooter}>
					<Button type="ghost" size="large" onClick={this.handleOK}>确认</Button>
				</div>
			</div>
		)
	}
})

const EditorControl = React.createClass({
	propTypes: {
		onChange: PropTypes.func.isRequired,
		onImageUpload: PropTypes.func.isRequired,
		onEnterFullscreen: React.PropTypes.func.isRequired,
		isFullscreenMode: React.PropTypes.bool.isRequired,
		isMarkDownMode: React.PropTypes.bool.isRequired,
		onChangeMarkDownMode: React.PropTypes.func.isRequired,
		editorState: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			showLinkPanel: false,
		}
	},

	componentDidMount() {
		this.props.isMarkDownMode ? null : window.addEventListener('mousedown', this.handleFadeOut);
	},

	componentWillUnmount() {
		this.props.isMarkDownMode ? null : window.removeEventListener('mousedown', this.handleFadeOut);
	},

	// 颜色面板控制
	handleFadeIn(e){
		e.preventDefault();
		let board = this.refs.colorBoard;
		board.style.display = board.style.display ? "" : "none";
		this.refs.colorBoardTooltip.setState({'visible':false});
		this.refs.tableBoard.style.display = 'none'
		this.setState({showLinkPanel: false});
		e.stopPropagation();
	},
	handleFadeOut(){
		if(!this.props.isMarkDownMode){
			let board = this.refs.colorBoard;
			board.style.display = "none";
			// this.refs.tableBoard.style.display = 'none'
		}
	},
	handleContentMouseDown(e){
		e.preventDefault();
		e.stopPropagation();
	},
	handlePhotoSelected(e){
		const files = e.target.files;
		this.props.onImageUpload(files[0]);
		e.target.value = "";
	},

	handleClickPhotoButton(e){
		e.preventDefault()
		let blocks = this.props.editorState.getCurrentContent().getBlockMap().toArray();
		const targetRange = this.props.editorState.getSelection();
		const newBlock = new ContentBlock({
			key: genKey(),
			type: 'unstyled',
			text: "![]()",
			characterList: List(Repeat(CharacterMetadata.create(), 5))
		});
		let newBlocksArray = []
		for(let b of blocks){
			if(b.getKey() === targetRange.getStartKey()){
				b.getText() == "" ? null : newBlocksArray.push(b)
				newBlocksArray.push(newBlock)
			}else{
				newBlocksArray.push(b)
			}
		}
		const renderSelection = SelectionState.createEmpty(newBlock.getKey()).merge({anchorOffset: 2, focusOffset: 2, hasFocus: true})
		let newEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(newBlocksArray));
		newEditorState = EditorState.forceSelection(newEditorState,renderSelection);
		this.props.onChange(newEditorState);
	},

	handleClickLinkButton(e){
		e.preventDefault()
		e.stopPropagation();

		if(this.props.isMarkDownMode){
			let contentState = this.props.editorState.getCurrentContent();
			const targetRange = this.props.editorState.getSelection();
			const start = targetRange.getStartOffset();
			const end = targetRange.getEndOffset();
			let newContentState
			if(start == end){
				newContentState = Modifier.insertText(
					contentState,
					targetRange,
					"[]()"
				)
			}else{
				const selectedText = contentState.getBlockMap().get(targetRange.getStartKey()).getText().slice(start,end);
				newContentState = Modifier.replaceText(
					contentState,
					targetRange,
					"[]("+selectedText+")"
				)
			}
			let newTargetRange = targetRange.merge({anchorOffset: start+1,focusOffset: start+1,hasFocus: true})
			let newEditorState = EditorState.createWithContent(newContentState);
			newEditorState = EditorState.forceSelection(newEditorState,newTargetRange);
			this.props.onChange(newEditorState);
		}else{
			this.refs.colorBoard.style.display = "none";
			this.refs.tableBoard.style.display = 'none'
			this.setState({
				showLinkPanel: true,
			}, ()=>{
				this.refs.linkInput.refs.input.focus() //导致选中文字内容失去高亮的原因，但是删掉会失去自动焦点
			})
		}
	},

	handleClickTableButton(e) {
		e.preventDefault();
		e.stopPropagation();
		if(this.props.isMarkDownMode){
			const blocks = this.props.editorState.getCurrentContent().getBlockMap().toArray();
			const targetRange = this.props.editorState.getSelection();
			const tableLine1 = new ContentBlock({
				key: genKey(),
				type: 'unstyled',
				text: 'Header1|Header2|Header3',
				characterList: List(Repeat(CharacterMetadata.create(), 23))
			});
			const tableLine2 = new ContentBlock({
				key: genKey(),
				type: 'unstyled',
				text: '--|--|--',
				characterList: List(Repeat(CharacterMetadata.create(), 8))
			});
			const tableLine3 = new ContentBlock({
				key: genKey(),
				type: 'unstyled',
				text: 'Data1|Data2|Data3',
				characterList: List(Repeat(CharacterMetadata.create(), 17))
			});
			let newBlocksArray = []
			for(let b of blocks){
				if(b.getKey() === targetRange.getStartKey()){
					b.getText() == "" ? null : newBlocksArray.push(b)
					newBlocksArray.push(tableLine1);
					newBlocksArray.push(tableLine2);
					newBlocksArray.push(tableLine3);
				}else{
					newBlocksArray.push(b)
				}
			}
			const renderSelection = SelectionState.createEmpty(tableLine1.getKey()).merge({anchorOffset: 7, focusOffset: 7, hasFocus: true})
			let newEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(newBlocksArray));
			newEditorState = EditorState.forceSelection(newEditorState,renderSelection);
			this.props.onChange(newEditorState);
		}else{
			let board = this.refs.tableBoard;
			board.style.display = board.style.display ? "" : "none";
			this.refs.colorBoard.style.display = 'none';
			this.setState({showLinkPanel: false});
			this.refs.tableBoardTooltip.setState({'visible':false});
			this.setState({
				showTableModal:true
			})
		}
	},

	handleAddLink(e) {
		const {
			editorState,
			onChange,
		} = this.props
		const regx = /^http:\/\/.*$/
		let url = this.refs.linkInput.refs.input.value

		//[fix]如果输入链接为空，则直接返回
		if(!url){
			return;
		}

		if(!regx.test(url)){
			url = "http://"+url;
		}
		const entityKey = Entity.create('LINK', 'MUTABLE', {
			url,
		})

		onChange(RichUtils.toggleLink(
			editorState,
			editorState.getSelection(),
			entityKey
		))
	},

	handleAddLinkByEnter(e) {
		if(e.key=="Enter"){
			this.handleAddLink();
			this.setState({showLinkPanel: false});
		}
	},

	handleChangeTextAlignment(e, alignment) {
		e.preventDefault()

		const {
			editorState,
			onChange,
		} = this.props
		const newContentState = Modifier.setBlockData(editorState.getCurrentContent(), editorState.getSelection(), {
			textAlignment: alignment,
		})
		onChange(EditorState.push(editorState, newContentState))
	},
	createTable(row,col){

		const editorState = this.props.editorState
		const entityKey = Entity.create('table', 'MUTABLE', {
			columnCount: col,
			rowCount: row,
			data:_.map(_.range(row),row=>(_.range(col).fill(' ')))
		})
		const nextEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
		this.props.onChange(nextEditorState)
		let board = this.refs.tableBoard;
		board.style.display = board.style.display ? "" : "none";
	},


	// Render
	renderTextAlignGroup() {
		return (
			<div className={styles.textAlignGroup}>
				<Tooltip overlayClassName={styles.tooltip} placement='top' title="左对齐">
					<span onMouseDown={(e)=>{this.handleChangeTextAlignment(e, 'left')}} className={`${styles.blockStyleButton} simuicon-alignleft`}></span>
				</Tooltip>
				<Tooltip overlayClassName={styles.tooltip} placement='top' title="中对齐">
					<span onMouseDown={(e)=>{this.handleChangeTextAlignment(e, 'center')}} className={`${styles.blockStyleButton} simuicon-aligncenter`}></span>
				</Tooltip>
				<Tooltip overlayClassName={styles.tooltip} placement='top' title="右对齐">
					<span onMouseDown={(e)=>{this.handleChangeTextAlignment(e, 'right')}} className={`${styles.blockStyleButton} simuicon-alignright`}></span>
				</Tooltip>
			</div>
		)
	},

	renderColorButton(){
		// 颜色面板
		const content = (
			<Row type="flex">
				{INLINE_STYLES.colors.map(color =>
					<Col className={styles.colorBlock} span={6} key={color.label}>
						<InlineColorButton
							label={color.label}
							onChange={this.props.onChange}
							editorState={this.props.editorState}
							style={color.style}
							afterToggle={this.handleFadeOut}
						/>
					</Col>
				)}
			</Row>
		);

		return (
			<div className={styles.popoverStyle}>
				<div>
					<Tooltip ref="colorBoardTooltip" overlayClassName={styles.tooltip} placement='top' title="字体颜色">
						<span onMouseDown={this.handleFadeIn} className={styles.blockStyleButton}>
							<ColorPickerIcon editorState={this.props.editorState} />
						</span>
					</Tooltip>
					<div onMouseDown={this.handleContentMouseDown} ref="colorBoard" style={{"display":"none"}} className={styles.colorBoard}>
						{content}
					</div>
				</div>
			</div>
		)
	},

	renderLinkButton(){
		const activeIconClassName = this.state.showLinkPanel ? styles.activeLinkIcon : ""

		return (
			//[fix]鼠标移入时出现提示，另外和设计确认过了，所有按钮的提示出现在上方
			<div className={styles.linkGroup}>
				{this.state.showLinkPanel?<div className={styles.linkOverlay}></div>:null}
				<Tooltip ref="linkTooltip" overlayClassName={styles.tooltip} placement='top' title='添加链接'>
					<span onMouseDown={this.handleClickLinkButton} className={`${styles.blockStyleButton} simuicon-link ${activeIconClassName}`}></span>
				</Tooltip>
				{this.state.showLinkPanel?<Input ref="linkInput" placeholder="http://www.menkor.com/" className={styles.linkInput} onBlur={()=>this.setState({showLinkPanel: false})} onKeyPress={this.handleAddLinkByEnter}></Input>:null}
				{this.state.showLinkPanel?<Icon type="check-circle" onMouseDown={this.handleAddLink}/>:null}
			</div>
		)
	},
	renderPhotoAddButton(){
		const iconClassName ={
			[styles.blockStyleButton]: true,
			'simuicon-photo': true,
		}

		return (
			<Tooltip overlayClassName={styles.tooltip} placement='top' title="插入图片">
					{
						this.props.isMarkDownMode ?
							<div className={styles.photoAddStyle} onMouseDown={this.handleClickPhotoButton}>
								<span className={classNames(iconClassName)}></span>
							</div>
							:
							<div className={styles.photoAddStyle}>
								<input className={styles.invisibleInput} type='file' onChange={this.handlePhotoSelected}/>
								<span className={classNames(iconClassName)}></span>
							</div>
					}
			</Tooltip>
		)
	},
	renderTableAddButton(){
		const iconClassName ={
			[styles.blockStyleButton]: true,
			'simuicon-table': true,
		}

		return (
			<div className={styles.wrapTableAddStyel} onMouseDown={(e)=>{e.stopPropagation()}}>
				<Tooltip ref="tableBoardTooltip" overlayClassName={styles.tooltip} placement='top' title="插入表格">
					<div className={styles.tableAddStyle} onMouseDown={this.handleClickTableButton}>
						<span className={classNames(iconClassName)}></span>
					</div>
				</Tooltip>
				<div ref="tableBoard" style={{"display":"none"}} className={styles.tableBoard} >
					<TableModal onOK={this.createTable}/>
				</div>
			</div>
		)
	},
	render() {
		const {
			editorState,
			onChange,
			onEnterFullscreen,
			isFullscreenMode,
			isMarkDownMode,
			onChangeMarkDownMode,
		} = this.props



		return (
			<div className={classNames(styles.container, isFullscreenMode?styles['container-fullscreen']:null)}>
				<div className={styles.content}>
					<div className={styles.leftGroup}>
						{/* headline */}
						<div className={styles.headlineGroup}>
							<BlockStyleButton onChange={onChange} type={BLOCK_TYPES.h1} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
							<BlockStyleButton onChange={onChange} type={BLOCK_TYPES.h2} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
							<BlockStyleButton onChange={onChange} type={BLOCK_TYPES.h3} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
						</div>

						{/* text decoration style */}
						<div className={styles.textDecorationGroup}>
							<InlineStyleButton onChange={onChange} type={INLINE_STYLES.bold} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
							<InlineStyleButton onChange={onChange} type={INLINE_STYLES.italic} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
							{isMarkDownMode ? null : this.renderColorButton()}
							<BlockStyleButton onChange={onChange} type={BLOCK_TYPES.blockquote} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
							<BlockStyleButton onChange={onChange} type={BLOCK_TYPES.code} editorState={editorState} isMarkDownMode={isMarkDownMode}/>
						</div>


						{/* text alignment style */}
						{isMarkDownMode ? null : this.renderTextAlignGroup()}

						<div className={styles.functionGroup}>
							{this.renderLinkButton()}
							{this.renderPhotoAddButton()}
							{this.renderTableAddButton()}
						</div>
					</div>
				</div>


			</div>
		)
	}
})

export default EditorControl
