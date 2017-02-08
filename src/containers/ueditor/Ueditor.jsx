import React from 'react'

const Ueditor = React.createClass({
  componentDidMount(){
    var ue = UE.getEditor('editor', {
    toolbars: [[
        'fullscreen', 'source', '|',
        'bold', 'italic', 'underline', '|', 'fontsize', '|', 'kityformula', 'preview'
    ]]
    });
  },
  // handleClick(){
  //   console.log("-->::")
  //   this._ue.getKfContent(function(content){
  //       console.log("-->:",content)
  //   })
  // },
  render(){
    return (
      <div>
        <script id="editor" type="text/plain" name="content" style={{width:'1024px',height:'500px'}}></script>
      </div>
    )
  }
})

export default Ueditor
