
//달력 출력
function printCalendar(y, m, data,colNum) {    
	
   var now = new Date();
   var year = now.getFullYear();
   var month = now.getMonth();
   var date = now.getDate();	//현재 날짜

   y = (y != undefined)? y:year;
   m = (m != undefined)? m:month;
   
   var startDate = new Date(y,m,1);
   var startDay = startDate.getDay();	//시작 요일
   
	var lastDate = 31;
	m++;
	month++;
	
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
	var tempDateNum = 1;
	
	//달력그리기
	for(var i = 0; i<row;i++){
		table+="<div class='dateLine ";
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
		table+="<table class = 'dayList'><tr>";
		var start = i*7;
		
		for(var j=0; j < 7 ; j++){
			if(i == 0 && j<startDay){
				table += "<td></td>";
			}else{
				if(tempDateNum > lastDate){
					table += "<td></td>";
				}else{
					table += "<td data-dateIndex='"+(j+start)+"' draggable='true' onclick='mouseUpDate(this,false)' onmousedown='startDrag(this)' ondragenter='mouseDownDate(this)' ondragend='mouseUpDate(this,true)'></td>";
					tempDateNum ++;
				}
			}
		}
		table += "</tr></table>";
		table+="<table class = 'scheduleList'>";
		var start = i*7;
		for(var j = 0;j < colNum;j++){
			table+="<tr class='dateLineTr'>";
			for(var x = 0; x < 7;x++){
				if(j == 0){//show date
					if(i == 0 && x < startDay){
						table += "<td class='date'>"+"   "+"</td>";
					}else{
						table += "<td class='date";
						if(m == month && dateNum == date){
							table+=" today";
						}
						if(dateNum > lastDate){
							table+="'></td>";
						}else{
							table += "'>"+dateNum+"</td>";
							dateNum++;
						}
					}
				}else{
					table += "<td class='event";
					if(m == month && x+start == date+startDay-1){
						table += " today";
					}
					if(j == colNum -1){
						table += " moreEvent";
					}
					table += "' data-index='"+(x+start)+"' data-col='"+j+"'";
					
					if(j == colNum -1){
						table+= " data-add=0";
					}
					table +="></td>";
				}
			}
			table+="</tr>";
		}
		table+="</table></div>";
	}
	document.getElementById("dates").innerHTML = table;

	printEvent(y, m, startDay, lastDate, data, colNum);
	$(".showMoreEvent").click(function(){
		var index = $(this).parent().attr('data-index');
		var clickDate = index-startDay+1;
		var top = $(this).offset().top;
		var left = $(this).offset().left;
		var div = $("#showMoreEventDiv");
		$("#showMoreEvent_Title").html(m+"월 "+clickDate+"일");
		
		var d = new Date(y,m-1,clickDate,0,0,0,0);
		clickDate = d.getTime();
		var clickDateMax = clickDate + 86400000;
		div.css('display','block');
		var leftPosition = left-$("#container").offset().left*1.5;
	
		console.log(leftPosition + " , "+$("#container").offset().left);
		if(leftPosition > $("#container").width()-190){
			leftPosition = $("#container").width()-190;
		}
		div.css('top',top-$("#container").offset().top*4);
		div.css('left',leftPosition);	//스크린 width따라 위치 조정
		
		var list = $("#moreEventList");
		var text = "";
		var size = data.length;
		
		for(var i=0;i<size;i++){
			//console.log(data[i].summary + " , "+data[i].start+" , "+clickDateMax + " , "+data[i].end+" , "+clickDate);
			if(data[i].start < clickDateMax && data[i].end >= clickDate && data[i].start != clickDateMax -1){//확인 종일 일정인 경우에는 오전 12시에서 -1밀리초 만큼 빼서 다음날 일정은 포함 안되게
				text+="<li>"+makeEventTitleForm(data[i],"black",true)+"</li>";
			}
			if(data[i].start > clickDateMax){
				break;
			}
		}
		list.html(text);
		return false;	//버튼 누를시 스크롤바 이동 방지
	});
}
function drawCalendar(year,month,data){
	calColNumAndPrintCalendar(year, month, data);
	$(window).resize(function(){
		calColNumAndPrintCalendar(year, month, data);
	});
	
}
function calColNumAndPrintCalendar(year, month, data){
	//높이에 따른 세로 갯수
	var colNum = 6;	//0번째 줄은 무조건 날짜
	var height = $("#container").height();
	if(height <= 744 && height > 610){
		colNum = 5;
	}else if(height <= 610 && height > 508){
		colNum = 4;
	}else if(height <= 508 && height > 385){
		colNum = 3;
	}else if(height <= 385){
		colNum = 2;
	}
	console.log(colNum);
	printCalendar(year,month,data,colNum);
}
//날짜 칸을 마우스가 처음으로 눌렀을 때
function startDrag(td){
	$(td).attr('id','firstClick');
	//eventFill original value = 4  날짜 한칸은 2
	$(".eventFill").css('z-index','1');
	$(".moreEvent").css('z-index','1');
}
function mouseDownDate(td){
	var last = $('.clickDate:last').attr('data-dateIndex');
	var first = $('.clickDate:first').attr('data-dateIndex');
	$(td).attr('class','clickDate');
	var start = parseInt($('#firstClick').attr('data-dateIndex'));
	var end = parseInt($(td).attr('data-dateIndex'));
	
	for(var i=first; i<= start-1; i++){
		$("[data-dateIndex="+i+"]").attr('class','');
	}
	
	if(start < end){
		var nextEnd = end+1;
		for(var a = nextEnd; a<= last; a++){
			$("[data-dateIndex="+a+"]").attr('class','');
		}
		for(var i=start; i <= end; i++){
			$("[data-dateIndex="+i+"]").attr('class','clickDate');
		}
	}else if(start >= end){
		for(var a = start+1; a<= last; a++){
			$("[data-dateIndex="+a+"]").attr('class','');
		}
		for(var i=end; i <= start; i++){
			$("[data-dateIndex="+i+"]").attr('class','clickDate');
		}
	}
	
}
function mouseUpDate(td,drag){
	var date = "";
	var year = $("#backBtn").attr('value');
	var month = $("#forwardBtn").attr('value');
	
	if(drag == false){
		console.log("Aa");
		$(td).attr('class','clickDate');
	}
	
	date += year+"-";
	date += month+"-";
	var startDate = new Date($("#backBtn").attr('value'),parseInt($("#forwardBtn").attr('value'))-1,1);
	var startDay = startDate.getDay();	//시작 요일
	date += (parseInt($(".clickDate:first").attr("data-dateindex"))-startDay +1);
	date += "~"+year+"-"+month+"-";
	date += (parseInt($(".clickDate:last").attr('data-dateIndex'))-startDay+1);
	console.log(date);
	$("#addEventDate").attr('value',date);
	clickAddBtn();
	$(".clickDate").removeClass("clickDate");
	//document.getElementById("addForm").submit();
}


