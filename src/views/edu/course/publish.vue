<template>
    <div class="app-container">
        <h2 style="text-align: center">最终确认</h2>
        <el-steps :active="3" finish-status="success">
                <el-step title="填写课程基本信息"></el-step>
                <el-step title="创建课程大纲"></el-step>
                <el-step title="最终发布"></el-step>
        </el-steps>
        <div class="ccInfo">
            <img :src="publishCourse.cover">
            <div class="main">
                <h2>{{publishCourse.title}}</h2>
                <p class="gray"><span>共{{publishCourse.lessonNum}}课时</span></p>
                <p><span>所属分类：{{publishCourse.oneSubject}} ------ {{publishCourse.twoSubject}}</span></p>
                <p>课程讲师:{{publishCourse.teacherName}}</p>
                <h3 class="red">￥{{ publishCourse.price }}</h3>
            </div>
        </div>


        <div>
            <el-button @click="previous">返回修改</el-button>
            <el-button type="primary" :disabled="saveBtDisabled" @click="publish">发布课程</el-button>
        </div>
    </div>
</template>
<script>
import course from '@/api/teacher/course'
export default {
    data(){
        return{
            saveBtDisabled: false, //保证安装是否禁用
            courseId: '',
            publishCourse:{}
        }
    },
    created(){
        //获取路由中的课程id值
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getCoursePublish();
        }
        
    },
    methods:{
        //返回上一步
        previous(){
            this.$router.push({path:`/course/chapter/${this.courseId}`})
        },
        //发布课程
        publish(){
            this.$confirm('是否确认发布课程, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { // 点击确定执行then 方法
               course.CorseFinAllyPublish(this.courseId)
                .then(resopnse => {
                    //提示信息
                    this.$message({
                        type:'success',
                        message:'发布成功'
                    })
                    //跳转课程列表页面
                    this.$router.push({path:`/course/list`})
                })
            }).catch(() => {  // 点击取消执行catch方法
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });



            
        },
        //获取确认的课程信息
        getCoursePublish(){
            course.getPublihCourseInfo(this.courseId)
                .then(resopnse => {
                     this.publishCourse = resopnse.data.coursePublishVo
                })
        },
    }
}
</script>
<style scoped>
.ccInfo{
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img{
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main{
    margin-left: 520px;
}
.ccInfo .main h2{
    font-size: 29px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p{
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main p{
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3{
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>
