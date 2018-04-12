//뒤로가기나 앞으로가기 이벤트
$(window).bind("popstate",function(event){
	var data = event.originalEvent.state;
	if(data){
		var path = location.pathname.split('/');
		var year;
		var month;
		var date;
		if(location.pathname != '/'){
	      	var fullDate = path[2].split('-');
	      	year = parseInt(fullDate[0]);
	      	month = parseInt(fullDate[1]);
	      	date = parseInt(fullDate[2]);
	     }else{
	    	 var now = new Date();
	    	 year = now.getFullYear();
	    	 month = now.getMonth()+1;
	    	 date = now.getDate();
	     }
		var pageUrl = "/"+year+"-"+month+"-"+date;
		
		switch(path[1]){
		case 'd':
			break;
		case 'w':
			break;
		case 'm':
			changeStyle("month");
			requestMonthlyCalendar(year,month,date,true);
			break;
		case 'l':
			changeStyle("list");
			requestListCalendar(year,month,date,true);
			break;
		case 'event':
			var refine = $("#container_EventDetail").html(data).find("#container_ShowEventDetail");
			$("#container_EventDetail").html(refine);
			$("#container").css('display','none');
			$("#header").css('display','none');
			$("#side").css('display','none');
			$("#container_EventDetail").css('display','inline-block');
			loadEventDetail();
			break;
		}
	}else{
		$(location).attr("href","/");
	}
});

function showTitle(y,m){
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth()+1;
	var input = "";
	
	y = (y != undefined)? y:year;
	m = (m != undefined)? m:month;
	
	input += "<form id = 'title-form'>";
	//년, 월, 버튼 출력
	input += "<button class = 'btn btn-info' id = 'backBtn' type='button' value='"+y+"' name='back'> < </button>";
	input += "<div id='calendarTitle' style='text-align : center;'>  "+y+"년 "+m+"월"+"  </div>";
	input += "<button class = 'btn btn-info' type='button' id = 'forwardBtn' value='"+m+"' name='forward'> > </button>";
	input += "</form>";
	document.getElementById("title").innerHTML = input;
}


//showTitle();
//back 버튼
$(document).on('click','#backBtn',function(){
	var year = $('#backBtn').val();
	var month = $('#forwardBtn').val();
	var date = 1;
	var path = location.pathname.split('/');
	month--;
	if(month == 0){
		year--;
		month = 12;
	}
	switch(path[1]){
    case 'd':
  	  changeStyle('day');
  	  //request(안에 print까지)
  	  break;
    case 'w':
  	  changeStyle('week');
  	  break;
    case 'm':
  	  changeStyle('month');
  	  requestMonthlyCalendar(year,month,date,false);
  	  break;
    case 'l':
  	  changeStyle('list');
  	  requestListCalendar(year,month,date,false);
  	  break;
    }
	
});

//forward 버튼
$(document).on('click','#forwardBtn',function(){
	var year = $('#backBtn').val();
	var month = $('#forwardBtn').val();
	var date = 1;
	var path = location.pathname.split('/');
	month++;
	if(month == 13){
		year++;
		month = 1;
	}
	switch(path[1]){
    case 'd':
  	  changeStyle('day');
  	  //request, print 추가
  	  break;
    case 'w':
  	  changeStyle('week');
  	  break;
    case 'm':
  	  changeStyle('month');
  	  requestMonthlyCalendar(year,month,date,false);
  	  break;
    case 'l':
  	  changeStyle('list');
  	  requestListCalendar(year,month,date,false);
  	  break;
    }
});

//일, 주, 월, 목록 버튼 누를때마다 호출
function requestData(request){
	var path = location.pathname.split('/');
	var year;
	var month;
	var date;
	if(location.pathname != '/'){
      	var fullDate = path[2].split('-');
      	year = parseInt(fullDate[0]);
      	month = parseInt(fullDate[1]);
      	date = parseInt(fullDate[2]);
     }else{
    	 var now = new Date();
    	 year = now.getFullYear();
    	 month = now.getMonth()+1;
    	 date = now.getDate();
     }
	var pageUrl = "/"+year+"-"+month+"-"+date;
	
	switch(request){
	case 'day':
		break;
	case 'week':
		break;
	case 'month':
		requestMonthlyCalendar(year,month,date,false);
		break;
	case 'list':
		requestListCalendar(year,month,date,false);
		break;
	}
	return pageUrl;
}

