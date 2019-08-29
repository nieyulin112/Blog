## 性能优化的点总结

1.前端方面：

=>减少HTTP请求：合并文件、CSS精灵、inline Image
=>减少DNS查询：DNS查询完成之前浏览器不能从这个主机下载任何任何文件。方法：DNS缓存、将资源分布到恰当数量的主机名，平衡并行下载和DNS查询
=>避免重定向：多余的中间访问
=>使Ajax可缓存
=>非必须组件延迟加载
=>未来所需组件预加载
=>减少DOM元素数量
=>将资源放到不同的域下：浏览器同时从一个域下载资源的数目有限，增加域可以提高并行下载量
=>减少iframe数量
=>不要404

2.server方面

=>使用CDN
=>添加Expires或者Cache-Control响应头
=>对组件使用Gzip压缩
=>配置ETag
=>Flush Buffer Early
=>Ajax使用GET进行请求
=>避免空src的img标签

3.Cookie方面
=>减小cookie大小
=>引入资源的域名不要包含cookie
=>css方面
=>将样式表放到页面顶部
=>不使用CSS表达式
=>使用不使用@import
=>不使用IE的Filter

4.Javascript方面
=>将脚本放到页面底部
=>将javascript和css从外部引入
=>压缩javascript和css
=>删除不需要的脚本
=>减少DOM访问
=>合理设计事件监听器

5.图片方面
=>优化图片：根据实际颜色需要选择色深、压缩
=>优化css精灵
=>不要在HTML中拉伸图片
=>保证favicon.ico小并且可缓存
6.移动方面
=>保证组件小于25k
=>Pack Components into a Multipart Document
