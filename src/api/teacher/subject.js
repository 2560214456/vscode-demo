import request from '@/utils/request' // 导入request 工具类，封装好了axios

export default{
    //1、课程分类列表
    getAllSubjectList(){
        return request({
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
        })
    }
}