
//달력 출력 m = 월-1
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
	$("#dayTable").css('display','');	//요일 부분 표시
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
					table += "<td class='dateIndexTd'";
					table += " data-dateIndex='"+(j+start)+"'></td>";
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

					if(j == colNum -1){
						table += " moreEvent";
					}
					if(m == month && x+start+1-startDay == date){
						table+=" today";
					}
					table += "' data-index='"+(x+start)+"' data-col='"+j+"'";
					
					if(j == colNum -1){
						table+= " data-add='0'";
					}
					table +="></td>";
				}
			}
			table+="</tr>";
		}
		table+="</table></div>";
	}
	document.getElementById("dates").innerHTML = table;
	var dateIndexTds = document.getElementsByClassName("dateIndexTd");
	for(var a=0;a<dateIndexTds.length;a++){
		dragDate(dateIndexTds[a],'data-dateindex');
	}
		
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

function makeEventTitleForm(data,color,more,responseStatus,weekly){
	var text = "<span class='eventTime'>";
	if(data.startTime[3] != -1){
		var hour = data.startTime[3];
		var min = data.startTime[4];
		text += changeTimeForm(hour, min);
	}
	text +=" </span><a title='"+isNull(data.summary)+"'style='";
	if(responseStatus == null){
		responseStatus = undefined;
	}
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
	var jsonStr = JSON.stringify(data).replace(/\'/g,"&#39;");
	text += "<span class='eventInformation' style='display:none;' data-information='"+jsonStr+"'></span>";
	return text;
}
function isNull(text){
	if(text == null){
		return "없음";
	}
	text = text.replace(/\'/g,"&#39;");	//'표시
	text = text.replace(/\"/g,"&quot;");	//"표시

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
		title += "</div>";
		if(startDateIndex == endDateIndex){//하루 일정
			var col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
			if(col == colNum -1){//마지막줄인 경우
				 setAddTd(startDateIndex, col,data[i]);
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
						 setAddTd(startDateIndex, col,data[i]);
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
						 setAddTd(index, col,data[i]);
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
	var eventTitleLinks = document.getElementsByClassName('eventTitleLink');
	for(var i=0;i<eventTitleLinks.length;i++){
		dragEvent_date(eventTitleLinks[i],'data-dateindex');
	}
}

function setEventTd(index, col, title, colorCode, colspan,responseStatus,eventTd){
	var td; 
	if(eventTd != undefined){
		td = eventTd;
	}else{
		td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
	}
	td.html(title);
	td.attr("colspan",colspan);
	td.attr('class',"eventFill");
	if(index == "weekly"){//주별에서 시간이 있는 일정 그리는 경우
		td.attr('class',"eventFill_weekly");
	}
	if(eventTd != undefined){
		td.removeAttr("data-indexweekly");
	}else{
		td.removeAttr("data-index");
		td.removeAttr("onclick");
	}
	td = td.children().eq(0);
	
	if(index == "weekly" && responseStatus == null){
		td.css('border','1px solid white');
	}else{
		td.css('border','2px solid '+colorCode);
	}
	if(responseStatus == null){
		td.css('background-color',colorCode);
	}else{
		switch(responseStatus){
			case "accepted":
				td.css('background-color',colorCode);
				break;
			case "declined":
				td.css('background-color','white');
				td.css('font-weight','bold');
				break;
			case "tentative":
				td.css('background-color','white');
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
				td.css('font-weight','bold');
				break;
		}
	}
}

function setAddTd(index, col,data){
	var td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
	var add = parseInt(td.attr("data-add")) +1;
	var more = "";
	td.attr("data-add",add);
	if(add == 1){//처음에만
		td.css('z-index','2');
	}
	temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
	td.html(temp);
//	if(data != null){
//		more = "<span class='eventInformation' style='display:none' data-information='"+JSON.stringify(data)+"'></span>";
//	}
//	if(td.children().length == 0){
//		td.removeAttr("onclick");
//		
//		if(more != ""){
//			temp += more;
//		}
//		td.html(temp);
//	}else{
//		td.children().eq(0).text("+"+add);
//		if(more != ""){
//			td.append(more);
//		}
//	}
}
function dragDate(elmnt,attr){
	elmnt.onmousedown = dragMouseDown_date;
	var startIndex;
	var endIndex;
	var width;
	var height;
	function dragMouseDown_date(e){
		var x;
		var y;
		if(attr == 'data-dateindex'){
			x = e.pageX - $("#dates").offset().left;
			y = e.pageY - $("#dates").offset().top;
			width = parseInt($(".dateIndexTd").eq(0).width());
			height = parseInt($(".dateIndexTd").eq(0).height());
		}else{
			x = e.pageX - $("#header_weekly").offset().left - 65;	//65만큼은 설명 부분 너비
			y = e.pageY - $("#header_weekly").offset().top;
			width = parseInt($(".dateIndexWeeklyTd").eq(0).width());
			height = parseInt($("#header_weekly").height());
		}
		$(".eventFill").css('z-index','1');
		$(".moreEvent").css('z-index','1');
		startIndex = parseInt(x/width) + parseInt(y/height)*7;
		$("["+attr+"="+startIndex+"]").addClass('clickDate');
//		console.log(x+","+y+", start index="+startIndex + " , width="+width+", height="+height);
		document.onselectstart = new Function('return false');
		if(attr == 'data-dateindex'){
			document.onmouseup = closeDragElement_date;
		}else{//daily, weekly에서 날짜 드래그 한 경우
			document.onmouseup = closeDragElement_dateWeekly;
		}
		document.onmousemove = elementDrag_date;
	}
	function elementDrag_date(e){
		var x;
		var y;
		if(attr == 'data-dateindex'){
			x = e.pageX - $("#dates").offset().left;
			y = e.pageY - $("#dates").offset().top;
		}else{
			x = e.pageX - $("#header_weekly").offset().left - 65;	//65만큼은 설명 부분 너비
			y = e.pageY - $("#header_weekly").offset().top;
		}
		endIndex = parseInt(x/width) + parseInt(y/height)*7;
//		console.log(x+","+y+", end index="+endIndex + " , width="+width+", height="+height);
		var last = $('.clickDate:last').attr(attr);
		var first = $('.clickDate:first').attr(attr);
		for(var i=first; i<= startIndex-1; i++){
			$("["+attr+"="+i+"]").removeClass("clickDate");
		}
		if(startIndex < endIndex){
			var nextEnd = endIndex+1;
			for(var a = nextEnd; a<= last; a++){
				$("["+attr+"="+a+"]").removeClass("clickDate");
			}
			for(var i=startIndex; i <= endIndex; i++){
				$("["+attr+"="+i+"]").addClass('clickDate');
			}
		}else if(startIndex >= endIndex){
			for(var a = startIndex+1; a<= last; a++){
				$("["+attr+"="+a+"]").removeClass("clickDate");
			}
			for(var i=endIndex; i <= startIndex; i++){
				$("["+attr+"="+i+"]").addClass('clickDate');
			}
		}
	}
	function closeDragElement_date(e){
		console.log("close");
		var date = "";
		var year = $("#backBtn").attr('value');
		var month = $("#forwardBtn").attr('value');

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
		//eventFill original value = 4 
		$(".eventFill").css('z-index','4');
		
		document.onmouseup = null;
		document.onmousemove = null;
		document.onselectstart = null;
	}
	function closeDragElement_dateWeekly(e){
		console.log("close");
		var date = "";
		var path = location.pathname.split('/');
		var dateStr = path[2].split('-');
		var urlDay = new Date(parseInt(dateStr[0]),parseInt(dateStr[1])-1,parseInt(dateStr[2]),9);	//사용자가 클릭한 날짜 추출
		var weekStart = new Date(urlDay.getTime()-urlDay.getDay()*86400000);	//사용자가 클릭한 날짜의 주 시작 날짜
		var startDate;
		var endDate;
		
		switch(path[1]){
		case 'w':
			startDate = new Date(weekStart.getTime()+parseInt($(".clickDate:first").attr('data-dateIndexWeekly'))*86400000);//시작 날짜
			endDate = new Date(weekStart.getTime()+parseInt($(".clickDate:last").attr('data-dateIndexWeekly'))*86400000);	//끝 날짜
			date = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+"~";
			date += endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
			break;
		case 'd':
			date = path[2]+"~"+path[2];
			break;
		}
		console.log(date);
		$("#addEventDate").attr('value',date);
		goToEventPage("add");
		$(".clickDate").removeClass("clickDate");
		//eventFill original value = 4  날짜 한칸은 2
		$(".eventFill").css('z-index','4');
		
		document.onmouseup = null;
		document.onmousemove = null;
		document.onselectstart = null;
	} 
}
function dragEvent_date(elmnt,attr){
	elmnt.onmousedown = dragMouseDown_date;
	var startIndex, endIndex;
	var width, height;
	var move;
	var inputJSON;
	var drag = false;
	var click = false;
	var startPosX,startPosY, endPosX, endPosY;
	function dragMouseDown_date(e){
		drag = false;
		click = false;
		var x,y;
		move = $(elmnt).clone();
		startPosX = e.pageX;
		startPosY = e.pageY;
		if(attr == 'data-dateindex'){//월뷰
			x = e.pageX - $("#dates").offset().left;
			y = e.pageY - $("#dates").offset().top;
			width = parseInt($(".dateIndexTd").eq(0).width());
			height = parseInt($(".dateIndexTd").eq(0).height());
			$(move).appendTo('#dates');
		}else{//weekly, daily
			x = e.pageX - $("#header_weekly").offset().left - 65;	//65만큼은 설명 부분 너비
			y = e.pageY - $("#header_weekly").offset().top;
			width = parseInt($(".dateIndexWeeklyTd").eq(0).width());
			height = parseInt($("#header_weekly").height());
			$(move).appendTo('#header_weekly');
		}
		$(move).css('width',$(elmnt).css('width'));
		$(".eventFill").css('z-index','1');
		startIndex = parseInt(x/width) + parseInt(y/height)*7;
		
//		console.log(x+","+y+", start index="+startIndex + " , width="+width+", height="+height);
//		$(elmnt).css('position','absolute');
		
		$(move).css('position','absolute');
		$(move).css('height','31px');
		$(move).css('border','1px solid white');
		$(move).css('z-index','5');
		$(move).css('display','none');
		
		document.onselectstart = new Function('return false');
		document.onmouseup = closeDragElement_date;
		document.onmousemove = elementDrag_date;
	}
	function elementDrag_date(e){
		drag = true;
		endPosX = e.pageX;
		endPosY = e.pageY;
		if(!click){
			if($(move).css('display') == 'none'){
				$("[data-"+attr+"='"+startIndex+"']").addClass('clickDate');
				$(move).css('top',y+'px');
				$(move).css('left',x+'px');
				$(move).css('display','');
			}
			var x,y;
			if(attr == 'data-dateindex'){
				x = e.pageX - $("#dates").offset().left;
				y = e.pageY - $("#dates").offset().top;
			}else{
				x = e.pageX - $("#header_weekly").offset().left - 65;	//65만큼은 설명 부분 너비
				y = e.pageY - $("#header_weekly").offset().top;
			}
			
			endIndex = parseInt(x/width) + parseInt(y/height)*7;
			$(move).css('top',y+'px');
			$(move).css('left',x+'px');
			$(".clickDate").removeClass('clickDate');
			$("["+attr+"='"+endIndex+"']").addClass('clickDate');
		}
//		console.log(x+","+y+", end index="+endIndex + " , width="+width+", height="+height);
	}
	function closeDragElement_date(e){
		console.log("close");
		var update = true;
		if(Math.abs(startPosX-endPosX) < 9 || Math.abs(startPosY-endPosY) < 9){//이동한 거리가 너무 작으면
			drag = false;
		}
		if(!drag){
			click = true;
			clickEvent(elmnt);
			update = false;
		}
		var inputJSON = JSON.parse($(move).children().last().attr('data-information'));
		var accessRole = $("input:checkbox[value='"+inputJSON.calendarID+"']").attr('data-accessrole');
		if(drag && (accessRole == 'reader' || accessRole == 'freeBusyReader')){//이 권한은 수정할 수 없음
			alert('이 일정은 수정이 불가능합니다');
			update= false;
		}
		endIndex = $(".clickDate").attr(attr);
		if(endIndex != undefined && update){//날짜 영역 밖에 놓은 경우는 제외
			var firstDate;
			var firstDay, urlDay;
			var path = location.pathname.split('/');
			if(attr == 'data-dateindex'){
				var year = $("#backBtn").attr('value');
				var month = $("#forwardBtn").attr('value');
				firstDate = new Date(parseInt(year),parseInt(month)-1,1);
				firstDay = firstDate.getDay();	//시작 요일
			}else{
				var dateStr = path[2].split('-');
				urlDay = new Date(parseInt(dateStr[0]),parseInt(dateStr[1])-1,parseInt(dateStr[2]));	//사용자가 클릭한 날짜 추출
				firstDate = new Date(urlDay.getTime()-urlDay.getDay()*86400000);	//사용자가 클릭한 날짜의 주 시작 날짜
				firstDay = 0;
			}
			var originStart = new Date(inputJSON.startTime[0],inputJSON.startTime[1]-1,inputJSON.startTime[2]);
			var clickDate = new Date(firstDate.getTime()+(parseInt(endIndex)-firstDay)*86400000);
			if(path[1] == 'd'){//daily인 경우 사용자가 클릭한 날짜가 url에 있는 날짜와 동일
				clickDate = new Date(urlDay.getTime());
			}
			if(originStart.getTime() == clickDate.getTime()){//원래 날짜에 놓았으면
				$(".clickDate").removeClass('clickDate');
				$(move).remove();
			}else{
				var isAllDay = true;
				var recurrence = false;
				var start ,end;
				var originalStartTime=0;
				var originEnd = new Date(inputJSON.endTime[0],inputJSON.endTime[1]-1,inputJSON.endTime[2]);
				var term = parseInt((originEnd.getTime()-originStart.getTime())/86400000);
				end = new Date(clickDate.getTime()+term*86400000);
				start = clickDate;
				
				if(inputJSON.startTime[3] != -1){//시간이 있는 일정
					isAllDay = false;
					start.setHours(inputJSON.startTime[3]);
					start.setMinutes(inputJSON.startTime[4]);
					originStart.setHours(inputJSON.startTime[3]);
					originStart.setMinutes(inputJSON.startTime[4]);
					console.log(start);
					end.setHours(inputJSON.endTime[3]);
					end.setMinutes(inputJSON.endTime[4]);
				}else{
					start.setHours(9);
					originStart.setHours(9);
					console.log(start);
					end.setTime(end.getTime()+86400000);
					end.setHours(9);
				}
				if(inputJSON.recurrence != null){
					recurrence = true;
					originalStartTime = originStart.getTime();
				}
				var data = {
					"calendarId" : inputJSON.calendarID,
					"eventId" : inputJSON.eventID,
					"startDate" : start.getTime(),
					"endDate" : end.getTime(),
					"isAllDay" : isAllDay,
					"recurrence" : recurrence,	//추후 고치기
					"originalStartTime" : originalStartTime
				};
				var baseUrl = "http://"+location.href.split('/')[2];
				$.ajax({
					url: baseUrl+"/updateEventDate",
					type:'POST',
					data: JSON.stringify(data),
					contentType: "application/json; charset=UTF-8",
					success:function(result){
						console.log(result=="true");
						if(result == "true"){
							alert('수정이 완료되었습니다');
							requestData();
						}else{
							alert(result);
						}
					},
				});
			}
		}
		//초기화
		$(".eventFill").css('z-index','4');
		$(".clickDate").removeClass('clickDate');
		$(move).remove();
		document.onmouseup = null;
		document.onmousemove = null;
		document.onselectstart = null;
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
	if(event.childNodes.length == 3 || event.childNodes.length == 4){	//why?
		clickEventTitle(event.childNodes[1],false);
		//clickEventTitle($(event).children().eq(0),false);
	}else{
		clickEventTitle(event.childNodes[0].childNodes[0],false);
		
	}
	
}
