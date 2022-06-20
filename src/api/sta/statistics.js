import request from '@/utils/request'
export default{
    createStatistics(day){
        return request({
            url:'/staservice/daily/addDaily/'+day,
            method:'post'
        })
    },
    //查询生成图表需要的数据
    showChart(searchObj){
        return request({
            url:`/staservice/daily/showChart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
            method:'get'
        })
    }
}