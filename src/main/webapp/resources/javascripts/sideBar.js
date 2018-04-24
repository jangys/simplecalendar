
function getCalendarList(reload){
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url:baseUrl+"/CalendarList",
		type:'GET',
		dataType :"json",
		success:function(data){
			printCalendarList(data);
			if(!reload){
				requestData();
			}else{
				reloadPage();
			}
		}
	});
}

//<label><input type="checkbox" value="1">Option1</label>
function printCalendarList(data){
	var checkList = "";
	var size = data.length;
	var colorList = ["#B5B2FF","#B2CCFF","#B2EBF4","#B7F0B1","#CEFBC9","#D4F4FA","#FAED7D"];
	for(var i=0;i<size;i++){
		var colorCode = colorList[parseInt(data[i].colorId)%colorList.length];
		checkList += "<div style='margin-bottom:5px;'><label>";
		checkList += "<div class='checkboxDiv' style='background-color:"+colorCode+"'>"
		if(data[i].check == true){
			checkList +="<p>✔</p>";
		}else{
			checkList += "<p>&nbsp;</p>";
		}
		checkList += "</div>";
		checkList += "<input style='display:none;' type='checkbox' value = '"+data[i].id+"' data-originalCalendarId = '"+data[i].id+"'";
		checkList += "data-defaultReminders='"+JSON.stringify(data[i].defaultReminders)+"'";
		if(data[i].check == true){
			checkList +=" checked";
		}
		if(data[i].primary){
			$("#userId").text(data[i].id);
		}
		checkList +=" onClick='clickCheckbox(this)' data-colorCode = '"+colorCode+"' data-accessRole = '"+data[i].accessRole+"'>"
		checkList +="<span style='font-weight:bold;'>"+data[i].summary+"</span></label>";
		checkList +="<button style='cursor:pointer;'type='button' onclick='clickCalendarUpdateBtn(this);'><img src='/image/settings.png'></button>";
		if($("#userId").text() != data[i].id){
			checkList +="<a href='#' class='noUnderLine' style='color:#787777;' onclick='clickDeleteCalendar(this); return false;'>X</a>";
		}
		checkList +="</div>";
	}
	document.getElementById("checkboxList").innerHTML = checkList;
}

