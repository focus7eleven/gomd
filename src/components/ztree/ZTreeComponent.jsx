import React from 'react'
import {fromJS,List} from 'immutable'

const zNodes =[
  { id:1, pId:0, name:"展开、折叠 自定义图标不同", open:true, },
  { id:11, pId:1, name:"叶子节点1", },
  { id:12, pId:1, name:"叶子节点2", },
  { id:13, pId:1, name:"叶子节点3", },
  { id:2, pId:0, name:"展开、折叠 自定义图标相同", open:true,},
  { id:21, pId:2, name:"叶子节点1", },
  { id:22, pId:2, name:"叶子节点2", },
  { id:23, pId:2, name:"叶子节点3", },
  { id:3, pId:0, name:"不使用自定义图标", open:true },
  { id:31, pId:3, name:"叶子节点1"},
  { id:32, pId:3, name:"叶子节点2"},
  { id:33, pId:3, name:"叶子节点3"}
];
const ZTreeComponent = React.createClass({
  getDefaultProps(){
    return {
      treeData:fromJS(zNodes),
      checkedData:[],
    }
  },
  componentDidMount(){
    const setting = {
			view: {
				selectedMulti: false
			},
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			},
		};
    let that = this
    this.ztree = $.fn.zTree.init($("#treeDemo"), setting, this.props.treeData.map(v => {
      if(that.props.checkedData.find(n => n.get('resource_id')==v.get('id'))){
        return v.set('checked',true)
      }else{
        return v
      }
    }).toJS());
  },
  componentWillUnmount(){
    this.ztree.destroy();
  },
  getCheckedData(){
    return fromJS(this.ztree.getCheckedNodes(true));
  },
  render(){
    return (
      <div style={{height:'100%'}}>
        <ul id="treeDemo" className="ztree"></ul>
      </div>
    )
  }
})

export default ZTreeComponent
