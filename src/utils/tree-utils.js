import {fromJS,List,Map} from 'immutable'

export function getTreeFromList(list){
    let newList_1 = list.groupBy(v => v.get('pId')).filter(v => v.get('pId')!='-1')
    console.log("-->:",newList_1.toJS())
    let newList = newList_1.map((v,k) => {
      let parent = list.find(v => v.get('id')==k)
      return parent?parent.set('children',v):Map({pId:0,children:v})
    }).toList()
    console.log("haha:",newList.toJS())
    debugger
    if(newList.size == 1){
      return newList
    }else{
      return getTreeFromList(newList)
    }

}

export function findInTree(tree,target){
  return tree.find(v => v.get('id')==target)||tree.reduce((pre,cur)=>{
    return !pre.isEmpty()?pre:findInTree(cur.get('children'),target)
  },List())
}

export function findPathInTree(tree,path=List(),target){
  tree.forEach((node,key) => {
    if(node.get('id')==target){
      path = path.push(key)
    }else{
      if(node.get('children')&&!node.get('children').isEmpty()){
        let subPath = findPathInTree(node.get('children'),path,target)
        path = subPath.size==path.size?path:path.push(key).push('children').concat(subPath)
      }
    }
  })
  return path
}
