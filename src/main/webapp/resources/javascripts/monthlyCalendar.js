
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
		closeAllDiv();
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
	console.log("drawCalendar");
	calColNumAndPrintCalendar(year, month, data);
	$(window).resize(function(){
		calColNumAndPrintCalendar(year, month, data,true);
	});
}
function calColNumAndPrintCalendar(year, month, data,resize){
	//높이에 따른 세로 갯수
	var originColNum = parseInt($("#monthCalendar").attr('data-colnum'));
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
	if(originColNum == colNum && resize)
		return;
	$("#monthCalendar").attr('data-colnum',colNum);
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
	closeAllDiv();
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
	goToEventPage("add");
	$(".clickDate").removeClass("clickDate");
	//document.getElementById("addForm").submit();
}


function makeEventTitleForm(data,color,more,responseStatus){
	var text = "<span class='eventTime'>";
	if(data.startTime[3] != -1){
		var hour = data.startTime[3];
		var min = data.startTime[4];
		text += changeTimeForm(hour, min);
	}
	text +=" </span><a title='"+isNull(data.summary)+"'style='";
	if(responseStatus != undefined){
		switch(responseStatus){
			case "accepted":
				text +="color:white'";
				break;
			case "declined":
				text += "color:"+color+"; text-decoration:line-through;'";
				break;
			case "tentative":
				text += "color:black'";
				break;
			case "needsAction":
				text += "color:"+color+"'";
				break;
		}
	}else{
		text += "color:"+color+"'";
	}
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
		var responseStatus = null;
		var me = -1;
		if(data[i].attendees != null){
			for(var y=0; y<data[i].attendees.length;y++){
				if(data[i].attendees[y].email == data[i].calendarID && data[i].attendees[y].email == $("#userId").text()){
					responseStatus = data[i].attendees[y].responseStatus;
				}
				if(data[i].attendees[y].email == $("#userId").text()){
					me = y;
				}
			}
			if(responseStatus == null){
				if(data[i].calendarID == data[i].organizer && me != -1){//현재 달력이 마스터 달력이고 참석자에 본인이 있는 경우
					responseStatus = data[i].attendees[me].responseStatus;
				}
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
		var title = "<div class='eventTitleLink' onclick='clickEvent(this);'>";
		if(responseStatus == null){
			title += makeEventTitleForm(data[i],"white",false);
		}else{
			title += makeEventTitleForm(data[i],colorCode,false,responseStatus);
		}
		
		if(startDateIndex == endDateIndex){//하루 일정
			var col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
			if(col == colNum -1){//마지막줄인 경우
				 setAddTd(startDateIndex, col);
				//$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").addClass('moreEvent');
			}else{//일정 세팅 그리기
				setEventTd(startDateIndex, col, title, colorCode, 0,responseStatus);
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
						setEventTd(startDateIndex, col, title, colorCode, colspan,responseStatus);
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
							setEventTd(startDateIndex, col, title, colorCode, colspan,responseStatus);
						}else{
							setEventTd(index, col, title, colorCode, colspan,responseStatus);
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
						 setEventTd(index, col, title, colorCode, colspan,responseStatus);
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

function setEventTd(index, col, title, colorCode, colspan,responseStatus){
	var td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
	td.html(title);
	if(responseStatus == null){
		td.css('background-color',colorCode);
		td.css('border-bottom','1px solid white');
		td.css('border-top','1px solid white');
	}else{
		switch(responseStatus){
			case "accepted":
				td.css('background-color',colorCode);
				td.css('border-bottom','1px solid white');
				td.css('border-top','1px solid white');
				break;
			case "declined":
				td.css('background-color','white');
				td.css('border','2px solid '+colorCode);
				td.css('font-weight','bold');
				break;
			case "tentative":
				td.css('background-color','white');
				td.css('border','2px solid '+colorCode);
				var background = "linear-gradient(-45deg";
				var start = 25;
				for(var i=0;i<3;i++){
					background += ",white "+start+"%,"+colorCode+" 0,"+" white "+(start+4)+"%";
					start += 25;
				}
				background +=')';
				td.css('background-image',background);
				td.css('background-size','30px 30px');
				break;
			case "needsAction":
				td.css('background-color','white');
				td.css('border','2px solid '+colorCode);
				td.css('font-weight','bold');
				break;
		}
	}
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
	if(event.childNodes.length == 3){
		clickEventTitle(event.childNodes[1],false);
		//clickEventTitle($(event).children().eq(0),false);
	}else{
		clickEventTitle(event.childNodes[0].childNodes[0],false);
		
	}
}