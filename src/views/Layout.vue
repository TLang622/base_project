<template>
  <el-container id="app">
    <el-header>
      <el-row class="header-row">
        <el-col :span="12" class="title">
          <router-link class="sidebar-logo-link" to="/">
            <img :src="logo" class="sidebar-logo" />
            <h1 class="sidebar-title">{{ title }}</h1>
          </router-link>
        </el-col>
        <el-col :span="12" class="header-name">
          <div>
            欢迎你 ：{{ userName }}
            <span class="btn-logout" @click="handleLogout">退出</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-openeds="openeds" class="el-menu-vertical-demo" router>
          <el-submenu index="1" route="/dealer/data">
            <template slot="title">
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1" route="/dealer/data">
              <span slot="title">商品管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>素材管理</span>
            </template>
            <el-menu-item index="2-1" route="/label/index">
              <span slot="title">标签管理</span>
            </el-menu-item>
            <el-menu-item index="2-2" route="/knowledge/index">
              <span slot="title">内容管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3" route="/order/index">
            <template slot="title">
              <span>订单管理</span>
            </template>
            <el-menu-item index="3-1" route="/order/index">
              <span slot="title">订单管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4" route="/user">
            <template slot="title">
              <span>用户管理</span>
            </template>
            <el-menu-item index="4-1" route="/user">
              <span slot="title">用户管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5" route="/manage/index">
            <template slot="title">
              <span>APP管理</span>
            </template>
            <el-menu-item index="5-1" route="/manage/index">
              <span slot="title">首页配置</span>
            </el-menu-item>
            <el-menu-item index="5-2" route="/shoppingmall/index">
              <span slot="title">商城配置</span>
            </el-menu-item>
            <el-menu-item index="5-3" route="/advertisment/index">
              <span slot="title">热门搜索</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <Breadcrumb class="breadcrumb-container" />
        <router-view class="view-container" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Cookies from 'js-cookie'
import { removeToken } from '@/utils/token'
import Breadcrumb from '@/components/Breadcrumb/index'

export default {
  name: 'Layout',
  components: { Breadcrumb },
  data() {
    return {
      names: [],
      active: '',
      userName: '李琦',
      type: null,
      logo: require('@/assets/logo.png'),
      title: '智检运营平台管理系统',
      openeds: ['1', '2', '3', '4', '5']
    }
  },
  created() {
    const info = JSON.stringify(Cookies.get('info'))
    if (info) {
      this.userName = info.name || '用户'
    }
  },
  methods: {
    handleLogout() {
      removeToken()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
  height: 60px;
}
.el-aside {
  height: 100%;
  background-color: #eee;
}
.header-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 60px;
}
.sidebar-logo-link {
  display: flex;
  align-items: center;
}
.sidebar-logo {
  width: 100px;
  height: 40px;
  vertical-align: middle;
  margin-right: 18px;
  margin-left: 18px;
  text-align: center;
  padding: 5px;
}
.sidebar-title {
  font-size: 20px;
}
.header-name {
  text-align: right;
  padding-right: 15px;
  height: 60px;
  line-height: 60px;
}
.el-main {
  margin: 0;
  padding: 0;
}
.btn-logout {
  color: #027DB4;
  cursor: pointer;
  margin-left: 20px;
}
.view-container {
  padding: 0 14px 20px;
}
.title {
  height: 100%;
  a {
    height: 100%;
  }
}
</style>
