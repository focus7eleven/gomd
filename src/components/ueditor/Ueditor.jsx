import React from 'react'
import styles from './Ueditor.scss'
import {addHttpPrefix} from '../answer_homework/util'
import {ueEventEmitter} from './UeEventEmitter';

const Ueditor = React.createClass({
    getDefaultProps(){
        return {
            onDestory: () => {
            },
            initialContent: '',
            name: 'editor',
            initialHeight: 100,
            onlyOne:true,  ///只有1个ue能打开
        }
    },
    componentDidMount(){
        this.ue = UE.getEditor(this.props.name, {
            toolbars: [[
                'fullscreen', 'source', '|',
                'bold', 'italic', 'underline', '|', 'fontsize', '|', 'kityformula', 'preview'
            ]],
            wordCountMsg: '',
            initialFrameHeight: this.props.initialHeight,
            wordCount:false,
            elementPathEnabled:false,
        });
        // this.ue.setContent(this.props.initialContent)
        // this.ue.destroy = ()=>{
        //   this.props.onDestory(this.ue.getContent())
        // }
        let that = this
        this.ue.addListener('ready', function (editor) {
            // console.log("dfdf",editor)
            if (!window.currentEditor) {
                window.currentEditor = {}
            }
            that.ue.setContent(addHttpPrefix(that.props.initialContent))
            window.currentEditor[that.props.name] = that.ue
            //  editor.setContent( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
            if( that.props.onlyOne ) {
                ueEventEmitter.emitEvent('closeUE',[that.props.name]);
            }
        });
        this.ue.addListener('destroy', function (editor) {
            that.props.onDestory(that.ue.getContent());
            window.currentEditor[that.props.name] = null;
        });

        ueEventEmitter.addListener('closeUE', this.handleCloseUE);
    },
    componentWillUnmount(){
        ueEventEmitter.removeListener('closeUE', this.handleCloseUE);
        if (window.currentEditor[this.props.name]) {
            this.ue.destroy();
        }

    },
    getData(){
        return this.ue.getContent()
    },
    render(){
        return (
            <div className={styles.container} onClick={(e) => {
                e.stopPropagation()
            }}>
                <script id={this.props.name} type="text/plain"></script>
            </div>
        )
    },
    handleCloseUE(name) {
        if( name ) {
            if( name != this.props.name ) {
                this.ue.destroy();
            }
        } else {
            this.ue.destroy();
        }
        //window.currentEditor[that.props.name] = null;
    }
})

export default Ueditor
