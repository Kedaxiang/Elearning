import axios from 'axios'
import Vue from 'vue'

let http_url;

if (process.env.NODE_ENV == 'development') {
    http_url = '/api';
}
else {
    http_url = 'http://www.vtmer2018.top:8066';
}

// 请求和应答报文数据均采用JSON格式，UTF-8编码
const instance = axios.create({
    baseURL: http_url,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*"
    }
})

Vue.prototype.axios = instance;

// request拦截器
instance.interceptors.request.use(config => {
        // console.log('request拦截器', config)
        let token = localStorage.getItem('token')
        if(token) config.headers.Authorization = localStorage.getItem('token')
        return config
    },
    error => {
        // Do something with request error
        console.log('request拦截器报错', error) // for debug
        Vue.prototype.$message.error("请求错误" + error);
        Promise.reject(error)
    });

//response拦截器
instance.interceptors.response.use(response => {
    const statusCode = response.status;
    console.log(response);
    if (statusCode == 200) {
        return response.data;
    } else {
        Vue.prototype.$message.error(response.statusText);
        return {
            code:400,
            msg:'服务器连接失败',
            data:null
        };
    }
},
    error => {
        // Do something with request error
        console.log('response拦截器报错', error) // for debug
        Vue.prototype.$message.error("请求出错" + error);
        // Vue.prototype.$message.error('请重新登录');
        return Promise.reject(error)
    })


    
export const GET = (url, data = {}) => {
    // console.log(url, data, "sss")
    // get方法需要加上params来接受参数
    return instance.get(url, { params: data })
}
export const POST = (url, data = {}, querys = {}) => {
    return instance.post(url, data, { params: querys })
}