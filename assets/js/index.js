//初始化
$(function(){
	//备份信息
	window.postsOrin = window.posts;

	//初始化界面
	$(".blogListMain").css("height", (50 * window.posts.length) + 125 + 'px');
	if(document.documentElement.clientHeight <= 580){
		$(".listFoot").hide();
	}

	//初始化标签
	var html = "";
	$.each(window.tags, function(i){
		html += "<li><a onclick='initBlogList(this, \"tags\")'>" + $(window.tags[i]).html() + "</a></li>";
	});
	$(".tagsUl").html(html);

	//初始化作者
	var html = "";
	$.each(window.authors, function(i){
		html += "<li><a onclick='initBlogList(this, \"authors\")'>" + $(window.authors[i]).html() + "</a></li>";
	});
	$(".authorsUl").html(html);

	//初始化幻灯片
	initPhoto();

});

//滑动栏事件
var openFlag = false;
function barControl(){
	if (openFlag == false) {
		$('.sideBar').animate({left : '+=648px'}, 500, function(){
			$('.sideBarCtrlBtn').removeClass('close').addClass('open');
			openFlag = true;
		});
	} else if (openFlag == true) {
		$('.sideBar').animate({left : '-=648px'}, 500, function(){
			$('.sideBarCtrlBtn').removeClass('open').addClass('close');
			openFlag = false;
		});
	}
}

//博客幻灯片
function initPhoto(){
	var htmlImg = "";
	var htmlList = "";
	var index = 0;
	$.each(window.posts, function(i){
		if($(window.posts[i].content).html() && index < 7){
			index++;
			htmlImg += $(window.posts[i].content).html();
			htmlList += "<li data-i='" + index + "'>" + index + "</li>";
		}
	});
	$(".tagOverView").html(htmlImg);
	$(".tagOverViewList>ul").html(htmlList);
	
	var imgArr = [0, 0];
	var isin = false;
	$(".tagOverViewList>ul>li").mouseenter(function(){
		isin = true;
		if($(this).attr("data-i") != $(".on").attr("data-i")){
			$(".on").removeClass("on");
			$(this).addClass("on");
			var newImg = $(this).attr("data-i");
			//处理旧图
			$(".tagOverView img:eq(" + (imgArr[0] - 1) + ")").css("z-index", "1").hide();
			$(".tagOverView img:eq(" + (imgArr[1] - 1) + ")").css("z-index", "2");
			//处理新图
			$(".tagOverView img:eq(" + (newImg - 1) + ")").css("z-index", "3").fadeIn('slow');
			//设置文字
			var html = "";
			html +=	"<h1><a>标签：" + $(window.posts[newImg - 1].tags).html() + "</a></h1>";
			html +=	"<p><a href='" + window.posts[newImg - 1].url + "' target='_blank'>" + window.posts[newImg - 1].title + "</a></p>";
			html +=	"<span>" + window.posts[newImg - 1].date + "</span>";
			html +=	"<span style='margin-left: 5px;'><a>" + $(window.posts[newImg - 1].author).html() + "</a></span>";
			
			$(".overViewInfo").html(html);
			//设置新的记录
			imgArr[0] = imgArr[1];
			imgArr[1] = newImg;
		}
	}).mouseleave(function(){
		isin = false;
	});
	$(".tagOverViewList li:eq(0)").mouseenter();
	$(".tagOverViewList li:eq(0)").mouseleave();
	setInterval(function(){
		if(!isin){
			var num = parseInt($(".on").attr("data-i"));
			num = (num + 1) == 7 ? 1 : (num + 1); 
			$(".tagOverViewList li:eq(" + (num - 1) + ")").mouseenter();
			$(".tagOverViewList li:eq(" + (num - 1) + ")").mouseleave();
		}
	}, 5000);
}

//博客预览
function findBlogView(obj, index){	
	$("#musicPlayer").hide();
	$(".postExcerpt").show();
	$(".blogListContent .active").removeClass("active");
	$(obj).addClass("active");
	$(".postExcerpt").fadeOut(200, function(){
		var html = "";
		if($(window.posts[index].content).html()){
			html += $(window.posts[index].content).html();
			html += "<div class='postExcerptWord'><h1><a class=\"readblogT\" target=\"_blank\" href=\"" + window.posts[index].url + "\">" + window.posts[index].title + "</a></h1>";
			html +=	"<p style='line-height: 15px;'><span>" + window.posts[index].date + "</span> ·";
			html +=	" <span><a>" + $(window.posts[index].author).html() + "</a></span> ·";
			html +=	" <span><a>标签：" + $(window.posts[index].tags).html() + "</a></span></p>";
			html += "<p style='margin-top: 5px;'>" + window.posts[index].excerpt + " <a class=\"readblog\" target=\"_blank\" href=\"" + window.posts[index].url + "\">&raquo;</a></p></div>"
		}else{
			html += "<h1><a class=\"readblogT\" target=\"_blank\" href=\"" + window.posts[index].url + "\">" + window.posts[index].title + "</a></h1>";
			html +=	"<p style='line-height: 15px;'><span>" + window.posts[index].date + "</span> ·";
			html +=	" <span><a>" + $(window.posts[index].author).html() + "</a></span> ·";
			html +=	" <span><a>标签：" + $(window.posts[index].tags).html() + "</a></p>";
			html += "<p style='margin-top: 5px;'>" + window.posts[index].excerpt + " <a class=\"readblog\" target=\"_blank\" href=\"" + window.posts[index].url + "\">&raquo;</a></p>"
		}
		
		$(".postExcerpt").html(html);
		$(".postExcerpt").css("left", "-510px").show().animate({left : '0px'}, 300);
	});
}

//音乐播放
function musicPlayer(){
	$("#musicPlayer").show();
	$(".postExcerpt").hide();
}

//重新生成列表
function initBlogList(obj, type){
	window.posts = [];
	if(type == "tags"){
		$(window.postsOrin).each(function(i){
			if($(obj).html() == $(window.postsOrin[i].tags).html()){
				window.posts.push(this);
			}
		});
	}else if(type == "authors"){
		$(window.postsOrin).each(function(i){
			if($(obj).html() == $(window.postsOrin[i].author).html()){
				window.posts.push(this);
			}
		});
	}
	
	var html = "";
	$.each(window.posts, function(i){
		html += "<li title='" + this.title +"' onclick='findBlogView(this, \"" + i + "\")'>" +
                	"<a><span>" + this.title +"</span></a>"
                "</li>"
	});
	$(".blogListContent").html(html);
	$(".blogListContent>li:eq(0)>a").click();
}