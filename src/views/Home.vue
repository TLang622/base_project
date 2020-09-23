<template>
  <div class="home">
    <el-table
      :data="list"
      border
    >
      <el-table-column type="index" label="序号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pName" label="品名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="lotNum" label="批次" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="box" label="数量（盒）" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tNum" label="数量（T）" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="date" label="发货日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="logistics" label="物流单号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="logisticsInfo" label="物流信息（最近一次）" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="params.page" :limit.sync="params.limit" @pagination="getList" />
  </div>
</template>

<script>
import { apiDealerReceive } from '@/api/common'
import Pagination from '@/components/Pagination'

export default {
  name: 'Home',
  components: { Pagination },
  data() {
    return {
      list: [],
      loading: false,
      params: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      apiDealerReceive().then(response => {
        console.log(response)
        // this.list = response.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
