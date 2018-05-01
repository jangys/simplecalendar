
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
	var text = "<table class='table_weekly' style='height:99%;'><tr>";
	var div = $("#title_weekly");
	var dayList = ["일","월","화","수","목","금","토"];
	var start = new Date(year,month-1,date,9);
	for(var i=0;i<col;i++){
		var d = new Date(start.getTime()+86400000*i);
		text += "<td style='border:1px solid #c3c3c3; padding-left:10px;'><p class='dateP_weekly'>"+d.getDate()+"</p>";
		text +="<p class='dayP_weekly'>"+ dayList[d.getDay()]+"</p></td>";
	}
	text += "</tr></table>";
	div.html(text);
}
function makeWeeklyAllDayTable(row){
	var div = $("#allDay_weekly");
	var col = 5;	//줄
	var table="<table id='alldayTable_weekly' class='table_weekly' cellpadding='0' cellspacing='0' data-maxcol="+col+">";
	table += "<tr style='display:hidden; height:0;'>";
	for(var j=0;j<row;j++){
		table += "<td></td>";
	}
	table += "</tr>";
	for(var i=0;i<col;i++){
		table += "<tr>";
		for(var j=0;j<row;j++){
			table += "<td style='border:1px solid #c3c3c3; width:14.2%;' data-indexWeekly="+j+" data-colWeekly="+i+"></td>";
		}
		table += "</tr>";
	}
	table += "</table>";
	div.html(table);
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
		if(data[i].summary == "4/3~4/5_22"){
			console.log(td);
		}
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
function showWeeklyEvent(year,month,date,data,weekly){
	var row = weekly == true? 7:1;
	var div = $("#contents_weekly");
	showTimeList();
	var text = "<table class='table_weekly' style='flex:1; -webkit-flex:1;'><tr>";
	for(var i=0;i<row;i++){
		text+="<td style='border:1px solid #c3c3c3;'><div data-timeindex='"+i+"' style='width:100%;height:100%;position:relative;'></div></td>";
	}
	text += "</tr></table>";
	div.html(text);
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
		console.log(data.summary+" , "+day);
		timeIndex = day;
		$("[data-timeindex='"+day+"']").append(result);
		setEventTd("weekly", 0, title, colorCode, 0,responseStatus,$("[data-timeindex='"+day+"']").children().last());
	}else{
		$("[data-timeindex=0]").append(result);
		setEventTd("weekly", 0, title, colorCode, 0,responseStatus,$("[data-timeindex=0]").children().last());
	}
}
function arrangeWeeklyEvnetTd(timeIndex){
//	var divs = $("[data-top='"+top+"']");	//같은 높이의 div 모으기
//	var size = divs.length;
//	var width = 100/size;
//	divs.css('width',width+"%");
//	for(var i=0;i<size;i++){
//		divs.eq(i).css('left',width*i+"%");
//	}
//	width = 100*width/div.offsetParent().width();
	var divs = $("[data-timeindex='"+timeIndex+"']").children();
	var size = divs.length;
	var maxBottomTop = divs.eq(0).attr('data-top');
	var maxBottom=divs.eq(0).attr('data-bottom');
	var newBottom = divs.last().attr('data-bottom');
	var newTop = divs.last().attr('data-top');
//	for(var i=0;i<size-1;i++){//마지막은 지금 새로 집어넣은 일정이라 보지 않아도 됨.
//		var bottom = divs.eq(i).attr('data-bottom');
//		var top = divs.eq(i).attr('data-top');
//		if(bottom > maxBottom){
//			maxBottom = bottom;
//			maxBottomTop = top;
//		}
//	}
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
		if(bottoms.length >= 1){//자리가 있는지 확인
			place = true;
		}
		var longerIndex = new Array();
		var nextIndex = -1;
		if(!place){//자리가 없으면
			var beforeIndex = -1;
			for(var j=0;j<i;j++){
				var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
				var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
				if(beforeIndex == -1 || (divIndex-beforeIndex) == 1){//바로 옆에 있는 경우
					if(dataBottom > top){//옆에 있음
						currentIndex = divIndex+1;
						beforeIndex = divIndex;
					}
					if(dataBottom > bottom){//현재 들어가는 일정보다 긴 일정이 있는 경우
						longerIndex.push(divIndex);
					}
				}
			}
			if(currentIndex > 0){
				var term;
				if(longerIndex.length != 0){
					term = 0;
					for(var j=0;j<longerIndex.length;j++){
						var temp = longerIndex[j]-currentIndex;
						if(temp > 0 && term > temp){//더 작은 수가 나오면
							term = temp;
							nextIndex = longerIndex[j];
						}
					}
					if(term <= 0){
						nextIndex = -1;
					}
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
		var place = false;
		var bottoms = $("[data-bottom='"+top+"']");
		if(bottoms.length >= 1){
			place = true;
			var index;
			if(bottoms.length == 1){
				index = bottoms.attr('data-currentIndex');
			}else{
				index = bottoms.eq(0).attr('data-currentIndex');
			}
			divs.eq(i).attr('data-currentIndex',index);
			divs.eq(i).css('width',(width*bottoms.length)+"%");
			divs.eq(i).css('left',width*index+"%");
		}
		if(!place){//자리가 없으면
			var longerIndex = new Array();
			var beforeIndex = -1;
			for(var j=0;j<i;j++){
				var dataBottom = parseInt(divs.eq(j).attr('data-bottom'));
				var divIndex = parseInt(divs.eq(j).attr('data-currentIndex'));
				
				if(beforeIndex == -1 || (divIndex-beforeIndex) == 1){//바로 옆에 있는 경우
					if(dataBottom > top){//옆에 있음
						beforeDiv = divs.eq(j);
						currentIndex = parseInt(beforeDiv.attr('data-currentIndex'))+1;
						beforeIndex = divIndex;
					}
				}
				if(dataBottom > bottom){//현재 들어가는 일정보다 긴 일정이 있는 경우
					console.log(beforeDiv.css('left'));
					longerIndex.push(parseInt(beforeDiv.attr('data-currentIndex')));
				}
			}
			if(currentIndex > 0){
				beforeDiv.css('width',width+"%");
				divs.eq(i).css('left',(width*currentIndex)+"%");
				divs.eq(i).attr('data-currentIndex',currentIndex);
				var term=col - currentIndex;
				if(longerIndex.length != 0){
					term = 0;
					for(var j=0;j<longerIndex.length;j++){
						var temp = longerIndex[j]-currentIndex;
						if(temp > 0 && term > temp){//더 작은 수가 나오면
							term = temp;
						}
					}
					if(term <= 0){
						term = col-currentIndex;
					}
				}
				divs.eq(i).css('width',term*width+"%");
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
				divs.eq(i).attr('data-currentIndex',0);
			}
		}
		
//		var beforeTop = beforeDiv.attr('data-top');
//		var beforeBottom = beforeDiv.attr('data-bottom');
//		console.log(beforeBottom+" , "+top);
//		if(beforeBottom > top){//옆에 있음
//			beforeDiv.css('width',width+"%");
//			beforeDiv.css('left',(width*beforeIndex)+"%");
//			console.log(beforeIndex);
//			beforeIndex++;
//		}else{//아래에 있음
//			beforeDiv.css('width',width*(col-beforeIndex)+"%");
//			beforeDiv.css('left',width*beforeIndex+"%");
//			beforeIndex=0;
//		}
	}
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