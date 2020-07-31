<template>
  <el-container id="app">
    <el-aside width="200px">
      <el-menu
        :default-active="active"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <i class="el-icon-s-data"></i>
          <span slot="title">收货信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-upload"></i>
          <span slot="title">上报数据</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-row class="header-row">
          <el-col :span="5">
            <div>发货总量(T)：{{ dealerBase.send }}</div>
          </el-col>
          <el-col :span="5">
            <div>收货总量(T)：{{ dealerBase.recive }}</div>
          </el-col>
          <el-col :span="5">
            <div>检测总量(T)：{{ dealerBase.detect }}</div>
          </el-col>
          <el-col :span="9" class="header-name">
            <div>尊敬的：{{ userName }}</div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Cookies from 'js-cookie'
import { apiDealerBase } from '@/api/common'

export default {
  name: 'App',
  data() {
    return {
      names: ['DealerData', 'DealerUpload'],
      active: '',
      userName: '用户',
      dealerBase: {
        send: 0,
        recive: 0,
        detect: 0
      }
    }
  },
  watch: {
    /*$route () {
      console.log(this.$router.currentRoute)
      const index = this.names.indexOf(this.$router.currentRoute.name)
      if (index !== -1) {
        this.active = String(index + 1)
      } else {
        this.active = '1'
      }
    }*/
  },
  created() {
    this.getData()

    // console.log(this.$router.currentRoute)
    const index = this.names.indexOf(this.$router.currentRoute.name)
    if (index !== -1) {
      this.active = String(index + 1)
    } else {
      this.active = '1'
    }

    const info = JSON.parse(Cookies.get('info'))
    if (info) {
      this.userName = info.name
    }
  },
  methods: {
    getData() {
      apiDealerBase().then(response => {
        this.dealerBase = response.data
      }).finally(() => {
      })
    },
    handleSelect(index) {
      if(this.$router.currentRoute.name !== this.names[parseInt(index) -1]) {
        this.$router.push({ name: this.names[parseInt(index) -1]})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-row {
    height: 60px;
    line-height: 60px;
  }
  .header-name {
    text-align: right;
  }
</style>
