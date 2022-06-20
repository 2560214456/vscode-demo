import request from '@/utils/request' // 导入request 工具类，封装好了axios

export default{
    //1、讲师列表(条件查询分页)
    //current 当前页  limit，每页总记录数  teacherQuery查询的条件对象
    getTeacherListPage(current,limit,teacherQuery){
        return request({
        //两种写法都可以
       // url: '/eduservice/teacher/pageTeacherCondition'+current+"/"+limit,
       url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
       method: 'post',
       //teacherQuery条件对象。后端使用的RequestBody获取数据
       // data表示把对象转化为json传递到接口里面
       data: teacherQuery
        })
        
    },
    //删除讲师
    removeDateBuyId(id){
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete',
        })
    },
    //添加讲师
    savTeacher(teacher){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },
    //根据id查询讲师
    getTeacherInfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    //修改讲师
    updateTeacher(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    },
    //查询所有讲师
    getAllTeacher(){
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get'
        })
    }
}