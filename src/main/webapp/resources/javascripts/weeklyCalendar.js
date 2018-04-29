
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
			endIndex = 0;
		}
		//console.log(data[i].summary + " , "+startIndex+" , "+endIndex);
		var startCol = $("[data-indexweekly='"+startIndex+"']:eq(0)").attr('data-colweekly');
		var endCol = $("[data-indexweekly='"+endIndex+"']:eq(0)").attr('data-colweekly');
		var col = startCol >= endCol ? startCol:endCol;
		if(col == undefined){
			maxcol++;
			table.attr('data-colmax',maxcol);
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
	var size = data.length;
	if(size != 0){
		for(var i=0;i<size;i++){
//			var date = new Date(data[i].startTime[0],data[i].startTime[1]-1,data[i].startTime[2]);
//			if(date.getDay() != day){//요일이 달라지면 전에 저장한 정보들 추가
//				if(weekly){
//					$("[data-timeindex='"+day+"']").html(text);
//				}else{//일 뷰이면 하루만 있으므로
//					$("[data-timeindex=0]").html(text);
//				}
//				day = date.getDay();
//				text = "";
//			}
//			text = makeWeeklyEventTd(data[i]);
			 makeWeeklyEventTd(data[i],weekly);
		}
	}
}
function makeWeeklyEventTd(data,weekly){
	//setEventTd(index, col, title, colorCode, colspan,responseStatus,eventTd)
	var term = data.endTime[3] - data.startTime[3];	//시간 뺌
	var min = data.endTime[4] - data.startTime[4];	//분 뺌
	term = (term*60+min)+"px";
	var top = (60*data.startTime[3]+data.startTime[4]);
	var result = "<div style='height:"+term+";position:absolute; top:"+top+"px;left:0px;width:100%;' data-top="+top+"></div>";
	
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
	if(weekly){
		var day = new Date(data.startTime[0],data.startTime[1]-1,data.startTime[2]).getDay();
		console.log(data.summary+" , "+day);
		$("[data-timeindex='"+day+"']").append(result);
		setEventTd("weekly", 0, title, colorCode, 0,responseStatus,$("[data-timeindex='"+day+"']").children().last());
	}else{
		$("[data-timeindex=0]").append(result);
		setEventTd("weekly", 0, title, colorCode, 0,responseStatus,$("[data-timeindex=0]").children().last());
	}
	var divs = $("[data-top='"+top+"']");	//같은 높이의 div 모으기
	var size = divs.length;
	var width = 100/size;
	divs.css('width',width+"%");
	for(var i=0;i<size;i++){
		divs.eq(i).css('left',width*i+"%");
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