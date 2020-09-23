<template>
 <div class="bread">
   <h3>{{breadList[0].meta.title}}</h3>
   <el-breadcrumb separator=">">
     <el-breadcrumb-item
       v-for="(item,index) in breadList"
       :key="index"
     >{{item.meta.title}}</el-breadcrumb-item>
   </el-breadcrumb>
   <el-divider></el-divider>
 </div>
</template>
<script>
export default {
  data () {
    return {
      breadList: [] // 路由集合
    }
  },
  watch:{
    $route(){
      this.getBreadcrumb();
    }
  },
  methods: {
    isHome(route) {
      return route.name === "首页";
    },
    getBreadcrumb() {
      let matched = this.$route.matched;
      /*if (!this.isHome(matched[0])) {
        matched = [{ path: "/", meta: { title: "首页" } }].concat(matched);
      }*/
      this.breadList = matched;
    }
  },
   created() {
    this.getBreadcrumb();
  }
}
</script>
<style scoped>
  .bread {
    margin: 20px 14px;
  }
 h3{
   font-size: 26px;
   margin: 10px 0;
 }
 .el-breadcrumb {
   font-size: 16px;
 }
</style>
