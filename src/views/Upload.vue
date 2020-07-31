<template>
  <div class="upload">
    <el-button class="btn" plain @click="handleTemplate">下载模板</el-button>
    <upload ref="fileCom" class="btn" :file-list.sync="fileList" accept="" :size="10" />
    <el-button class="btn" plain @click="submitForm">确定上传</el-button>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { apiDealerReport } from '@/api/common'
import { OssClient } from '@/utils/oss-client'
import { Message } from 'element-ui'

export default {
  name: 'UploadPage',
  components: { Upload },
  data() {
    return {
      fileList: [],
      form: {
        url: '',
        fileName: ''
      },
      template: 'template/万孚新冠产品数据统计模板.xlsx',
      templateUrl: ''
    }
  },
  watch: {
    fileList() {
      console.log(this.fileList)
      if (this.fileList && this.fileList.length > 0 && this.fileList[0].percentage === 100) {
        this.form.fileName = this.fileList[0].name
        const client = OssClient()
        this.form.url = client.signatureUrl(this.fileList[0].response.name, { expires: 3600 * 24 })
        this.postForm()
      } else {
        this.form.fileName = ''
        this.form.url = ''
      }
    }
  },
  created() {
    const client = OssClient()
    this.templateUrl = client.signatureUrl(this.template, { expires: 3600 * 24 })
  },
  methods: {
    handleTemplate() {
      window.open(this.templateUrl, '_blank')
    },
    submitForm() {
      if(!this.fileList || this.fileList.length === 0) {
        Message({
          message: '请选择要上传的文件',
          type: 'warning',
          showClose: true,
          duration: 2 * 1000
        })
      }
      this.$refs.fileCom.submitUpload()
    },
    postForm() {
      if (this.fileList[0].percentage === 100) {
        apiDealerReport(this.form).then(response => {
          console.log(response)
        }).finally(() => {
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .upload {
    .btn {
      margin-bottom: 10px;
    }
  }
</style>
