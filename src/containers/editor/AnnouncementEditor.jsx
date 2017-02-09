import React, {PropTypes} from 'react'
import {Editor, EditorState, convertToRaw, convertFromRaw, Entity, AtomicBlockUtils, ContentState} from 'draft-js'
import EditorControl, {inlineStyleMap, getBlockStyle, getBlockRender} from './EditorControl'
import stateToMarkdown from 'stateToMarkdown'
import stateFromMarkdown from 'stateFromMarkdown'
import {Progress,notification} from 'antd'
import styles from './AnnouncementEditor.scss'
import "draft-js/dist/Draft.css"
import {NormalButton} from '../../components/button/Button'
import classNames from 'classnames'
import EditorDecorator from "./EditorDecorator"
import {Map} from 'immutable'
import {Motion, spring} from 'react-motion';
import {stateToHTML} from 'draft-js-export-html';
// import config from '../../config'

const initialRawDraftContentState = {
	"entityMap":{"0":{"type":"MEDIA","mutability":"IMMUTABLE","data":{"src":"http://img4.imgtn.bdimg.com/it/u=2898212038,3221700425&fm=214&gp=0.jpg"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"url":"http://www.menkor.com/"}},"2":{"type":"table","mutability":"MUTABLE","data":{"columnCount":4,"rowCount":2,"data":[["a1","a2","a3","a4"],["b1","b2","b3","b4"]]}}},"blocks":[{"key":"1dpia","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3g159","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"dngoi","text":"Most of the lectures have been video-recorded, and you can watch them at home. The weekly quizzes and programming homeworks will be automatically uploaded and graded. Lecture, quizzes, and homeworks are available on Coursera.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":37,"length":8,"key":1}],"data":{}},{"key":"3n0l8","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":2}],"data":{}},{"key":"7s8uh","text":"5 of the in-class sessions will be for group problem-solving activities. The remainder will be for some lectures on material not in the videos, a few redundant lectures by me (covering the same material as the videos), a few guest speakers, review sessions, and occasional presentation of state-of-the-art research.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]
}
// const initialRawDraftContentState = {
// 	"entityMap": {
// 		"0": {
// 			"type": "LINK",
// 			"mutability": "MUTABLE",
// 			"data": {
// 				"url": "http://www.menkor.com/"
// 			}
// 		},
// 		"1": {
// 			"type": "table",
// 			"mutability": "MUTABLE",
// 			"data": {
// 				"columnCount": 4,
// 				"rowCount": 2,
// 				"data":[['a1','a2','a3','a4'],['b1','b2','b3','b4']],
// 			}
// 		},
// 		"2": {
// 			"type": "MEDIA",
// 			"mutability": "IMMUTABLE",
// 			"data": {
// 				"scr": "http://img4.imgtn.bdimg.com/it/u=2898212038,3221700425&fm=214&gp=0.jpg"
// 			}
// 		}
// 	},
// 	"blocks": [{
// 		"key": "1dpia",
// 		"text": "Most of the lectures have been video-recorded, and you can watch them at home. The weekly quizzes and programming homeworks will be automatically uploaded and graded. Lecture, quizzes, and homeworks are available on Coursera.",
// 		"type": "unstyled",
// 		"depth": 0,
// 		"inlineStyleRanges": [],
// 		"entityRanges": [{
// 			"offset": 37,
// 			"length": 8,
// 			"key": 0
// 		}],
// 		"data": {}
// 	}, {
// 		"key": "3n0l8",
// 		"text": " ",
// 		"type": "atomic",
// 		"depth": 0,
// 		"inlineStyleRanges": [],
// 		"entityRanges": [{
// 			"offset": 0,
// 			"length": 1,
// 			"key": 1
// 		}],
// 		"data": {}
// 	}, {
// 		"key": "7s8uh",
// 		"text": "5 of the in-class sessions will be for group problem-solving activities. The remainder will be for some lectures on material not in the videos, a few redundant lectures by me (covering the same material as the videos), a few guest speakers, review sessions, and occasional presentation of state-of-the-art research.",
// 		"type": "unstyled",
// 		"depth": 0,
// 		"inlineStyleRanges": [],
// 		"entityRanges": [],
// 		"data": {}
// 	}]
// }

const AnnouncementEditor = React.createClass({
	getInitialState() {
		const editorState = EditorState.createWithContent(convertFromRaw(initialRawDraftContentState), EditorDecorator)

		return {
			editorState,
			// editorState: EditorState.createEmpty(EditorDecorator),
			isFullscreenMode: false,
			isMarkDownMode: false,
			liveEdits: Map(), // 记录哪些 block 正在被编辑。
			progress: false,
			progressStatus: 0,
			markDownEditorState: EditorState.createWithContent(stateToMarkdown(editorState.getCurrentContent()), EditorDecorator),
			motionStatus: true,
		}
	},
	componentDidMount() {
		this.onChange = (editorState) => this.setState({
			editorState,
		})
	},

	// Handler
	focus() {
		this.refs.editor.focus()
	},
	handleChange(editorState) {
		this.setState({
			editorState,
			markDownEditorState: EditorState.createWithContent(stateToMarkdown(editorState.getCurrentContent()), EditorDecorator),
		})
	},
	handleChangeMarkDown(editorState) {
		this.setState({
			editorState: EditorState.createWithContent(stateFromMarkdown(editorState.getCurrentContent()), EditorDecorator),
			markDownEditorState: editorState,
		})
	},
	handleEnterFullscreen() {
		this.setState({
			isFullscreenMode: true,
		})
	},
	handleExitFullscreen(){
		this.setState({
			isMarkDownMode: false,
			isFullscreenMode: false,
		})
	},
	hanleEditBlock(blockKey, isFocus) {
		this.setState({
			liveEdits: isFocus ? this.state.liveEdits.set(blockKey) : this.state.liveEdits.remove(blockKey)
		})
	},

	handleImageDragOver(e){
		e.preventDefault();
		e.stopPropagation();
		this.refs.dropZone.style.opacity = 0.95;
		this.refs.editorContainer.style.opacity = 0;
		this.refs.footer.style.opacity = 0;
	},

	handleImageDragLeave(e){
		e.preventDefault();
		this.refs.dropZone.style.opacity = 0;
		this.refs.editorContainer.style.opacity = 1;
		this.refs.footer.style.opacity = 1;
	},

	handleImageDrop(e){
		e.preventDefault();
		this.refs.dropZone.style.opacity = 0;
		this.refs.editorContainer.style.opacity = 1;
		this.refs.footer.style.opacity = 1;

		const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;

		this.handleImageUpload(droppedFiles[0])
	},

	handleImageUpload(file){
		const regx = /^image(\/jpeg|\/jpg|\/png)$/;
		let imageURL = "";

		if(!regx.test(file.type)){
			notification['warning']({
				message: '无法上传该类型的图片',
				description: '目前支持的图片格式有：jpg，jpeg，png',
			})
			return;
		}

		if(file.size > 20 * 1024 * 1024){
			notification['warning']({
				message: '图片大小超过限制，请压缩后上传',
				description: '单个图片大小不超过20M',
			})
			return;
		}

		this.setState({progressStatus:0,motionStatus:true});

		// Upload image to oss
		// fetch(config.api.uploadToken.get, {
		// 		method: 'GET',
		// 		credentials: 'include',
		// 	}).then((res) => {
		// 		return res.json()
		// 	}).then(json => {
		// 		this.setState({progressStatus:60})
		// 		const data = json.data
		// 		const form = new FormData()
		// 		const key = `${data.dir}/draft/${Date.now()}.${file.type.split('/')[1]}`
		// 		form.append('key', key)
		// 		form.append('policy', data.policy)
		// 		form.append('OSSAccessKeyId', data.accessid)
		// 		form.append('success_action_status', '200')
		// 		form.append('signature', data.signature)
		// 		form.append('file', file)
    //
		// 		fetch(data.host, {
		// 			method: 'POST',
		// 			body: form,
		// 		}).then((res) => {
		// 			// Insert image to the editor
		// 			imageURL = res.url + key;
		// 			const editorState = this.state.editorState;
		// 			const entityKey = Entity.create('MEDIA', 'IMMUTABLE', {src: imageURL});
		// 			const nextEditorState = AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,' ');
		// 			this.setState({progressStatus:100});
		// 			this.handleChange(nextEditorState);
    //
		// 		})
		// })
		// imageURL = res.url + key;
	},

	// Render
	renderHeader() {
		return (
			<div className={styles.header}>
				<p>{this.state.isMarkDownMode?"MarkDown模式":"写作模式"}</p>
				<span onClick={this.handleExitFullscreen} className={`simuicon-zoomin ${styles['exit-fullscreen']}`}></span>
			</div>
		)
	},
	renderEditArea() {
		const {
			editorState,
			isFullscreenMode,
			liveEdits,
			isMarkDownMode,
			markDownEditorState,
		} = this.state
		return (
			<div style={!isMarkDownMode?{width:'100%'}:{}}>
				{/*dropZone*/}
				<div className={classNames({[styles.dropZone]: !this.state.isFullscreenMode, [styles['dropZone-fullscreen']]: this.state.isFullscreenMode})} ref="dropZone"><span className={`simuicon-dropzone`}>拖拽至此处上传</span></div>

				{/*编辑部分*/}
				<div onClick={this.focus}
						className={styles.editor}
						ref="editorContainer"
						onDragOver={isMarkDownMode?null:this.handleImageDragOver}
						onDragLeave={isMarkDownMode?null:this.handleImageDragLeave}
						onDrop={isMarkDownMode?null:this.handleImageDrop}>
					<Editor
						blockRendererFn={getBlockRender.bind(this)}
						blockStyleFn={getBlockStyle}
						editorState={isMarkDownMode?markDownEditorState:editorState}
						placeholder="Hint text"
						onChange={isMarkDownMode?this.handleChangeMarkDown:this.handleChange}
						ref="editor"
						customStyleMap={inlineStyleMap}
						onFocus={()=>{this.setState({isFocus:true})}}
						onBlur={()=>{this.setState({isFocus:false})}}
						readOnly={liveEdits.count()}
					></Editor>
				</div>

				{/*底部操作*/}
				<div ref="footer" className={styles.footer}>
					<NormalButton className={styles.submitButton} content="发送" width={68} height={31}></NormalButton>
				</div>
			</div>
		)
	},
	renderMarkDownPreview() {
		if(this.state.isMarkDownMode){
			return (
				<div className={styles.editor}>
					<Editor
						className={styles.markDownPreview}
						blockRendererFn={getBlockRender.bind(this)}
						blockStyleFn={getBlockStyle}
						editorState={this.state.editorState}
						placeholder="Hint text"
						customStyleMap={inlineStyleMap}
						readOnly={true}
					></Editor>
				</div>
			)
		}else{
			return null
		}
	},
	render() {
		const {
			editorState,
			markDownEditorState,
			isFullscreenMode,
			liveEdits,
			progressStatus,
			isMarkDownMode,
		} = this.state

		const options = {
			blockRenderers: {
				atomic: (block) => {
					let data = block.getData();
					const entity = Entity.get(block.getEntityAt(0)).toJS();
					if(entity.type=="MEDIA"){
						return '<img src="' + entity.data.src + '" />';
					}
				},
			},
		}


		return (
			<div className={classNames({[styles.container]: true, [styles['container-fullscreen']]: this.state.isFullscreenMode, [styles['container-focus']]: this.state.isFocus})}>
				{/* 全屏模式下的标题 */}
				{/*isFullscreenMode?this.renderHeader():null*/}

				{/*控制栏部分*/}
				<EditorControl isFullscreenMode={isFullscreenMode} isMarkDownMode={isMarkDownMode} onChangeMarkDownMode={mode=>this.setState({isMarkDownMode: mode})} onEnterFullscreen={this.handleEnterFullscreen} onImageUpload={this.handleImageUpload} onChange={isMarkDownMode?this.handleChangeMarkDown:this.handleChange} editorState={isMarkDownMode?markDownEditorState:editorState}/>

				{
				 	this.state.motionStatus ?
					<Motion defaultStyle={{x: 0}} style={{x: spring(progressStatus)}}
						onRest={
							()=>{
								const nextMotionStatus = ((progressStatus == 100) ? false : true)
								this.setState({motionStatus:nextMotionStatus,progressStatus:0})
							}}
					>
						{
							value => {
								return (
									<div className={styles.progressBar}>
								    <Progress strokeWidth={5} percent={value.x} showInfo={false} />
								  </div>
								)
							}
						}
					</Motion> : null
				}

				<div className={styles.editView}>
					{this.renderEditArea()}
					{this.renderMarkDownPreview()}
				</div>
			</div>
		)
	}
})

export default AnnouncementEditor
