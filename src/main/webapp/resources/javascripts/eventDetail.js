//처음 
function loadEventDetail(){
	var path = location.pathname.split('/');
	$('#calendarId_detail').attr('value',path[2]);
	$('#eventId_detail').attr('value',path[3]);
	//시간 선택창 만들기
	var text ="";
	var hour = 0;
	var min = 0;
	for(var i=0;i<48;i++){
		text += "<div class='timePicker' value='"+makeTimeForm(hour,min,0)+"'data-order="+i+">"+changeTimeForm(hour,min)+"</div>";
		hour = min == 30? hour+1 : hour;
		min = min == 0? 30:0;
	}
	$('#timePickerDiv').html(text);
	if($('#eventId_detail').attr('value') == "addEvent"){//그냥 삽입인 경우
		var date = new Date();
		if($('#calendarId_detail').attr('value') == "0"){
			document.getElementById('startDatePicker').valueAsDate = date;
			document.getElementById('endDatePicker').valueAsDate = date;
			showRecurrenceList(date);
			document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
			if(date.getHours() == 23){
				document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),30,0);
			}else{
				document.getElementById('endTimePicker').value = makeTimeForm(date.getHours()+1,0,0);
			}
			
		}else{
			var type = path[4].split("&")[0];
			var str = $('#calendarId_detail').attr('value').split("~");
			var time = false;
			var strStartDate = str[0].split("-");
			var strEndDate = str[1].split("-");
			var startDate = new Date(parseInt(strStartDate[0]),parseInt(strStartDate[1])-1,parseInt(strStartDate[2]),9);
			var endDate = new Date(parseInt(strEndDate[0]),parseInt(strEndDate[1])-1,parseInt(strEndDate[2]),9);
			showRecurrenceList(startDate);
			document.getElementById('startDatePicker').valueAsDate = startDate;
			document.getElementById('endDatePicker').valueAsDate = endDate;
			document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
			var endHour = date.getHours();
			if(startDate.getTime() == endDate.getTime()){
				endHour++;
			}
			document.getElementById('endTimePicker').value = makeTimeForm(endHour,0,0);
			if(type == "w" || type == "d"){//종일 일정인 경우
				if(path[2].indexOf("&") != -1){
					var time = path[2].split("&")[1].split("~");
					document.getElementById('startTimePicker').value = time[0];
					document.getElementById('endTimePicker').value = time[1];
				}else{
					$("#allDayCheckBox").attr('checked',true);
					$("#allDayCheckBox").attr('value',true);
					resetTimePicker_detail();
				}
			}else{
				$("#allDayCheckBox").attr('value',false);
			}
			
		}
		
		getCalendarList_detail(false);
	}else{
		getCalendarList_detail(true);
	}
	//getList();
}

//submit 엔터키 막기
$("*").keypress(function(e){
	if(e.keyCode == 13){
		return false;
	}
});
//캘린더 목록 추가
function getCalendarList_detail(getEvent){
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url:baseUrl+"/CalendarList",
		type:'GET',
		dataType :"json",
		success:function(data){
			var size = data.length;
			var text = "";
			if($("checkboxList").children().length == 0)
				printCalendarList(data);
			for(var i=0;i<size;i++){
				if(data[i].accessRole == "writer" || data[i].accessRole == "owner"){
					text += "<option value='"+data[i].id+"'";
					if($("#eventId_detail").attr('value')=="addEvent"){//이벤트 생성인 경우
						if(data[i].primary){
							text += "selected";
						}
					}else{
						if(data[i].id == $("#calendarId_detail").attr('value')){//이벤트 수정인 경우 이벤트의 캘린더가 선택되도록
							text += "selected";
							$("#calendarList_detail").attr('data-originalvalue',data[i].id);
						}
					}
					if(data[i].primary){
						$("#userId").text(data[i].id);
						var type = location.pathname.split('/')[4].split("&")[0];
						if(!getEvent && (type=='m' || type == 'l')){//일정 추가이고 월뷰, 리스트뷰 캘린더에서 요청한거면
							showAlarm_detail(true,null,data[i].id);
						}
					}
					text += ">"+data[i].summary+"</option>";
				}
			}
			$("#calendarList_detail").html(text);
			if(getEvent){
				getEvent_detail();
			}
		}
	});
	
}

//상세보기를 눌러서 들어왔을 경우
function getEvent_detail(){
	console.log($("#eventId_detail").text());
	var baseUrl = "http://localhost:8080";
	var data={
			"calendarId" : $("#calendarId_detail").attr('value'),
			"eventId" : $("#eventId_detail").attr('value')
		};
	console.log(data.calendarId);
	$.ajax({
		url: baseUrl+"/getEvent",
		type:'GET',
		data: data,
		dataType :"json",
		success:function(data){
			console.log(data.summary);
			showEvent_detail(data);
		}
	});
}

