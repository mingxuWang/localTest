/**
 * 环境变量
 */
var ENV = 'eyes';
var TARGET_PATH = '/home/inf/apache-tomcat-7.0.78/webapps/eyes/'
fis.set( 'version', '1.0' ); // 版本号
fis.set( 'localPath', '/scheduling' ); // 本地项目路径
fis.set( 'localCommonPath', '/common' ); // 本地公共文件路径
fis.set( 'pubPath', '/static/${version}' ); // 项目发布文件路径
fis.set('onlinePath', '/static/${version}'); // 线上访问地址

/**
 * 基础配置
 */
// 设置项目源码文件过滤器
fis.set( 'project.files', [ '*.html' ] );
// 设置附加的文本类型文件
fis.set( 'project.fileType.text', 'vue' );
// 设置忽略文件
fis.set( 'project.ignore', [
       'fis-conf-scheduling.js',
       '**.md',
       'package-scheduling.json'
 ] );
/**
 * 语言解析
 */
// vue 相关
// 参考：https://github.com/ccqgithub/fis3-parser-vue-component

// 公共组件
fis
	.match( '${localCommonPath}/component/**.vue', {
    // 产出文件类型
		rExt: '.js',
    // 是否为模块化
		isMod: true,
    // 是否自动加载同名依赖
		useSameNameRequire: true,
    // 预编译
		parser: fis.plugin( 'vue-component', {
			cssScopeFlag: 'vuec'
		} )
	} )
	// .vue文件，es6解析
	.match( '${localCommonPath}/component/**.vue:js', {
		parser: [
       fis.plugin( 'babel-5.x' ),
       fis.plugin( 'translate-es3ify', null, 'append' )
     ]
	} )
	// .vue文件，less解析
	.match( '${localCommonPath}/component/{**.vue:less,**.less, **.css}', {
		rExt: 'css',
		parser: [ fis.plugin( 'less-2.x' ) ],
		postprocessor: fis.plugin( 'autoprefixer', {
			"browsers": [ 'Firefox >= 20', 'Safari >= 6', 'Explorer >= 9', 'Chrome >= 12', "ChromeAndroid >= 4.0" ]
		} )
	} )
	.match( '${localCommonPath}/component/**.js', {
		isMod: true,
		parser: [
       fis.plugin( 'babel-5.x' ),
       fis.plugin( 'translate-es3ify', null, 'append' )
     ]
	} );

// 业务组件
fis
	.match( '${localPath}/**.vue', {
    // 产出文件类型
		rExt: '.js',
    // 是否为模块化
		isMod: true,
    // 是否自动加载同名依赖
		useSameNameRequire: true,
    // 预编译
		parser: fis.plugin( 'vue-component', {
			cssScopeFlag: 'vuec'
		} )
	} )
	// .vue文件，es6解析
	.match( '${localPath}/**.vue:js', {
		parser: [
       fis.plugin( 'babel-5.x' ),
       fis.plugin( 'translate-es3ify', null, 'append' )
     ]
	} )
	// .vue文件，less解析
	.match( '${localPath}/{**.vue:less,**.less, **.css}', {
		rExt: 'css',
		parser: [ fis.plugin( 'less-2.x' ) ],
		postprocessor: fis.plugin( 'autoprefixer', {
			"browsers": [ 'Firefox >= 20', 'Safari >= 6', 'Explorer >= 9', 'Chrome >= 12', "ChromeAndroid >= 4.0" ]
		} )
	} )
	.match( '${localPath}/**.js', {
		isMod: true,
		parser: [
       fis.plugin( 'babel-5.x' ),
       fis.plugin( 'translate-es3ify', null, 'append' )
     ]
	} );


/****************************** 发布目录 ******************************/
// 公共文件
fis
	.match( '{${localCommonPath}, ${localPath}}/**.js', {
		isMod: true,
		release: false,
	} )
	.match( '${localCommonPath}/js/mod/mod.js', {
		isMod: false,
		parser: null,
		release: '${pubPath}/js/mod.js',
    url: '${onlinePath}/js/mod.js'
	} );

fis
	.match( '${localPath}/(**.html)', {
		useHash: false,
		useCache: false,
		release: '/$1',
	} )
	.match( '${localPath}/(**.js)', {
		isMod: true,
		release: '${pubPath}/js/$1',
    url: '${onlinePath}/js/$1'
	} )
	.match( '**.{css,less}', {
		packTo: '${pubPath}/css/pkg_page.css'
	} )
	.match( '**.less', {
		release: false
	} )
	.match( '${localPath}/pages/(**).{js,vue}', {
		release: '${pubPath}/js/$1',
    url:'${onlinePath}/js/$1'
	} )
	.match( '${localPath}/component/**.{js,vue}', {
		packTo: '${pubPath}/js/pkg_components.js'
	} )
	// 路由与状态管理一起打包
	.match( '${localPath}/{router,store}/**.js', {
		packTo: '${pubPath}/js/pkg_router_store.js'
	} )
	// 所有json文件打包到config中
	.match( '${localPath}/(**).json', {
		release: '${pubPath}/config/$1',
    url:'${onlinePath}/config/$1'
	} )
	.match( '${localPath}/(**.{png, jpg, jpeg, gif, mp3})', {
		release: '${pubPath}/img/$1',
    url:'${onlinePath}/img/$1'
	} );


