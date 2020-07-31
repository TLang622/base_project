<template>
  <el-upload
    ref="uploads"
    action=""
    :multiple="multiple"
    :limit="limit"
    :accept="accept"
    :file-list="fileList"
    :list-type="type"
    :auto-upload="auto"
    :on-change="handelChange"
    :on-remove="handelRemove"
    :on-exceed="handelExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :http-request="fnUploadRequest"
  >
    <el-button slot="trigger" plain>选择文件</el-button>
    <div v-if="tip" hidden slot="tip" class="el-upload__tip">只能上传{{accept}}格式文件</div>
  </el-upload>
</template>
<script>
import OSS from 'ali-oss'
import axios from 'axios'
import { getToken } from '@/utils/token'

export default {
  name: 'Uploads',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 1000
    },
    accept: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 10 // 文件大小，单位是M
    },
    folder: {
      type: String,
      default: ''
    },
    type: {
      type: String, // text/picture/picture-card
      default: 'text'
    },
    auto: {
      type: Boolean,
      default: false
    },
    region: {
      type: String,
      default: 'oss-cn-shenzhen' // oss region
    },
    accessKeyId: {
      type: String,
      default: '' // oss accessKeyId
    },
    accessKeySecret: {
      type: String,
      default: '' // oss accessKeySecret
    },
    bucket: {
      type: String,
      default: 'wondfo-ai-testing-web' // oss bucket
    }
  },
  computed: {
    tip() {
      return this.accept.length > 0
    }
  },
  data() {
    return {
      // fileList: [],
      fileName: null,
      tempCheckpoint: null,
      pause: false,
      sts: null
    }
  },
  created() {
    this.tempCheckpoint = new Map()
    this.getToken()
  },
  methods: {
    getToken() {
      axios({
        method: 'get',
        headers: { 'Authority': getToken() },
        url: process.env.VUE_APP_BASE_API + '/user/sts'
      }).then(res => {
        console.log('sts')
        console.log(res)
        this.sts = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    handelChange(file, fileList) {
      console.log(fileList)
      this.$emit('update:file-list', fileList)
    },
    handelRemove(file, fileList) {
      console.log(fileList)
      this.$emit('update:file-list', fileList)
    },
    handelExceed(file, fileList) {
      this.$message.error('文件数量不能超过：' + this.limit)
    },
    submitUpload(fileName) {
      this.fileName = fileName
      // console.log(this.$refs.uploads.uploadFiles)
      const files = this.$refs.uploads.uploadFiles
      files && files.forEach(item => {
        // status: ready,uploading,success,fail
        if(this.pause && item.status !== 'success') {
          item.status = 'ready'
        }
      })
      this.pause = false
      // this.$refs.uploads.submit()的调用最好结合throttle，这样在断点续传的时候，快速点击就不会触发多次submit，就不会导致百分比溢出
      this.$refs.uploads.submit()
    },
    beforeUpload(file) {
      // console.log(file)
      let isType = true
      const point = file.name.lastIndexOf('.')
      const suffix = file.name.substr(point)
      if (this.accept) {
        const types = this.accept.split(',')
        isType = !(types.indexOf(suffix) < 0)
      }
      const fileSize = file.size
      const isSize = fileSize / 1024 / 1024 < this.size
      if (!isType) {
        this.$message.error('文件格式要求是：' + this.accept)
      }
      if (!isSize) {
        this.$message.error('文件大小不能超过：' + this.size + 'M')
      }
      return isType && isSize
    },
    fnUploadRequest(option) {
      // console.log(option)
      const ossConfig = {
        region: this.region,
        accessKeyId: this.sts.accessKeyId,
        accessKeySecret: this.sts.accessKeySecret,
        stsToken: this.sts.securityToken,
        bucket: this.bucket
      }
      const client = new OSS(ossConfig)
      const file = option.file
      let fileName
      // const date = new Date().getTime()
      const date = file.uid
      const point = file.name.lastIndexOf('.')
      const suffix = file.name.substr(point)
      if (this.fileName) {
        fileName = `${this.fileName}_${date}${suffix}`
      } else {
        const name = file.name.substr(0, point)
        fileName = `${name}_${date}${suffix}`
      }
      fileName = process.env.VUE_APP_ENV + '/' + this.folder + '/' + fileName
      console.log(fileName)
      const _this = this
      async function multipartUpload() {
        try {
          const result = await client.multipartUpload(fileName, file, {
            progress: function(p, checkpoint) {
              const e = {}
              e.percent = p * 100
              option.onProgress(e)
              _this.tempCheckpoint.set(file.uid, checkpoint)
              console.log(p)
            },
            checkpoint: _this.tempCheckpoint.get(file.uid)
          })
          console.log(result)
          if (result.res.statusCode === 200) {
            console.log('成功')
            option.onSuccess(result)
            // const url = client.signatureUrl(fileName, { expires: 3600 })
            // console.log(url)
          } else {
            // option.onError('上传失败')
            _this.pause = true
            _this.$message({
              message: '文件上传失败',
              type: 'error',
              duration: 2 * 1000
            })
            _this.handleError(new Error())
          }
        } catch (e) {
          // option.onError('上传失败')
          _this.pause = true
          _this.$message({
            message: '文件上传失败',
            type: 'error',
            duration: 2 * 1000
          })
          _this.handleError(e)
        }
      }
      multipartUpload()
    },
    handleSuccess(response, file, fileList) {
      console.log(fileList)
      this.$emit('update:file-list', fileList)
      this.$emit('success', fileList)
    },
    handleError(error, file, fileList) {
      console.log('upload error')
      this.$emit('error', error)
    },
    clearFiles() {
      console.log('clearfiles')
      this.$refs.uploads.clearFiles()
    }
  }
}
</script>

<style scoped>

</style>
