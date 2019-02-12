//引入model层
const userModel = require("../model/users.js");
//引入加密模块
const crypto = require("crypto");
//注册
const register = (req,res)=>{
    //req.body接收前端通过post方法传来的值
    const {username,password} = req.body;
    userModel.findUser({username},(data)=>{
        if(data){
            res.json({
                info:"用户名重复",
                status:2
            })

        }else{
            //创建加密算法
            const hash = crypto.createHash("sha256");
            //对password进行加密
            hash.update(password);
            //hash.digest("helle")将pwssword与字符穿hello一起加密
            userModel.addUser({username,password:hash.digest("hello")},()=>{
                res.json({
                    info:"注册成功",
                    status:1
                })
            })
        }
    })
}
//登录
const login = function(req,res){
    const {username,password} = req.body;
    userModel.findUser({username},(data)=>{
        if(data){
            //创建加密算法
            const hash = crypto.createHash("sha256");
            //对password进行加密
            hash.update(password);
            if(data.password == hash.digest("hello")){
                //用户名和密码都正确，将当前用户的用户名存储在session中
                req.session.user = username;

                res.json({
                    info:"登录成功",
                    status:1
                })
            }else{
                res.json({
                    info:"密码不正确",
                    status:2
                })
            }
        }else{
            res.json({
                info:"用户名不存在",
                status:3
            })
        }
    })

}
//是否登录
const isLogin = (req,res)=>{
    //如果当前用户的用户名存储在session中
    if(req.session.user){
        res.json({
            info:"已登录",
            status:true,
            userId:req.session.user

        })
    }else{
        res.json({
            info:"未登录",
            status:false
        })
    }
}

//退出
const logout = (req,res)=>{
    //销毁session
    req.session= null;

    res.json({
        info:"已退出",
        status:true
    })
}
module.exports = {
    register,
    login,
    isLogin,
    logout
};