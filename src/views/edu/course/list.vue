<template>
<div class="app-container"> 
    <!--查询表单-->
  <el-form :inline="true" class="demo-form-inline">
    <!-- 所属分类：级联下拉列表 -->
    <!-- 一级分类 -->
    <el-form-item label="课程类别">
      <el-select
        v-model="searchObj.OneSubjectId"
        placeholder="请选择"
        @change="subjectLevelOneChanged">
        <el-option
          v-for="subject in subjectNestedList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
      </el-select>
      <!-- 二级分类 -->
      <el-select v-model="searchObj.TwoSubject" placeholder="请选择">
        <el-option
          v-for="subject in subSubjectList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
      </el-select>
    </el-form-item>
    <!-- 标题 -->
    <el-form-item>
      <el-input v-model="searchObj.title" placeholder="课程标题"/>
    </el-form-item>
    <!-- 讲师 -->
    <el-form-item>
      <el-select
        v-model="searchObj.teacherId"
        placeholder="请选择讲师">
        <el-option
          v-for="teacher in teacherList"
          :key="teacher.id"
          :label="teacher.name"
          :value="teacher.id"/>

      </el-select>
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
    <el-button type="default" @click="resetData()">清空</el-button>
  </el-form>

  <!-- 表格 -->
  <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="数据加载中"
    border
    fit
    highlight-current-row
    row-class-name="myClassList">
    <el-table-column
      label="序号"
      width="70"
      align="center">
      <template slot-scope="scope">
        {{ (page - 1) * limit + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="课程信息" width="470" align="center">
      <template slot-scope="scope">
        <div class="info">
          <div class="pic">
            <img :src="scope.row.cover" alt="scope.row.title" width="150px">
          </div>
          <div class="title">
            <a href="">{{ scope.row.title }}</a>
            <p>{{ scope.row.lessonNum }}课时</p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="是否发布" align="center">
      <template slot-scope="scope">
        {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
      </template>
    </el-table-column>

    <el-table-column label="创建时间" align="center">
      <template slot-scope="scope">
        {{ scope.row.gmtCreate.substr(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column label="发布时间" align="center">
      <template slot-scope="scope">
        {{ scope.row.gmtModified.substr(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column label="价格" width="100" align="center" >
      <template slot-scope="scope">
        {{ Number(scope.row.price) === 0 ? '免费' :
        '¥' + scope.row.price.toFixed(2) }}

      </template>
    </el-table-column>
    <el-table-column prop="buyCount" label="付费学员" width="100" align="center" >
      <template slot-scope="scope">
        {{ scope.row.buyCount }}人
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" align="center">
      <template slot-scope="scope">
        <router-link :to="'/course/info/'+scope.row.id">
          <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
        </router-link>
        <router-link :to="'/course/chapter/'+scope.row.id">
          <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
        </router-link>
        <el-button type="text" size="mini" @click="deleteCourse(scope.row.id)" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    :current-page="page"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="coursePage"
    />
</div>
</template>
<script>
import course from '@/api/teacher/course'
import subject from '@/api/teacher/subject'
import teacher from '@/api/teacher/teacher'
export default {
  data(){
    return{
      listLoading: true, // 实现显示讲师列表
      teacherList:[], //讲师集合
      list: null,  //课程信息
      subSubjectList:[], //二级分类信息
      subjectNestedList:[], //一级分类信息
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {
        OneSubjectId: '',
        TwoSubject: '',
        title: '',
        teacherId: ''
      }, // 查询条件


    }
  },
  created(){
    this.coursePage()
    this.getAllSubject()
    this.getListTeacher()
  },
  methods:{
    //分页查询课程信息
    coursePage(page = 1){
      this.page = page;
      this.listLoading = true;
      course.coursePageQuery(this.page,this.limit,this.searchObj)
        .then(resopnse => {
          this.list = resopnse.data.page.records
          this.total = resopnse.data.page.total
        })
        this.listLoading = false
    },
    //查询所有一级分类()
    getAllSubject(){
      subject.getAllSubjectList()
        .then(resopnse => {
          this.subjectNestedList = resopnse.data.list
        })
    },
    //当一级分类框，发送变化执行，(把一级分类中的二级分类赋值给TwoSubject)
    subjectLevelOneChanged(value){
      //value是一级分类id
      for(let i = 0; i < this.subjectNestedList.length;i++){
        if(value === this.subjectNestedList[i].id){
          this.subSubjectList = this.subjectNestedList[i].children
        }
      }
    },
    //删除课程
    deleteCourse(id){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { // 点击确定执行then 方法
                course.removeCourseBuId(id)
                  .then(resopnse => {
                    this.$message({
                      type:'success',
                      message: '删除成功'
                    })
                    //刷新页面
                    this.coursePage()
                  })
            
            }).catch(() => {  // 点击取消执行catch方法
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
    },
    //查询所有讲师
    getListTeacher(){
      teacher.getAllTeacher()
        .then(resopnse => {
          this.teacherList = resopnse.data.items
        })
    },
    //清空查询表单
    resetData(){
      this.searchObj = {} 
    },
    //查询课程
    fetchData(){
      this.coursePage()
    },
  }
}
</script>
<style scoped>
.myClassList .info {
    width: 450px;
    overflow: hidden;
}
.myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
}

.myClassList .info .pic a {
    display: block;

    width: 100%;
    height: 100%;

    margin: 0;
    padding: 0;
}
.myClassList .info .pic img {
    display: block;
    width: 100%;

}

.myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
}

.myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
}
.myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
}
</style>