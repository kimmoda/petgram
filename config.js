module.exports = {
    open   : true,
    version: '1.0.0',
    const  : {
        api      : {
            dev : 'http://127.0.0.1/clientes/11/4D1/server',
            prod: 'http://189.113.170.4/~fortheonecom/api/index.php'
        },
        blog     : {
            dev : 'http://localhost:8100/blog/?json=',
            prod: 'http://agenciafoccus.com.br/blog/?json='
        },
        facebook : {
            dev : '750930828289265',
            prod: '750930828289265'
        },
        analytics: {
            dev : '',
            prod: ''
        },
        parse    : {
            dev : '',
            prod: ''
        }
    },
    src    : {
        index: 'www/index.html',
        fonts: 'www/lib/ionic/fonts/**.*',
        imgs : 'www/img/**/**.*',
        path : 'www/',
        lib: 'www/lib/*',
        sass: [
                'scss/*.scss',
                'scss/**/*.scss'
        ],
        css  : [
            'www/css/*.css',
            'www/css/**/*.css',
            'www/fonts/***.css',
            'www/module/**/*.css'
        ],
        js   : [
            'www/app/*.js',
            'www/app/**/*.js',
            '!www/app/**/*.spec.js',
            'www/component/**/*.js',
            '!www/component/**/*.spec.js',
            'www/component/*.js',
            'www/module/*.js',
            'www/module/**/*.js',
            '!www/module/**/*.spec.js',
            'www/js/*.js'
        ],
        html : [
            'www/module/**/*.html'
        ]
    },
    libs   : [
        'www/lib/ionicons/fonts'
    ],
    sass   : 'scss/ionic.app.scss',
    source : 'www',
    dist   : 'dist',
    docs   : 'docs',
    bower  : [
        'bower.json',
        '.bowerrc'
    ]
};