function makeEventTitleForm(data,color,more){
	var text = "<span class='eventTime'>";
	if(data.startTime[3] != -1){
		var hour = data.startTime[3];
		var min = data.startTime[4];
		text += changeTimeForm(hour, min);
	}
	text +=" </span><a title='"+isNull(data.summary)+"'style='color:"+color+"'";
	text += " onClick ='";
	if(more){
		text += " clickEventTitle(this,false);"
	}
	text +=	"return false;' href='#' data-eventId ="+data.eventID+" data-calendarId = "+data.calendarID+">"+isNull(data.summary)+"</a>";
	text += "<span style='display:none;' data-information='"+JSON.stringify(data)+"'></span>";
	return text;
}
function isNull(text){
	if(text == null){
		return "없음";
	}
	return text;
}
//이벤트 출력
function printEvent(year, month, startIndex, lastDate, data, colNum){
	var eventNum = 0;
	var dateIndex = startIndex-1;
	 var size = data.length;
	for(var i = 0; i < size; i++){
		var index=0;
		var startDateIndex=0;
		var endDateIndex=0;
		var colorCode;
		var calendarListSize = $("[type='checkbox']").size();
		for(var j=0; j < calendarListSize;j++){
			if($("[type='checkbox']").eq(j).val() == data[i].calendarID){
				colorCode = $("[type='checkbox']").eq(j).attr('data-colorCode');
				break;
			}
		}
		if(data[i].startTime[1] < month || data[i].startTime[0] < year){//2017-12 ~ 2018-3
			index = startIndex;
		}else{
			index = data[i].startTime[2] + startIndex -1;
		}
		startDateIndex = index;
		if(data[i].endTime[1] > month || data[i].endTime[0] > year){
			endDateIndex = lastDate + startIndex - 1;
		}else{
			endDateIndex = data[i].endTime[2] + startIndex -1;
		}
		var title = "<div class='eventTitleLink' onclick='clickEvent(this);'>"+makeEventTitleForm(data[i],"white",false);
		
		if(startDateIndex == endDateIndex){//하루 일정
			var col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
			if(col == colNum -1){//마지막줄인 경우
				 setAddTd(startDateIndex, col);
				//$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").addClass('moreEvent');
			}else{//일정 세팅 그리기
				setEventTd(startDateIndex, col, title, colorCode, 0);
			}
		}else{//이어지는 일정
			var weekNum = 6;
			var colspan = 0;
			var isIn = 0;
			var col = 0;
			
			for(var n = 0; n < 6;n++){
				weekNum = 6 + 7*n;
				if(startDateIndex <= weekNum && endDateIndex <= weekNum && isIn == 0){//한 주에 있는 경우
					colspan = endDateIndex - startDateIndex +1;
					if(index == startDateIndex){//이벤트가 들어갈 줄 선정
						col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
						var lastCol = $("[data-index="+endDateIndex+"]:eq(0)").attr("data-col");
						col = col > lastCol ? col:lastCol;
					}
					if(col == colNum - 1){//마지막 줄인 경우
						 setAddTd(startDateIndex, col);
					}else{//일정 세팅 그리기
						setEventTd(startDateIndex, col, title, colorCode, colspan);
					}
					index++;
					while(index <= endDateIndex){
						if(col == colNum - 1){
							 setAddTd(index, col);
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						}
						index++;
					}
					break;
				}else if(index <= weekNum && endDateIndex > weekNum){//주 넘어가는 경우
					colspan = weekNum-index+1;
					if(index == startDateIndex){//이벤트가 들어갈 줄 선정
						col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
						var tempWeekNum = 0;
						var tempIndex = index;
						for(var a=0;a<6;a++){
							tempWeekNum = 6+7*a;
							if(index <= tempWeekNum && endDateIndex > tempWeekNum){
								var last = $("[data-index="+tempWeekNum+"]:eq(0)").attr("data-col");
								col = col > last ? col:last; 
							}else if(endDateIndex <= tempWeekNum){//마지막 주
								var last = $("[data-index="+endDateIndex+"]:eq(0)").attr("data-col");
								col = col > last ? col:last; 
								break;
							}	
						}
					}
					if(col == colNum-1){//마지막 줄인 경우
						 setAddTd(index, col);
					}else{//일정 칸 설정 
						if(index == startDateIndex){
							setEventTd(startDateIndex, col, title, colorCode, colspan);
						}else{
							setEventTd(index, col, title, colorCode, colspan);
						}
					}
					index++;
					while(index <= weekNum){//일정 칸 늘린 만큼 제거
						if(col == colNum - 1){//마지막 줄이면 각 줄에 더보기 추가
							 setAddTd(index, col);
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						}
						index++;
					}
					index = weekNum+1;
					isIn = 1;
				}else if(index <= weekNum && endDateIndex <= weekNum){//마지막 주
					//console.log("last"+", "+endDateIndex);
					colspan = endDateIndex - index +1;
					if(col == colNum-1){//더보기 링크
						 setAddTd(index, col);
					}else{
						 setEventTd(index, col, title, colorCode, colspan);
					}
					index++;
					while(index <= endDateIndex){
						if(col == colNum - 1){//더보기 링크
							 setAddTd(index, col);
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						}
						index++;
					}
					break;
				}
			}//for-n
		}
	}//for-i
}

