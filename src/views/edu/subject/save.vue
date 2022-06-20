<template>
    <div class="app-container">
        <el-form label-width="120px">
            <el-form-item label="信息描述">
                <el-tag type="info">excel模板说明</el-tag>
                <el-tag>
                    <i class="el-icon-download"/>
                    <a :href="'/static/01.xlsx'">点击下载模板</a>
                </el-tag>
            </el-form-item>
            <el-form-item label="选择excel">
                <!-- 
                    ref="upload"  组件唯一标识
                    name="file"
                    accept="application/vnd-ms-excel"  设置上传文件的格式，只能是.excel格式
                    :action="BASE_API+'/eduservice/subject/addSubject'"   上传的接口地址
                    :on-success="fileUploadSuccess"   上传成功回调方法
                    :on-error="fileUploadError"       上传失败回调方法
                    :disabled="importBtnDisadled"     按钮是否可用
                    :limit="1"                        限制文件上传数量为1
                    :auto-upload="false"  是否自动上传
                 -->
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    name="file"
                    accept="application/vnd-ms-excel"
                    :action="BASE_API+'/eduservice/subject/addSubject'" 
                    :on-success="fileUploadSuccess"
                    :on-error="fileUploadError"
                    :disabled="importBtnDisadled"
                    :limit="1"
                    
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button 
                    :loading="loading"
                    style="margin-left: 10px;" 
                    size="small" 
                    type="success" 
                    @click="submitUpload">{{fileUploadBtnText}}</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return{
            BASE_API: process.env.VUE_APP_BASE_API, //接口API地址
            fileUploadBtnText: '上传到服务器', // 按钮文字
            importBtnDisadled: false, //按钮是否禁用
            loading: false // 是否加载文件
        }
    },
    created(){

    },
    methods:{
        //点击按钮上传文件
        submitUpload(){
            this.importBtnDisadled = true
            this.loading = true
            // 提交表单 upload 类似于表单id
            // document.getElementById("upload").submit()  原始的js代码，
            this.$refs.upload.submit()
        },
        //上传成功回调
        fileUploadSuccess(){
            //提示信息
            this.loading = false
            this.$message({
                type: 'success',
                message: '添加课程分类成功'
            })
            //跳转显示课程列表  （路由跳转）
            this.$router.push({path:'/subject/list'})
        },
        //上传失败回调
        fileUploadError(){
            //提示信息
            this.loading = false
            this.$message({
                type: 'error',
                message: '添加课程分类失败'
            })
        }
    }
}
</script>
