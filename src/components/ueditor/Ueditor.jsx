import React from 'react'
import styles from './Ueditor.scss'

const Ueditor = React.createClass({
  getDefaultProps(){
    return {

    }
  },
  componentDidMount(){
    console.log("asdfasdfasdf")
    this.ue = UE.getEditor('editor',{
  		toolbars: [[
  			'fullscreen', 'source', '|',
  			'bold', 'italic', 'underline', '|', 'fontsize', '|', 'kityformula', 'preview'
  		]],
  	});
  },
  componentWillUnmount(){
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
