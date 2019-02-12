var express = require('express');
var router = express.Router();
//导入controller层
var controller = require("../controller/goods")
//-----------------------------存----------------------------------------------
//处理表单数据
var multer = require("multer");
//设置传递到服务器图片的路径
var storage = multer.diskStorage({
    //处理图片路径
    destination: function (req, file, cb) {
        //路径必须写对（根据项目根目录来写的路径，不是根据当前文件）
        cb(null, './public/img')
    },
    //设置文件夹中图片文件的名称
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) //时间戳，防止图片路径被覆盖
    }
})
//内存存储引擎
var upload = multer({
    storage: storage
})

//名字必须写对，限制文件上传的个数
var cpUpload = upload.fields([{
    //goodsMaxImg为前端通过ajax传给ajax的key值
    name: 'goodsBigImg',
    //限制文件上传的个数
    maxCount: 1
}, {
    //goodsMaxImg为前端通过ajax传给ajax的key值
    name: 'goodsSmallImg',
    //限制文件上传的个数 
    maxCount: 8
}])

router.post("/addGoods",cpUpload, controller.addGoods);
//--------------------------查---------------------------------------
router.post("/findGoods",controller.findGoods);

//----------------删---------------
router.post("/delGoods",controller.delGoods);
//----------------修改前，查询------------------
router.post("/updateFindGoods",controller.updateFindGoods);

//------------------修改---------------
router.post("/updateGoods",cpUpload, controller.updateGoods);


module.exports = router;