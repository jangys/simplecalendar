
function drawWeeklyCalendar(year,month,date,data,weekly){
	showWeeklyTitle(year,month,date,weekly);
	showWeeklyAllDay(year,month,date,data,weekly);
	showWeeklyEvent(year,month,date,data.weekly);
}

function showWeeklyTitle(year,month,date,weekly){
	var col = weekly == true? 7:1;
	var text = "<table style='border-collapse:collapse; border:none;height:100%;'><tr>";
	var div = $("#weekCalendar_Title");
	var dayList = ["일","월","화","수","목","금","토"];
	var start = new Date(year,month-1,date,9);
	for(var i=0;i<col;i++){
		var d = new Date(start.getTime()+84000000*i);
		if(d.getMonth() != (month-1)){
			text+="<td style='border:1px solid #c3c3c3;'></td>";
		}else{
			text += "<td style='border:1px solid #c3c3c3; padding-left:10px;'><p class='dateP_weekly'>"+d.getDate()+"</p>";
			text +="<p class='dayP_weekly'>"+ dayList[d.getDay()]+"</p></td>";
		}
	}
	text += "</tr></table>";
	div.html(text);
}

function showWeeklyAllDay(year,month,date,data,weekly){
	var col = weekly == true? 7:1;
	var text = "";
	var div = $("#weekCalendar_AllDay");
}

function showWeeklyEvent(year,month,date,data,weekly){
	var col = weekly == true? 7:1;
	var text = "";
	var div = $("#weekCalendar_Container");
}