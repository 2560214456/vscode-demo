<template>
    <!-- //- 创建课程大纲 -->
    <div class="app-container">
        <h2 style="text-align: center">发布新课程</h2>
            <el-steps :active="2" finish-status="success">
                <el-step title="填写课程基本信息"></el-step>
                <el-step title="创建课程大纲"></el-step>
                <el-step title="最终发布"></el-step>
            </el-steps>
            <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
            <!-- 添加章节的弹框 -->
            <el-dialog  :visible.sync="dialogChapterFormVisble" title="添加章节">
                <el-form :model="chapterInfo" label-width="120px">
                  <el-form-item label="章节标题">
                      <el-input v-model="chapterInfo.title"></el-input>
                  </el-form-item>
                  <el-form-item label="章节排序">
                      <el-input-number v-model="chapterInfo.sort" :min="0" controls-position="right"/>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogChapterFormVisble = false">取消</el-button>
                    <el-button type="primary" @click="saveOrUpdate">确定</el-button>
                </div>
            </el-dialog>
            <!-- 添加小节的弹框 -->
            <el-dialog  :visible.sync="dialogVideoFormVisble" title="添加课时">
                <el-form :model="videoInfo" label-width="120px">
                  <el-form-item label="课时标题">
                      <el-input v-model="videoInfo.title"></el-input>
                  </el-form-item>
                  <el-form-item label="可是排序">
                      <el-input-number v-model="videoInfo.sort" :min="0" controls-position="right"/>
                  </el-form-item>
                  <el-form-item label="是否免费">
                      <el-radio-group v-model="videoInfo.isFree">
                        <el-radio :label="true">免费</el-radio>
                        <el-radio :label="false">默认</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="上传视频">
                      <!-- 
                :on-success="handleVodUploadSuccess" 添加成功
                :action="BASE_API+'/eduvod/video/uploadAlyVideo'" 保存视频调用接口方法
                :on-remove="handleRemove"  删除之后调用的方法
                :before-remove="beforeRemove"  确认删除列表数据 返回false不删除，返回true删除
                :limit="1"   最大上传数
                :on-exceed="handleExceed"    文件超出个数限执行的方法
                :file-list="fileList">  文件列表
                       -->
                        <el-upload
                            class="upload-demo"
                            :on-success="handleVodUploadSuccess"
                            :action="BASE_API+'/eduvod/video/uploadAlyVideo'"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <el-tooltip placement="right-end">
                            <div slot="content">最大支持1G，<br>
                                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                            <i class="el-icon-question"/>
                        </el-tooltip>
                        </el-upload>

                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVideoFormVisble = false">取消</el-button>
                    <el-button type="primary" @click="saveOrUpdateVideo">确定</el-button>
                </div>
            </el-dialog>
            <!-- 章节 -->
            <div class="chanpterList">
                
                <li v-for="chapter in CourseChapters" :key="chapter.id">
                    <p>
                        {{chapter.title}}
                        <span class="acts">
                            <el-button type="text" @click="insertVideo(chapter.id)">添加课时</el-button>
                            <el-button type="text" @click="reviseChapter(chapter.id)" >编辑</el-button>
                            <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
                        </span>

                    </p>
                    <!-- 视频 -->
                    <ul class="chanpterList videoList">
                        <li v-for="section in chapter.courseSections" :key="section.id">
                            <p>{{section.title}}
                                <span class="acts">
                                    <el-button type="text" @click="updateVideo(section.id)">编辑</el-button>
                                    <el-button type="text" @click="removeVideo(section.id)">删除</el-button>
                                </span>
                            </p>
                        </li>
                    </ul>
                </li>
            </div>
            <el-form label-width="120px">
                <el-form-item >
                    <el-button @click="previous">上一步</el-button>
                    <el-button style="margin-top: 12px;" :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
                </el-form-item>
            </el-form>
    </div>
