export default (env = 'production') => {
  if (env === 'development' || env === 'dev') {
    process.env.NODE_ENV = 'development'
    return [require('./client/client.dev').default, require('./server/server.dev').default]
  }
  process.env.NODE_ENV = 'production'
  return [require('./client/client.prod').default, require('./server/server.prod').default]
}
