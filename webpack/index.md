## webpack的核心概念

entry   打包的入口文件

output  打包后的出口文件

mudule  主要是放各种loader

plugins 第三方的组件

externals 是为了将公用的第三方库单独抽出来作为CDN资源加载进来
提升首屏加载的时间

'''
externals: {
  'vue': 'Vue',
  'axios': 'axios',
  'vue-router': 'VueRouter'
}
'''

### plugins

- 1.html-webpack-plugin
- 2.copy-webpack-plugin
- 3.uglifyjs-webpack-plugin
- 4.extract-text-webpack-plugin
- 5.optimize-css-assets-webpack-plugin
- 6.friendly-errors-webpack-plugin(dev环境的错误提示信息)



### webpack打印出来最大的三个包

- app(这里会区分出来js包是不是按需加载，拆分成多个js包,执行的入口文件，写出更精简的代码，提升加载的效率)

- manifest(在vendor的基础上，主要将一些异步加载等打包在这里)

- vendor(默认将node_modules依赖都打包在这里，可以使用CDN单独引用某些依赖库)
