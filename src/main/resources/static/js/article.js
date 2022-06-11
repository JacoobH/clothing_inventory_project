var MAXPAGE = 5;
$(function () {
    getTable(1, MAXPAGE);
    $("#pre").click(function () {
        var current = sessionStorage.getItem('current');
        if (current > 1) {
            current--;
            getTable(current, MAXPAGE);
        }
    });
    $("#next").click(function () {
        var current = sessionStorage.getItem('current');
        var pages = sessionStorage.getItem('pages');
        if (current < pages) {
            current++;
            getTable(current, MAXPAGE);
        }
    });
    $("#tbody").on('click', 'button', function () {
        var id = $(this).attr("id");
        var cals = $(this).attr("class");
        if(cals === 'btn-danger'){
            $.ajax({
                url: "/article_number/delete/" + id, //请求地址
                type: "DELETE", //请求方式
                success: function (data) {
                    if (data.code === 20021) {
                        alert("删除成功");
                        getTable(1, MAXPAGE);
                    }
                }
            });
        }
    });
    $("#save").on("click", function () {
        var tradeName = $("#tradeName").val();
        var colorNo = $("#colorNo").val();
        var size = $("#size").val();
        if(tradeName === ''||colorNo === ''||size ===  ''){
            alert('输入不能为空');
            return ;
        }
        $.ajax({
            url: "/article_number/save", //请求地址
            type: "POST", //请求方式
            contentType: "application/json",
            data: JSON.stringify({
                tradeName: tradeName,
                colorNo: colorNo,
                size: size
            }),
            success: function (data) {
                if (data.code === 20011) {
                    alert("新增成功");
                    getTable(1, MAXPAGE);
                }
            }
        });
    });
    $("#get").on("click", function () {
        var articleNumber = $("#getArticleNumber").val();
        var tradeName = $("#getTradeName").val();
        var colorNo = $("#getColorNo").val();
        var size = $("#getSize").val();
        getTableByConditions(1, MAXPAGE, articleNumber, tradeName, colorNo, size);
        // $.ajax({
        //     url: "/article_number/get", //请求地址
        //     type: "GET", //请求方式
        //     data: {
        //         articleNumber: articleNumber,
        //         tradeName: tradeName,
        //         colorNo: colorNo,
        //         size: size
        //     },
        //     success: function (data) {
        //         console.log(data.code);
        //         if (data.code === 20041) {
        //
        //         }
        //     }
        // });
    });
    $("#update").on("click", function () {
        var tradeName = $("#UtradeName").val();
        var colorNo = $("#UcolorNo").val();
        var size = $("#Usize").val();
        var id = $("#uid").val();
        console.log(id);
        if(tradeName === ''&&colorNo === ''&&size === ''){
            alert("未修改值");
            return;
        }
        $.ajax({
            url: "/article_number/update", //请求地址
            type: "PUT", //请求方式
            contentType: "application/json",
            data: JSON.stringify({
                id: id,
                tradeName: tradeName,
                colorNo: colorNo,
                size: size
            }),
            success: function (data) {
                if (data.code === 20031) {
                    alert("修改成功");
                    getTable(1, MAXPAGE);
                }
            }
        });
    });
    $("#updateModal").on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('whatever');
        console.log("1234" + id);
        var modal = $(this);
        modal.find('.modal-body textarea').val(id);
    });
});


function loadTable() {
    $("tbody").empty();
    var pagedata = JSON.parse(sessionStorage.getItem("pagedata")).records;
    $.each(pagedata, function (index, value) {
        var tr = $("<tr></tr>");
        tr.append("<td>" + (index + 1) + "</td>");
        tr.append("<td>" + value.articleNumber + "</td>");
        tr.append("<td>" + value.tradeName + "</td>");
        tr.append("<td>" + value.colorNo + "</td>");
        tr.append("<td>" + value.size + "</td>");
        tr.append("<td>" + value.number + "</td>");
        tr.append("<td>" + "<div class='row'>" +
            "<div class='col-md-2'><button type='button' class='btn-info' data-toggle='modal' data-target='#updateModal'" + "data-whatever='" + value.id + "'>修改</button></div>" +
            // "<div class='col-md-1'></div>" +
            "<div class='col-md-2'><button type='button' class='btn-danger' "+ "id='" + value.id + "'>删除</button></div></div></td>")
        $("tbody").append(tr);
    });
}

function getTable(current, size) {
    $.get({
        url: "/article_number/getPage",
        data: {
            "current": current,
            "size": size
        },
        success: function (data) {
            if (data.code === 20041) {
                sessionStorage.setItem("pagedata", JSON.stringify(data.data));
                sessionStorage.setItem("total", data.data.total);
                sessionStorage.setItem("current", data.data.current);
                sessionStorage.setItem("pages", data.data.pages);
                loadTable();
                loadPagination();
            }
        }
    });
}

function getTableByConditions(current) {
    $("#get").on("click", function () {
        var articleNumber = $("#getArticleNumber").val();
        var tradeName = $("#getTradeName").val();
        var colorNo = $("#getColorNo").val();
        var size = $("#getSize").val();
        $.ajax({
            url: "/article_number/get", //请求地址
            type: "GET", //请求方式
            data: {
                current: "1",
                articleNumber: articleNumber,
                tradeName: tradeName,
                colorNo: colorNo,
                size: size
            },
            success: function (data) {
                console.log(data.code);
                if (data.code === 20041) {
                    sessionStorage.setItem("pagedata", JSON.stringify(data.data));
                    sessionStorage.setItem("total", data.data.total);
                    sessionStorage.setItem("current", data.data.current);
                    sessionStorage.setItem("pages", data.data.pages);
                    loadTable();
                    loadPagination();
                }
            }
        });
        // $.get({
        //     url: "/article_number/get",
        //     data: {
        //         "current": "1",
        //         "articleNumber": articleNumber,
        //         "tradeName": tradeName,
        //         "colorNo": colorNo,
        //         "size": size
        //     },
        //     success: function (data) {
        //         console.log(data.code);
        //         if (data.code === 20041) {
        //             sessionStorage.setItem("pagedata", JSON.stringify(data.data));
        //             sessionStorage.setItem("total", data.data.total);
        //             sessionStorage.setItem("current", data.data.current);
        //             sessionStorage.setItem("pages", data.data.pages);
        //             loadTable();
        //             loadPagination();
        //         }
        //     }
        // });
    });
}

function loadPagination() {
    $(".yemabiaoqian").remove();
    var pages = sessionStorage.getItem("pages");
    var current = sessionStorage.getItem("current");
    for (var i = 1; i <= pages; i++) {
        var li = $("<li class='page-item yemabiaoqian'></li>");
        // li.append('<a class="page-link" href="javascript:;" onclick="page(' + i * MAXPAGE + ',' + (i * MAXPAGE + MAXPAGE - 1) + ')"' + 'index="' + i + '"' + i + '</a>');
        li.append('<a class="page-link" href="javascript:;"> ' + i + '</a>');
        li.attr("index", i);
        li.on('click',function () {
            getTable($(this).attr('index'), MAXPAGE);
        });
        if(i === parseInt(current)){
            li.addClass("active");
            li.attr("aria-current", "page");
        }
        $("#next").before(li);
    }
}