</template>
<script>
import chapter from '@/api/teacher/chapter'
import video from '@/api/teacher/video'
export default({
    data() {
      return{
          fileList:[], // 视频列表
          saveBtnDisabled: false,  // 默认不显示
          CourseId: '',
          BASE_API: process.env.VUE_APP_BASE_API,
          CourseChapters: [],
          chapterInfo: { //封装章节数据
                title: '',
                sort: 0
          },
          videoInfo:{ //封装小节
                title: '',  //标题
                sort: '', //排序
                isFree: false, //是否免费
                videoSourceId: '', // 云视频id
                videoOriginalName:''//视频名称
          },
          dialogChapterFormVisble: false,  //添加章节弹窗默认不显示
          dialogVideoFormVisble: false   //添加小节弹出默认不显示
      }
    },
    created(){
        if(this.$route.params && this.$route.params.id){
            this.CourseId = this.$route.params.id
            this.getChapterById(this.CourseId)
        }
    },
    methods:{
        //上一步
        previous(){
            this.$router.push({path:'/course/info/'+this.CourseId})
        },
        //下一步
        next() {
            this.$router.push({path:'/course/publish/'+this.CourseId})
        },
        //根据课程id查询所有章节
        getChapterById(){
            chapter.getCourseChapterById(this.CourseId)
                .then(resopnse => {
                    this.CourseChapters = resopnse.data.courseChapters
                })
        },
        //开启弹框
        openChapterDialog(id){
            this.dialogChapterFormVisble = true
            //清空弹窗
            this.chapterInfo.title = ''
            this.chapterInfo.sort = 0
        },
        //添加章节
        saveOrUpdate(){
            this.chapterInfo.courseId = this.CourseId
            if(!this.chapterInfo.id){
                //没有id添加操作
                //把课程id 设置进chapter对象中
                chapter.addChapter(this.chapterInfo)
                    .then(resopnse =>{
                        //关闭弹框
                        this.dialogChapterFormVisble = false
                        //提示信息
                        this.$message({
                            type: 'success',
                            message: '添加课程章节信息成功'
                        })
                        //刷新页面
                        this.getChapterById()
                    })
            }else{
                //有id修改操作
                this.updateChapter()

            }
            
        },
        //弹出修改框，回显需要修改的信息
        reviseChapter(chapterId){
            chapter.getChapterById(chapterId)
                .then(resopnse => {
                    //显示修改弹框
                    this.dialogChapterFormVisble = true
                    //回显信息
                    this.chapterInfo = resopnse.data.chapter
                    
                })
        },
        //修改方法
        updateChapter(){
            chapter.updateChapter(this.chapterInfo)
                .then(request => {
                    //关闭弹出
                    //关闭弹框
                        this.dialogChapterFormVisble = false
                        //提示信息
                        this.$message({
                            type: 'success',
                            message: '修改课程章节信息成功'
                        })
                        //刷新页面
                        this.getChapterById()
                })
        },
        //删除课程章节
        deleteChapter(id){
            this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { // 点击确定执行then 方法
                chapter.removeChapter(id)
                .then(response =>{
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    }); 
                    //刷新页面--重新发起请求
                    this.getChapterById()
                })
            
            }).catch(() => {  // 点击取消执行catch方法
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        // =====================小节操作===========================
        //添加小节（框）
        insertVideo(chapterId){
            this.videoInfo.chapterId = chapterId
            this.videoInfo.courseId = this.CourseId
            //清空添加小节框中的内容
            this.videoInfo.title = ''
            this.videoInfo.sort = 0
            //情况视频列列表
            this.fileList = []
            //打开添加小节框
            this.dialogVideoFormVisble = true
        },
        
        //添加小节 or 修改小节
        saveOrUpdateVideo(){
            if(!this.videoInfo.id){
                // 没有id就是新增
                chapter.insertVideo(this.videoInfo)
                .then(resopnse => {
                    //关闭弹框
                    this.dialogVideoFormVisble = false
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    }); 
                    //刷新页面
                    this.getChapterById()
                })
            }else{
                //有id就是修改
                chapter.updateVideo(this.videoInfo)
                    .then(resopnse => {
                        //关闭修改框
                        this.dialogVideoFormVisble = false
                        //提示信息
                        this.$message({
                            type: 'success',
                            message: '修改成功！'
                        })
                        //刷新页面
                        this.getChapterById()
                    })
            }
            
        },
        //删除小节
        removeVideo(id){
            this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { // 点击确定执行then 方法
                chapter.removeVodeoById(id)
                .then(resopnse => {
                    //确认框
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    //刷新页面
                    this.getChapterById()
                })
            }).catch(() => {  // 点击取消执行catch方法
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //修改小节-信息回旋
        updateVideo(id){
            chapter.getByIdVideo(id)
                .then(resopnse =>{
                    //回填信息
                    this.videoInfo = resopnse.data.video
                    if(this.videoInfo.videoOriginalName){
                        // 回弹视频列表
                        this.fileList = [{'name':this.videoInfo.videoOriginalName}]
                    }
                    
                    //打开编辑小节框
                    this.dialogVideoFormVisble = true
                    
                })
        },
        // ========================上传视频====================================
        //上传视频成功的回调
        handleVodUploadSuccess(resopnse,file,fileList){
            //上传视频id赋值
            this.videoInfo.videoSourceId = resopnse.data.videoId
            //上传视频名称赋值
            this.videoInfo.videoOriginalName  = file.name
        },
        // 文件超出个数限制时的钩子
        handleExceed(){
            this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },
        //删除文件之后执行方法
        handleRemove(){
            video.removeVideo(this.videoInfo.videoSourceId)
                .then(resopnse => {
                    this.$message({
                        type: 'suucess',
                        message: '删除视频成功'
                    })
                     //上传视频id赋值
                     this.videoInfo.videoSourceId = ''
                     //上传视频名称赋值
                     this.videoInfo.videoOriginalName = ''
                     //文件列表清空
                     this.fileList = []
                })
        },
        //删除文件之前执行方法 参数是： 文件  文件列表
        beforeRemove(file,fileList){
            return this.$confirm(`确定移除 ${ file.name }？`);
        }











    }
    

    
})
</script>
<style scoped>

.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}

.chanpterList li{
    position: relative;
}
.chanpterList P{
    /* float: left; */
    font-size: 20px;
    margin: 10px 0;
    padding: 15px;
    height: 70px;
    line-height: 40px;
    width: 100%;
    border: 1px dotted #DDD;   
}
.videoList{
    padding-left: 50px;
}
.videoList P{
    /* float: left; */
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    widows: 100%;
    border: 1px dotted #DDD;
}
.acts{
    float: right;
}
</style>