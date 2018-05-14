
function drawWeeklyCalendar(year,month,date,data,weekly){
	//console.log(data);
	$(".sideDiv_weekly").css('display','inline-block');
	$("#allDay_weekly").css('display','block');
	$("#container_weekly").css('display','block');
	$("#title_weekly").css('display','block');
	$("#moreAllDay_weekly").text("∧");
	showWeeklyTitle(year,month,date,weekly);
	var allDayEvent = new Array();
	var timeEvent = new Array();
	var size = data.length;
	month = parseInt(month);
	date = parseInt(date);
	//console.log(year+"-"+month+"-"+date);
	var same = true;
	for(var i=0;i<size;i++){
		same = true;
		for(var j=0;j<3;j++){
			if(data[i].startTime[j] != data[i].endTime[j]){	//시작 날짜와 끝날짜가 같으면 하루 일정
				same = false;
				break;
			}
		}
		if(same && data[i].startTime[3] != -1){	//그날 하루짜리 시간이 있는 일정
			timeEvent.push(data[i]);
		}else{
			allDayEvent.push(data[i]);
		}
	}
	showWeeklyAllDay(year,month,date,allDayEvent,weekly);
	showWeeklyEvent(year,month,date,timeEvent,weekly);
	
}

function showWeeklyTitle(year,month,date,weekly){
	var col = weekly == true? 7:1;
	var text = "<table class='table_weekly' style='height:99%;position:absolute;'><tr>";
	var clickTable = "<table id='clickAlldayTable_weekly' class='table_weekly' style='z-index:3; border:none;height:100%; width:100%;position:absolute;'>";
	var div = $("#title_weekly");
	var dayList = ["일","월","화","수","목","금","토"];
	var start = new Date(year,month-1,date,9);
	for(var i=0;i<col;i++){
		var d = new Date(start.getTime()+86400000*i);
		text += "<td style='border:1px solid #c3c3c3; padding-left:10px;'><p class='dateP_weekly'>"+d.getDate()+"</p>";
		text +="<p class='dayP_weekly'>"+ dayList[d.getDay()]+"</p></td>";
		clickTable += "<td class='dateIndexWeeklyTd' data-dateIndexWeekly='"+i+"'></td>"; 
	}
	text += "</tr></table>";
	clickTable +="</tr><table>";
	div.html(text);
	div.append(clickTable);
}
function makeWeeklyAllDayTable(row){
	var div = $("#allDay_weekly");
	var col = 5;	//줄
	var table="<table id='alldayTable_weekly' class='table_weekly' style='position:absolute;' cellpadding='0' cellspacing='0' data-maxcol="+col+">";
	var clickTable = "<table id='clickAlldayTable_weekly class='table_weekly' style='z-index:3; border:none;height:100%; width:100%;position:absolute;'>";
	table += "<tr style='display:hidden; height:0;'>";
	clickTable += "<tr>";
	for(var j=0;j<row;j++){
		table += "<td></td>";
		clickTable += "<td class='dateIndexWeeklyTd' data-dateIndexWeekly='"+j+"'></td>"; 
	}
	table += "</tr>";
	clickTable +="</tr>";
	for(var i=0;i<col;i++){
		table += "<tr>";
		for(var j=0;j<row;j++){
			table += "<td style='border:1px solid #c3c3c3; width:14.2%;' data-indexWeekly="+j+" data-colWeekly="+i+"></td>";
		}
		table += "</tr>";
	}
	table += "</table>";
	clickTable += "</table>";
	div.html(table);
	div.append(clickTable);
	var dateIndexWeeklyTds = document.getElementsByClassName("dateIndexWeeklyTd");
	for(var i=0;i<dateIndexWeeklyTds.length;i++){//드래그 등록
		dragDate(dateIndexWeeklyTds[i],'data-dateIndexWeekly');
	}
}
function showWeeklyAllDay(year,month,date,data,weekly){
	var row = weekly == true? 7:1;
	var text = "";
	//console.log(data);
	makeWeeklyAllDayTable(row);
	//초기화
	var table = $("#alldayTable_weekly");
	$("#allDay_weekly").css('height','128px');
	$(".sideDiv_weekly:eq(1)").css('height','128px');
	var headerHeight = $("#title_weekly").height()+128+"px";
	$("#header_weekly").css('height',headerHeight);
	var containerHeight = $("#weekCalendar").height()-$("#title_weekly").height()-128+"px";	// 65 = 날짜
	$("#container_weekly").css('height',containerHeight);
//	var width = $("#alldayTable_weekly").width()+"px";
//	$("#title_weekly").css('width',width);
//	
	var start = new Date(year,month-1,date);
	var endD = new Date(start.getTime()+86400000*6);
	var size = data.length;
	
	var maxcol = table.attr('data-maxcol');
	for(var i=0;i<size;i++){
		var startIndex;
		var endIndex;
		var dataStart = new Date(data[i].startTime[0],data[i].startTime[1]-1,data[i].startTime[2]);
		var dataEnd = new Date(data[i].endTime[0],data[i].endTime[1]-1,data[i].endTime[2]);
		if(dataStart.getTime() < start.getTime()){
			startIndex = 0;
		}else{
			startIndex = dataStart.getDay();	//시작 인덱스는 요일
		}
		if(dataEnd.getTime() > endD.getTime()){
			endIndex = 6;
		}else{
			endIndex = dataEnd.getDay();
		}
		if(!weekly){
			startIndex=0;
			endIndex = 0;
		}
		//console.log(data[i].summary + " , "+startIndex+" , "+endIndex);
		var startCol = $("[data-indexweekly='"+startIndex+"']:eq(0)").attr('data-colweekly');
		var endCol = $("[data-indexweekly='"+endIndex+"']:eq(0)").attr('data-colweekly');
		var col = startCol >= endCol ? startCol:endCol;
		if(startCol == undefined || endCol == undefined){
			col = undefined;
		}
		if(col == undefined){
			maxcol++;
			table.attr('data-maxcol',maxcol);
			var tableTd = "<tr>";
			for(var j=0;j<row;j++){
				tableTd += "<td style='border:1px solid #c3c3c3;' data-indexWeekly="+j+" data-colWeekly="+(maxcol-1)+"></td>";
			}
			tableTd += "</tr>";
			table.append(tableTd);
			col = maxcol-1;
		}
		var td = $("[data-indexweekly="+startIndex+"]"+"[data-colweekly="+col+"]:eq(0)");
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
		var title = "<div class='eventTitleLink'>";
		if(responseStatus == null){
			title += makeEventTitleForm(data[i],"white",false);
		}else{
			title += makeEventTitleForm(data[i],colorCode,false,responseStatus);
		}
		title += "</div>";
		var colspan = endIndex - startIndex+1;
		if(colspan == 1){
			colspan = 0;
		}
		setEventTd(0, 0, title, colorCode, colspan,responseStatus,td);

		var index = startIndex;
		while(index <= endIndex){
			$("[data-indexweekly="+index+"]"+"[data-colweekly="+col+"]:eq(0)").remove();
			index++;
		}
	}//for
	
	//종일 일정 높이 조절
	var height = table.height()+1+"px";
	var containerHeight = $("#weekCalendar").height()-$("#title_weekly").height()-table.height()+1+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
	$("#allDay_weekly").css('height',height);
	$(".sideDiv_weekly:eq(1)").css('height',height);
	$("#container_weekly").css('height',containerHeight);
	var headerHeight = $("#title_weekly").height()+table.height()+"px";
	$("#header_weekly").css('height',headerHeight);

	var eventTitleLinks = document.getElementsByClassName('eventTitleLink');
	
	//일정 드래그 등록
	for(var i=0;i<eventTitleLinks.length;i++){
		dragEvent_date(eventTitleLinks[i],'data-dateIndexWeekly');
	}
}
function showTimeList(){
	var div = $("#container_weekly");
	if(div.children().length == 2){//이미 시간은 만든 상태
		return;
	}
	var text = "<div style='z-index:-1;position:absolute;top:0px; left:0px;width:100%;height:1440px;'>";
	var hourText = "";
	for(var i=0;i<24;i++){
		var hour;
		if(i < 12){
			hour = "오전 "+i+"시";
		}else if(i > 12){
			hour = "오후 "+(i-12)+"시";
		}else{
			hour = "오후 12시";
		}
		text += "<div class='timeEventTimeRowDiv_weekly'></div>";
		hourText += "<div class='timeEventTimeDiv_weekly' style='top:"+(60*i+5)+"px;'>"+hour+"</div>";
	}
	text += "</div>";
	div.append(text);
	$(".sideDiv_weekly:eq(2)").html(hourText);
}
function showCurrentTime_weekly(){
	var path = location.pathname.split('/');
	if(path[1] != "w"){//사용자가 다른 캘린더 누른 경우 멈춤
		return;
	}
	var now = new Date();
	var min = now.getHours()*60+now.getMinutes()+"px";
	var prevIndex = $("#todayLine_weekly").prev().attr('data-timeindex');
	if(prevIndex != undefined && now.getDay() != prevIndex){//다른날로 넘어감
		$("#todayLine_weekly").remove();
		if(now.getDay() == 0){//주가 바뀐 것을 의미. 제거만 하고 더이상 호출 안함
			return;
		}
		var div = $("[data-timeindex='"+now.getDay()+"']").parent();
		var text = "<div id='todayLine_weekly' style='top:"+min+";'></div>";
		div.append(text);
	}
	if($("#todayLine_weekly") != undefined){
		$("#todayLine_weekly").css('top',min);
		setTimeout("showCurrentTime_weekly()",1000*60);
	}
	
}
function showCurrentTime_daily(){
	var path = location.pathname.split('/');
	if(path[1] != "d"){//사용자가 다른 캘린더 누른 경우 멈춤
		return;
	}
	var now = new Date();
	if(parseInt($(".dateP_weekly").text()) != now.getDate()){
		$("#todayLine_weekly").remove();
	}
	if($("#todayLine_weekly") != undefined){
		var min = now.getHours()*60+now.getMinutes()+"px";
		$("#todayLine_weekly").css('top',min);
		setTimeout("showCurrentTime_daily()",1000*60);
	}
}
function showWeeklyEvent(year,month,date,data,weekly){
	var row = weekly == true? 7:1;
	var div = $("#contents_weekly");
	showTimeList();
	var text = "<table class='table_weekly' style='flex:1; -webkit-flex:1;'><tr>";
	var divText;
	for(var i=0;i<row;i++){
		text += "<td class='timeEventDayTd_weekly'><div data-timeindex='"+i+"' class='timeEventDayDiv_weekly'></div>";
		text += "<div id='clickTime_"+i+"' data-clickTimeIndex='"+i+"' class='timeEventDayDiv_weekly' style='z-index:3;'></div></td>";
	}
	text += "</tr></table>";
	div.html(text);
	for(var i=0;i<row;i++){//시간 선택 위한 드래그 등록
		var id = 'clickTime_'+i;
		dragTime(document.getElementById(id));
	}
	var now = new Date();
	var nowDiv = null;
	if(!weekly){//하루
		if(now.getFullYear() == year && now.getMonth() == (month-1) && now.getDate() == date){//오늘
			nowDiv = $("[data-timeindex=0]").parent();
			showCurrentTime_daily();
		}
	}else{
		var nowWeek = new Date(now.getTime()-now.getDay()*86400000);
		nowWeek.setHours(9);
		if(nowWeek.getFullYear() == year && nowWeek.getMonth() == (month-1) && nowWeek.getDate() == date){//오늘과 같은 주
			nowDiv = $("[data-timeindex='"+now.getDay()+"']").parent();
			showCurrentTime_weekly();
		}
	}
	
	if(nowDiv != null){
		var min = now.getHours()*60 + now.getMinutes();
		var text = "<div id='todayLine_weekly' style='top:"+min+"px;'></div>";
		nowDiv.append(text);
	}
	if(data.length == 0){
		return;
	}
	var size = data.length;
	var day;
	day = new Date(data[0].startTime[0],data[0].startTime[1]-1,data[0].startTime[2]).getDay();
	makeWeeklyEventTd(data[0],weekly);
	if(size != 0){
		for(var i=1;i<size;i++){//resize
			if(weekly){
				var date = new Date(data[i].startTime[0],data[i].startTime[1]-1,data[i].startTime[2]);
				if(date.getDay() != day){//요일이 달라지면 전에 저장한 정보들 추가
					arrangeWeeklyEvnetTd(day);
					day = date.getDay();
				}
			}
			makeWeeklyEventTd(data[i],weekly);
		}
		if(!weekly){
			arrangeWeeklyEvnetTd(0);
		}else{
			arrangeWeeklyEvnetTd(day);
		}
	}
	var changeEventTimes = document.getElementsByClassName('changeEventTime');
	//일정 시간 드래그 하는거 등록
	for(var i=0;i<changeEventTimes.length;i++){
		dragResizeTime(changeEventTimes[i]);
	}
	//시간이 있는 일정 드래그 등록
	var eventTitleLink_weeklys = document.getElementsByClassName('eventTitleLink_weekly');
	for(var i=0;i<eventTitleLink_weeklys.length;i++){
		dragTimeEvent(eventTitleLink_weeklys[i],weekly);
	}
}
function makeWeeklyEventTd(data,weekly){
	//setEventTd(index, col, title, colorCode, colspan,responseStatus,eventTd)
	var term = data.endTime[3] - data.startTime[3];	//시간 뺌
	var min = data.endTime[4] - data.startTime[4];	//분 뺌
	term = term*60+min;
	var top = (60*data.startTime[3]+data.startTime[4]);
	if(term < 20){//최소 20px로 맞추기
		term = 20;
	}
	var result = "<div style='height:"+term+"px; position:absolute; top:"+top+"px;left:0px;width:100%;' data-top='"+top+"' data-bottom="+(top+term)+"></div>";
	
	var colorCode;
	var calendarListSize = $("[type='checkbox']").size();
	for(var j=0; j < calendarListSize;j++){
		if($("[type='checkbox']").eq(j).val() == data.calendarID){
			colorCode = $("[type='checkbox']").eq(j).attr('data-colorCode');
			break;
		}
	}
	var responseStatus = null;
	var me = -1;
	if(data.attendees != null){
		for(var y=0; y<data.attendees.length;y++){
			if(data.attendees[y].email == data.calendarID && data.attendees[y].email == $("#userId").text()){
				responseStatus = data.attendees[y].responseStatus;
			}
			if(data.attendees[y].email == $("#userId").text()){
				me = y;
			}
		}
		if(responseStatus == null){
			if(data.calendarID == data.organizer && me != -1){//현재 달력이 마스터 달력이고 참석자에 본인이 있는 경우
				responseStatus = data.attendees[me].responseStatus;
			}
		}
	}
	var title = "<div class='eventTitleLink_weekly'>";
	if(responseStatus == null){
		title += makeEventTitleForm(data,"white",false,null,true);
	}else{
		title += makeEventTitleForm(data,colorCode,false,responseStatus,true);
	}
	title += "</div>";
	title += "<div class='changeEventTime' style='cursor:s-resize; position:absolute; bottom:0; left:0; width:100%;height:4px;'></div>";
	var timeIndex = 0;
	if(weekly){
		var day = new Date(data.startTime[0],data.startTime[1]-1,data.startTime[2]).getDay();
		timeIndex = day;
		$("[data-timeindex='"+day+"']").append(result);
		setEventTd("weekly", 0, title, colorCode, 0,responseStatus,$("[data-timeindex='"+day+"']").children().last());
	}else{
		$("[data-timeindex=0]").append(result);
		setEventTd("weekly", 0, title, colorCode, 0,responseStatus,$("[data-timeindex=0]").children().last());
	}
}
function arrangeWeeklyEvnetTd(timeIndex){
//	width = 100*width/div.offsetParent().width();
	var divs = $("[data-timeindex='"+timeIndex+"']").children();
	var size = divs.length;
	var col = 0;
	var beforeDiv = divs.eq(0);
	var currentIndex = 0;
	beforeDiv.css('left','0%');
	beforeDiv.css('width','100%');
	beforeDiv.attr('data-currentIndex',0);
	
	for(var i=1;i<size;i++){
		var top = parseInt(divs.eq(i).attr('data-top'));
		var bottom = parseInt(divs.eq(i).attr('data-bottom'));
		currentIndex=0;
		var bottoms = $("[data-timeindex='"+timeIndex+"']").children("[data-bottom='"+top+"']");
		var longerIndex = new Array();
		for(var j=0;j<i;j++){
			var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
			var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
			if(dataBottom > top){//현재 들어가는 일정보다 긴 일정이 있는 경우 즉 들어가는 일정에 누가 차지하고 있는 경우
				longerIndex.push(divIndex);
			}
		}
		var beforeIndex = -1;
		for(var x=0;x<=col;x++){
			var lastDiv =  $("[data-timeindex='"+timeIndex+"']").children("[data-currentIndex='"+x+"']").last();
			if(x == 0 && parseInt(lastDiv.attr('data-bottom')) <= top){//맨 처음 자리가 비었다는 것을 의미
				beforeIndex = -1;
				break;
			}
			if((beforeIndex == -1|| (x-beforeIndex == 1)) && parseInt(lastDiv.attr('data-bottom')) > top){//왼쪽 일정 중 제일 오른쪽에 있는 일정 찾기
				beforeIndex = x;
			}
			if((beforeIndex == -1|| (x-beforeIndex == 1)) && parseInt(lastDiv.attr('data-bottom')) == top){//왼쪽 일정 중 자리 빈 곳이 있으면 그 곳에 넣기
				beforeIndex = x-1;
				break;
			}
		}
		if(beforeIndex >= 0){
			currentIndex = beforeIndex+1;
			if(longerIndex.length != 0){
				for(var j=0;j<longerIndex.length;j++){
					if(longerIndex[j] == currentIndex){//현재 일정이 들어가려는 부분에 이미 일정이 있는 경우 다음 칸으로 이동
						currentIndex++;
					}
				}
			}
			divs.eq(i).attr('data-currentIndex',currentIndex);
		}else{
			divs.eq(i).attr('data-currentIndex',0);
		}
		if(col < currentIndex){
			col = currentIndex;
		}
	}
	col++;	//currentIndex는 0부터 시작하니깐
	var width = 100/col;
	beforeDiv = divs.eq(0);
	for(var i=1;i<size;i++){
		var top = parseInt(divs.eq(i).attr('data-top'));
		var bottom = parseInt(divs.eq(i).attr('data-bottom'));
		currentIndex=0;
		
		var longerIndex = new Array();
		var longerIndexDiv = new Array();
		for(var j=0;j<i;j++){
			var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
			var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
			if(dataBottom > top){//현재 들어가는 일정보다 긴 일정이 있는 경우
				longerIndex.push(divIndex);
//				longerIndexDiv.push(divs.eq(j));
			}
		}

		currentIndex = divs.eq(i).attr('data-currentIndex');
		var beforeIndex = currentIndex-1;
		if(currentIndex != 0){
			var lastDiv = $("[data-timeindex='"+timeIndex+"']").children("[data-currentIndex='"+(currentIndex-1)+"']");
			for(var j=0;j<lastDiv.length;j++){
				if(parseInt(lastDiv.eq(j).attr('data-bottom')) > top){//옆에 있다는 것
					beforeDiv = lastDiv.eq(j);
					break;
				}
			}
		}
		if(beforeIndex >= 0){
			if(beforeDiv != null){
				beforeDiv.css('width',width+"%");
			}
			var term=col - currentIndex;
			var sameLongerIndex = -1;
			if(longerIndex.length != 0){
				term = -1;
				for(var j=0;j<longerIndex.length;j++){
					var temp = longerIndex[j]-currentIndex;
					if(temp > 0 && (term == -1 || term > temp)){//더 작은 수가 나오면
						term = temp;
					}
				}
				if(term <= 0){
					term = col-currentIndex;
				}
			}
			divs.eq(i).css('width',term*width+"%");
			divs.eq(i).css('left',(width*currentIndex)+"%");
		}else{
			divs.eq(i).css('left','0%');
			var widthStr="100%";
			if(longerIndex.length != 0){
				term = -1;
				for(var j=0;j<longerIndex.length;j++){
					var temp = longerIndex[j]-currentIndex;
					if(temp > 0 && (term == -1 || term > temp)){//더 작은 수가 나오면
						term = temp;
					}
				}
				if(term > 0){
					widthStr = term*width+"%";
				}
			}
			divs.eq(i).css('width',widthStr);
		}
	}
		
}
function dragTime(elmnt){
	elmnt.onmousedown = dragMouseDown_weekly;
	var start;
	var end;
	function dragMouseDown_weekly(e){
		start = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
		$("#dragTimeDiv_weekly").remove();
		//선택 div 생성
		var div = "<div id='dragTimeDiv_weekly' style='width:100%;position:absolute;z-index:10;top:"+start+"px;background-color:#c3c3c3;'></div>";
		$(elmnt).append(div);
		$(".eventFill_weekly").css('z-index','1');
		document.onselectstart = new Function('return false');
		document.onmouseup = closeDragElement_weekly;
		document.onmousemove = elementDrag_weekly;
	}
	function elementDrag_weekly(e){
		var div = $("#dragTimeDiv_weekly");
//		console.log("pageY : "+e.pageY+" , divTop : "+$("#container_weekly").offset().top + " , scroll : "+ $("#container_weekly").scrollTop());
		end = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
		var startStr, endStr;
		if(start <= end){
			div.css('top',start+"px");
			div.css('bottom','');
			div.css('height',(end-start)+"px");
			var top = parseInt(div.css('top'));
			var height = parseInt(div.css('height'));
			//일의 자리수는 반올림하기 10분 단위로 만들기
			top = Math.round(top*0.1)*10;
			height =  Math.round(height*0.1)*10;
			var startStr = addZero(parseInt(top/60))+":"+addZero(top%60);
			var endStr = addZero(parseInt((top+height)/60))+":"+addZero((top+height)%60);
		}else{
			div.css('top','');
			div.css('height',(start-end)+"px");
			div.css('bottom',(1440-start)+"px");
			var top = parseInt(div.css('top'));
			var bottom = parseInt(start);
			//일의 자리수는 반올림하기 10분 단위로 만들기
			top = Math.round(top*0.1)*10;
			bottom =  Math.round(bottom*0.1)*10;
			var startStr = addZero(parseInt(top/60))+":"+addZero(top%60);
			var endStr = addZero(parseInt(bottom/60))+":"+addZero(bottom%60);
		}
		
		div.html("<p style='font-size:small;'>"+startStr+"~"+endStr+"</p>");
	}
	function closeDragElement_weekly(e){
		console.log("close");
		var div = $("#dragTimeDiv_weekly");
		if(start <= end){
			var term = end-start;
			if(term > 1440-start){
				console.log("over");
				term = 1440-start;
			}
			div.css('height',term+"px");
		}else{
			var term = start-end;
			if(term > start){
				term = start;
			}
			div.css('height',term+"px");
		}
		$(".eventFill_weekly").css('z-index','4');
		document.onmouseup = null;
		document.onmousemove = null;
		document.onselectstart = null;
		//이벤트 추가 페이지 이동
		console.log(parseInt(div.css('top'))+" , "+parseInt(div.css('height')));
		var top = parseInt(div.css('top'));
		var height = parseInt(div.css('height'));
		//일의 자리수는 반올림하기 10분 단위로 만들기
		top = Math.round(top*0.1)*10;
		height =  Math.round(height*0.1)*10;
		var start = addZero(parseInt(top/60))+":"+addZero(top%60)+":00";
		var end = addZero(parseInt((top+height)/60))+":"+addZero((top+height)%60)+":00";
		if(start == end){
			var hour = parseInt(top/60);
			var min = top%60;
			if(hour >= 23){
				if(min < 30){
					min = 30;
				}
			}else{
				hour++;
			}
			end= addZero(hour)+":"+addZero(min)+":00";
		}
		var date = "";
		var path = location.pathname.split('/');
		var dateStr = path[2].split('-');
		var urlDay = new Date(parseInt(dateStr[0]),parseInt(dateStr[1])-1,parseInt(dateStr[2]),9);
		var weekStart = new Date(urlDay.getTime()-urlDay.getDay()*86400000);
		
		var startDate;
		var endDate;
		switch(path[1]){
		case 'w':
			var day = parseInt($("#dragTimeDiv_weekly").parent().attr('data-clicktimeindex'));
			startDate = new Date(weekStart.getTime() + day*86400000);//시작 날짜
			endDate = new Date(weekStart.getTime() + day*86400000);	//끝 날짜
			date = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()+"~";
			date += endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
			break;
		case 'd':
			date = path[2]+"~"+path[2];
			break;
		}
		date += "&"+start+"~"+end;
		$("#addEventDate").attr('value',date);
		goToEventPage("add");
		$("#dragTimeDiv_weekly").remove();
	} 
}
//일정 드래그할때 안에 시간 표시해주는 함수
function showTimeTerm_weekly(div, start){
	var height = parseInt(div.css('height'));
	//일의 자리수는 반올림하기 10분 단위로 만들기
	var top = start;
	top = Math.round(top*0.1)*10;
	height =  Math.round(height*0.1)*10;
	var startStr = addZero(parseInt(top/60))+":"+addZero(top%60);
	var endStr = addZero(parseInt((top+height)/60))+":"+addZero((top+height)%60);
	div.children(":first").children(":first").html("<p style='font-size:small;'>"+startStr+"~"+endStr+"</p>");
}
//시간 일정 끝 시간 부분 resize
function dragResizeTime(elmnt){
	elmnt.onmousedown = dragMouseDown_weeklyTime;
	var end;
	var div;
	var start;
	var parent;
	function dragMouseDown_weeklyTime(e){
		console.log("twice?");
		//선택 div 생성
		parent = $(elmnt).parent();
		div = parent.clone();
		$(div).appendTo(parent.parent());
		div = $(div);
		$(".eventFill_weekly").css('z-index','1');
		div.css('z-index','4');
		div.css('width','100%');
		div.css('left','0%');
		parent.css('opacity','0.5');
		start = parseInt(div.css('top'));
		showTimeTerm_weekly(div,start);
		document.onselectstart = new Function('return false');
		document.onmouseup = closeDragElement_weeklyTime;
		document.onmousemove = elementDrag_weeklyTime;
	}
	function elementDrag_weeklyTime(e){
//		console.log("pageY : "+e.pageY+" , divTop : "+$("#container_weekly").offset().top + " , scroll : "+ $("#container_weekly").scrollTop());
		end = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
		div.css('height',(end-start)+"px");
		showTimeTerm_weekly(div,start);
	}
	function closeDragElement_weeklyTime(e){
		console.log("close");
		var inputJSON = JSON.parse($(div).children(':eq(0)').children().last().attr('data-information'));	
		var originStart = new Date(inputJSON.start);
		var originEnd = new Date(inputJSON.end);
		
		var top = parseInt(div.css('top'));
		var height = parseInt(div.css('height'));
		//일의 자리수는 반올림하기 10분 단위로 만들기
		top = Math.round(top*0.1)*10;
		height =  Math.round(height*0.1)*10;
		var hour = parseInt((top+height)/60);
		var min = parseInt((top+height)%60);
		var clickDate = new Date(inputJSON.end);
		clickDate.setHours(hour);
		clickDate.setMinutes(min);
		
		var update = true;
		if(clickDate.getTime() >= originEnd.getTime()-60000*10 && clickDate.getTime() <= originEnd.getTime()+60000*10){//+- 10분정도
			update = false;
		}
		if(clickDate.getTime() <= originStart.getTime()){//사용자가 resize한 값이 현재 top보다 위인 경우
			update = false;
		}
		var accessRole = $("input:checkbox[value='"+inputJSON.calendarID+"']").attr('data-accessrole');
		if(accessRole == 'reader' || accessRole == 'freeBusyReader'){//이 권한은 수정할 수 없음
			alert('이 일정은 수정이 불가능합니다');
			update= false;
		}
		
		var recurrence = false;
		if(inputJSON.recurrence != null){
			recurrence = true;
		}
		if(update){
			var data = {
					"calendarId" : inputJSON.calendarID,
					"eventId" : inputJSON.eventID,
					"startDate" : originStart.getTime(),
					"endDate" : clickDate.getTime(),
					"isAllDay" : false,
					"recurrence" : recurrence,	
					"originalStartTime" : inputJSON.start
				};
			var baseUrl = "http://"+location.href.split('/')[2];
				$.ajax({
					url: baseUrl+"/updateEventDate",
					type:'POST',
					data: JSON.stringify(data),
					contentType: "application/json; charset=UTF-8",
					success:function(result){
						if(result == "true"){
							alert('수정이 완료되었습니다');
							requestData();
						}else{
							alert(result);
						}
					},
				});
		}
		
		//초기화
		$(".eventFill_weekly").css('z-index','4');
		parent.css('opacity','');
		div.remove();
		document.onmouseup = null;
		document.onmousemove = null;
		document.onselectstart = null;
		//div.remove();
	} 
}
//시간 일정 드래그
function dragTimeEvent(elmnt,weekly){
	elmnt.onmousedown = dragMouseDown_weeklyTimeEvent;
	var start, end, term;
	var div;
	var drag = false;
	var click = false;
	var width, index;
	var startPosX,startPosY, endPosX, endPosY;
	function dragMouseDown_weeklyTimeEvent(e){
		//선택 div 생성
		drag = false;
		click = false;
		startPosX = e.pageX;
		startPosY = e.pageY;
		div = $(elmnt).parent().clone();
		$(div).appendTo($("#contents_weekly"));
		div = $(div);
		var clickStart = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
		term = parseInt(div.css('top'))-clickStart;
		
		$(".eventFill_weekly").css('z-index','1');
		$(elmnt).parent().css('opacity','0.5');
		
		start = parseInt(div.css('top'));
		var parent = $(elmnt).parent().parent();
		width = parseFloat(parent.css('width'));
		index = parseInt(parent.attr('data-timeindex'));
		
		div.css('z-index','4');
		div.css('width',width+"px");
		div.css('left',index*width+2+"px");
		div.css('display','none');
		showTimeTerm_weekly(div, start);
		document.onselectstart = new Function('return false');
		document.onmouseup = closeDragElement_weeklyTimeEvent;
		document.onmousemove = elementDrag_weeklyTimeEvent;
	}
	function elementDrag_weeklyTimeEvent(e){
		drag = true;
		endPosX = e.pageX;
		endPosY = e.pageY;
//		console.log("pageY : "+e.pageY+" , divTop : "+$("#container_weekly").offset().top + " , scroll : "+ $("#container_weekly").scrollTop());
		if(!click){
			if(div.css('display') == 'none'){
				div.css('display','block');
			}
			end = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
			end = Math.round(end*0.1)*10;
			var top = end + term;
			div.css('top',top+"px");
			showTimeTerm_weekly(div, top);
			if(weekly){
				var left =  e.pageX - $("#contents_weekly").offset().left;
				var startLeft = index*width;
				var endLeft = startLeft + width;
				if(left < startLeft || left > endLeft){
					index = parseInt(left/width);
					if(index < 0){
						index = 0;
					}
					if(index > 6){
						index = 6;
					}
					div.css('left',index*width+3+"px");
				}
			}
		}
		//div.html("<p style='font-size:small;'>"+startStr+"~"+endStr+"</p>");
	}
	function closeDragElement_weeklyTimeEvent(e){
		console.log("close");
		var updateEvent = true;
		if(Math.abs(startPosY-endPosY) < 9 && Math.abs(startPosX-endPosX) < 9){//이동한 거리가 너무 작으면
			console.log("dfdf");
			drag = false;
		}
		if(!drag){
			click = true;
			updateEvent = false;
			clickEvent(elmnt);
		}
		if(updateEvent){
			var inputJSON = JSON.parse($(div).children(':eq(0)').children().last().attr('data-information'));	
			
			var originStart = new Date(inputJSON.start);
			var originEnd = new Date(inputJSON.end);
			
			var top = parseInt(div.css('top'));
			var height = parseInt(div.css('height'));
			//일의 자리수는 반올림하기 10분 단위로 만들기
			top = Math.round(top*0.1)*10;
			var hour = parseInt((top+height)/60);
			var min = parseInt((top+height)%60);
			
			var clickDate = null;
			var clickDateEnd = null;
			var path = location.pathname.split('/');
			if(path[1] == 'd'){
				var dateStr = path[2].split('-');
				clickDate = new Date(parseInt(dateStr[0]),parseInt(dateStr[1])-1,parseInt(dateStr[2]));	//사용자가 클릭한 날짜 추출
				clickDateEnd = new Date(clickDate.getTime());
			}else{
				var startDate = new Date(inputJSON.start - 86400000*new Date(inputJSON.start).getDay());
				clickDate = new Date(startDate.getTime() + 86400000*index);
				clickDateEnd = new Date(startDate.getTime() + 86400000*index);
			}
			clickDate.setHours(parseInt(top/60));
			clickDate.setMinutes(parseInt(top%60));
			clickDateEnd.setHours(hour);
			clickDateEnd.setMinutes(min);
			
			var update = true;
			if(clickDateEnd.getTime() >= originEnd.getTime()-60000*10 && clickDateEnd.getTime() <= originEnd.getTime()+60000*10){//+- 10분정도
				update = false;
			}
			var recurrence = false;
			if(inputJSON.recurrence != null){
				recurrence = true;
			}
			var accessRole = $("input:checkbox[value='"+inputJSON.calendarID+"']").attr('data-accessrole');
			console.log(accessRole);
			if(drag && (accessRole == 'reader' || accessRole == 'freeBusyReader')){//이 권한은 수정할 수 없음
				alert('이 일정은 수정이 불가능합니다');
				update= false;
			}
			if(update){
				var data = {
						"calendarId" : inputJSON.calendarID,
						"eventId" : inputJSON.eventID,
						"startDate" : clickDate.getTime(),
						"endDate" : clickDateEnd.getTime(),
						"isAllDay" : false,
						"recurrence" : recurrence,	
						"originalStartTime" : inputJSON.start
					};
				var baseUrl = "http://"+location.href.split('/')[2];
					$.ajax({
						url: baseUrl+"/updateEventDate",
						type:'POST',
						data: JSON.stringify(data),
						contentType: "application/json; charset=UTF-8",
						success:function(result){
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
		$(".eventFill_weekly").css('z-index','4');
		$(elmnt).parent().css('opacity','');
		div.remove();
		document.onmouseup = null;
		document.onmousemove = null;
		document.onselectstart = null;
		//div.remove();
	} 
}
//시간 부분 누른 경우
function clickTime_weekly(clickDiv,event){
	var div = $(clickDiv);
	var index = div.attr('data-clicktimeindex');
	if(index == undefined){
		return;
	}
	console.log(event.layerX + " , "+event.layerY);
}
//종일 이벤트 더보기 누른 경우
function clickMoreAllDay_weekly(btn){
	if($(btn).text()=="∧"){//숨기기
		$("#allDay_weekly").css('height','128px');
		$(".sideDiv_weekly:eq(1)").css('height','128px');
		var containerHeight = $("#weekCalendar").height()-$("#title_weekly").height()-128+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
		$("#container_weekly").css('height',containerHeight);
		var headerHeight = $("#title_weekly").height()+128+"px";
		$("#header_weekly").css('height',headerHeight);
		$(btn).text("∨");
	}else{//더보기
		var table = $("#alldayTable_weekly");
		var height = table.height()+1+"px";
		var containerHeight = $("#weekCalendar").height()-$("#title_weekly").height()-table.height()+1+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
		$("#allDay_weekly").css('height',height);
		$(".sideDiv_weekly:eq(1)").css('height',height);
		$("#container_weekly").css('height',containerHeight);
		var headerHeight = $("#title_weekly").height()+table.height()+"px";
		$("#header_weekly").css('height',headerHeight);
		$(btn).text("∧");
	}
}