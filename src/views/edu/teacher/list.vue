    <template>
    <div class="app-contaier">
        <!-- 
            :inline="true" ：强制内容在一行显示
         -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="讲师名称">
                <el-input v-model="teacherQuery.name" placeholder="讲师名"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="teacherQuery.level" placeholder="讲师头衔">
                <el-option label="高级讲师" :value="1"></el-option>
                <el-option label="首席讲师" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
                <el-date-picker 
                    v-model="teacherQuery.begin" 
                    type="datetime" 
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00"/>
            </el-form-item>
            <el-form-item label="">
                <el-date-picker 
                    v-model="teacherQuery.end" 
                    type="datetime" 
                    placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList()" icon="el-icon-search">查询</el-button>
                <el-button type="default" @click="resetData()">情空</el-button>
            </el-form-item>
        </el-form>
        <!-- :data 单向绑定 -->
        <el-table :data="list" border fit="" highlight-current-row  style="width: 100%">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                   {{ (page -1)*limit + scope.$index+1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120"></el-table-column>
            <el-table-column label="头衔" width="120">
                <!--slot-scope="scope" 表示整个表格 scope.row.level：获取表level这一行    -->
                <template slot-scope="scope">
                    {{ scope.row.level === 1?'高级讲师':'首席讲师'}}
                </template>
            </el-table-column> 
            <el-table-column prop="career" label="资历" width="120"></el-table-column>
            <el-table-column prop="intro" label="简介"> </el-table-column>
            <el-table-column prop="gmtCreate" label="添加时间" width="160"> </el-table-column>
            <el-table-column prop="sort" label="排序" width="120"> </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <!-- router-link ：通过路由方式带参数跳转页面 /teacher/save/'+scope.row.id -->
                    <router-link :to="`/teacher/save/${scope.row.id}`">
                        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDateBuyId(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
    </el-table>
    <!-- 分页 
         v-model="page"     :双向绑定，绑定当前页
        :page-size="limit" :单向绑定，绑定每页记录数
        :total="total"      :单向绑定，绑定总记录数
        @currejt-change="getList" :每次分页切换去调用 getList 方法
        layout              ：显示数据，prev 上一页 next 下一页
    -->
    <el-pagination v-model="page" :page-size="limit" :total="total" 
        @current-change="getList" background layout="total,jumper,prev, pager, next" style="text-align: center"></el-pagination>
    </div>
</template>
<script>
// 导入teacher.js文件
import teacher from '@/api/teacher/teacher'
export default {
    //写核心代码位置
    data(){ // 定义变量和初始值
        return{
            list:null, // 查询之后接口返回集合
            page: 1, // 当前页
            limit: 8, // 每页记录数
            total: 0, //总记录数
            teacherQuery:{} // 条件封装对象
        }
    },
    created(){ // 在页面渲染之前执行
        // 调用
        this.getList()
    },
    methods:{ // 创建具体的方法，调用teacher.js中的方法
    // page = 1 当调用方法每页传递参数是，page就是1，传递了参数，page的值就是传递的那个参数
        getList(page = 1){
            this.page = page
            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
                .then(response => { // 请求成功
                    // 把获取的讲师数据赋值给list
                    this.list = response.data.TeacherPage.records
                    // 把总页数赋值给total
                    this.total = response.data.TeacherPage.total
                    //console.log(this.$route.params.page)
                    
                })
        },
        resetData(){ //清空方法
        //表单数据清空
        this.teacherQuery = {}
        //查询全部数据
        this.getList()
        }, 
        removeDateBuyId(id){ // 删除方法
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => { // 点击确定执行then 方法
                teacher.removeDateBuyId(id)
                .then(response =>{
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    }); 
                    //刷新页面--重新发起请求
                    this.getList(this.page);
                })
            
            }).catch(() => {  // 点击取消执行catch方法
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        }
    }
}
</script>