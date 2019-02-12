function List() {
    this.init();
}

$.extend(List.prototype, {
    init: function () {
        //----------查-----------
        this.getData();
        this.getDataByPriceMo();
        this.getDataByPriceBig();
        this.getDataByPriceSmall();
        //获取模态框修改按钮
        this.getModifyBtns();
    },

    //======================================单独封装，异步插入元素，并获取指定的元素=============================================================
    insertData: function (data) {
        var str = ""
        for (var i = 0; i < data.data.length; i++) {
            str += `
            <div class="col-sm-6 col-md-3" goods_id=${data.data[i]._id}>
                <div class="thumbnail">
                    <img src=${data.data[i].goodsBigImg} alt="...">
                    <div class="caption">
                        <h3></h3>
                        <p>价格:${data.data[i].goodsPrice}</p>
                        
                        <p>
                            <a href="##"  class="btn btn-default update" role="button" data-toggle="modal" data-target="#goods_update">修改</a>
                            <a href="##"  class="btn btn-primary delete " role="button">删除</a>

                        </p>
                    </div>
                </div>
            </div>
            `;
        }

        $("#goods_list").html(str);
        //----------------------------------修改---------------------------------
        this.updateBtns = $(".update");
        this.updateBtns.each($.proxy(this.handleUpdateEach,this));
        //---------------------------------------------------删------------------
        //获取所有删除按钮（获取指定的元素）
        this.delBtns = $(".delete");
        //遍历删除按钮，为每一个按钮，匹配规定运行的函数（回掉函数）
        this.delBtns.each($.proxy(this.handleDelBtnEach, this));
    },
    //===========================================注意，删除元素操作===================================================
    handleDelBtnEach: function (index, val) {
        // console.log(index,val);
        //index为当前delBtn的下标，val为当前元素
        //给每个按钮添加点击事件
        this.delBtns.eq(index).on("click", index, $.proxy(this.handleDelClick, this));

    },
    handleDelClick: function (e) {
        // console.log(e);
        //获取当前删除按钮元素的下标
        var index = e.data;
        //获取商品的id
        var goods_id = this.delBtns.eq(index).parent().parent().parent().parent().attr("goods_id");
        console.log(goods_id);
        //向后端发送请求
        $.ajax({
            type: "post",
            url: "/goods/delGoods",
            data: {
                goods_id
            },
            success: $.proxy(this.delGoodsSuccess, this)
        })

    },
    delGoodsSuccess: function (data) {
        console.log(data);
        if (data.status) {
            //删除后，进行页面刷新
            location.reload();
        }
    },
    //==============================================注意，修改元素的操作=======================
    handleUpdateEach:function(index,val){
        this.updateBtns.eq(index).on("click", index, $.proxy(this.handleUpdateClick, this));
    },
    handleUpdateClick:function(e){
        // console.log(e);
        const index = e.data;
        var goods_id = this.updateBtns.eq(index).parent().parent().parent().parent().attr("goods_id");
        console.log(goods_id);
        //将商品id以属性形式存储在修改模态框中
        $("#goods_update").attr("goods_id",goods_id);
        //根据商品id进行查询
        $.ajax({
            type:"post",
            url:"/goods/updateFindGoods",
            data:{goods_id},
            success:$.proxy(this.getUpdateFindGoodsSuccess,this)
        }) 


    },
    getUpdateFindGoodsSuccess:function(data){
        //将原商品的信息展现在模态框中
        $("#goods_name").val(data.data[0].goodsName);
        $("#goods_price").val(data.data[0].goodsPrice);
        $("#goods_des").val(data.data[0].goodsDes);
        // $("#goods_bigImg").val(data.data[0].goodsBigImg);
        console.log(data);
    },
    //获取修改模态框中的确认修改按钮,必须在初始函数init中进行调用
    getModifyBtns:function(){
        var modifyBtn = $("#modify_btn");
        modifyBtn.on("click",$.proxy(this.modifyBtnClick,this));
    },
    modifyBtnClick:function(){
        // 点击确认修改，获取模态框中的内容
        var goods_id = $("#goods_update").attr("goods_id");
        var goodsName = $("#goods_name").val();
        var goodsPrice = $("#goods_price").val();
        var goodsDes = $("#goods_des").val();
        var goodsBigImg = $("#goods_bigImg");
        var goodsSmallImg = $("#goods_smallImg");
        // console.log(goods_id);
        // console.log(goodsName);
        // console.log(goodsPrice);
        // console.log(goodsDes);
        // console.log(goodsBigImg);
        // console.log(goodsSmallImg);
        //使用formdata提交表单信息
        var formdata = new FormData();
        formdata.append("goods_id",goods_id);
        formdata.append("goodsName", goodsName);
        formdata.append("goodsPrice", goodsPrice);
        formdata.append("goodsDes", goodsDes);
        formdata.append("goodsBigImg", goodsBigImg[0].files[0]);
        for (var i = 0; i < goodsSmallImg[0].files.length; i++) {
            formdata.append("goodsSmallImg", goodsSmallImg[0].files[i]);
        }
        // console.log(formdata);

        //判断是否确认修改
        // var cfirm = confirm("确认修改商品信息");
        // if(cfirm == true){
            $.ajax({
                type: "post",
                data: formdata,
                url: "/goods/updateGoods",
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                success: $.proxy(this.updateGoodsSuccess, this)
    
            })
    
        // }
    },
    updateGoodsSuccess:function(data){
        // console.log(data);
        if(data.status){
            location.reload();
        }
    },


    //----------------------------------------默认顺序----------------------------
    //每次刷新页面时，都会按照默认顺序进行排序
    getData: function () {
        $.ajax({
            type: "post",
            url: "/goods/findGoods",
            data: {
                status: 1,
            },
            success: $.proxy(this.getDataSuccess, this)
        })
    },
    getDataSuccess: function (data) {
        this.insertData(data);

        // console.log(data);
        // var str = ""
        // for(var i = 0;i < data.data.length;i ++){
        //     str += `
        //     <div class="col-sm-6 col-md-3">
        //         <div class="thumbnail">
        //             <img src=${data.data[i].goodsBigImg} alt="...">
        //             <div class="caption">
        //                 <h3></h3>
        //                 <p>价格:${data.data[i].goodsPrice}</p>

        //                 <p>
        //                     <a href="##" id="update" class="btn btn-default" role="button">修改</a>
        //                     <a href="##" id="delete" class="btn btn-primary" role="button">删除</a>

        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        //     `;
        // }

        // $("#goods_list").html(str);


    },

    //-----------------------点击按钮，默认排序---------------------
    getDataByPriceMo: function () {
        var priceBtn = $("#moren");
        priceBtn.on("click", $.proxy(this.handleClickPriceBtn1, this));
    },
    handleClickPriceBtn1: function () {
        var sort_list = $("#sort_list");
        // console.log(sort_list.text());
        sort_list.text("默认排序");
        this.getData();

    },

    //----------------------------价格升序------------------------------
    getDataByPriceBig: function () {
        var priceBtn = $("#shengxu");
        priceBtn.on("click", $.proxy(this.handleClickPriceBtn2, this));
    },
    handleClickPriceBtn2: function () {
        // console.log(11);
        var sort_list = $("#sort_list");
        // console.log(sort_list.text());
        sort_list.text("价格升序");
        $.ajax({
            type: "post",
            url: "/goods/findGoods",
            data: {
                status: 2,
            },
            success: $.proxy(this.getDataSuccess2, this)
        })
    },
    getDataSuccess2: function (data) {
        this.insertData(data);

        // console.log(data);
        // var str = ""
        // for(var i = 0;i < data.data.length;i ++){
        //     str += `
        //     <div class="col-sm-6 col-md-3">
        //         <div class="thumbnail">
        //             <img src=${data.data[i].goodsBigImg} alt="...">
        //             <div class="caption">
        //                 <h3></h3>
        //                 <p>价格:${data.data[i].goodsPrice}</p>
        //                 <p>
        //                     <a href="##" id="update" class="btn btn-default" role="button">修改</a>
        //                     <a href="##" id="delete" class="btn btn-primary" role="button">删除</a>

        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        //     `;
        // }

        // $("#goods_list").html(str);


    },
    //--------------------------------------------价格降序--------------------------
    getDataByPriceSmall: function () {
        var priceBtn = $("#jiangxu");
        priceBtn.on("click", $.proxy(this.handleClickPriceBtn3, this));
    },
    handleClickPriceBtn3: function () {
        var sort_list = $("#sort_list");
        // console.log(sort_list.text());
        sort_list.text("价格降序");
        $.ajax({
            type: "post",
            url: "/goods/findGoods",
            data: {
                status: 3,
            },
            success: $.proxy(this.getDataSuccess3, this)
        })
    },
    //

    getDataSuccess3: function (data) {
        this.insertData(data);
        // console.log(data);
        // var str = ""
        // for(var i = 0;i < data.data.length;i ++){
        //     str += `
        //     <div class="col-sm-6 col-md-3" goods_id=${data.data[i]._id}>
        //         <div class="thumbnail">
        //             <img src=${data.data[i].goodsBigImg} alt="...">
        //             <div class="caption">
        //                 <h3></h3>
        //                 <p>价格:${data.data[i].goodsPrice}</p>

        //                 <p>
        //                     <a href="##"  class="btn btn-default update" role="button">修改</a>
        //                     <a href="##"  class="btn btn-primary delete " role="button">删除</a>

        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        //     `;
        // }

        // $("#goods_list").html(str);
        // //---------------------------------------------------删------------------
        // //获取所有删除按钮
        // this.delBtns = $(".delete");
        // //遍历删除按钮，为每一个按钮，匹配规定运行的函数（回掉函数）
        // this.delBtns.each($.proxy(this.handleDelBtnEach,this));

    },




})

new List();