function setEventTd(index, col, title, colorCode, colspan){
	var td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
	td.html(title);
	td.css('background-color',colorCode);
	td.css('border-bottom','1px solid white');
	td.css('border-top','1px solid white');
	td.attr("colspan",colspan);
	td.attr("class","eventFill");
	td.removeAttr("data-index");
	td.removeAttr("onclick");
}

function setAddTd(index, col){
	var td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
	var add = parseInt(td.attr("data-add")) +1;
	td.attr("data-add",add);
	td.removeAttr("onclick");
	temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
	td.html(temp);
}

function clickEventTitle(title,scroll){
	var baseUrl = "http://localhost:8080";
	var data={
		"calendarId" : title.getAttribute('data-calendarId'),
		"eventId" : title.getAttribute('data-eventId')
	};
	$.ajax({
		url:baseUrl+"/showEventDetail",
		type:'GET',
		data : data,
		dataType :"json",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			var calendar = $("[data-originalCalendarId = '"+title.getAttribute('data-calendarId')+"']");
			var contents = "<p class='eventSummaryContents_p'> 제목 : "+isNull(data.summary)+"</p>";
			contents += "<p class='eventSummaryContents_p'> 일시 : "+data.startTime[0]+"."+addZero(data.startTime[1])+"."+addZero(data.startTime[2]);
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
			contents += "<p class='eventSummaryContents_p'> 장소 : "+data.location+"</p>";
			contents += "<p class='eventSummaryContents_p'> 내용 : "+data.description+"</p>";
			
			$('#eventSummary_Contents').html(contents);
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
		}
	});
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
}
function clickDeleteEvent(button){
	var result;
	var baseUrl = "http://localhost:8080";
	var data={
			"calendarId" : button.getAttribute('data-calendarId'),
			"eventId" : button.getAttribute('data-eventId')
		};
	result= confirm('정말 삭제하시겠습니까?');
	if(result == true){
		console.log("delete");
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
					getList();
					count=0;
				}
				else{
					alert(data);
					$(this).attr('disabled',false);
					count=0;
				}
			}
		});
	}else{
		alert('취소 되었습니다.');
		$(this).attr('disabled',false);
		count=0;
	}
}
function addZero(data){
	var result = "";
	if(data < 10){
		result +="0";
	}
	result += data;
	return result;
}
function changeTimeForm(hour, min){
	var result = "";
	if(hour < 12){
		result += "오전 ";
		
	}else{
		result += "오후 ";
		if(hour > 12){
			hour -= 12;
		}
	}
	result+=addZero(hour)+":"+addZero(min);
	return result;
}
function clickEvent(event){
	if(event.childNodes.length == 2){
		clickEventTitle(event.childNodes[1],false);
	}else{
		clickEventTitle(event.childNodes[0].childNodes[0],false);
	}
}