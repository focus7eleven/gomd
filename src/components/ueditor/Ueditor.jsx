import React from 'react'
import styles from './Ueditor.scss'

const Ueditor = React.createClass({
  getDefaultProps(){
    return {
      onDestory:()=>{},
      initialContent:'',
      name:'editor',
    }
  },
  componentDidMount(){
    this.ue = UE.getEditor(this.props.name,{
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
      if(!window.currentEditor){
        window.currentEditor = {}
      }
      that.ue.setContent(that.props.initialContent)
      window.currentEditor[that.props.name] = that.ue
    //  editor.setContent( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
    });

    this.ue.addListener( 'destroy', function( editor ) {
      // console.log("dfdf",editor)
      that.props.onDestory(that.ue.getContent())
      window.currentEditor[that.props.name] = null

    //  editor.setContent( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
    });
  },
  componentWillUnmount(){

    this.ue.destroy()
  },
  render(){
    return (
      <div className={styles.container} onClick={(e)=>{e.stopPropagation()}}>
        <script id={this.props.name} type="text/plain"></script>
      </div>
    )
  }
})

export default Ueditor
