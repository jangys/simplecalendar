
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
	var clickTable = "<table id='clickAlldayTable_weekly class='table_weekly' style='z-index:3; border:none;height:100%; width:100%;position:absolute;'>";
	var div = $("#title_weekly");
	var dayList = ["일","월","화","수","목","금","토"];
	var start = new Date(year,month-1,date,9);
	for(var i=0;i<col;i++){
		var d = new Date(start.getTime()+86400000*i);
		text += "<td style='border:1px solid #c3c3c3; padding-left:10px;'><p class='dateP_weekly'>"+d.getDate()+"</p>";
		text +="<p class='dayP_weekly'>"+ dayList[d.getDay()]+"</p></td>";
		clickTable += "<td data-dateIndexWeekly='"+i+"'onclick='mouseUpDate_weekly(this,false)' onmousedown='startDrag(this)'" 
		clickTable += "ondragstart='dragstart_handler(this,event);'ondragenter='mouseDownDate(this,event,true)' ondragend='mouseUpDate_weekly(this,true)' ondragover='allowDrop(event)'></td>";
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
		clickTable += "<td data-dateIndexWeekly='"+j+"'onclick='mouseUpDate_weekly(this,false)' onmousedown='startDrag(this)'" 
		clickTable += "ondragstart='dragstart_handler(this,event);'ondragenter='mouseDownDate(this,event,true)' ondragend='mouseUpDate_weekly(this,true)' ondragover='allowDrop(event)'></td>";
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
}
function mouseUpDate_weekly(td,drag){
	var date = "";
	var path = location.pathname.split('/');
	var dateStr = path[2].split('-');
	var urlDay = new Date(parseInt(dateStr[0]),parseInt(dateStr[1])-1,parseInt(dateStr[2]),9);
	var weekStart = new Date(urlDay.getTime()-urlDay.getDay()*86400000);
	
	if(drag == false){
		$(td).addClass('clickDate');
	}
	
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
	$(".moreEvent").css('z-index','2');
	
	//document.getElementById("addForm").submit();
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
		var title = "<div class='eventTitleLink' onclick='clickEvent(this);'>";
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
	if(maxcol > 5){
		var height = table.height()+1+"px";
		var containerHeight = $("#weekCalendar").height()-$("#title_weekly").height()-table.height()+1+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
		$("#allDay_weekly").css('height',height);
		$(".sideDiv_weekly:eq(1)").css('height',height);
		$("#container_weekly").css('height',containerHeight);
		var headerHeight = $("#title_weekly").height()+table.height()+"px";
		$("#header_weekly").css('height',headerHeight);
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
		text += "<div style='position:relative;height:60px;width:100%;border-bottom:1px solid #c3c3c3;z-index:-1;'></div>";
		hourText += "<div style='position:absolute; top:"+(60*i+5)+"px; right:5px; font-size:11px;text-align:right;width:100%'>"+hour+"</div>";
	}
	text += "</div>";
	div.append(text);
	$(".sideDiv_weekly:eq(2)").html(hourText);
}
function showCurrentTime_weekly(){
	var path = location.pathname.split('/');
	if(path[1] != "w"){
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
		var text = "<div id='todayLine_weekly' style='aria-hidden=true; border-top:2px solid #db4437;z-index:12; position:absolute; width:100%; height:3px;top:"+min+";'></div>";
		div.append(text);
	}
	if($("#todayLine_weekly") != undefined){
		$("#todayLine_weekly").css('top',min);
		setTimeout("showCurrentTime_weekly()",1000*60);
	}
	
}
function showCurrentTime_daily(){
	var path = location.pathname.split('/');
	if(path[1] != "d"){
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
		text += "<td style='border:1px solid #c3c3c3;position:relative;'><div data-timeindex='"+i+"' style='width:100%;height:100%;position:absolute;top:0px;'></div>";
		text += "<div id='clickTime_"+i+"' data-clickTimeIndex='"+i+"' style='width:100%;height:100%;position:absolute;z-index:3;top:0px;'></div></td>";
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
		var text = "<div id='todayLine_weekly' style='aria-hidden=true; border-top:2px solid #db4437;z-index:12; position:absolute; width:100%; height:3px;top:"+min+"px;'></div>";
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
		for(var i=1;i<size;i++){
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
	var title = "<div class='eventTitleLink_weekly' onclick='clickEvent(this);'>";
	if(responseStatus == null){
		title += makeEventTitleForm(data,"white",false);
	}else{
		title += makeEventTitleForm(data,colorCode,false,responseStatus);
	}
	title += "</div>";
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
	var maxBottomTop = divs.eq(0).attr('data-top');
	var maxBottom=divs.eq(0).attr('data-bottom');
	var newBottom = divs.last().attr('data-bottom');
	var newTop = divs.last().attr('data-top');
	
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
		var place = false;
		var bottoms = $("[data-bottom='"+top+"']");
		var longerIndex = new Array();
		for(var j=0;j<i;j++){
			var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
			var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
			if(dataBottom > top){//현재 들어가는 일정보다 긴 일정이 있는 경우
				longerIndex.push(divIndex);
			}
		}
		if(bottoms.length >= 1){//자리가 있는지 확인
			var tops = $("[data-top='"+top+"']");
			var remain = 0;
			var lastIndex = -1;
			for(var x=0;x<tops.length;x++){
				if(tops.eq(x).attr('data-currentIndex') == undefined){
					remain++;
				}else{
					lastIndex = parseInt(tops.eq(x).attr('data-currentIndex'));
				}
			}
			if(bottoms.length > tops.length-remain){//이미 내 자신은 추가 되어 있으니깐 같은 경우에도 넣을 수 있음
				if(bottoms.length == 1){
					index = bottoms.attr('data-currentIndex');
				}else{
					index = bottoms.eq(0).attr('data-currentIndex');
					if(lastIndex != -1){
						index = lastIndex+1;
					}
				}
				var start = -1;
				var end = -1;
				if(longerIndex.length > 0){
					for(var x=0;x<longerIndex.length;x++){
						if(longerIndex[x] == index){
							if(start == -1){
								start = index;
							}
							index++;
							end = index;
						}
					}
				}
				if(start != -1){
					divs.eq(i).attr('data-term',end-start);
				}
				divs.eq(i).attr('data-currentIndex',index);
				place = true;
			}
		}
		
		if(!place){//자리가 없으면
			var beforeIndex = -1;
			for(var j=0;j<i;j++){
				var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
				var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
				if(beforeIndex == -1 || (divIndex-beforeIndex) == 1 || divs.eq(j).attr('data-term') != undefined){//바로 왼쪽에 일정이 있는 경우
					if(dataBottom > top){//옆에 있음
						currentIndex = divIndex+1;
						beforeIndex = divIndex;
					}
				}
			}
			var start = -1;
			var last = -1;
			if(currentIndex > 0){
				if(longerIndex.length != 0){
					for(var j=0;j<longerIndex.length;j++){
						if(longerIndex[j] == currentIndex){//현재 일정이 들어가려는 부분에 이미 일정이 있는 경우 다음 칸으로 이동
							if(start == -1){
								start = currentIndex;
							}
							currentIndex++;
							last = currentIndex;
						}
					}
				}
				if(start != -1){
					divs.eq(i).attr('data-term',last-start);
				}
				divs.eq(i).attr('data-currentIndex',currentIndex);
			}else{
				divs.eq(i).attr('data-currentIndex',0);
			}
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
				longerIndexDiv.push(divs.eq(j));
			}
		}
		var place = false;
		var bottoms = $("[data-bottom='"+top+"']");
		if(bottoms.length >= 1){
			var tops = $("[data-top='"+top+"']");
			var remain = 0;
			var lastIndex = -1;
			var lastDiv= null;
			for(var x=0;x<tops.length;x++){
				if(tops.eq(x).css('left') == "0px"){
					remain++;
				}else{
					lastIndex = parseInt(tops.eq(x).attr('data-currentIndex'));
					lastDiv=tops.eq(x);
				}
			}
			if(bottoms.length > tops.length-remain){//이미 내 자신은 추가 되어 있으니깐 같은 경우에도 넣을 수 있음
				place = true;
				var index;
				if(bottoms.length == 1){
					index = bottoms.attr('data-currentIndex');
				}else{
					index = bottoms.eq(0).attr('data-currentIndex');
					if(lastIndex != -1){
						lastDiv.css('width',width+"%");
						index = lastIndex+1;
					}
				}
				if(longerIndex.length > 0){
					for(var x=0;x<longerIndex.length;x++){
						if(longerIndex[x] == index){
							index++;
							longerIndexDiv[x].css('width',width+"%");
						}
					}
				}
				if(index != divs.eq(i).attr('data-currentIndex')){
					console.log("index error : "+index + " , "+ divs.eq(i).attr('data-currentIndex'));
					index = divs.eq(i).attr('data-currentIndex');
				}
				
				var calRemain = bottoms.length-(tops.length-remain);
				if(calRemain == 1){
					//width = 100*width/div.offsetParent().width();
					var parentWidth= 100*bottoms.last().width()/bottoms.last().offsetParent().width();
					divs.eq(i).css('width',parentWidth+"%");
				}else{
					divs.eq(i).css('width',width*calRemain+"%");
				}
				divs.eq(i).css('left',width*index+"%");
			}
		}

		if(!place){//자리가 없으면
			var beforeIndex = -1;
			for(var j=0;j<i;j++){
				var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
				var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
				var term = divs.eq(j).attr('data-term');
				if(beforeIndex == -1 || (divIndex-beforeIndex) == 1 || term != undefined){//바로 옆에 있는 경우, term이 있는 경우는 일정 건너 뛴 경우 이 값이 있다는건 무조건 왼쪽에 뭐가 있다는 것
					if(dataBottom > top){//옆에 있음 오른쪽으로 갈수록 무조건 내려가기 때문에 왼쪽에는 내 시작지점보다 긴 일정을 가지고 있어야함.
						beforeDiv = divs.eq(j);
						currentIndex = parseInt(beforeDiv.attr('data-currentIndex'))+1;
						beforeIndex = divIndex;
					}
				}
			}
			if(currentIndex > 0){
				beforeDiv.css('width',width+"%");
				var term=col - currentIndex;
				var sameLongerIndex = -1;
				if(longerIndex.length != 0){
					term = 0;
					for(var j=0;j<longerIndex.length;j++){
						var temp = longerIndex[j]-currentIndex;
						if(longerIndex[j] == currentIndex){
							currentIndex++;
							longerIndexDiv[j].css('width',width+"%");
						}
						if(temp > 0 && term > temp){//더 작은 수가 나오면
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
					term = 0;
					for(var j=0;j<longerIndex.length;j++){
						var temp = longerIndex[j]-currentIndex;
						if(temp > 0 && term > temp){//더 작은 수가 나오면
							term = temp;
						}
					}
					if(temp > 0){
						widthStr = temp*width+"%";
					}
				}
				divs.eq(i).css('width',widthStr);
			}
		}
		
	}
}
function dragTime(elmnt){
	elmnt.onmousedown = dragMouseDown;
	var start;
	var end;
	function dragMouseDown(e){
		start = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
		$("#dragTimeDiv_weekly").remove();
		//선택 div 생성
		var div = "<div id='dragTimeDiv_weekly' style='width:100%;position:absolute;z-index:10;top:"+start+"px;background-color:#c3c3c3;'></div>";
		$(elmnt).append(div);
		$(".eventFill_weekly").css('z-index','1');
		document.onselectstart = new Function('return false');
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}
	function elementDrag(e){
		var div = $("#dragTimeDiv_weekly");
//		console.log("pageY : "+e.pageY+" , divTop : "+$("#container_weekly").offset().top + " , scroll : "+ $("#container_weekly").scrollTop());
		end = e.pageY - $("#container_weekly").offset().top +  $("#container_weekly").scrollTop();
		if(start <= end){
			div.css('top',start+"px");
			div.css('bottom','');
			div.css('height',(end-start)+"px");
		}else{
			div.css('top','');
			div.css('height',(start-end)+"px");
			div.css('bottom',(1440-start)+"px");
		}
		var top = parseInt(div.css('top'));
		var height = parseInt(div.css('height'));
		//일의 자리수는 반올림하기 10분 단위로 만들기
		top = Math.round(top*0.1)*10;
		height =  Math.round(height*0.1)*10;
		var startStr = addZero(parseInt(top/60))+":"+addZero(top%60);
		var endStr = addZero(parseInt((top+height)/60))+":"+addZero((top+height)%60);
		div.html("<p style='font-size:small;'>"+startStr+"~"+endStr+"</p>");
	}
	function closeDragElement(e){
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
		console.log(start + " , "+end);
		
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