/**
 * Created by wuyq on 2017/1/20.
 */
/* 有些画面是一样的，可能就参数不一样，为了复用画面，将3级菜单对应的路由的path进行重新规划 */

const menuRoutePath = {
  "homework_area": { //公共作业
    path: "/index/homework_lib/homework_area"
  },
  "homework_school": { //学校作业
    path: "/index/homework_lib/homework_school"
  },
  "homework_self": { //公共课程
    path: "/index/homework_lib/homework_self"
  },
};

export default menuRoutePath;