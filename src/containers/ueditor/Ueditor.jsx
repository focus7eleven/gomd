import React from 'react'
import styles from './Ueditor.scss'

const Ueditor = React.createClass({
  getDefaultProps(){
    return {

    }
  },
  componentDidMount(){

    var ue = UE.getEditor('editor',{
  		toolbars: [[
  			'fullscreen', 'source', '|',
  			'bold', 'italic', 'underline', '|', 'fontsize', '|', 'kityformula', 'preview'
  		]],
  	});
  },
  render(){
    console.log("00asdf")
    return (
      <div className={styles.container}>
        <script id="editor" type="text/plain"></script>
      </div>
    )
  }
})

export default Ueditor