//y = 2018, m=월
function makeMiniCalendar(y,m){
	$("#miniCalendar_Header").children().eq(1).text(y+"년 "+m+"월");
	$("#miniCalendar_Header").children().eq(1).attr('value',y+"-"+m);
	var contents = $("#miniCalendar_Contents");
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth()+1;
	var date = now.getDate();	//현재 날짜

	y = (y != undefined)? y:year;
	m = (m != undefined)? m:month;
   
	var startDate = new Date(y,m-1,1);
	var startDay = startDate.getDay();	//시작 요일
   
	var lastDate = 31;
	
	var strDate = location.pathname.split('/')[2].split('-');
	var clickYear = parseInt(strDate[0]);
	var clickMonth = parseInt(strDate[1]);
	var clickDate = parseInt(strDate[2]);

	//마지막 날짜 계산
	if((m%2 == 0 && m<= 6) || (m%2 == 1 && m>=9)){
		lastDate = 30;
	}
	if(m==2 && y%4 == 0 && y%100 != 0 || y%400 == 0){
		lastDate = 29;
	}else if(m == 2){
		lastDate = 28;
	}
   
	var row = Math.ceil((startDay+lastDate)/7);
	var table = "";
	var dateNum = 1;
	
	//달력그리기
	for(var i = 0; i<row;i++){
		table+="<div style='width:100%;text-align:center;' class='";
		switch(row){
		case 4:
			table+="week4'>";
			break;
		case 5:
			table+="week5'>";
			break;
		case 6:
			table+="week6'>";
			break;
		}
		
		for(var j=0; j < 7 ; j++){
			if(i == 0 && j<startDay){
				table += "<div class='miniCalendar_Date'><p></p></div>";
			}else{
				if(dateNum > lastDate){
					table += "<div class='miniCalendar_Date'><p></p></div>";
				}else{
					table += "<div class='miniCalendar_Date'><a href='#' class='";
					if(m == month && dateNum == date){
						table += "miniCalendar_today ";
					}
					if(y == clickYear && m == clickMonth && dateNum == clickDate){
						table += "miniCalendar_clickDate ";
					}
					table += "noUnderLine' style='display:inline-block;' onclick='clickMiniCalendarDate(this); return false;'";
					table += "data-date='"+y+"-"+m+"-"+dateNum+"'";
					table += ">"+dateNum+"</a></div>";
					dateNum ++;
				}
			}
		}
		table+="</div>";
	}
	contents.html(table);
}
//minicalendar 월 이동
//next == true -> 다음 월, false-> 전 월
function clickMiniCalendarNextBtn(next){
	var header = $("#miniCalendar_Header").children().eq(1).text();
	var value = $("#miniCalendar_Header").children().eq(1).attr('value').split("-");
	var year = parseInt(value[0]);
	var month = parseInt(value[1]);
	if(next){
		month++;
		if(month > 12){
			year++; month = 1;
		}
	}else{
		month --;
		if(month < 1){
			year--; month = 12;
		}
	}
	makeMiniCalendar(year,month);
}
//mini calendar에서 날짜 눌렀을 경우
function clickMiniCalendarDate(input){
	var strDate = $(input).attr('data-date');
	var baseUrl = "http://localhost:8080";
	var path =  location.pathname.split('/');
	var type = path[1];
	var curDate = path[2];
	var pageUrl = baseUrl+"/"+type+"/"+strDate;
	if(type == "m" || type == "l"){
		if(parseInt(strDate.split('-')[1]) != parseInt(curDate.split('-')[1])){// 월이 다르면
			var date = strDate.split('-');
			requestData(null,date[0],parseInt(date[1]),parseInt(date[2]));
		}else{
			history.pushState(null,"SimpleCalendar",pageUrl);
			$(".miniCalendar_clickDate").removeClass("miniCalendar_clickDate");
			$(input).addClass("miniCalendar_clickDate");
		}
	}else if(type == "d"){//일
		
	}else{//type == w 주
		
	}
}
///check/{checkedId}/{calType}/{year}/{month}/{date}
function clickCheckbox(box){
	var path = location.pathname.split('/');
	var year;
	var month;
	var date;
	if($(box).prop("checked")){
		$(box).prev().html("<p>✔</p>");
	}else{
		$(box).prev().html("<p>&nbsp;</p>");
	}
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
	requestCheckCalendar(year,month,date,box);
}
function requestCheckCalendar(year,month,date,box){
	var baseUrl = "http://localhost:8080";
	var path = location.pathname.split('/');
	//console.log(box.value);
	var data = {
			"id" : box.value,
			"year" : year,
			"month" : month,
			"date" : date
	};
	$.ajax({
		url:baseUrl+"/check"+"/m",
		type:'GET',
		data : data,
		dataType :"json",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			switch(path[1]){
		    case 'd':
		  	  //request, print 추가
		  	  break;
		    case 'w':
		  	  break;
		    case 'm':
		    	drawCalendar(year,month-1,data);
		  	  break;
		    case 'l':
		  	  printList(year,month,data);
		  	  break;
		    }
			
		}
	});
}
function clickCalendarUpdateBtn(btn){
	var calendarId = $(btn).prev().children().eq(1).attr('data-originalcalendarid');
	goToCalendarPage(calendarId);
}

function clickDeleteCalendar(link){
	var input = $(link).prevAll().eq(1).children().eq(1);
	var calendarId = input.attr('data-originalcalendarid');
	var result = false;
	var baseUrl = "http://localhost:8080";
	result = confirm("이 캘린더를 정말 삭제하시겠습니까?");
	if(result){
		$(link).attr('disabled',true);
		var data={
			"type":calendarId	
		};
		$.ajax({
			url:baseUrl+"/deleteCalendar",
			type:'GET',
			data : data,
			dataType :"json",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success:function(data){
				if(data == true){
					alert('삭제가 완료되었습니다.');
					//location.reload();
					$(link).attr('disabled',false);
					getCalendarList(false);
				}
				else{
					alert(data);
					$(link).attr('disabled',false);
				}
			}
		});
	}else{
		alert("취소되었습니다.");
	}
}

function goToCalendarPage(type){
	if(type == "ko.south_korea#holiday@group.v.calendar.google.com"){
		type = "ko.south_korea";
	}
	if(type == "#contacts@group.v.calendar.google.com"){
		type = "contacts";
	}
	$.ajax({
		url: "http://localhost:8080/showCalendarPage",
		dataType: "text",
		success: function(data){
			changeStyle("calendar",data);
			var calendarId;
			var eventId;
			var path = location.pathname.split('/');
			var url ="http://localhost:8080/calendar/"+type+"/"+path[1]+"&"+path[2];
			history.pushState(data,"Simple Calendar-Add/Update Event",url);
			loadCalendarDetail();
		}
	});
}
