import * as request from '@/utils/http.js'

const $tools = Object.assign(
    request,
)

function install (Vue, opts = {}) {
    Vue.prototype.$tools = $tools
}

export default {
    install
}
