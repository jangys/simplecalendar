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
	/*캘린더 리스트 select*/
	#calendarList{
		width: 30%;
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
	/*알람 메소드 선택 */
	.selectMethod{
		width: 20%;
		margin-right: 2%;
	}
	/*알람 타입 선택*/
	.selectType{
		width: 10%;
		margin-left: 2%;
		margin-right: 2%;
	}
	</style>
</head>
<body>
<div id="container">
	<h4 id="eventDateTitle"></h4>
	<div id="contents">
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
			<span>알람</span><ul id="alarmList" style="list-style: none; padding:0% 0%; display:none;" data-alarmNum="0"></ul>
			<button id="btnAddAlarm" class="btn btn-info" type="button" onclick="addAlarm()">알람 추가</button><br><br>
			<span>참석자</span><input id="attendee" class="form-fontrol" type="email" onkeypress="addAttendee(this);" >
			<ul id="attendeeList" style="list-style:none; padding: 0% 0%; " data-attNum="0">
				</ul>
			<span>캘린더</span><select class="form-control" id="calendarList" name="calendars"></select>
			<input id="calendarId" type="text" style="display:none;"value=${calendarId} name="calendarId">
			<input id="eventId" type="text" style="display:none;"value=${eventId} name="eventId">
			<br/><br/>
			<button id="btnSave" class="btn btn-info" type="button" name="save" value="true" onclick="submitInput();">저장</button>
			<button id="btnCancel" class="btn btn-info" type="button" onclick="history.back();">취소</button>
	</div>
	
