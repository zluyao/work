module.exports = {
    productionSourceMap: false,
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 8099,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://10.20.2.188:6089/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/socket': {
                target: 'http://10.20.0.63:15674/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/socket': ''
                }
            }
        },
        before: app => {}
    },
}

