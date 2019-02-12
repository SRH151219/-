function Addgoods() {
    this.init();
}

$.extend(Addgoods.prototype, {
    init: function () {
        var addBtn = $("#goods_add");
        addBtn.on("click", $.proxy(this.handleAddBtn, this))
    },
    handleAddBtn: function () {
        var goodsName = $("#goods_name").val();
        var goodsPrice = $("#goods_price").val();
        var goodsDes = $("#goods_des").val();
        var goodsBigImg = $("#goods_bigImg");
        // console.log(goodsBigImg[0].files[0]);

        var goodsSmallImg = $("#goods_smallImg");
        // console.log(goodsSmallImg);


        var formdata = new FormData();
        formdata.append("goodsName", goodsName);
        formdata.append("goodsPrice", goodsPrice);
        formdata.append("goodsDes", goodsDes);
        formdata.append("goodsBigImg", goodsBigImg[0].files[0]);
        for (var i = 0; i < goodsSmallImg[0].files.length; i++) {
            formdata.append("goodsSmallImg", goodsSmallImg[0].files[i]);
        }
        // console.log(formdata);
        //判断是否确认添加
        var cfirm = confirm("确认添加商品信息");
        if(cfirm == true){
            $.ajax({
                type: "post",
                data: formdata,
                url: "/goods/addgoods",
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                success: $.proxy(this.addGoodsSuccess, this)
    
            })
    
        }else{
            alert("添加失败");
        }

       
    },
    addGoodsSuccess: function (data) {
        // console.log(data);
        if (data.status) {
          location.reload();
        }


    }



})

new Addgoods();