</div>
</body>
<script type="text/javascript">
//처음 
$(document).ready(function(){
	if($('#eventId').attr('value') == "addEvent"){//그냥 삽입인 경우
		var date = new Date();
		if($('#calendarId').attr('value') == "0"){
			document.getElementById('startDatePicker').valueAsDate = date;
			document.getElementById('endDatePicker').valueAsDate = date;
			
			document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
			if(date.getHours() == 23){
				document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),30,0);
			}else{
				document.getElementById('endTimePicker').value = makeTimeForm(date.getHours()+1,0,0);
			}
			
		}else{
			var str = $('#calendarId').attr('value').split("/");
			var strStartDate = str[0].split("-");
			var strEndDate = str[1].split("-");
			var startDate = new Date(parseInt(strStartDate[0]),parseInt(strStartDate[1])-1,parseInt(strStartDate[2]),12);
			var endDate = new Date(parseInt(strEndDate[0]),parseInt(strEndDate[1])-1,parseInt(strEndDate[2]),12);
			document.getElementById('startDatePicker').valueAsDate = startDate;
			document.getElementById('endDatePicker').valueAsDate = endDate;
			document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),0,0);
		}
		
		$("#allDayCheckBox").attr('value',false);
		showAlarm(true);
		getCalendarList();
	}else{
		getEvent();
	}
	//getList();
});
//submit 엔터키 막기
$("*").keypress(function(e){
	if(e.keyCode == 13){
		return false;
	}
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
					if($("#eventId").attr('value')=="addEvent"){
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

//이벤트 정보 input에 출력
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
	if(data.reminders.overrides != null || data.reminders.useDefault){
		showAlarm(data.reminders.useDefault,data);
	}
	if(data.attendees != null){
		var size = data.attendees.length;
		var text = "";
		for(var i=0;i<size;i++){
			var optional = false;
			var organizer = false;
			var name = "";
			var email = "";
			if(data.attendees[i].optional != null){
				optional = true;
			}
			if(data.attendees[i].organizer != null){
				organizer = true;
			}
			if(data.attendees[i].displayName != null){
				name = data.attendees[i].displayName;
			}
			email = data.attendees[i].email;
			text += makeAttendeeForm(optional, name, email, organizer,data.attendees[i].responseStatus);
		}
		console.log(text);
		$("#attendeeList").append(text);
	}
	getCalendarList();
}

//0추가
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
//<select class="form-control" id="calendarList" name="calendars">
function showAlarm(useDefault, data){
	var text = "";
	var size = 0;
	if(useDefault == true){
		text += makeAlarmForm(0,"popup",30);
		text += makeAlarmForm(1,"email",10);
		size = 2;
		$("[data-alarmnum]").attr("data-alarmnum",2);
	}else{
		 size = data.reminders.overrides.length;
		for(var i=0;i<size;i++){
			text += makeAlarmForm(i,data.reminders.overrides[i].method,data.reminders.overrides[i].minutes);
		}
		$("[data-alarmnum]").attr("data-alarmnum",size);
	}
	if(size != 0){
		$("#alarmList").css('display','block');
	}
	$("#alarmList").html(text);
}
function makeAlarmForm(alarmIndex, method, minutes){
	var text = "";
	if(alarmIndex == 5){
		return "";
	}
	text += "<li>";
	text += "<select class='form-control selectMethod' name='overrides["+alarmIndex+"].method'>";
	if(method == "popup"){
		text += "<option value='popup' selected>알림</option>";
		text += "<option value='email'>이메일</option>";
	}else{
		text += "<option value='popup'>알림</option>";
		text += "<option value='email' selected>이메일</option>";
	}
	text += "</select>";
	var hour = 0;
	var type;
	var result = minutes;
	if(minutes >= 60){
		hour = minutes/60;
		if(parseInt(hour) === hour){
			var day = hour/24;
			if(parseInt(day) === day){
				var week = day/7;
				if(parseInt(week) === week){//주
					result = week;
					type="week";
				}else{
					result = day;
					type = "day";
				}
			}else{//시간
				result = hour;
				type = "hour";
			}
		}else{//분
			result = minutes;
			type = "min";
		}
	}
	var optionValue=["min","hour","day","week"];
	var optionText=["분","시간","일","주"];
	text += "<input type='number' name='overrides["+alarmIndex+"].minutes' min='0' max='40320' style='display:none;' value="+minutes+">";
	text += "<input type='number' id='inputNumber'min='0' value="+result+" onblur='checkMinutes(this);'>";
	text += "<select class='form-control selectType' onchange='changeType(this);'>";
	for(var i=0;i<4;i++){
		text += "<option value="+optionValue[i];
		if(optionValue[i] == type){
			text += " selected";
		}
		text += ">"+optionText[i]+"</option>";
	}
	text += "</select>";
	text += "<span> 전</span>"
	text += "<button type='button' class='btn btn-info' onclick='removeAlarm(this);'>X</button>";
	text += "</li>";
	return text;
}
//알람 삭제 버튼 눌렀을 시
function removeAlarm(btn){
	$(btn).parent().remove();
	var alarmNum = $("[data-alarmnum]");
	var before = alarmNum.attr('data-alarmnum');
	alarmNum.attr('data-alarmnum',before-1);
	if(before-1 == 0){
		$("#alarmList").css('display','none');
	}
	console.log(alarmNum.children().length);
	var children = alarmNum.children();
	for(var i=0; i<children.length;i++){
		children.eq(i).children().eq(0).attr('name',"overrides["+i+"].method");
		children.eq(i).children().eq(1).attr('name',"overrides["+i+"].minutes");
	}
}
//알람 추가 버튼 눌렀을 시
function addAlarm(){
	var alarmIndex = parseInt($("[data-alarmnum]").attr('data-alarmnum'));
	var text = makeAlarmForm(alarmIndex,"popup",10);
	if(alarmIndex == 0){
		$("#alarmList").css('display','block');
	}
	if(text != ""){
		$("#alarmList").append(text);
		$("[data-alarmnum]").attr('data-alarmnum',alarmIndex+1);
	}
}
//알람 숫자 입력칸 유효성 체크
function checkMinutes(input){
	var num = parseInt(input.value);
	var result = num;
	if(num < 0){
		input.value = 0;
	}else{
		switch($(input).next().val()){
		case "min":
			if(num > 40320){
				input.value = 40320;
			}
			break;
		case "hour":
			if(num > 672){
				input.value = 672;
			}
			result = input.value*60;
			break;
		case "day":
			if(num > 28){
				input.value = 28;
			}
			result = input.value*60*24;
			break;
		case "week":
			if(num > 4){
				input.value = 4;
			}
			result = input.value*60*24*7;
			break;
		}
	}
	$(input).prev().attr('value',result);
}
//알람 타입(분,시,일,주) 바꼈을 떄
function changeType(input){
	var type = $(input).val();
	var num = $(input).prev().val();
	var result = num;
	var numInput = $(input).prev();
	console.log(num);
	switch(type){
	case "min":
		if(num > 40320){
			numInput.attr('value',40320);
			numInput.val(40320);
			num = 40320;
		}
		break;
	case "hour":
		if(num > 672){
			numInput.attr('value',672);
			numInput.val(672);
			num = 672;
		}
		result =num*60;
		break;
	case "day":
		if(num > 28){
			numInput.attr('value',28);
			numInput.val(28);
			num = 28;
		}
		result = num*60*24;
		break;
	case "week":
		if(num > 4){
			numInput.attr('value',4);
			numInput.val(4);
			num = 4;
		}
		result = num*60*24*7;
		break;
	}
	$(input).prev().prev().attr('value',result);
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
	if(startDate.getFullYear() != endDate.getFullYear() || startDate.getMonth() != endDate.getMonth() || startDate.getDate() != endDate.getDate()){//시작 날짜와 끝 날짜가 다르면 시간 체크는 안해도 됨
		return;
	}
	//console.log($('#startTimePicker').val());
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
function addAttendee(input){
	var regExp = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

	if(event.keyCode == 13){
		if($(input).val().match(regExp)){
			var text = makeAttendeeForm(false, "", $(input).val(), false ,"needsAction");
			$("#attendeeList").append(text);
			input.value = "";
		}else{
			alert('이메일 형태로 입력해주세요.');
			input.focus();
		}
		
	}
}	
//<li><button type="button" class="optionalBtn btn" value="false">필수</button><span class="attendeeName"> 이름 </span><span class="email"> 이메일 </span><span>주최자</span>
function makeAttendeeForm(optional, name, email, organizer,response){
	var text = "<li><button type='button' class='optionalBtn btn' value="+optional+">";
	if(optional){
		text += "선택";
	}else{
		text += "필수";
	}
	text += "</button><span class='attendeeName'> "+name+" </span>";
	text += "<span class='email'> "+email+" </span>";
	if(organizer){
		text += "<span> 주최자 </span>";
	}
	text += "<span> "+response+" </span>";
	text += "<button type='button' class='btn btn-info'>X</button>";
	
	return text;
}

function submitInput(){
	var form = document.createElement("form");
	form.setAttribute("accept-charset","UTF-8");
	form.setAttribute("method","POST");
	form.setAttribute("action","updateEvent");

	form.appendChild(document.getElementById("contents"));
	
	document.body.appendChild(form);
	form.submit();
}
</script>
</html>