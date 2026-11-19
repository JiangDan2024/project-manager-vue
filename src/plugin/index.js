import tab from './tab'
import auth from './auth'

export default function installPlugins(app) {
  app.config.globalProperties.$tab = tab
  app.config.globalProperties.$auth = auth
}
