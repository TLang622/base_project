import OSS from 'ali-oss'

export function OssClient(region, accessKeyId, accessKeySecret, bucket) {
  const ossConfig = {
    region: region || '',
    accessKeyId: accessKeyId || '',
    accessKeySecret: accessKeySecret || '',
    bucket: bucket || 'wondfo-ncov'
  }
  const client = new OSS(ossConfig)
  return client
}
