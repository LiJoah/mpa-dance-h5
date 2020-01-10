export const isDev: boolean = process.env.NODE_ENV === 'development'
export const isProd: boolean = process.env.NODE_ENV === 'production'
export const generateSourceMap: boolean = process.env.OMIT_SOURCEMAP === 'true' ? false : true
export const isProfilerEnabled: boolean = process.argv.includes('--profile')

export const DANGEROUSLY_DISABLE_HOST_CHECK = process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true'

export const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
export const host = process.env.HOST || '0.0.0.0'

export const isHttps = protocol === 'https'

// 当标准输出为终端的时候
export const isInteractive = process.stdout.isTTY

// webpack dev server: Tools like Cloud9 rely on this.
// 涉及C9云部署时的环境变量检查
export const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
export const HOST = process.env.HOST || '0.0.0.0'
