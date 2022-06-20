import request from '@/utils/request' // 导入request 工具类，封装好了axios

export default{
    //1、添加课程信息功能
    addCourseInfo(courseInfo){
        return request({
            url: '/eduservice/course/addCourse',
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有课程分类
    getSubject(){
        return request({
            url: '/eduservice/subject/getAllSubject',
            method: 'get'
        })
    },
    //查询所有讲师
    getAllTeacher(){
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get'
        })
    },
    //查询课程分类的所有一级分类
    getOneSubjectList(){
        return request({
            url: '/eduservice/subject/getAllSubject',
            method: 'get'
        })
    },
    //根据id查询课程基本信息
    getCourseByid(id){
        return request({
            url: '/eduservice/course/getCourseById/'+id,
            method: 'get'
        })
    },
    //修改讲师基本信息
    updateCourse(id,course){
        return request({
            url: '/eduservice/course/updateCourse/'+id,
            method: 'post',
            data: course
        })
    },
    //课程确认信息显示
    getPublihCourseInfo(id){
        return request({
            url: '/eduservice/course/getCoursePublishVo/'+id,
            method: 'get'
        })
    },
    //课程的最终发布
    CorseFinAllyPublish(id){
        return request({
            url: '/eduservice/course/publishCourse/'+id,
            method: 'post'
        })
    },
    //分页查询-条件查询
    coursePageQuery(page,limit,courseQuery){
        return request({
            url: `/eduservice/course/coursePage/${page}/${limit}`,
            method:'post',
            params: courseQuery
        })
    },
    //删除课程
    removeCourseBuId(id){
        return request({
            url: '/eduservice/course/deleteCourse/'+id,
            method: 'delete'
        })
    }
    
}