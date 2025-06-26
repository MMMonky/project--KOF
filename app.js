const express = require('express');
const path = require('path');
const app = express();

// 静态资源服务
app.use('/static', express.static(path.join(__dirname, 'static')));

// 主页服务：返回 HTML 文件
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});