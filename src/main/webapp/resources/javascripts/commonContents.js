//처음 
$(document).ready(function(){
	//getList();
	var path = location.pathname.split('/');
	var baseUrl = location.href.split('/')[2];
	var year;
	var month;
	var date;
	if(path[1] =="event"){
		$.ajax({
			url: "http://"+baseUrl+"/showEventPage",
			dataType: "text",
			success: function(data){
				changeStyle("event",data);
				loadEventDetail();
			}
		});
	}else if(path[1]=="calendar"){
		$.ajax({
			url: "http://"+baseUrl+"/showCalendarPage",
			dataType: "text",
			success: function(data){
				changeStyle("calendar",data);
				loadCalendarDetail();
			}
		});
	}
	else{
		if(location.pathname == '/'){
			getCalendarList(false);
		}else{//새로고침 시 히스토리에 기록 남기지 않게 하기
			console.log("Fd");
			getCalendarList(true);
		}
	}
});
function reloadPage(data){
	var path = location.pathname.split('/');
	var year;
	var month;
	var date;
	var type;
	if(location.pathname != '/'){
      	var fullDate = path[2].split('-');
      	year = parseInt(fullDate[0]);
      	month = parseInt(fullDate[1]);
      	date = parseInt(fullDate[2]);
      	type=path[1];
    	if(type != 'd' && type != 'w' && type != 'm' && type != 'l' && type !='event' && type !='calendar'){
    		type = 'm';
    	}
     }else{//맨처음  localhost:8080이 되면
    	 var now = new Date();
    	 year = now.getFullYear();
    	 month = now.getMonth()+1;
    	 date = now.getDate();
    	 type='';
    	 requestData();
     }
  	switch(type){
	case 'd':
		changeStyle("day");
		requestDailyCalendar(year,month,date,true);
		break;
	case 'w':
		changeStyle("week");
		requestWeeklyCalendar(year,month,date,true);
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
		changeStyle("event",data);
		loadEventDetail();
		break;
	case 'calendar':
		changeStyle("calendar",data);
		loadCalendarDetail();
		break;
	}
}
//뒤로가기나 앞으로가기 이벤트
$(window).bind("popstate",function(event){
	var data = event.originalEvent.state;
	reloadPage(data);
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
	input += "<div id='calendarTitle' style='text-align : center;'>  "+y+"년 "+parseInt(m)+"월"+"  </div>";
	input += "<button class = 'btn btn-info' type='button' id = 'forwardBtn' value='"+parseInt(m)+"' name='forward'> > </button>";
	input += "</form>";
	document.getElementById("title").innerHTML = input;
	makeMiniCalendar(y,m);
}

//showTitle();
//back 버튼
$(document).on('click','#backBtn',function(){
	var year = $('#backBtn').val();
	var month = $('#forwardBtn').val();
	var date = 1;
	month--;
	if(month == 0){
		year--;
		month = 12;
	}
	requestData(null,year,month,date);
	
});

//forward 버튼
$(document).on('click','#forwardBtn',function(){
	var year = $('#backBtn').val();
	var month = $('#forwardBtn').val();
	var date = 1;
	month++;
	if(month == 13){
		year++;
		month = 1;
	}
	requestData(null,year,month,date);
});

//일, 주, 월, 목록 버튼 누를때마다 호출, 타입에 맞게 호출
//request = type 지정, 미지정시 path에서 추출
//y,m,d 미지정시 path에서 추출
function requestData(request,y,m,d){
	var path = location.pathname.split('/');
	var year;
	var month;
	var date;
	if(y == undefined){
		if(location.pathname != '/'){
	      	var fullDate = path[2].split('-');
	      	year = parseInt(fullDate[0]);
	      	month = parseInt(fullDate[1]);
	      	date = parseInt(fullDate[2]);
	     }else{//맨 처음 요청시 무조건 month 보이게
	    	 var now = new Date();
	    	 year = now.getFullYear();
	    	 month = now.getMonth()+1;
	    	 date = now.getDate();
	    	 request = "first";
	     }
	}else{
		year = y;
		month = m;
		date = d;
	}
	var pageUrl = "/"+year+"-"+month+"-"+date;
	if(request==undefined || request == null){
		request = path[1];
		var type = path[1];
    	if(type != 'd' && type != 'w' && type != 'm' && type != 'l' && type !='event' && type !='calendar'){
    		type = 'm';
    	}
    	request = type;
	}
	switch(request){
	case 'd':
		changeStyle("day");
		requestDailyCalendar(year,month,date,false);
		break;
	case 'w':
		changeStyle("week");
		requestWeeklyCalendar(year,month,date,false);
		break;
	case 'm':
		changeStyle("month");
		requestMonthlyCalendar(year,month,date,false);
		break;
	case 'l':
		changeStyle("list");
		requestListCalendar(year,month,date,false);
		break;
	case 'first':
		changeStyle("month");
		requestMonthlyCalendar(year,month,date,"first");
		break;
	}
	return pageUrl;		//day, week 추가시 삭제 해야함.
}
function requestDailyCalendar(year,month,date,reload){
	var baseUrl = "http://"+location.href.split('/')[2];
	var pageUrl = "/d/"+year+"-"+month+"-"+date;
	console.log("request");
	if(!reload){
		history.pushState(null,"SimpleCalendar",pageUrl);				//데이터 요청이 느리니 먼저 url을 바꾸자
	}
	if(reload == "first"){
		history.replaceState(null,"SimpleCalendar",pageUrl);
	}
	$.ajax({
		url: baseUrl+"/daily/"+year+"/"+month+"/"+date,
		type:'GET',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType:"json",
		success:function(data){
			console.log(data);
			showTitle(year,month);
			drawWeeklyCalendar(year,month,date,data,false);	//false->daily
		},
		error: function (XMLHttpRequest, textStatus, errorThrown){
      	alert(errorThrown);
      }
	});
}
function requestWeeklyCalendar(year,month,date,reload){
	var baseUrl = "http://"+location.href.split('/')[2];
	var cur = new Date(year,month-1,date);
	var firstDate = new Date(cur.getTime()-cur.getDay()*86400000);
	var y = firstDate.getFullYear();
	var m = (firstDate.getMonth()+1);
	var d = firstDate.getDate();
	var pageUrl = "/w/"+year+"-"+month+"-"+date;
	console.log("request weekly");
	if(!reload){
		history.pushState(null,"SimpleCalendar",pageUrl);				//데이터 요청이 느리니 먼저 url을 바꾸자
	}
	if(reload == "first"){
		history.replaceState(null,"SimpleCalendar",pageUrl);
	}
	$.ajax({
		url: baseUrl+"/weekly/"+y+"/"+m+"/"+d,
		type:'GET',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType:"json",
		success:function(data){
			showTitle(year,month);
			console.log(data);
			drawWeeklyCalendar(y,m,d,data,true);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown){
      	alert(errorThrown);
      }
	});
}
function requestMonthlyCalendar(year,month,date,reload){
	var baseUrl = "http://"+location.href.split('/')[2];
	var pageUrl = "/m/"+year+"-"+month+"-"+date;
	console.log("request");
	if(!reload){
		history.pushState(null,"SimpleCalendar",pageUrl);				//데이터 요청이 느리니 먼저 url을 바꾸자
	}
	if(reload == "first"){
		history.replaceState(null,"SimpleCalendar",pageUrl);
	}
	$.ajax({
		url: baseUrl+"/monthly/"+year+"/"+month+"/"+date,
		type:'GET',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType:"json",
		success:function(data){
			showTitle(year,month);
			drawCalendar(year,month-1,data);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown){
      	alert(errorThrown);
      }
	});
}

function requestListCalendar(year,month,date,reload){
	var baseUrl = "http://"+location.href.split('/')[2];
	var pageUrl = "/l/"+year+"-"+month+"-"+date;
	if(!reload){
		history.pushState(null,"SimpleCalendar",pageUrl);				
	}
	$.ajax({
		url: baseUrl+"/monthly/"+year+"/"+month+"/"+date,
		type:'GET',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType:"json",
		success:function(data){
			showTitle(year,month);
			printList(year,month,data);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown){
      	alert(errorThrown);
      }
	});
}

//일 버튼
$(document).on('click','#dayBtn',function(){
	requestData("d");
});
//주 버튼
$(document).on('click','#weekBtn',function(){
	requestData("w");
});
//월 버튼
$(document).on('click','#monthBtn',function(){
	requestData("m");
    //history.replaceState(null,"SimpleCalendar",pageUrl);
});
//목록 버튼
$(document).on('click','#listBtn',function(){
	requestData("l");
    //history.replaceState(null,"SimpleCalendar",pageUrl);
});

//버튼 배경색 설정 함수, 현재 타입에 맞게 스타일 변경
function changeStyle(type,data){
	
	if($("#container").css('display') == 'none'){//전에 이벤트,캘린더 상세보기를 보았으면
		$("#container").css('display','inline-block');
		$("#header").css('display','');
		$("#showMoreEventDiv").css('display','none');
		$("#showEventSummary").css('display','none');
		$("#showAttendeesList").css('display','none');
		$("#side").css('display','inline-block');
		$("#container_EventDetail").css('display','none');
		$("#container_EventDetail").html("");
		$("#calendarDetailContents").css('display','none');
		$("#calendarDetailContents").html("");
		
	}
	if($(".pushCalendarBtn").length == 0){//타입 버튼 눌러진게 없으면
		$("#"+type+"Btn").addClass('pushCalendarBtn');
		if(type=="day"){
			type="week";
		}
		$("#"+type+"Calendar").css("display","inline-block");
	}else{//있으면 전에 눌러진거 클래스 제거, 안보이게 한 후 지금 눌러진거 새로 추가
		var id = $(".pushCalendarBtn").attr('id').split('Btn');
		if(id[0] == "day"){
			id[0]="week";
		}
		$("#"+id[0]+"Calendar").css("display","none");
		$(".pushCalendarBtn").removeClass('pushCalendarBtn');
		$("#"+type+"Btn").addClass('pushCalendarBtn');
		if(type=="day"){
			type="week";
		}
		$("#"+type+"Calendar").css("display","inline-block");
	}
	if(type == "month"){
		$("#contents").css('min-height','');
	}else{
		$("#contents").css('min-height','875px');
	}
	closeAllDiv();
	switch(type){
	case "day":
		$("#contents").css('height','90%');
		$("#container").css('height','100%');
		break;
	case "week":
		$("#contents").css('height','90%');
		$("#container").css('height','100%');
		break;
	case "month":
		$("#contents").css('height','90%');
		$("#container").css('height','100%');
		break;
	case "list":
		$("#contents").height('auto');
		$("#container").height('auto');
		break;
	case "event":
		var refine = $("#container_EventDetail").html(data).find("#container_ShowEventDetail");
		$("#container_EventDetail").html(refine);
		$("#container").css('display','none');
		$("#header").css('display','none');
		$("#side").css('display','none');
		$("#container_CalendarDetail").css('display','none');
		$("#container_EventDetail").css('display','inline-block');
		break;
	case "calendar":
		var refine = $("#container_CalendarDetail").html(data).find("#calendarDetailContents");
		$("#container_CalendarDetail").html(refine);
		$("#container").css('display','none');
		$("#header").css('display','none');
		$("#side").css('display','none');
		$("#container_EventDetail").css('display','none');
		$("#container_CalendarDetail").css('display','inline-block');
		break;
	}
}	
function clickEventTitle(title,scroll){
	closeAllDiv();
	var data = JSON.parse($(title).nextAll().last().attr('data-information'));
	if(data.attendees != null){
		if(data.recurrence == null){
			$("#showEventSummary").height(250);
			$("#eventSummary_Header").css('height','15%');
			$("#eventSummary_Contents").css('height','70%');
			$("#eventSummary_Footer ").css('height','15%');
		}else{
			$("#showEventSummary").height(260);
			$("#eventSummary_Header").css('height','12%');
			$("#eventSummary_Contents").css('height','76%');
			$("#eventSummary_Footer ").css('height','12%');
		}
	}else{
		if(data.recurrence == null){
			$("#showEventSummary").height(200);
			$("#eventSummary_Header").css('height','20%');
			$("#eventSummary_Contents").css('height','60%');
			$("#eventSummary_Footer ").css('height','20%');
		}else{
			$("#showEventSummary").height(225);
			$("#eventSummary_Header").css('height','18%');
			$("#eventSummary_Contents").css('height','64%');
			$("#eventSummary_Footer ").css('height','18%');
		}
	}
	var calendar = $("[data-originalCalendarId = '"+title.getAttribute('data-calendarId')+"']");
	var contents = "<p class='eventSummaryContents_p'><span class='eventSummaryContents_span'>제목</span>"+isNull(data.summary)+"</p>";
	contents += "<p class='eventSummaryContents_p' style='font-size:15px;'><span class='eventSummaryContents_span'>일시</span>"+data.startTime[0]+"."+addZero(data.startTime[1])+"."+addZero(data.startTime[2]);
	var check = -1;
	for(var i = 0;i<5;i++){
		if(data.startTime[i] != data.endTime[i]){
			check = i;
			break;
		}
	}
	var endTimeString;
	if(check == -1){
		contents += "</p>";
	}else{
		endTimeString = data.endTime[0]+"."+addZero(data.endTime[1])+"."+addZero(data.endTime[2]);
		if(data.startTime[3] != -1){//시간이 있는 경우
			contents += " " +changeTimeForm(data.startTime[3],data.startTime[4]) + " ~ ";
			if(check != 3){//같은 날이 아닌 경우
				contents += endTimeString;
			}
			contents += " " +changeTimeForm(data.endTime[3],data.endTime[4]);	//시간 추가
		}else{//시간이 없는 경우
			contents += " ~ "+endTimeString;
		}
		contents += "</p>";
	}
	if(data.recurrence != null){
		contents += "<p class='eventSummaryContents_p' id='eventSummaryRecurrence'";
		if(data.start == data.originalStart){//반복 일정의 첫번째 일정
			contents += " data-recurFirst='true'"
		}
		contents += "><span class='eventSummaryContents_span'";
		contents += ">반복 </span> ";
		var temp = data.recurrence[0].split(':');
		if(data.recurrence.length > 1){
			for(var i=0;i<data.recurrence.length;i++){
				if(data.recurrence[i].substring(0,5) == "RRULE"){
					temp = data.recurrence[i].split(':');
					break;
				}
			}
		}
		var rrule = temp[1];
		contents += covertRRULEInKorean(rrule,data.startTime[1],data.startTime[2])+"</p>";
	}
	contents += "<p class='eventSummaryContents_p'><span class='eventSummaryContents_span'>장소</span>"+isNull(data.location)+"</p>";
	contents += "<p class='eventSummaryContents_p'><span class='eventSummaryContents_span'>내용</span>"+isNull(data.description)+"</p>";
	if(data.attendees != null){
		var size = data.attendees.length;
		var canSeeOthers = data.guestsCanSeeOtherGuests;
		var totalNum = size;
		var organizer = false;
		if(data.organizer == data.calendarID){
			organizer = true;
		}
		if(!organizer && !canSeeOthers){//다른 참석자 목록 볼 수 없는 경우
			totalNum = 1;
		}
		contents += "<p class='eventSummaryContents_p'><span class='eventSummaryContents_span'>초대</span>인원"+totalNum+"명</span>";
		var responseCount = {
			"accepted" : 0,
			"declined" : 0,
			"tentative" : 0,
			"needsAction" : 0
		};
		var me = -1;
		for(var i=0;i < size;i++){
			responseCount[data.attendees[i].responseStatus] += 1;
			if(data.attendees[i].email == $("#userId").text()){//사용자 본인이 있는 경우
				me = i;
			}
			if(data.attendees[i].email == data.calendarID && !organizer && !canSeeOthers){//일정 주인이지만 주최자가 아니고 다른 참석자 목록 볼 수 없는 경우
				var responseKorean = {
						"accepted" : '수락',
						"declined" : '거절',
						"tentative" : '미정',
						"needsAction" : '대기'
				};
				contents += "<span style='color:#5c5c5c; margin-left:5px;'>"+responseKorean[data.attendees[i].responseStatus]+" 1명</span>";
			}
		}
		if(organizer || canSeeOthers){//다른 참석자 목록 볼 수 있는 경우, 볼수 없어도 주최자 본인인 경우
			contents += "<span style='color:#5c5c5c'>(수락"+responseCount["accepted"]+"명, 거절"+responseCount["declined"]+"명, 미정"+responseCount["tentative"]+"명, 대기"+responseCount["needsAction"]+"명) </span>";
		}
		contents += "</p>";
		contents += "<p class='eventSummaryContents_p'>";
		if(me != -1 && (data.organizer == data.calendarID || data.calendarID == $("#userId").text())){
			contents += "<span class='eventSummaryContents_span'>내 응답</span>";
			var response = ["수락","거절","미정"];
			var myResponse = getResponseStatus(data.attendees[me].responseStatus);
			var link = "";
			for(var i=0;i<3;i++){
				link +="<a href='#' class='updateResponseLink_Summ'";
				if(response[i] == myResponse){
					link += "style='color:#f0af00; font-weight:bold;"
				}else{
					link += "style='color:black;"
				}
				link += " margin-right:5px;' onclick='updateResponse(this); return false;'>"+response[i]+"</a>";
			}
			contents += link;
		}
		if(organizer || canSeeOthers){//참석자 목록 볼 수 있는 경우
			contents += "<span style='float:right;'><a href='#' id='attendeesList_a' style='color:black' title='참석자 목록 보기'>참석자 목록</a></span>";
		}
		contents += "</p>";
	}
	$('#eventSummary_Contents').html(contents);
	//추가한 후
	if(rrule != undefined){
		$("#eventSummaryRecurrence").attr('data-rrule',rrule);
	}
	if(calendar.attr('data-accessRole') == "owner" || calendar.attr('data-accessRole') == "writer"){
		var text = "<input type='text' name='calendarId' style='display:none' value='"+title.getAttribute('data-calendarId')+"' />";
		text += "<input type='text' name='eventId' style='display:none' value='"+title.getAttribute('data-eventId')+"' />";
		text += "<button id='btnShowEvent' class='btn btn-info' type='submit'>상세보기</button>";
		$('#btnDeleteEvent').css('display','inline');
		$('#btnShowEvent').css('display','inline');
		$('#btnDeleteEvent').attr('data-calendarId',title.getAttribute('data-calendarId'));
		$('#btnDeleteEvent').attr('data-eventId',title.getAttribute('data-eventId'));
		$('#showEvent_Form').html(text);
	}else{
		$('#btnDeleteEvent').css('display','none');
		$('#btnShowEvent').css('display','none');
	}
	var div = $('#showEventSummary');
	var topPosition = event.pageY;
	if(scroll){
		topPosition -=$('#container').offset().top*5.5;
	}else{
		topPosition -=$('#container').offset().top*4;
	}
	var leftPosition = event.pageX-$('#container').offset().left*1.5;
	var scrollHeight = $(document).scrollTop();
	
	if(leftPosition > $('#container').width()-430){
		leftPosition = $('#container').width()-430;
	}
	if(topPosition < -5.7){//화면이 위로 넘어가지 않게
		topPosition = -5.7;
	}
	if(topPosition < scrollHeight && scrollHeight != 0){//스크롤이 아래로 내력갔을때 계산한 값이 스크롤 위치보다 작으면
		console.log("top : "+topPosition);
		topPosition += 200;	//위치에서 이벤트 요약정보 창 높이 만큼 더하기
	}
	if(topPosition >  $('#container').height()-230){
		topPosition =  $('#container').height()-230;
	}
//	console.log("width : "+(leftPosition) + " , "+"height : "+(topPosition)+" / "+$('#container').width()+" , "+$('#container').height());
	div.css('top',topPosition);
	div.css('left',leftPosition);	//스크린 width따라 위치 조정
	div.css('display','block');
	
	//일시 부분에 날짜 정보 추가
	$(".eventSummaryContents_p:eq(1)").attr('data-startdate',data.startTime[0]+"-"+addZero(data.startTime[1])+"-"+addZero(data.startTime[2]));
	$(".eventSummaryContents_p:eq(1)").attr('data-enddate',data.endTime[0]+"-"+addZero(data.endTime[1])+"-"+addZero(data.endTime[2]));
	
	$("#attendeesList_a").click(function(){
		var list = $("#attendeesList");
		var div = $("#showAttendeesList");
		var text = "";
		var size = data.attendees.length;
		var organizer="";
		list.html('');
		for(var i=0;i<size;i++){
			if(data.attendees[i].organizer == null){
				text+="<li style='font-size:small;'>";
				if(data.attendees[i].displayName != undefined){
					text += data.attendees[i].displayName;
				}
				text += " &lt;"+data.attendees[i].email+"&gt;<li>";
			}else{
				organizer += "<li style='font-size:small;'>주최자 ";
				if(data.attendees[i].displayName != undefined){
					organizer += data.attendees[i].displayName;
				}
				organizer += " &lt;"+data.attendees[i].email+"&gt;<li>";
			}
		}
		list.append(text);
		list.prepend(organizer);
		var top = $(this).offset().top;
		var left = $(this).offset().left;
		var leftPosition = left-$("#container").offset().left*1.5;
		console.log(leftPosition + " , "+$("#container").offset().left);
		if(leftPosition > $("#container").width()-300){
			leftPosition = $("#container").width()-300;
		}
		var topPosition = top-$("#container").offset().top*0.6;
		if(topPosition > $("#container").height()-140){
			topPosition = $("#container").height()-140;
		}
		div.css('top',topPosition);
		div.css('left',leftPosition);	//스크린 width따라 위치 조정
		div.css('display','block');
		return false;
	});
}
function closeAllDiv(){
	$("#showMoreEventDiv").css('display','none');
	$("#showEventSummary").css('display','none');
	$("#showAttendeesList").css('display','none');
}
function clickDeleteEvent(button){
	var result;
	var baseUrl = "http://"+location.href.split('/')[2];
	var data={
			"calendarId" : button.getAttribute('data-calendarId'),
			"eventId" : button.getAttribute('data-eventId')
		};
	result= confirm('정말 삭제하시겠습니까?');
	if(result == true){
		console.log("delete");
		if($("#eventSummaryRecurrence").length == 1){
			$("#recurUpdateDiv").css('display','block');
			if($("#eventSummaryRecurrence").attr('data-recurfirst') != undefined){
				$("input:radio[name=userType]:eq(2)").parent().css('display','none');
			}else{
				$("input:radio[name=userType]:eq(2)").parent().css('display','block');
			}
		}else{
			$.ajax({
				url:baseUrl+"/deleteEvent",
				type:'GET',
				data : data,
				dataType :"json",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				success:function(data){
					if(data == true){
						alert('삭제가 완료되었습니다.');
						$(this).attr('disabled',false);
						//location.reload();
						$("#showEventSummary").css('display','none');
						requestData();
						count=0;
					}
					else{
						alert(data);
						$(this).attr('disabled',false);
						count=0;
					}
				}
			});
		}
	}else{
		alert('취소 되었습니다.');
		$(this).attr('disabled',false);
		count=0;
	}
}
function clickDeleteRecurrenceEvent(){
	var type = $("[name='userType']:checked").val();
	var deleteType = 0;
	var baseUrl = "http://"+location.href.split('/')[2];
	var rrule = "";
	switch(type){
	case "ONLYTHIS":
		deleteType=1;
		break;
	case "ALL":
		deleteType=2;
		break;
	case "NEXT":
		deleteType=3;
		var rruleStr = $("#eventSummaryRecurrence").attr('data-rrule');
		var original = convertRRULEToObject(rruleStr);
		var start = $("#eventSummary_Contents").children().eq(1).attr('data-startdate').split('-');
		var current = new Date(new Date(parseInt(start[0]),parseInt(start[1])-1,parseInt(start[2]),9).getTime()-86400000);	//하루 빼기
		var result = ""+(current.getFullYear())+addZero(current.getMonth()+1)+addZero(current.getDate());
		original.UNTIL = result;
		original.COUNT = undefined;

		rrule = rruleToString(original);
		console.log(rrule);
		break;
	}
	var deleteBtn = $("#btnDeleteEvent");
	var div = $("#showEventSummary");
	var data={
		"calendarId" : deleteBtn.attr('data-calendarId'),
		"eventId" : deleteBtn.attr('data-eventId'),
		"startTime" : $("#eventSummary_Contents").children().eq(1).attr('data-startdate'),
		"rrule" : rrule,
		"deleteType" : deleteType
	};
	$.ajax({
		url:baseUrl+"/deleteRecurrenceEvent",
		type:'GET',
		data : data,
		dataType :"json",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			if(data == true){
				alert('삭제가 완료되었습니다.');
				$(this).attr('disabled',false);
				//location.reload();
				$("#showEventSummary").css('display','none');
				$("#recurUpdateDiv").css('display','none');
				requestData();
				count=0;
			}
			else{
				alert(data);
				$(this).attr('disabled',false);
				$("#recurUpdateDiv").css('display','none');
				count=0;
			}
		}
	});
}
//updateResponseStatus
function updateResponse(response){
	var baseUrl = "http://"+location.href.split('/')[2];
	var response = getResponseStatus($(response).text());
	$(".updateResponseLink_Summ").css('pointer-events','none');
	var data = {
			"calendarId" : $("#btnDeleteEvent").attr('data-calendarid'),
			"eventId" : $("#btnDeleteEvent").attr('data-eventid'),
			"responseStatus" : response,
			"userId" : $("#userId").text()
	};
	$.ajax({
		url:baseUrl+"/updateResponseStatus",
		type:'POST',
		data: data,
		dataType :"json",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			if(data == true){
				alert('수정이 완료되었습니다.');
				requestData();
			}
			else{
				alert(data);
				closeAllDiv();
			}
			$(".updateResponseLink_Summ").css('pointer-events','');
		}
	});
	return false;
}