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
		width:22%;
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
		<form action="updateEvent" method="post" accept-charset="UTF-8">
			<span>제목</span><input id="summary" class="form-control" type="text" name="summary"><br><br>
			<span>일시</span>
				<input id="startDatePicker" class="form-control datePick" type="date" name="startDate" required onblur="checkDate();">
				 <input id="startTimePicker" class="form-control timePick" type="time" name="startDateTime" onclick="resetTimePicker();" onblur="checkTime();">
				<span> - </span>
				<input id="endDatePicker" class="form-control datePick" type="date" name="endDate" required onblur="checkDate();">
				 <input id="endTimePicker" class="form-control timePick" type="time" name="endDateTime" onclick="resetTimePicker();"  onblur="checkTime();">
			 <label><input id="allDayCheckBox" type='checkbox' name="allDay" onclick="resetTimePicker();"> 종일</label>
			 <br/><br/>
			<span>장소</span><input id="location" class="form-control" type="text" name="location" ><br/><br>
			<span>메모</span><textarea id="description" class="form-control" rows="5" id="memo" style="display:block; width:84%;" name="description"></textarea> <br/><br>
			<span>캘린더</span><select id="calendarList" name="calendars">
			</select>
			<input id="eventId" type="text" style="display:none;" value=${eventId} name="eventId">
			<input id="calendarId" type="text" style="display:none;"value=${calendarId} name="calendarId">
			<br/><br/>
			<button id="btnSave" class="btn btn-info" type="submit" name="save" value="true">저장</button>
			<button id="btnCancel" class="btn btn-info" type="button" onclick="history.back();">취소</button>
		</form>
	</div>
	
</div>
</body>
<script type="text/javascript">
//처음 
$(document).ready(function(){
	if($('#eventId').attr('value') == "addEvent"){//그냥 삽입인 경우
		var date = new Date();
		document.getElementById('startDatePicker').valueAsDate = date;
		document.getElementById('endDatePicker').valueAsDate = date;
		$("#allDayCheckBox").attr('value',false);
		document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
		if(date.getHours() == 23){
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),30,0);
		}else{
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours()+1,0,0);
		}
		getCalendarList();
	}else{
		getEvent();
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
				if(data[i].accessRole == "writer" || data[i].accessRole == "owner"){
					text += "<option value='"+data[i].id+"'";
					if($("#calendarId").attr('value')=="addEvent"){
						if(data[i].primary){
							text += "selected";
						}
					}else{
						if(data[i].id == $("#calendarId").attr('value')){
							text += "selected";
						}
					}
					text += ">"+data[i].summary+"</option>";
				}
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
			"calendarId" : $("#calendarId").attr('value'),
			"eventId" : $("#eventId").attr('value')
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
		$("#allDayCheckBox").attr('checked',true);
		$("#allDayCheckBox").attr('value',true);
		resetTimePicker();
	}else{
		console.log(new Date(data.start.dateTime.value));
		date = new Date(data.start.dateTime.value);	
		document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),date.getMinutes(),0);
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
		document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),date.getMinutes(),0);
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
//종일 일정 체크 여부에 따른 리셋
function resetTimePicker(){
	if($("#allDayCheckBox").prop('checked')){
		$('#startTimePicker').css('display','none');
		$('#endTimePicker').css('display','none');
		$("#allDayCheckBox").attr('value',true);
		var date=  new Date();
		document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
		if(date.getHours() == 23){
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),30,0);
		}else{
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours()+1,0,0);
		}
	} else{
		$('#startTimePicker').css('display','inline');
		$('#endTimePicker').css('display','inline');
		$("#allDayCheckBox").attr('value',false);
	}
}
//날짜 유효성 체크. 시작 날짜 기준으로 맞춤
function checkDate(){
	var startDate = new Date($("#startDatePicker").val());
	var endDate = new Date($("#endDatePicker").val());
	if(startDate.getTime() > endDate.getTime()){
		document.getElementById('endDatePicker').valueAsDate = new Date(startDate.getTime());
	}
}
//시간 유효성 체크. 시작 시간 기준으로 맞춤
function checkTime(){
	var startDate = new Date($("#startDatePicker").val());
	var endDate = new Date($("#endDatePicker").val());
	if(startDate != endDate){//시작 날짜와 끝 날짜가 다르면 시간 체크는 안해도 됨
		return;
	}
	console.log($('#startTimePicker').val());
	if($('#startTimePicker').val() == ''){
		document.getElementById('startTimePicker').value = makeTimeForm(0,0,0);
	}
	if($('#endTimePicker').val() == ''){
		document.getElementById('endTimePicker').value = makeTimeForm(0,0,0);
	}
	var startTime = $('#startTimePicker').val().split(":");
	var endTime = $('#endTimePicker').val().split(":");
	var startH = parseInt(startTime[0]);
	var endH =  parseInt(endTime[0]);
	var startM = parseInt(startTime[1]);
	var endM = parseInt(endTime[1]);
	if(startH > endH || (startH == endH && startM >= endM)){
		if(startH == 23){
			if(startM < 30){
				document.getElementById('endTimePicker').value = makeTimeForm(startH,startM+30,0);
			}else{
				document.getElementById('endTimePicker').value = makeTimeForm(startH,startM,0);
			}
		}else{
			document.getElementById('endTimePicker').value = makeTimeForm(startH+1,startM,0);
		}
	}
}
	//document.getElementById('startTimePicker').value = "15:21:00";
	
</script>
</html>