/**
 * Created by wuyq on 2017/1/20.
 */
/* 有些画面是一样的，可能就参数不一样，为了复用画面，将3级菜单对应的路由的path进行重新规划 */

const menuRoutePath = {
  "homework_area": { //公共作业
    path: "/index/homework/homework_lib/homework_area"
  },
  "homework_school": { //学校作业
    path: "/index/homework/homework_lib/homework_school"
  },
    "edit_homework":{
     path:"/index/homework/setHomework/edit/"
    },
  "homework_self": { //公共课程
    path: "/index/homework/homework_lib/homework_self"
  },
  "notification": { //收到的通知
    path: "/index/notify-mgr/notify_lib/notification"
  },
  "mynotification": { //发送的通知
    path: "/index/notify-mgr/notify_lib/mynotification"
  },
  "undonotification": { //待处理通知
    path: "/index/notify-mgr/notify_lib/undonotification"
  },
  "task": { //已处理任务
    path: "/index/notify-mgr/notify_lib/task"
  },
  "mytask": { //发送的任务
    path: "/index/notify-mgr/notify_lib/mytask"
  },
  "undotask": { //待处理任务
    path: "/index/notify-mgr/notify_lib/undotask"
  },
  "cityeduinfo": { //市直动态
    path: "/index/notify-mgr/notify_lib/cityeduinfo"
  },
  "schooleduinfo": { //校园风采
    path: "/index/notify-mgr/notify_lib/schooleduinfo"
  },
  "classeduinfo": { //班级剪影
    path: "/index/notify-mgr/notify_lib/classeduinfo"
  },
    "kindergarten":{
      path:"/index/teaching_center/plan/kindergarten"
    },
    "primarySchool":{
        path:"/index/teaching_center/plan/primarySchool"
    },
    "juniorHighSchool":{
        path:"/index/teaching_center/plan/juniorHighSchool"
    },
    "seniorMiddleSchool":{
        path:"/index/teaching_center/plan/seniorMiddleSchool"
    },
    "planDetail":{
        path:"/index/teaching_center/planDetail/"
    }
};

export default menuRoutePath;