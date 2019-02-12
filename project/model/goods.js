//导入数据库

const db = require("../db/database.js");

//定义数据类型
const Goods = db.model("goods",{
    goodsName:String,
    goodsPrice:Number,
    goodsDes:String,
    goodsBigImg:String,
    goodsSmallImg:Array
})

//增：
const addGoodsDetails = (goodsInfo,cb)=>{
    const goods = new Goods({
        goodsName:goodsInfo.goodsName,
        goodsPrice:goodsInfo.goodsPrice,
        goodsDes:goodsInfo.goodsDes,
        goodsBigImg:goodsInfo.goodsBigImg,
        goodsSmallImg:goodsInfo.goodsSmallImg
     })
    goods.save().then(()=>{
        cb();
    })
}
//查
const findGoods = (cb)=>{
    Goods.find().then((data)=>{
        cb(data);
        // console.log("查找结果：")
        // console.log(data);
    })
}
//按照价格升序查
const findGoodsByPriceB = (cb)=>{
    Goods.find().sort({goodsPrice:1}).then((data)=>{
        console.log(data);
        cb(data);
    })
}

//按照价格降序查
const findGoodsByPriceS = (cb)=>{
    Goods.find().sort({goodsPrice:-1}).then((data)=>{
        cb(data);
    })
}
//----------------------删-----------------
const delGoods = (goods_id,cb)=>{
    Goods.remove({_id:goods_id}).then((data)=>{
        cb(data);
    })
}

//-----------------------修改前，查询-------------------
const updateFindGoods = (goods_id,cb)=>{
    Goods.find({_id:goods_id}).then((data)=>{
        cb(data);
    })
}
//-------------------修改信息---------------------------
const updateGoods = (goods_id,goodsInfo,cb)=>{
    Goods.update(goods_id,{
        $set:
         goodsInfo
    }).then((data)=>{
        cb(data);
    })
}

module.exports = {
    addGoodsDetails,
    findGoods,
    findGoodsByPriceB,
    findGoodsByPriceS,
    delGoods,
    updateFindGoods,
    updateGoods
}
