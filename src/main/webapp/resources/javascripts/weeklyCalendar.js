
function drawWeeklyCalendar(year,month,date,data,weekly){
	console.log(data);
	$(".sideDiv_weekly").css('display','inline-block');
	$("#moreAllDay_weekly").text("∧");
	showWeeklyTitle(year,month,date,weekly);
	var allDayEvent = new Array();
	var timeEvent = new Array();
	var size = data.length;
	month = parseInt(month);
	date = parseInt(date);
	console.log(year+"-"+month+"-"+date);
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
	var text = "<table class='table_weekly'><tr>";
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
	console.log(data);
	makeWeeklyAllDayTable(row);
	//초기화
	var table = $("#alldayTable_weekly");
	var containerHeight = 970-65-129+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
	$("#allDay_weekly").css('height','129px');
	$(".sideDiv_weekly:eq(1)").css('height','129px');
	$("#container_weekly").css('height',containerHeight);
	var width = $("#alldayTable_weekly").width()+"px";
	$("#title_weekly").css('width',width);
	
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
		console.log(data[i].summary + " , "+startIndex+" , "+endIndex);
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
		var height = table.height()+"px";
		var containerHeight = 970-65-table.height()+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
		$("#allDay_weekly").css('height',height);
		$(".sideDiv_weekly:eq(1)").css('height',height);
		$("#container_weekly").css('height',containerHeight);
	}
}

function showWeeklyEvent(year,month,date,data,weekly){
	var row = weekly == true? 7:1;
	var div = $("#container_weekly");
	var text = "<table class='table_weekly'><tr>";
	for(var i=0;i<row;i++){
		
	}
	text += "</tr></table>";
}

//종일 이벤트 더보기 누른 경우
function clickMoreAllDay_weekly(btn){
	if($(btn).text()=="∧"){//숨기기
		var containerHeight = 970-65-129+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
		$("#allDay_weekly").css('height','129px');
		$(".sideDiv_weekly:eq(1)").css('height','129px');
		$("#container_weekly").css('height',containerHeight);
		$(btn).text("∨");
	}else{//더보기
		var table = $("#alldayTable_weekly");
		var height = table.height()+"px";
		var containerHeight = 970-65-table.height()+"px";	//970 = 전체 크기,ㅣ 65 = 날짜
		$("#allDay_weekly").css('height',height);
		$(".sideDiv_weekly:eq(1)").css('height',height);
		$("#container_weekly").css('height',containerHeight);
		$(btn).text("∧");
	}
}