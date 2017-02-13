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
  },
  componentWillUnmount(){
    this.props.onDestory(this.ue.getContent())
    this.ue.destroy()
  },
  render(){
    return (
      <div className={styles.container}>
        <script id="editor" type="text/plain"></script>
      </div>
    )
  }
})

export default Ueditor
