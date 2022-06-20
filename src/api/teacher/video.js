import request from '@/utils/request' // 导入request 工具类，封装好了axios

export default{
    removeVideo(id){
        return request({
            url: '/eduvod/video/removeVideo/'+id,
            method: 'delete'
        })
    }
}