function requestMonthlyCalendar(year,month,date,reload){
	var baseUrl = "http://localhost:8080";
	var pageUrl = "/m/"+year+"-"+month+"-"+date;
	console.log("request");
	
	$.ajax({
		url: baseUrl+"/monthly/"+year+"/"+month+"/"+date,
		type:'GET',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType:"json",
		success:function(data){
			showTitle(year,month);
			drawCalendar(year,month-1,data);
			if(!reload){
				history.pushState(data,"SimpleCalendar",pageUrl);				//데이터 요청이 느리니 먼저 url을 바꾸자
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown){
      	alert(errorThrown);
      }
	});
}

function requestListCalendar(year,month,date,reload){
	var baseUrl = "http://localhost:8080";
	var pageUrl = "/l/"+year+"-"+month+"-"+date;

	$.ajax({
		url: baseUrl+"/monthly/"+year+"/"+month+"/"+date,
		type:'GET',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType:"json",
		success:function(data){
			showTitle(year,month);
			printList(year,month,data);
			if(!reload){
				history.pushState(data,"SimpleCalendar",pageUrl);				//데이터 요청이 느리니 먼저 url을 바꾸자
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown){
      	alert(errorThrown);
      }
	});
}

//일 버튼
$(document).on('click','#dayBtn',function(){
	changeStyle("day");
	var baseUrl = "http://localhost:8080";
	var pageUrl = "/d"+requestData('day');
    history.pushState(null,"SimpleCalendar",pageUrl);
});
//주 버튼
$(document).on('click','#weekBtn',function(){
	changeStyle("week");
	var pageUrl = "/w"+requestData('week');
    history.pushState(null,"SimpleCalendar",pageUrl);
});
//월 버튼
$(document).on('click','#monthBtn',function(){
	changeStyle("month");
	var pageUrl = "/m"+requestData('month');
    //history.replaceState(null,"SimpleCalendar",pageUrl);
});
//목록 버튼
$(document).on('click','#listBtn',function(){
	changeStyle("list");
	var pageUrl = "/l"+requestData('list');
    //history.replaceState(null,"SimpleCalendar",pageUrl);
});

//버튼 배경색 설정 함수
function changeStyle(button){
	if($("#container").css('display') == 'none'){
		$("#container").css('display','inline-block');
		$("#header").css('display','');
		$("#showMoreEventDiv").css('display','none');
		$("#showEventSummary").css('display','none');
		$("#side").css('display','inline-block');
		$("#container_EventDetail").css('display','none');
		$("#container_EventDetail").html("");
	}
	if($(".pushCalendarBtn").length == 0){
		$("#"+button+"Btn").addClass('pushCalendarBtn');
		$("#"+button+"Calendar").css("display","inline-block");
	}else{
		var id = $(".pushCalendarBtn").attr('id').split('Btn');
		$("#"+id[0]+"Calendar").css("display","none");
		$(".pushCalendarBtn").removeClass('pushCalendarBtn');
		$("#"+button+"Btn").addClass('pushCalendarBtn');
		$("#"+button+"Calendar").css("display","inline-block");
	}
	switch(button){
	case "day":
		break;
	case "week":
		break;
	case "month":
		$("#contents").css('height','90%');
		$("#container").css('height','100%');
		break;
	case "list":
		$("#contents").height('auto');
		$("#container").height('auto');
		break;
	}
}	

//처음 
$(document).ready(function(){
	//getList();
	var path = location.pathname.split('/');
	var year;
	var month;
	var date;
	if(path[1] =="event"){
		$.ajax({
			url: "http://localhost:8080/showEventPage",
			dataType: "text",
			success: function(data){
				var refine = $("#container_EventDetail").html(data).find("#container_ShowEventDetail");
				$("#container_EventDetail").html(refine);
				$("#container").css('display','none');
				$("#header").css('display','none');
				$("#side").css('display','none');
				$("#container_EventDetail").css('display','inline-block');
				loadEventDetail();
			}
		});
	}else{
		getCalendarList();
	}

});
function getList(){
	var baseUrl = "http://localhost:8080";
	var year;
	var month;
	var fullDate;
	var path;
	var requestURL;
	var date;
	if(location.pathname != '/'){
		path = location.pathname.split('/');
  	fullDate = path[2].split('-');
  	year = parseInt(fullDate[0]);
  	month = parseInt(fullDate[1]);
  	date = parseInt(fullDate[2]);
  }else{
  	 var now = new Date();
       year = now.getFullYear();
       month = now.getMonth()+1;
       date = now.getDate();
  }
	
	requestURL = "/"+year.toString()+"-"+month.toString()+"-"+date.toString();
	
	$.ajax({
      url:baseUrl+"/MonthlyCalendar"+requestURL,
      type:'GET',
      dataType : "json",
      success:function(data){
          //console.log(location.pathname);
          path = location.pathname.split('/');
          var now = new Date();
          year = now.getFullYear();
          month = now.getMonth()+1;
          date = now.getDate();
          var pageUrl = "/m/"+year+"-"+month+"-"+date;
          //url에서 현재 년,월 추출
          if(location.pathname != '/'){
          	var fullDate = path[2].split('-');
          	year = parseInt(fullDate[0]);
          	month = parseInt(fullDate[1]);
          }else{//맨처음 요청시
          	history.pushState(data,"SimpleCalendar",pageUrl);
          	$("#monthCalendar").css('display','inline-block');
          	$("#monthBtn").addClass('pushCalendarBtn');
          	drawCalendar(year,month-1,data);
          }
          showTitle(year, month);
          switch(path[1]){
          case 'd':
        	  changeStyle('day');
        	  //print 추가
        	  break;
          case 'w':
        	  changeStyle('week');
        	  break;
          case 'm':
        	  changeStyle('month');
        	  drawCalendar(year,month-1,data);
        	  break;
          case 'l':
        	  changeStyle('list');
        	  printList(year,month,data);
        	  break;
          }
          
      }
  });
	
}