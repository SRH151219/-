const goodsModel = require("../model/goods");
//------------------------------存----------------------------------
const addGoods = (req, res) => {
    // console.log(req.body)
    // console.log(req.files);
    //获取前端传来的内容
    const {
        goodsName,
        goodsPrice,
        goodsDes
    } = req.body;

    //要将图片的路径存储为一下格式，才能在浏览器中正确显示
    ////http://localhost:3000/img/1546663402424-1.jpg
   
   const imgUrl = req.files.goodsBigImg[0].path;
   const imgUrl1 = imgUrl.replace(/\\/g, "/");
   var goodsBigImg = imgUrl1.replace("public/", "");
   goodsBigImg = "http://localhost:3000/" + goodsBigImg;

//    console.log(goodsBigImg);

    var arr = [];
    for (var i = 0; i < req.files.goodsSmallImg.length; i++) {
        const imgUrl = req.files.goodsSmallImg[i].path;
        const imgUrl1 = imgUrl.replace(/\\/g, "/");
        var goodsSmallImg = imgUrl1.replace("public/", "");
        goodsSmallImg = "http://localhost:3000/" + goodsSmallImg
        arr.push(goodsSmallImg);
    }
    // console.log(arr);

    goodsModel.addGoodsDetails({
        goodsName,
        goodsPrice,
        goodsDes,
        goodsBigImg,
        goodsSmallImg: arr
    }, () => {
        res.json({
            info: "添加成功",
            status: true
        })
    })
}

//------------------------------------查-------------------------------------------
const findGoods = (req,res)=>{
    // console.log(req.body);
    //获取前端传来的值
    const {status} = req.body;
    if(status == 1){
        //默认顺序
        goodsModel.findGoods((data)=>{
            res.json({
                data:data
            })
            // console.log(data);
        })
    }else if(status == 2){
        //按照 价格升序
        goodsModel.findGoodsByPriceB((data)=>{
            
            res.json({
                data:data
            })
        })
    }else if(status == 3){
        //按照价格降序
        goodsModel.findGoodsByPriceS((data)=>{
            res.json({
                data:data
            })
        })
    }
    
}
//--------------------------------删------------------------------

const delGoods = (req,res)=>{
    // console.log(req.body);
    //解构赋值，获取前端传来的值goods_id
    const {goods_id} = req.body;
    goodsModel.delGoods(goods_id,(data)=>{
        res.json({
            info:"删除成功",
            status:true
        })
    })
}

//-----------------------------修改前，查询------------
const updateFindGoods = (req,res)=>{
    // console.log(req.body);
    //获取前端传来的值
    const {goods_id} = req.body;
        goodsModel.updateFindGoods(goods_id,(data)=>{
            res.json({
                data:data
            })
            // console.log(data);
        })
    
}
//---------------------修改---------------------
const updateGoods = (req, res) => {
    console.log(req.body)
    console.log(req.files);
    //获取前端传来的内容
    const {
        goods_id,
        goodsName,
        goodsPrice,
        goodsDes
    } = req.body;

    //要将图片的路径存储为一下格式，才能在浏览器中正确显示
    ////http://localhost:3000/img/1546663402424-1.jpg
   
   const imgUrl = req.files.goodsBigImg[0].path;
   const imgUrl1 = imgUrl.replace(/\\/g, "/");
   var goodsBigImg = imgUrl1.replace("public/", "");
   goodsBigImg = "http://localhost:3000/" + goodsBigImg;

//    console.log(goodsBigImg);

    var arr = [];
    for (var i = 0; i < req.files.goodsSmallImg.length; i++) {
        const imgUrl = req.files.goodsSmallImg[i].path;
        const imgUrl1 = imgUrl.replace(/\\/g, "/");
        var goodsSmallImg = imgUrl1.replace("public/", "");
        goodsSmallImg = "http://localhost:3000/" + goodsSmallImg
        arr.push(goodsSmallImg);
    }
    // console.log(arr);

    goodsModel.updateGoods({_id:goods_id},{
        goodsName,
        goodsPrice,
        goodsDes,
        goodsBigImg,
        goodsSmallImg:arr
    }, () => {
        res.json({
            info: "修改成功",
            status: true
        })
    })
}

module.exports = {
    addGoods,
    findGoods,
    delGoods,
    updateFindGoods,
    updateGoods

}