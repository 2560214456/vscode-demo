<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

<!-- 
      ref="tree2"  类似于id，唯一标识
      :data="data2"         要显示的数据
      :props="defaultProps"  获取到子节点的名称
      :filter-node-method="filterNode"  调用方法，使用搜索功能
      class="filter-tree"
      default-expand-all
 -->
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subject from '@/api/teacher/subject'

export default {

  data() {
    return {
      filterText: '',
      data2: [], // 返回所有分类数据
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created(){
      this.getAllSubjectList()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
      getAllSubjectList(){
          subject.getAllSubjectList()
          .then(resopnse => {
              this.data2 = resopnse.data.list
          })
      },
    filterNode(value, data) {
      if (!value) return true  // .toLowerCase() 变成小写比较
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

