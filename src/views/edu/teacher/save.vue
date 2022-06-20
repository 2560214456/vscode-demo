<template>
    <div class="app-contaier">
        <el-form label-width="120px">
          <el-form-item label="讲师名称">
              <el-input v-model="teacher.name" />
          </el-form-item>
          <el-form-item label="讲师排序">
              <el-input-number v-model="teacher.sort" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="讲师头衔">
              <el-select v-model="teacher.level" clearable  placeholder="请选择">
                  <!-- 
                      数据类型一定要和取出的json中的一致，否则没法回填
                      因此，这里value使用动态绑定的值，保证其属性是number
                   -->
                <el-option label="高级讲师" :value="1"></el-option>
                <el-option label="首席讲师" :value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="讲师资历">
              <el-input v-model="teacher.career"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
              <el-input v-model="teacher.intro" :rows="10" type="textarea"></el-input>
          </el-form-item>
          <!-- 讲师头像 -->
          <el-form-item label="讲师头像">
              <!-- 头衔缩略图 -->
              <pan-thumb :image="String(teacher.avatar)"/>
              <!-- 文件上传按钮 -->
              <el-button type="primary" icon="el-icon-upload" @click="imageecropperShow=true">更换头像</el-button>
              <!-- 
                  v-show :是否显示上传组件
                  :key  ：类似于id  如果一个页面多个图片上传组件，可以做区分
                  :url  ：后台上传的url地址
                  @close :关闭上传组件
                  @crop-upload-success  :上传成功的回调
               -->
               <image-cropper
                    v-show="imageecropperShow"
                    :width="300"
                    :height="300"
                    :key="imagecroppperKey"
                    :url="VUE_APP_BASE_API+'/eduoss/fileoss'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>
          </el-form-item>
          <el-form-item >
              <!-- :disabled="saveBtnDisabled" :是否可用。默认false -->
              <el-button type="primary" :disabled="saveBtnDisabled" @click="saveOrUpdate">保存</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
import teacherApi from '@/api/teacher/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
    components: {ImageCropper,PanThumb}, // 声明
    data() {
        return{
            teacher:{
                name: '', //讲师名称
                sory: 0,  // 讲师排序
                level: 1, // 讲师级别
                career: '', // 讲师简介
                intro: '', // 讲师资历
                avatar: 'https://edu-222000.oss-cn-guangzhou.aliyuncs.com/2022/05/28/7ef6ed29557b448f80ec66a740a477a7file.png' // 讲师头像
            },
            imageecropperShow: false, // 上传弹出的组件
            imagecroppperKey: 0,  //上传头像组件的唯一标识
            VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,//获取VUE_APP_BASE_API .env.development 里面的地址
            saveBtnDisabled: false // 保存按钮是否禁用 false表示禁用
        }
    },
    created(){ // 页面渲染之前执行
        this.init()
    },
    watch:{ // 路由监听
        $route(to,from){ // 当路由发生变化，方法就会执行
            console.log(from.path)
            console.log(to.path)
            this.init()
        }
    },
    methods:{
        //关闭上传弹窗的方法
        close(){
            this.imageecropperShow = false;
            //上传组件初始化
            this.imagecroppperKey = this.imagecroppperKey+1
        },
        //上传成功的回调
        cropSuccess(data){
            this.imageecropperShow = false;
            console.log(data.url)
            //上传成功返回图片URL地址
            this.teacher.avatar = data.url
            //上传组件初始化
            this.imagecroppperKey = this.imagecroppperKey+1
        },
        init(){
            //判断路径是否有id值
            if(this.$route.params && this.$route.params.id){
                //从路径中获取id 值
                const id = this.$route.params.id;
                //调用根据id 查询讲师信息的方法
                this.getTeacherById(id);
            }else{
                //新增 ，清空标签
                this.teacher = {}
            }
        },
        //添加和者修改
        saveOrUpdate(){
            //teacher中有id就是修改，没有就是添加
            if(!this.teacher.id){
                //添加
                this.saveTeacher()
            }else{
                //修改
                this.updateTeacherById();
            }
        },
        //添加讲师方法
        saveTeacher(){
            teacherApi.savTeacher(this.teacher)
            .then(resopnse => {
                 this.$confirm('添加成功, 是否添加?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { // 点击确定执行then 方法
                //提示信息
                this.$message({
                     type: 'success',
                    message: '保存成功!'
                }); 
                //刷新当前页面
                location.reload()
            
            }).catch(() => {  // 点击取消执行catch方法
                 //回到列表  路由跳转(跳转到显示所有讲师列表页面)
                this.$router.push({path:'/teacher/table'})      
            });













            //     // 添加成功
            //     this.$message({
            //         type: 'success',
            //         message: '添加成功'
            //     });
            //     //回到列表  路由跳转(跳转到显示所有讲师列表页面)
            //    // this.$router.push({path:'/teacher/table'})
            //     //刷新当前页面
            //      location.reload()

            })
        },
        //根据讲师id查询
        getTeacherById(id){
            teacherApi.getTeacherInfo(id)
            .then(resopnse => {
                this.teacher = resopnse.data.teacher
            })
        },
        //修改讲师
        updateTeacherById(){
            teacherApi.updateTeacher(this.teacher)
            .then(resopnse => {
                //提示信息
                this.$message({
                    type: 'success',
                    message: '修改成功'
                }); 
                //回到列表页面 page /teacher/table
                this.$router.push({path: `/teacher/table`})
            })
        }
        
    }

}
</script>