//이벤트 정보 input에 출력
function showEvent_detail(data){
	$('#summary_detail').attr('value',data.summary);
	$('#summary_detail').attr('data-originalValue',data.summary);
	var date;
	var start;
	var recurStart;
	var recurEnd;
	var path = location.pathname.split('/')[4].split('&');
	if(path.length == 4){
		recurStart=path[2].split('-');
		recurEnd=path[3].split('-');
	}
	var allDay = false;
	var originalStart;
	
	if(data.start.date != undefined){
		allDay = true;
		start = data.start.date.value;
		$("#allDayCheckBox").attr('checked',true);
		$("#allDayCheckBox").attr('value',true);
		$("#allDayCheckBox").attr('data-originalValue',true);
		resetTimePicker_detail();
	}else{
		start = data.start.dateTime.value;
		$("#allDayCheckBox").attr('data-originalValue',false);
		var d = new Date(data.start.dateTime.value);	
		var time =  makeTimeForm(d.getHours(),d.getMinutes(),0);
		document.getElementById('startTimePicker').value = time;
		$("#startTimePicker").attr('data-originalValue',time);
		var originalDate = new Date()
	}
	var startDate;
	if(path.length == 4){
		startDate = new Date(recurStart[0],recurStart[1]-1,recurStart[2]);
	}else{
		startDate = new Date(start);
	}
	showRecurrenceList(new Date(start));
	var valueDate = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),9);	//시간 있는 날짜인 경우 9시 이전이면 그 전날을 표시하기 때문
	document.getElementById('startDatePicker').valueAsDate = valueDate;
	$("#startDatePicker").attr('data-originalValue',valueDate.getTime());	//날짜만 판단. 시간은 판단하지 않을 거임
	$("#startDatePicker").attr('data-originalDateValue',start);
	if(!allDay){
		var d = new Date(data.start.dateTime.value);
		valueDate.setHours(d.getHours());
		valueDate.setMinutes(d.getMinutes());
		console.log(valueDate);
	}
	$("#startDatePicker").attr('data-originalStartDate',valueDate.getTime());
	var end;
	if(data.end.date != null){
		end = data.end.date.value; 
		$("#endDatePicker").attr('data-originalDateValue',end);
		if(data.end.date.dateOnly){
			end -= 86400000;
		}
	}else{
		end = data.end.dateTime.value;
		date = new Date(end);
		$("#endDatePicker").attr('data-originalDateValue',end);
		var time = makeTimeForm(date.getHours(),date.getMinutes(),0);
		document.getElementById('endTimePicker').value = time;
		$("#endTimePicker").attr('data-originalValue',time);
	}
	if(path.length == 4){
		date = new Date(recurEnd[0],recurEnd[1]-1,recurEnd[2]);
	}else{
		date = new Date(end);
	}
	var valueDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),9);
	document.getElementById('endDatePicker').valueAsDate = valueDate;
	$("#endDatePicker").attr('data-originalValue',valueDate.getTime());
	
	if(!allDay){
		var d = new Date(data.end.dateTime.value);
		valueDate.setHours(d.getHours());
		valueDate.setMinutes(d.getMinutes());
		console.log(valueDate);
	}
	$("#endDatePicker").attr('data-originalStartDate',valueDate.getTime());	//추후 개별 일정의 originalStartTime
	if(data.location != null){
		$('#location_detail').attr('value',data.location);
		$("#location_detail").attr('data-originalValue',data.location);
	}
	if(data.description != null){
		$('#description_detail').val(data.description);
		$("#description_detail").attr('data-originalValue',data.description);
	}
	if(data.reminders.overrides != null || data.reminders.useDefault){
		showAlarm_detail(data.reminders.useDefault,data,$("#calendarId_detail").val());
		$("#alarmList").attr('data-originalValue',JSON.stringify(data.reminders));
	}
	$("#creator_detail").text(data.creator.email);
	if(data.attendees != null){
		var size = data.attendees.length;
		var text = "";
		var organizerResponse="accepted";
		var self = false;
		var organizerEmail = data.organizer.email;
		$("#attendeeList").attr('data-originalValue',JSON.stringify(data.attendees));
		if($("#userId").text() != $("#calendarId_detail").val()){
			$("#attendeesDiv_detail").css('display','none');
		}
		if($("#calendarId_detail").val() == data.organizer.email){//먼저 메인 캘린더 여부 체크
			$("#isOrganizerCalendar").text("이 캘린더가 초대 일정의 원본을 가지고 있는 메인 캘린더 입니다.");
			var size = data.attendees.length;
			var me = -1;
			for(var i=0;i<size;i++){
				if($("#userId").text() == data.attendees[i].email){
					me = i;
					break;
				}
			}
			if(me != -1){//primary calendar에 내가 있는 경우
				$("#attendeesDiv_detail").css('display','');
			}
		}
		
		for(var i=0;i<size;i++){
			var optional = false;
			var name = "";
			var email = data.attendees[i].email
			if(data.attendees[i].organizer == null && email != organizerEmail){//주최자는 따로 추가
				if(data.attendees[i].optional != null){
					optional = true;
				}
				if(data.attendees[i].displayName != null){
					name = data.attendees[i].displayName;
				}
				if(data.attendees[i].email == $("#userId").text()){
					self = true;
				}else{
					self = false;
				}
				text += makeAttendeeForm_detail(optional, name, email, false,data.attendees[i].responseStatus,self);
			}else{
				organizerResponse=data.attendees[i].responseStatus;
			}
			
		}//for
		var strEmail = data.organizer.email.split("@");
		if(strEmail[1] != "group.calendar.google.com"){//primary 아닌 경우
			var organizerName = "";
			if(data.organizer.displayName != null){
				organizerName = data.organizer.displayName;
			}
			if(data.organizer.email == $("#userId").text()){
				self = true;
			}else{
				self = false;
			}
			var organizer = makeAttendeeForm_detail(false,organizerName, data.organizer.email, true,organizerResponse,self);
			$("#attendeeList").prepend(organizer);
		}
		$("#attendeeList").append(text);
		
	}//if-attendee
	if(data.recurrence != null){
		var rrule = data.recurrence[0];
		var size = data.recurrence.length;
		if(size > 1){
			for(var i=0;i<size;i++){
				if(data.recurrence[i].substring(0,5) == "RRULE"){
					rrule = data.recurrence[i];
					break;
				}
			}
		}
		console.log("rrule = "+rrule);
		$("#recurrenceList_detail").attr('data-originalValue',rrule);
		var option = $("#recurrenceList_detail").children();
		var isIn = false;
		for(var i=0;i<option.length;i++){
			if(option.eq(i).val() == rrule){
				option.eq(i).prop('selected',true);
				$("#recurrenceList_detail").attr('data-beforeSelect',rrule);
				isIn = true;
			}
		}
		if(!isIn){
			var temp = rrule.split(':');
			var rruleSplit = temp[1];
			var text = "<option value='RRULE:"+rruleSplit+"' selected>"+covertRRULEInKorean(rruleSplit,startDate.getMonth()+1,startDate.getDate())+"</option>";
			$("#recurrenceList_detail").attr('data-beforeSelect',rrule);
			$("#recurCustomOption").before(text);
		}
		$("#recurrenceList_detail").attr('data-moreInformation',JSON.stringify(data.recurrence));
	}
	//반복일정의 개별 일정인 경우
	if(data.recurringEventId != null){
		$("#recurrenceList_detail").prop('disabled','true');
	}
	$("#previousData_detail").text(JSON.stringify(data));
}


