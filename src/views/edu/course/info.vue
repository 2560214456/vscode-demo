<template>
    <!-- //- 课程基本信息 -->
    <div class="app-container">
        <h2 style="text-align: center">发布新课程</h2>
            <el-steps :active="1" finish-status="success" align-center>
                <el-step title="填写课程基本信息"></el-step>
                <el-step title="创建课程大纲"></el-step>
                <el-step title="最终发布"></el-step>
            </el-steps>
            <!-- 课程基本信息 数据表单 -->
            <el-form label-width="120px">
              <el-form-item label="课程标题">
                  <el-input v-model="courseInfo.title" placeholder="示例:机器学习项目课程:从基础到搭配项目视频课程。专业名称注意大小写"></el-input>
              </el-form-item>
              <!-- 所属分类 -->
            <el-form-item label="课程分类">
                <!-- @change="subjectLevelOneChanged"：当下拉框中内容改变调用subjectLevelOneChanged方法 -->
                <el-select v-model="courseInfo.subjectParentId" 
                  placeholder="一级分类" @change="subjectLevelOneChanged">
                    <el-option v-for="subject in subjectOneList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
                <!-- 二级分类 -->
                <el-select v-model="courseInfo.subjectId"   placeholder="二级分类">
                    <el-option v-for="subject in subjectTwoList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            </el-form-item>

              <!-- 课程讲师 -->
                <el-form-item label="课程讲师">
                    <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
                        <el-option v-for="teacher in teacherList"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>

              <el-form-item label="总课时">
                  <el-input-number v-model="courseInfo.lessonNum" controls-position="right" :min="0" />
              </el-form-item>
              <!-- 课程简介 -->
              <el-form-item label="课程简介">
                  <!-- <el-input v-model="courseInfo.description" placeholder="课程简介"></el-input> -->
                  <el-card style="height: 400px;">
                    <quill-editor v-model="courseInfo.description" ref="myQuillEditor" style="height: 500px;" :options="editorOption">
                    </quill-editor>
                </el-card>
              </el-form-item>
              <!-- 课程封面  -->
              <el-form-item label="课程封面">   
                  <el-upload 
                    :action="BASE_API+'/eduoss/fileoss'"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    :show-file-list="false"
                    class="avatar-uploader">
                    <img :src="courseInfo.cover" width="360">
                  </el-upload>
              </el-form-item>
              <!-- 课程价格-->
              <el-form-item label="课程价格">
                  <el-input-number v-model="courseInfo.price" :min="0" controls-position="right" />元
              </el-form-item>
              <!-- 保存下一步  -->
              <el-form-item >
                    <el-button style="margin-top: 12px;" :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
                </el-form-item>
            </el-form>
    </div>
</template>
<script>
import course from '@/api/teacher/course'
import {
    quillEditor
  } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
export default({
    name: 'FuncFormsEdit',
    components: {
      quillEditor
    },
    data() {
      return{
          saveBtnDisabled: false,  // 默认不显示
          courseInfo:{
              title:'', //课程标题
              subjectId:'二级分类', //讲师id  （二级分类）
              teacherId:'1', //课程分类id  
              lessonNum: 0, //总课时
              description: '',//课程描述
              cover: 'https://edu-222000.oss-cn-guangzhou.aliyuncs.com/2022/05/30/a29295dc2dfe4a53a1355387ec02911e360wallpaper.jpg', //课程封面图片URL地址
              price: 0, //课程价格
              subjectParentId: "一级分类"  //课程类型id（一级分类）
          },
          BASE_API: process.env.VUE_APP_BASE_API, //接口API地址
          teacherList: [], //讲师列表
          subjectOneList: [], //课程分类(一级分类)
          subjectTwoList:[], //课程分类（二级分类）
          content: null,
          editorOption: {},
          courseId: ''
      }  
    },
    created(){
        //判断路径中是否有id
        if(this.$route.params && this.$route.params.id){
            //根据id查询课程基本信息
            this.getByIdCourse()
        }else{
            //初始化所有讲师
            this.getAllteacherList()
            //初始化所有一级分类
            this.getOneAllSubjectList()
        }
    },
    methods:{
        //保存下一步
         saveOrUpdate() {
             //判断路径中是否有id，有就是修改没有就是添加
             if(this.$route.params && this.$route.params.id){
                 this.courseId = this.$route.params.id
                //修改
                course.updateCourse(this.$route.params.id,this.courseInfo)
                    .then(resopnse => {
                        //提示
                        this.$message({
                            type: 'success',
                            message: '修改课程信息成功'
                        })
                        //跳转到下一个页面
                        this.$router.push({path:`/course/chapter/${this.courseId}`})
                    })
             }else{
                //提交数据到数据库
                course.addCourseInfo(this.courseInfo)
                    .then(resopnse =>{
                        //提示
                        this.$message({
                            type: 'success',
                            message: '填写课程信息成功'
                        })
                        //跳转到下一个页面
                        this.$router.push({path:`/course/chapter/${resopnse.data.id}`})
                    })
             }
             
        },
         //获取讲师列表（赋值给teacherList）
        getAllteacherList(){
            course.getAllTeacher()
            .then(resopnse => {
                this.teacherList = resopnse.data.items
            })
        },
        //查询课程分类List（赋值给）
        getOneAllSubjectList(){
            course.getOneSubjectList()
            .then(resopnse =>{
                this.subjectOneList = resopnse.data.list
            })
        },
        //点击某个一级分类，触发change，显示对应二级分类
        subjectLevelOneChanged(TwoSubject){
            //value就是一级分类的id值
            for(let i = 0;i < this.subjectOneList.length;i++){
                if(this.subjectOneList[i].id === TwoSubject){
                    this.subjectTwoList = this.subjectOneList[i].children
                    //把二级分类的id值情况
                    this.courseInfo.subjectId = ''
                }
                
                
            }
        },
        //课程封面图片上传之前 执行
        beforeAvatarUpload(file){
            const isJPG = file.type == 'image/jpeg'
            const isLt2M = file.size /1024 / 1024 < 2
            if(!isJPG){
                this.$message.error("上传课程封面图片只能是 JPG 格式！")
            }
            if(!isLt2M){
                this.$message.error("上传课程封面图片大小不能超过2MB")
            }
            return isJPG && isLt2M
        },
        //头像上传成功 执行
        handleAvatarSuccess(res,file){
            this.courseInfo.cover = res.data.url
        },
        //根据id查询课程基本
        getByIdCourse(){
            course.getCourseByid(this.$route.params.id)
                .then(resopnse => {
                    // 在courseInfo中有课程基本信息，包含一级分类id 和 二级分类id
                    this.courseInfo = resopnse.data.courseInfo
                    // 查询所有分类信息，包含一级分类 二级分类
                    course.getSubject()
                        .then(resopnse => {
                            //一级分类中包含了二级分类
                            this.subjectOneList = resopnse.data.list
                            //遍历所以一级分类
                            for(let i = 0;i < this.subjectOneList.length;i++){
                                if(this.courseInfo.subjectParentId === this.subjectOneList[i].id){
                                    this.subjectTwoList = this.subjectOneList[i].children
                                }
                            }
                            //初始化所有讲师
                            this.getAllteacherList()
                        })
                })
        }
    }
})
</script>
