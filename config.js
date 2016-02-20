/**
 * Created by Ukun on 16/1/31.
 */
var Config = {
    site: {
        title: 'Ukun Wire',
        description: 'Ukun',
        version: '1.0.0',
        duoshuo: {
            short_name: 'Ukun'
        }
    },
    db: {
        cookieSecret: 'ukunwire',
        name: 'wire',
        host: 'localhost',
        url: 'mongodb://localhost:27017/wire'
    },
    constant: {
        flash: {
            success: 'success',
            error: 'error'
        },
        role: {
            admin: 'admin',
            user: 'user'
        }
    },
    article: {
        pageSize: 10,
        types: ['Own', 'Share']
    },
    wx: {
        load: true,
        noSkill: 'Sorry about that!'
    },
    tl: {
        api: 'http://www.tuling123.com/openapi/api',
        key: '080cb4400d17375660c8b49e25994125'
    }
};

module.exports = Config;