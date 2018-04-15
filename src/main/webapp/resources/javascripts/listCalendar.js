
function printList(year,month,data){
	var size = data.length;
	var date = 0;
	var colorCode; 
	var startDate = new Date(year,month-1,1);
	var startDay = startDate.getDay();
	var lastDate = 31;
	var dayList = ["일","월","화","수","목","금","토"];
	console.log(size);
	if(size == 0){
		var text="<p style='text-align:center; padding-top:5%;'>일정 없음</p>";
		$("#listCalendar").html(text);
		return;
	}
	//마지막 날짜 계산
	if((month%2 == 0 && month<= 6) || (month%2 == 1 && month>=9)){
		lastDate = 30;
	}
	if(month==2 && year%4 == 0 && year%100 != 0 || year%400 == 0){
		lastDate = 29;
	}else if(month == 2){
		lastDate = 28;
	}
	var divText = "";
	var day = startDay;
	for(var i=1;i<=lastDate;i++){
		divText +="<div class='listRowGroup' style='display:none' data-listdate='"+i+"' data-listday="+day+"></div>";
		day = day+1 == 7 ? 0:day+1;
	}
	$("#listCalendar").html(divText);
	for(var i=0; i<size; i++){
		var start=data[i].startTime[2];
		var end=data[i].endTime[2];
		if(data[i].startTime[1] != month || data[i].startTime[0] != year){
			start = 1;
		}
		if(data[i].endTime[1] != month || data[i].endTime[0] != year){
			end = lastDate;
		}
		var calendarListSize = $("[type='checkbox']").size();
		for(var x=0; x < calendarListSize;x++){
			if($("[type='checkbox']").eq(x).val() == data[i].calendarID){
				colorCode = $("[type='checkbox']").eq(x).attr('data-colorCode');
				break;
			}
		}
		for(var j=start; j<=end; j++){
			var div = $("[data-listdate="+j+"]");
			div.css('display','block');
			var text = "";
			text +="<div class='listrow'>";
			text += "<div class='listDate'>";
			if(div.children().length == 0){
				text +=month+"월 "+j+"일 "+dayList[div.attr('data-listday')];
			}
			text +="</div>";
			text += "<div class='listCalendar'><div class='calendarCircle' style='background-color:"+colorCode+"'></div></div>";
			text += "<div class='listTime'>";
			if(data[i].startTime[3] == -1){
				text+= "종일";
			}else{
				text+= changeTimeForm(data[i].startTime[3], data[i].startTime[4])+" ~ "+changeTimeForm(data[i].endTime[3], data[i].endTime[4]);
			}
			text +="</div>";
			text += "<div class='listSummary'>"+"<a title='"+isNull(data[i].summary)+"'style='color:black' onClick ='clickEventTitle(this,true); return false;' href='#' data-eventId =";
			text += data[i].eventID+" data-calendarId = "+data[i].calendarID+">"+isNull(data[i].summary)+"</a>";
			text += "<span style='display:none;' data-information='"+JSON.stringify(data[i])+"'></span></div>";
			text += "</div>";
			div.append(text);
		}
	}
	
}