//<select class="form-control" id="calendarList" name="calendars">
//return은 alarm add할때 아무것도 없는 상태에서 추가 버튼 눌렀을때 defaultReminder가 나오도록 했는데 defaultReminder가 비었는지를 판단하기 위함
function showAlarm_detail(useDefault, data,calendarId){
	var text = "";
	var size = 0;
	if(useDefault == true){
		var defaultReminder = new Object();
		if($("[data-originalcalendarid='"+calendarId+"']").attr('data-defaultreminders') != undefined){
			defaultReminder = JSON.parse($("[data-originalcalendarid='"+calendarId+"']").attr('data-defaultreminders'));
		}
		size = defaultReminder.length;
		for(var i=0;i<size;i++){
			text += makeAlarmForm_detail(i,defaultReminder[i].method,defaultReminder[i].minutes,$("#allDayCheckBox").prop('checked'));
		}
		$("[data-alarmnum]").attr("data-alarmnum",size);
	}else{
		size = 0;
		if(data.reminders.overrides != undefined){//useDefault = false인데 overrides가 없는 경우가 있을 수 있음
			 size = data.reminders.overrides.length;
			for(var i=0;i<size;i++){
				text += makeAlarmForm_detail(i,data.reminders.overrides[i].method,data.reminders.overrides[i].minutes,$("#allDayCheckBox").prop('checked'));
			}
		}
		$("[data-alarmnum]").attr("data-alarmnum",size);
	}
	if(size != 0){
		$("#alarmList").css('display','block');
	}
	$("#alarmList").html(text);
	return text;
}
function makeAlarmForm_detail(alarmIndex, method, minutes,allDay){
	var text = "";
	if(alarmIndex == 5){
		return "";
	}
	text += "<li>";
	text += "<select class='form-control selectMethod_detail' name='overrides["+alarmIndex+"].method'>";
	if(method == "popup"){
		text += "<option value='popup' selected>알림</option>";
		text += "<option value='email'>이메일</option>";
	}else{
		text += "<option value='popup'>알림</option>";
		text += "<option value='email' selected>이메일</option>";
	}
	text += "</select>";
	text += "<input type='number' name='overrides["+alarmIndex+"].minutes' min='0' max='40320' style='display:none;' value="+minutes+">";
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
	if(allDay){
		var week;
		var date;
		var hour;
		var remainder_hour;
		var remainder_min;
		var remainder;
		var isDate = true;
		if(minutes >= 60){
			hour = parseInt(minutes/60);
			if(hour >= 24){
				date = parseInt(hour /24) + 1;	//전날 기준
				if(date >= 7){
					week = parseInt(date/7);
					result = week;
					remainder = minutes - week*60*24*7;
					isDate = false;
				}else{
					result = date;
					remainder = minutes - date*60*24;
				}
				remainder = remainder+24*60;	//하루 전이라서 표현만 하루전으로 하고 실제 계산은 돌려놓기
			}else{
				result = 1;
				remainder = minutes;
			}
		}else{
			result = 1;
			remainder = minutes;
		}
		
		remainder_hour = 24 - parseInt(remainder/60);
		remainder_min = remainder%60;
		if(remainder_min != 0){
			remainder_hour--;
		}
		//console.log("result = "+result + " ,"+"remainder = "+remainder_hour+ " , "+remainder_min);
		text += "<input type='number' class='form-control selectType_detail' style='margin-right:0;' min='1' max='28' value="+result+" onblur='checkMinutes_detail(this,true);'>";
		text += "<select class='form-control selectType_detail' onchange='changeType_detail(this,true);'>";
		if(isDate){
			text += "<option name='alarm_allDay' value='day' selected>일</option>";
			text += "<option name='alarm_allDay' value='week'>주</option>";
		}else{
			text += "<option name='alarm_allDay' value='day'>일</option>";
			text += "<option name='alarm_allDay' value='week' selected>주</option>";
		}
		text += "</select>";
		text += "<span class='detail_span'>전</span>";
		text += "<input type='time' class='form-control timePick_detail' value='"+makeTimeForm(remainder_hour,remainder_min,0)+"' onblur='convertTime_alarm(this);'>";
		//text += "<input type='text' class='form-control selectType_detail' onclick='showTimePicker(this,true);' onkeyup='convertTime(this);' onblur='showTimePicker(this,false);'>";
	}else{
		var optionValue=["min","hour","day","week"];
		var optionText=["분","시간","일","주"];
		text += "<input type='number' id='inputNumber_detail'min='0' value="+result+" onblur='checkMinutes_detail(this);'>";
		text += "<select class='form-control selectType_detail' onchange='changeType_detail(this);'>";
		for(var i=0;i<4;i++){
			text += "<option value="+optionValue[i];
			if(optionValue[i] == type){
				text += " selected";
			}
			text += ">"+optionText[i]+"</option>";
		}
		text += "</select>";
		text += "<span class='detail_span'> 전</span>"
	}
	text += "<a href='#' style='color:black;' class='noUnderLine' onclick='removeAlarm_detail(this); return false;'>X</a>";
	text += "</li>";
	return text;
}
//알람 삭제 버튼 눌렀을 시
function removeAlarm_detail(btn){
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
function addAlarm_detail(){
	var alarmIndex = parseInt($("[data-alarmnum]").attr('data-alarmnum'));
	var text;
	if($("#allDayCheckBox").prop('checked')){
		text = makeAlarmForm_detail(alarmIndex,"popup",900,true);
	}else{
		text = makeAlarmForm_detail(alarmIndex,"popup",10,false);
	}
	var result = "";
	if(alarmIndex == 0){
		$("#alarmList").css('display','block');
		if(!$("#allDayCheckBox").prop('checked'))
			result = showAlarm_detail(true,null,$("#calendarList_detail").val());
	}
	if(result == ""){
		if(text != ""){
			$("#alarmList").append(text);
			$("[data-alarmnum]").attr('data-alarmnum',alarmIndex+1);
		}
	}
}
//알람 숫자 입력칸 유효성 체크
function checkMinutes_detail(input,allDay){
	var num = parseInt(input.value);
	var result = num;
	if(num < 0){
		input.value = 0;
		if(allDay){
			input.value = 1;
		}
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
	if(allDay){
		result -= 60*24; //표현만 하루 전으로 표현
		var timeStr = $(input).nextAll(":eq(2)").val().split(":");
		var hour = 24 - parseInt(timeStr[0]);
		var min = parseInt(timeStr[1]);
		if(min != 0){
			hour --;
		}
		$(input).prev().attr('value',result+hour*60+min);
	}
		
}
//알람 타입(분,시,일,주) 바꼈을 떄
function changeType_detail(input,allDay){
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
	if(allDay){
		result -= 60*24; //표현만 하루 전으로 표현
		var timeStr = $(input).nextAll(":eq(1)").val().split(":");
		var hour = 24 - parseInt(timeStr[0]);
		var min = parseInt(timeStr[1]);
		if(min != 0){
			hour --;
		}
		$(input).prev().prev().attr('value',result+hour*60+min);
	}
}
function convertTime_alarm(time){
	var timeStr = $(time).val().split(":");
	var result;
	var type = $(time).prevAll(":eq(1)").val();
	var num = $(time).prevAll(":eq(2)").val();
	switch(type){
	case "day":
		result = num*60*24;
		break;
	case "week":
		result = num*60*24*7;
		break;
	}
	result -= 60*24; //표현만 하루 전으로 표현
	var hour = 24 - parseInt(timeStr[0]);
	var min = parseInt(timeStr[1]);
	if(min != 0){
		hour --;
	}
	console.log("type = "+type+", num = "+num);
	$(time).prevAll(":eq(3)").attr('value',result+hour*60+min);
}
//종일 일정 체크 여부에 따른 리셋
function resetTimePicker_detail(){
	if($("#allDayCheckBox").prop('checked')){//종일
		$('#startTimePicker').css('display','none');
		$('#endTimePicker').css('display','none');
		$("#allDayCheckBox").attr('value',true);
		$("#alarmList").html('');
		$("[data-alarmnum]").attr("data-alarmnum",0);
		if($("#allDayCheckBox").attr('data-originalvalue') == 'true'){
			if($("#previousData_detail").text() != ''){
				var previous = JSON.parse($("#previousData_detail").text());
				showAlarm_detail(previous.reminders.useDefault, previous,$("#calendarList_detail").attr('data-originalvalue'));
			}
		}
	} else{
		var date = new Date();
		
		document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
		if(date.getHours() == 23){
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),30,0);
		}else{
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours()+1,0,0);
		}
		$('#startTimePicker').css('display','inline');
		$('#endTimePicker').css('display','inline');
		$("#allDayCheckBox").attr('value',false);
		$("#alarmList").html('');
		$("[data-alarmnum]").attr("data-alarmnum",0);
		if($("#allDayCheckBox").attr('data-originalvalue') == 'false'){
			if($("#previousData_detail").text() != ''){
				var previous = JSON.parse($("#previousData_detail").text());
				showAlarm_detail(previous.reminders.useDefault, previous,$("#calendarList_detail").val());	//지금 사용자가 선택한 캘린더의 기본 알림 값이 나오도록 함
			}
		}else{
			showAlarm_detail(true,null,$("#calendarList_detail>option:selected").val());
		}
	}
}
//날짜 유효성 체크. 시작 날짜 기준으로 맞춤
function checkDate_detail(start){
	var startDate = new Date($("#startDatePicker").val());
	var endDate = new Date($("#endDatePicker").val());
	if(startDate.getTime() > endDate.getTime()){
		document.getElementById('endDatePicker').valueAsDate = new Date(startDate.getTime());
	}
	if(start){
		//showRecurrenceList(startDate);
	}
}
//시간 유효성 체크. 시작 시간 기준으로 맞춤
function checkTime_detail(){
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
//캘린더 리스트 바뀐 여부
function changeCalendarList_detail(select){
	var val = $("#calendarList_detail>option:selected").val();
	var id = $("#userId").text();
	if($("#attendeeList").children().length > 0 && $("#calendarList_detail>option:selected").text() ==val){//primary 선택
		if(id != val){//다른 사람 id
			$("attendeeList").children().eq(0).children().eq(3).text("");
		}else{
			
		}
	}
	showAlarm_detail(true,null,val);
}
	//document.getElementById('startTimePicker').value = "15:21:00";
function addAttendee_detail(input){
	var regExp = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if(event.keyCode == 13){
		if($(input).val().match(regExp)){
			if($("#attendeeList").children().length == 0 && $(input).val() != $("#userId").text()){
				var text = makeAttendeeForm_detail(false,"",$("#userId").text(),true,"accepted",true,true);
				$("#attendeeList").append(text);
			}
			if($(input).val() == $("#userId").text()){//본인이 추가
				var text = makeAttendeeForm_detail(false,"",$("#userId").text(),true,"accepted",true);
				$("#attendeeList").append(text);
			}else{
				var text = makeAttendeeForm_detail(false, "", $(input).val(), false ,"needsAction",false,true);
				$("#attendeeList").append(text);
			}
			input.value = "";
		}else{
			alert('이메일 형태로 입력해주세요.');
			input.focus();
		}
		
	}
}	
//<li><button type="button" class="optionalBtn btn" value="false">필수</button><span class="attendeeName"> 이름 </span><span class="email"> 이메일 </span><span>주최자</span>
function makeAttendeeForm_detail(optional, name, email, organizer,response,self,add){
	var text = "<li class='attendee";
	var mainCalendar = false;
	if($("#isOrganizerCalendar").text() != ""){
		mainCalendar = true;
	}
	if(self){
		text += " selfAttendee";
	}
	text +="'><button type='button' class='optionalBtn btn' value="+optional+" onclick='changeOptionalBtn_detail(this);'";
	if(!mainCalendar && add == undefined){//메인 캘린더가 아닌 경우에는 수정 불가 본인이 추가할 경우는 수정 가능.
		text += " disabled";
	}
	text += ">";
	if(optional){
		text += "선택";
	}else{
		text += "필수";
	}
	text += "</button><span class='attendeeName'>"+name+"</span>";
	text += "<span class='email attendeeSpan'>&lt;"+email+"&gt;</span>";
	if(organizer){
		text += "<span class='attendeeSpan'>주최자</span>";
	}else{
		text += "<span class='attendeeSpan'></span>";
	}
	text += "<span class='attendeeSpan'";
	if(self){
		text += " data-self='true'";
		$("option[value="+response+"]").attr("selected", "selected");
	}
	text += ">"+getResponseStatus(response)+"</span>";
	
	if(mainCalendar || add == true){//메인 캘린더가 아닌 경우에는 수정 불가
		text += "<a href='#' style='color:black;' class='noUnderLine' onclick='$(this).parent().remove(); return false;'>X</a>";
	}
	return text;
}
//참석자의 선택, 필수 여부
function changeOptionalBtn_detail(btn){
	var optional = !($(btn).val() == 'true');
	$(btn).val(optional);
	if(optional){
		$(btn).text("선택");
	}else{
		$(btn).text("필수");
	}
}
//내 참석 여부 바꿨을 경우
function changeMyResponseStatus_detail(select){
	var me = $("[data-self='true']");
	me.text(getResponseStatus($(select).val()));
}

function getResponseStatus(response){
	switch(response){
	case "needsAction":
		return "대기";
		break;
	case "declined":
		return "거절";
		break;
	case "tentative":
		return "미정";
		break;
	case "accepted":
		return "수락";
		break;
	case "대기":
		return "needsAction";
		break;
	case "거절":
		return "declined";
		break;
	case "미정":
		return "tentative";
		break;
	case "수락":
		return "accepted";
		break;		
	}
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
//아래 시간 선택 창 출력
function showTimePicker(input,show){
	var div = $("#timePickerDiv");
	var top = $(input).offset().top;
	var left = $(input).offset().left;
	if(show){
		div.css('display','block');
		div.css('top',top+40);
		div.css('left',left);
	}else{
		div.css('display','none');
	}
}
//입력된 값에서 시간, 분 추출
function convertTime(input){
	var num = $(input).val().replace(/[^0-9]/g,'');
	if(num.length <= 2){//시간만 입력
		var time = makeTimeForm(parseInt(num),0,0);
		var div = $("div[value='"+time+"']");
		div.css('background-color','#c3c3c3');
		var order = parseInt(div.attr('data-order'));
		console.log(order*20);
		$('#timePickerDiv').animate({scrollTop : order*20}, 400);
	}
}
function clickCancel_detail(){
	console.log("cancel");
	var typeStr = location.pathname.split('/')[4].split("&");
	var date =  $("#startDatePicker").val();
	var type = typeStr[0];
	var strDate =typeStr[1].split("-");
	switch(type){
	case 'd':
		changeStyle("day");
		requestDailyCalendar(strDate[0],strDate[1],strDate[2],false);
		break;
	case 'w':
		changeStyle("week");
		requestWeeklyCalendar(strDate[0],strDate[1],strDate[2],false);
		break;
	case 'm':
		changeStyle("month");
		requestMonthlyCalendar(strDate[0],strDate[1],strDate[2],false);
		break;
	case 'l':
		changeStyle("list");
		requestListCalendar(strDate[0],strDate[1],strDate[2],false);
		break;
	}
}
function checkInputChange(input){
	if($("#eventId_detail").val() == "addEvent"){
		return true;
	}
	var previous = JSON.parse($("#previousData_detail").text());
	if(input.summary != previous.summary){
		return true;
	}
	var start = "";
	var startTime = "";
	var date;
	if(input.allDay == $("#allDayCheckBox").is(":checked")){
		return true;
	}
	var startSplit = input.startDate.split("-");
	start = new Date(startSplit[0],startSplit[1]-1,startSplit[2],9);
	if($("#startDatePicker").attr('data-originalvalue') != start.getTime()){
		return true;
	}
	var end = "";
	var date;
	var endTime = "";

	var endSplit = input.endDate.split("-");
	end = new Date(endSplit[0],endSplit[1]-1,endSplit[2],9);
	if($("#endDatePicker").attr('data-originalvalue') != end.getTime()){
		return true;
	}
	if(previous.start.dateTime != null){
		startTime = $("#startTimePicker").attr('data-originalvalue');
	}
	if(startTime != input.startDateTime){
		return true;
	}

	if(previous.end.dateTime != null){
		endTime = $("#endTimePicker").attr('data-originalvalue');
	}
	if(endTime != input.endDateTime){
		return true;
	}
	if(previous.recurrence == undefined && input.recurrence != null){
		return true;
	}
	if(previous.recurrence != undefined && previous.recurrence.toString() != input.recurrence.toString()){
		return true;
	}
	var location = "";
	if(previous.location != undefined){
		location = previous.location;
	}
	if(location != input.location){
		return true;
	}
	var description = "";
	if(previous.description != undefined){
		description = previous.description;
	}
	if(description != input.description){
		return true;
	}
	var useDefault = false;
	var defaultReminder = new Object();
	if($("[data-originalcalendarid='"+input.calendars+"']").attr('data-defaultreminders') != undefined){
		defaultReminder = JSON.parse($("[data-originalcalendarid='"+input.calendars+"']").attr('data-defaultreminders'));
	}
	var size = defaultReminder.length;
	var isDefault = true;
	if(size == input.overrides.length){
		for(var i=0;i<size;i++){
			if(input.overrides[i].method != defaultReminder[i].method || input.overrides[i].minutes != defaultReminder[i].minutes){
				isDefault = false;
				break;
			}
		}
	}
	useDefault = isDefault;
	console.log("useDefault = "+useDefault);
	if(previous.reminders.useDefault != useDefault){
		return true;
	}
	//console.log(JSON.stringify(previous.reminders.overrides));
	//console.log(JSON.stringify(input.overrides));
	if(!useDefault && ((previous.reminders.overrides == undefined && input.overrides.length != 0) ||(previous.reminders.overrides != undefined && JSON.stringify(previous.reminders.overrides) != JSON.stringify(input.overrides)))){
		return true;
	}
	if($("#calendarId_detail").val() != input.calendars){
		return true;
	}
	if(previous.attendees == undefined && input.attendees.length != 0){
		return true;
	}
	if(previous.attendees != undefined){
		if(previous.attendees.length != input.attendees.length){
			return true;
		}
		for(var i=0;i<input.attendees.length;i++){
			var isIn = false;
			for(var j=0;j<previous.attendees.length;j++){
				if(input.attendees[i].email == previous.attendees[j].email){
					isIn = true;
					var optional = false;
					if(previous.attendees[j].optional != undefined){
						optional = true;
					}
					if(input.attendees[i].optional !=optional){
						return true;
					}
					if(input.attendees[i].responseStatus != previous.attendees[j].responseStatus){
						return true;
					}
					continue;
				}
			}
			if(!isIn){
				return true;
			}
		}
	}
	return false;
}

function submitInput_detail(){

	var overrides = new Array();
	var size = $("[data-alarmNum]").attr('data-alarmNum');
	console.log(size);
	for(var i=0;i<size;i++){
		var override = new Object();
		override.method = $("[name='overrides["+i+"].method']").val().toString();
		override.minutes = (parseInt($("[name='overrides["+i+"].minutes']").val()));
		overrides.push(override);
	}

	var size = $("li.attendee").length;
	var attendees = new Array();
	for(var i=0;i<size;i++){
		var index = 0;
		var email = "";
		var li = $("li.attendee").eq(i);
		var attendee = new Object();
		attendee.optional = (li.children().eq(0).val()=="true");
		var emailStr = li.children().eq(2).text();
		email = emailStr.substring(1,emailStr.length-1);
		attendee.email = email;
		attendee.responseStatus = getResponseStatus(li.children().eq(4).text());
		attendees.push(attendee);
	}	
	var recurrence = new Array();
	var originRecurrence = new Object();
	if($("#recurrenceList_detail").attr('data-moreInformation') != undefined){
		originRecurrence = JSON.parse($("#recurrenceList_detail").attr('data-moreInformation'));
	}
	var originRRULE = "";
	for(var i=0;i<originRecurrence.length;i++){
		if(originRecurrence[i].substring(0,5) == "RRULE"){
			originRRULE = originRecurrence[i];
			break;
		}
	}
	if($("#recurrenceList_detail").val() == originRRULE && originRecurrence.length > 1){
		recurrence = originRecurrence;
	}else{
		recurrence.push($("#recurrenceList_detail").val());
	}
	console.log(recurrence);
	if(recurrence == "none"){
		recurrence = null;
	}
	//var originalStart = $("#startDatePicker").attr('data-originalDateValue')+new Date($("#startDatePicker").val()).getTime()-$("#startDatePicker").attr('data-originalValue');
	//var originalEnd = $("#endDatePicker").attr('data-originalDateValue')+new Date($("#endDatePicker").val()).getTime()-$("#endDatePicker").attr('data-originalValue');
	var originalStart = new Array();
	originalStart.push($("#startDatePicker").attr('data-originalDateValue'));
	originalStart.push($("#startDatePicker").attr('data-originalStartDate'));
	var originalAllDay = 0;	//false
	if($("#allDayCheckBox").attr('data-originalvalue')=="true"){
		originalAllDay = 1;
	}
	originalStart.push(originalAllDay);
	var originalEnd = new Array();
	originalEnd.push($("#endDatePicker").attr('data-originalDateValue'));
	originalEnd.push($("#endDatePicker").attr('data-originalStartDate'));
	console.log($("#endDatePicker").attr('data-originalStartDate'));
	var calendarId = $("#calendarList_detail").val().toString();
	var inputJSON={
		"summary" : $("#summary_detail").val().toString(),
		"startDate" : $("#startDatePicker").val().toString(),
		"startDateTime" : $("#startTimePicker").val().toString(),
		"endDate" :  $("#endDatePicker").val().toString(),
		"endDateTime" : $("#endTimePicker").val().toString(),
		"originalStartDate" : originalStart,
		"originalEndDate" :  originalEnd,
		"allDay" : $("#allDayCheckBox").is(":checked"),
		"location" : $("#location_detail").val().toString(),
		"description" : $("#description_detail").val().toString(),
		"overrides" : overrides,
		"defaultReminders" : JSON.parse($("[data-originalcalendarid='"+calendarId+"']").attr('data-defaultreminders')),
		"attendees" : attendees,
		"recurrence" : recurrence,
		"updateType" : 0,
		"calendars" : calendarId,
		"eventId" : $("#eventId_detail").val().toString(),
		"calendarId" : $("#calendarId_detail").val().toString()
		};
	if(!checkInputChange(inputJSON)){
		clickCancel_detail();
		return;
	}else{
		console.log("true");
		var start;
		var startSplit = inputJSON.startDate.split("-");
		start = new Date(startSplit[0],startSplit[1]-1,startSplit[2],9);
		var end;
		var endSplit = inputJSON.endDate.split("-");
		end = new Date(endSplit[0],endSplit[1]-1,endSplit[2],9);
		console.log("picker = "+$("#startDatePicker").attr('data-originalvalue')+" , "+start.getTime());
		if($("#startDatePicker").attr('data-originalvalue') != start.getTime()){
			$("[name='userType_detail']:eq(1)").parent().css('display','none');
		}else{
			$("[name='userType_detail']:eq(1)").parent().css('display','inline-block');
		}
		//반복 규칙이 바뀐 경우
		console.log(originRecurrence);
		console.log(recurrence);
		if($("#recurrenceList_detail").attr('data-moreInformation') != JSON.stringify(recurrence)){
			$("[name='userType_detail']:eq(0)").parent().css('display','none');
			$("[name='userType_detail']:eq(1)").prop('checked',true);
		}else{
			$("[name='userType_detail']:eq(0)").parent().css('display','inline-block');
		}
		if($("#recurrenceList_detail").attr('data-originalValue') != undefined){
			$("#recurUpdateDiv_detail").css('display','block');
			$("#recurUpdateBtn_detail").click(function(){
				var updateTypeStr = $("[name='userType_detail']:checked").val();
				var updateType = 0;
				switch(updateTypeStr){
				case "ONLYTHIS":
					updateType = 1;
					break;
				case "ALL":
					updateType = 2;
					//이때 EXDATE는 다 지우기
					if(recurrence.length > 1){
						var rrule;
						for(var i=0;i<recurrence.length;i++){
							if(recurrence[i].substring(0,5) == "RRULE"){
								rrule = recurrence[i];
								break;
							}
						}
						recurrence = new Array();
						recurrence.push(rrule);
						inputJSON.recurrence = recurrence;
					}
					break;
				case "NEXT":
					updateType = 3;	//until 추가 originRecurrence
					var original = convertRRULEToObject($("#recurrenceList_detail").attr('data-originalvalue').split(":")[1]);
					var current = new Date(new Date($("#startDatePicker").val()).getTime()-86400000);	//하루 전까지 UNTIL
					var result = ""+(current.getFullYear())+addZero(current.getMonth()+1)+addZero(current.getDate());
					original.UNTIL = result;
					inputJSON.originRecurrence = JSON.parse($("#recurrenceList_detail").attr('data-moreInformation'));
					if(inputJSON.originRecurrence.length > 1){
						for(var i=0; i<inputJSON.originRecurrence.length;i++){
							if(inputJSON.originRecurrence[i].substring(0,5) == "RRULE"){
								inputJSON.originRecurrence[i] = rruleToString(original);
								console.log(inputJSON.originRecurrence[i]);
								break;
							}
						}
					}else{
						inputJSON.originRecurrence[0] = rruleToString(original);
						console.log(inputJSON.originRecurrence[0]);
					}
					break;
				}
				inputJSON.updateType = updateType;
				submitData(inputJSON);
			});
		}
	}
	if($("#recurrenceList_detail").attr('data-originalValue') == undefined){
		submitData(inputJSON);
	}
}
function submitData(inputJSON){
	var data = JSON.stringify(inputJSON);
	
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url: baseUrl+"/updateEvent",
		type:'POST',
		data: data,
		contentType : "application/json; charset=UTF-8",
		success:function(data){
			if(data=="true"){
				var type = location.pathname.split('/')[4].split('&')[0];
				var date =  $("#startDatePicker").val();
				var strDate =date.split("-");
				switch(type){
				case 'd':
					changeStyle("day");
					requestDailyCalendar(strDate[0],strDate[1],strDate[2],false);
					break;
				case 'w':
					changeStyle("week");
					requestWeeklyCalendar(strDate[0],strDate[1],strDate[2],false);
					break;
				case 'm':
					changeStyle("month");
					requestMonthlyCalendar(strDate[0],strDate[1],strDate[2],false);
					break;
				case 'l':
					changeStyle("list");
					requestListCalendar(strDate[0],strDate[1],strDate[2],false);
					break;
				}
			}else{
				alert(data);
			}
		}
	});
}