/****************************** 模块化配置 ******************************/
fis.hook( 'commonjs', {
	extList: [ '.js', '.vue' ],
	// 必须指定，要不然fis查找会出错
	paths: {
		"vue": '/common/js/vue/2.1.8/vue.min.js',
		"axios": '/common/js/axios/0.16.2/axios.min.js',
		"vue-router": '/common/js/vue-router/2.0.3/vue-router.min.js',
		"vuex": '/common/js/vuex/2.0.0/vuex.min.js',
		"underscore": '/common/js/underscore/underscore.min.js',
		"element": '/common/js/element/1.1.6/element.min.js',
    "echarts": '/common/js/echarts/echarts.min.js'
	}
} );

/*模块化加载器配置*/
fis.match( '::package', {
	postpackager: fis.plugin( 'loader', {
		allInOne: true, // 合并页面下的js、css
		sourceMap: true, //是否生成依赖map文件
		useInlineMap: true //是否将sourcemap作为内嵌脚本输出
	} )
} );

// vue, vue-resource, echarts 文件打包
fis.match( '${localCommonPath}/js/{vue,axios,vue-router,vuex,underscore,element,echarts}/**.js', {
	packTo: '${pubPath}/js/pkg_vue.js',
	release: '${pubPath}/js/pkg_vue.js',
	optimizer: false
} )

fis.match('*.{js,css,png,vue}', {
    useHash: true,
    useSprite: false,
    optimizer: null
  })

  // 额外处理打包的文件
  fis
    .match('${pubPath}/js/pkg_vue.js', {
      url: '${onlinePath}/js/pkg_vue.js'
    })
    .match('${pubPath}/css/pkg_page.css', {
      url: '${onlinePath}/css/pkg_page.css'
    })
    .match('${pubPath}/js/pkg_components.js', {
      url: '${onlinePath}/js/pkg_components.js'
    })
    .match('${pubPath}/js/pkg_router_store.js', {
      url: '${onlinePath}/js/pkg_router_store.js'
    });

  // 额外处理common模块中的文件
  fis
    .match('${localCommonPath}/component/(**).{js,vue}', {
      url: '/common/component/$1'
    })


  /****************************** 测试 / 发布 ******************************/
  // 调试环境下，不加hash、合并、压缩
  fis
    .media('debug')
    .match('*.{js,css,png,vue}', {
      useHash: true,
      useSprite: false,
      optimizer: null
    })
    // vue, vue-resource 文件打包
    .match('${localCommonPath}/js/{vue,axios,vue-router,vuex,underscore,element,echarts}/**.js', {
      packTo: '${pubPath}/js/pkg_vue.js',
      release: '${pubPath}/js/pkg_vue.js',
      optimizer: false
    })
    .match('${localPath}/dist/**.js', {
      useHash: false,
      optimizer: false,
    })
    .match('*', {
      deploy: [
        fis.plugin('skip-packed'),
        fis.plugin('http-push', {
          receiver: 'http://115.182.215.159/receiver.php',
          to: TARGET_PATH
        })
      ]
    });

  // 代码发布时
  fis.media('qa')
    .match('*.{js,css,png,jpg,vue}', { useHash: true })                             // 添加指纹
    .match('*.{js,vue}',     { optimizer: fis.plugin('uglify-js') })        // js压缩
    // vue, vue-resource 文件打包
    .match('${localCommonPath}/js/{vue,axios,vue-router,vuex,underscore,element,echarts}/**.js', {
      packTo: '${pubPath}/js/pkg_vue.js',
      release: '${pubPath}/js/pkg_vue.js',
      optimizer: false
    })
    .match('*.css',        { optimizer: fis.plugin('clean-css') })        // css压缩
    .match('*.{png,jpg}',    { optimizer: fis.plugin('png-compressor') })   // 图片压缩
    .match('::package',      { spriter: fis.plugin('csssprites') })         // 图片合并，需要添加：?__sprite
    .match('*.css',          { useSprite: true })                           // 对 CSS 进行图片合并
    .match('*', {
      deploy: [
        fis.plugin('skip-packed'),
        fis.plugin('http-push', {
          receiver: 'http://115.182.215.159/receiver.php',
          to: TARGET_PATH
        })
      ]
    });
