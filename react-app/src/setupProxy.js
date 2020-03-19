const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "https://hunter-todo-api.herokuapp.com",
            pathRewrite: {
                "^/api": "/"
            },
            changeOrigin: true
        })
    );
};