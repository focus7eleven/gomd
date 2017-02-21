import React from 'react'
import styles from './Ueditor.scss'

const Ueditor = React.createClass({
  getDefaultProps(){
    return {
      onDestory:()=>{},
      initialContent:'',
    }
  },
  componentDidMount(){
    this.ue = UE.getEditor('editor',{
  		toolbars: [[
  			'fullscreen', 'source', '|',
  			'bold', 'italic', 'underline', '|', 'fontsize', '|', 'kityformula', 'preview'
  		]],
  	});
    // this.ue.setContent(this.props.initialContent)
    // this.ue.destroy = ()=>{
    //   this.props.onDestory(this.ue.getContent())
    // }
    let that = this
    this.ue.addListener( 'ready', function( editor ) {
      // console.log("dfdf",editor)
      that.ue.setContent(that.props.initialContent)
      window.currentEditor = that.ue
    //  editor.setContent( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
    });

    this.ue.addListener( 'destroy', function( editor ) {
      // console.log("dfdf",editor)
      that.props.onDestory(that.ue.getContent())
      window.currentEditor = null
    //  editor.setContent( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
    });
  },
  componentWillUnmount(){

    this.ue.destroy()
  },
  render(){
    return (
      <div className={styles.container} onClick={(e)=>{e.stopPropagation()}}>
        <script id="editor" type="text/plain"></script>
      </div>
    )
  }
})

export default Ueditor
