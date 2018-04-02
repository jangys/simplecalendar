<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" href="/bootstrap/css/bootstrap.css" >
<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Simple Calendar</title>
<style>
	@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
	html, body{
		height:100%;
		font-family: Nanum Gothic;
	}
	span{
		margin-right: 10px;
	}
	/*전체 문서*/
	#container{
		padding: 2% 2%;
		height : 100%;
	}
	/*내용 들어가는 부분*/
	#contents{
		width: 85%;
		margin: 0 auto;
		height: 100%;
	}
	.form-control{
		width: 80%;
		display:inline;
	}
	/*날짜 선택*/
	.datePick{
		width:23%;
		marigin-right:1%;
	}
	/*시간 선택*/
	.timePick{
		width:19%;
		margin-right:1%;
	}
</style>
</head>
<body>
<div id="container">
	<h4 id="eventDateTitle"></h4>
	<div id="contents">
		<form action="updateEvent" method="post">
			<span>제목</span><input id="summary" class="form-control" type="text" name="title"><br><br>
			<span>일시</span><input id="startDatePicker" class="form-control datePick" type="date" name="startDate" ><input id="startTimePicker" class="form-control timePick" type="time" name="startDate"><span>
			 - </span><input id="endDatePicker" class="form-control datePick" type="date" name="endDate"><input id="endTimePicker" class="form-control timePick" type="time" name="endDate"><br/><br/>
			<span>장소</span><input id="location" class="form-control" type="text" name="location"><br/><br>
			<span>메모</span><textarea id="description" class="form-control" rows="5" id="memo" style="display:block; width:84%;"></textarea> <br/><br>
			<span>캘린더</span><select id="calendarList" name="calendars">
			</select>
			<br/><br/>
			<button id="btnSave" class="btn btn-info" type="submit" name="save" value="true">저장</button>
			<button id="btnCancel" class="btn btn-info" type="button" onclick="history.back();">취소</button>
		</form>
		
	</div>
	<p id="eventId" style="display:none;">${eventId}</p>
	<p id="calendarId" style="display:none;">${calendarId}</p>
</div>
</body>
<script type="text/javascript">
//처음 
$(document).ready(function(){
	if($("#eventId").text() != ''){
		getEvent();
	}else{//그냥 삽입인 경우
		var date = new Date();
		document.getElementById('startDatePicker').valueAsDate = date;
		document.getElementById('endDatePicker').valueAsDate = date;
		getCalendarList();
	}
	//getList();
});
//캘린더 목록 추가
function getCalendarList(){
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url:baseUrl+"/CalendarList",
		type:'GET',
		dataType :"json",
		success:function(data){
			var size = data.length;
			var text = "";
			for(var i=0;i<size;i++){
				text += "<option value='"+data[i].id+"'";
				if(data[i].id == $("#calendarId").text()){
					text += "selected";
				}
				text += ">"+data[i].summary+"</option>";
			}
			$("#calendarList").html(text);
		}
	});
}

//상세보기를 눌러서 들어왔을 경우
function getEvent(){
	console.log($("#eventId").text());
	var baseUrl = "http://localhost:8080";
	var data={
			"calendarId" : $("#calendarId").text(),
			"eventId" : $("#eventId").text()
		};
	console.log(data.calendarId);
	$.ajax({
		url: baseUrl+"/getEvent",
		type:'GET',
		data: data,
		dataType :"json",
		success:function(data){
			console.log(data.summary);
			showEvent(data);
		}
	});
}

function showEvent(data){
	$('#summary').attr('value',data.summary);
	var date;
	if(data.start.date != null){
		date = new Date(data.start.date.value);
	}else{
		console.log(new Date(data.start.dateTime.value));
		date = new Date(data.start.dateTime.value);	
		document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),date.getMinutes(),date.getSeconds());
	}
	
	document.getElementById('startDatePicker').valueAsDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
	var end;
	if(data.end.date != null){
		end = data.end.date.value; 
		if(data.end.date.dateOnly){
			end -= 86400000;
		}
	}else{
		end = data.end.dateTime.value;
		date = new Date(end);
		document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),date.getMinutes(),date.getSeconds());
	}
	date = new Date(end);
	document.getElementById('endDatePicker').valueAsDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
	if(data.location != null){
		$('#location').attr('value',data.location);		
	}
	if(data.description != null){
		$('#description').text(data.description);
	}
	getCalendarList();
}
	
function makeTimeForm(hour, min, sec){
	var result="";
	if(hour < 10){
		result+="0";
	}
	result+=hour+":";
	if(min < 10){
		result+="0";
	}
	result+=min+":";
	if(sec < 10){
		result+="0";
	}
	result+=sec;
	
	return result;
}
	//document.getElementById('startTimePicker').value = "15:21:00";
	
</script>
</html>