import request from '@/utils/request' // 导入request 工具类，封装好了axios
import { remove } from 'js-cookie'

export default{
    //1、根据课程id查询章节（包括章节下的字节）
    getCourseChapterById(id){
        return request({
            url: '/eduservice/chapter/getById/'+id,
            method: 'get'
        })
    },
    // 2、添加章节
    addChapter(chapter){
        return request({
            url: '/eduservice/chapter/addChapter',
            method: 'post',
            data: chapter
        })
    },
    //3、根据id查询章节
    getChapterById(id){
        return request({
            url: '/eduservice/chapter/getChapterInfo/'+id,
            method: 'get'
        })
    },
    //4、修改章节
    updateChapter(chapter){
        return request({
            url: '/eduservice/chapter/updateChapter/',
            method: 'post',
            data: chapter
        })
    },
    //5、删除章节
    removeChapter(id){
        return request({
            url: '/eduservice/chapter/remove/'+id,
            method: 'delete',
        })
    },
    // ========================小节=======================
    //6、添加小节 
    insertVideo(video){
        return request({
            url: '/eduservice/video/addVideo/',
            method: 'post',
            data: video
        })
    },
    removeVodeoById(id){
        return request({
            url: '/eduservice/video/removeVideo/'+id,
            method: 'delete'
        })
    },
    //根据小节id查询小节
    getByIdVideo(id){
        return request({
            url: '/eduservice/video/getVideo/'+id,
            method: 'get'
        })
    },
    //修改小节
    updateVideo(video){
        return request({
            url: '/eduservice/video/updateVideo',
            method: 'post',
            data: video
        })
    }
}