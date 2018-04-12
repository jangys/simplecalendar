//처음 
function loadEventDetail(){
	var path = location.pathname.split('/');
	$('#calendarId_detail').attr('value',path[2]);
	$('#eventId_detail').attr('value',path[3]);
	if($('#eventId_detail').attr('value') == "addEvent"){//그냥 삽입인 경우
		var date = new Date();
		if($('#calendarId_detail').attr('value') == "0"){
			document.getElementById('startDatePicker').valueAsDate = date;
			document.getElementById('endDatePicker').valueAsDate = date;
			
			document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
			if(date.getHours() == 23){
				document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),30,0);
			}else{
				document.getElementById('endTimePicker').value = makeTimeForm(date.getHours()+1,0,0);
			}
			
		}else{
			var str = $('#calendarId_detail').attr('value').split("~");
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
		showAlarm_detail(true);
		getCalendarList_detail();
	}else{
		getEvent_detail();
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
function getCalendarList_detail(){
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
					if($("#eventId_detail").attr('value')=="addEvent"){
						if(data[i].primary){
							text += "selected";
						}
					}else{
						if(data[i].id == $("#calendarId_detail").attr('value')){
							text += "selected";
						}
					}
					if(data[i].primary){
						$("#userId").text(data[i].id);
					}
					text += ">"+data[i].summary+"</option>";
				}
			}
			$("#calendarList_detail").html(text);
			
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
	var date;
	if(data.start.date != null){
		date = new Date(data.start.date.value);
		$("#allDayCheckBox").attr('checked',true);
		$("#allDayCheckBox").attr('value',true);
		resetTimePicker_detail();
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
		showAlarm_detail(data.reminders.useDefault,data);
	}
	
	if(data.attendees != null){
		var size = data.attendees.length;
		var text = "";
		var organizerResponse="accepted";
		var self = false;
		for(var i=0;i<size;i++){
			var optional = false;
			var name = "";
			var email = "";
			if(data.attendees[i].organizer == null){//주최자는 따로 추가
				if(data.attendees[i].optional != null){
					optional = true;
				}
				if(data.attendees[i].displayName != null){
					name = data.attendees[i].displayName;
				}
				if(data.attendees[i].self != null){
					self = true;
				}else{
					self = false;
				}
				email = data.attendees[i].email;
				text += makeAttendeeForm_detail(optional, name, email, false,data.attendees[i].responseStatus,self);
			}else{
				organizerResponse=data.attendees[i].responseStatus;
			}
			
		}
		var organizerName = "";
		if(data.organizer.displayName != null){
			organizerName = data.organizer.displayName;
		}
		if(data.organizer.self != null){
			self = true;
		}else{
			self = false;
		}
		var organizer = makeAttendeeForm_detail(false,organizerName, data.organizer.email, true,organizerResponse,self);
		$("#attendeeList").append(text);
		$("#attendeeList").prepend(organizer);
	}
	getCalendarList_detail();
}


//<select class="form-control" id="calendarList" name="calendars">
function showAlarm_detail(useDefault, data){
	var text = "";
	var size = 0;
	if(useDefault == true){
		text += makeAlarmForm_detail(0,"popup",30);
		text += makeAlarmForm_detail(1,"email",10);
		size = 2;
		$("[data-alarmnum]").attr("data-alarmnum",2);
	}else{
		 size = data.reminders.overrides.length;
		for(var i=0;i<size;i++){
			text += makeAlarmForm_detail(i,data.reminders.overrides[i].method,data.reminders.overrides[i].minutes);
		}
		$("[data-alarmnum]").attr("data-alarmnum",size);
	}
	if(size != 0){
		$("#alarmList").css('display','block');
	}
	$("#alarmList").html(text);
}
function makeAlarmForm_detail(alarmIndex, method, minutes){
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
	text += "<input type='number' id='inputNumber'min='0' value="+result+" onblur='checkMinutes_detail(this);'>";
	text += "<select class='form-control selectType_detail' onchange='changeType_detail(this);'>";
	for(var i=0;i<4;i++){
		text += "<option value="+optionValue[i];
		if(optionValue[i] == type){
			text += " selected";
		}
		text += ">"+optionText[i]+"</option>";
	}
	text += "</select>";
	text += "<span> 전</span>"
	text += "<button type='button' class='btn btn-info' onclick='removeAlarm_detail(this);'>X</button>";
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
	var text = makeAlarmForm_detail(alarmIndex,"popup",10);
	if(alarmIndex == 0){
		$("#alarmList").css('display','block');
	}
	if(text != ""){
		$("#alarmList").append(text);
		$("[data-alarmnum]").attr('data-alarmnum',alarmIndex+1);
	}
}
//알람 숫자 입력칸 유효성 체크
function checkMinutes_detail(input){
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
function changeType_detail(input){
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
function resetTimePicker_detail(){
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
function checkDate_detail(){
	var startDate = new Date($("#startDatePicker").val());
	var endDate = new Date($("#endDatePicker").val());
	if(startDate.getTime() > endDate.getTime()){
		document.getElementById('endDatePicker').valueAsDate = new Date(startDate.getTime());
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
	//document.getElementById('startTimePicker').value = "15:21:00";
function addAttendee_detail(input){
	var regExp = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if(event.keyCode == 13){
		if($(input).val().match(regExp)){
			if($("#attendeeList").children().length == 0 && $(input).val() != $("#userId").text()){
				var text = makeAttendeeForm_detail(false,"",$("#userId").text(),true,"accepted",false);
				$("#attendeeList").append(text);
			}
			if($(input).val() == $("#userId").text()){//본인이 추가
				var text = makeAttendeeForm_detail(false,"",$("#userId").text(),true,"accepted",true);
				$("#attendeeList").append(text);
			}else{
				var text = makeAttendeeForm_detail(false, "", $(input).val(), false ,"needsAction",false);
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
function makeAttendeeForm_detail(optional, name, email, organizer,response,self){
	var text = "<li class='attendee'><button type='button' class='optionalBtn btn' value="+optional+" onclick='changeOptionalBtn_detail(this);'>";
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
	text += "<button type='button' class='btn btn-info' onclick='$(this).parent().remove();'>X</button>";
	
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

function submitInput_detail(){
	var input = new Object();
	input.summary = $("#summary_detail").val().toString();
	input.startDate = $("#startDatePicker").val().toString();
	input.startDateTime = $("#startTimePicker").val().toString();
	input.endDate = $("#endDatePicker").val().toString();
	input.endDateTime = $("#endTimePicker").val().toString();
	input.allDay = $("#allDayCheckBox").is(":checked").toString();
	input.location = $("#location_detail").val().toString();
	input.description = $("#description_detail").text().toString();
	var size = $("[data-alarmNum]").attr("data-alarmNum");
	
	var overrides = new Array();
	
	for(var i=0;i<size;i++){
		var override = new Object();
		override["method"] = $("[name='overrides["+i+"].method']").val().toString();
		override["minutes"] = (parseInt($("[name='overrides["+i+"].minutes']").val()));
		overrides.push(override);
	}
	input.overrides = overrides;
	
	input.calendars = $("#calendarList_detail").val().toString();
	input.eventId = $("#eventId_detail").val().toString();
	input.calendarId = $("#calendarId_detail").val().toString();
	
	var size = $("li.attendee").length;
	var field=["optional","email","organizer","responseStatus","self"];
	var attendees = new Array();
	for(var i=0;i<size;i++){
		var index = 0;
		var email = "";
		var li = $("li.attendee").eq(i);
		var attendee = new Object();
		attendee.optional = li.children().eq(0).val();
		var emailStr = li.children().eq(2).text();
		email = emailStr.substring(1,emailStr.length-1);
		attendee.email = email;
		var organizer = false;
		if(li.children().eq(3).text() == "주최자"){
			organizer = true;
		}
		attendee.organizer = organizer;
		attendee.responseStatus = getResponseStatus(li.children().eq(4).text());
		var self = false;
		if(email == $("#userId").text()){
			self = true;
		}
		attendee.self=self;
		attendees.push(attendee);
	}	
	var inputJSON={
		"summary" : $("#summary_detail").val().toString(),
		"startDate" : $("#startDatePicker").val().toString(),
		"startDateTime" : $("#startTimePicker").val().toString(),
		"endDate" :  $("#endDatePicker").val().toString(),
		"endDateTime" : $("#endTimePicker").val().toString(),
		"allDay" : $("#allDayCheckBox").is(":checked"),
		"location" : $("#location_detail").val().toString(),
		"description" : $("#description_detail").text().toString(),
		"overrides" : overrides,
		"attendees" : attendees,
		"calendars" : $("#calendarList_detail").val().toString(),
		"eventId" : $("#eventId_detail").val().toString(),
		"calendarId" : $("#calendarId_detail").val().toString()
		};
	var reminderJSON={"method":"popup","minutes":10};
	
	var test = JSON.stringify(inputJSON);
	var obj = JSON.parse(test);
	console.log(test);
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url: baseUrl+"/updateEvent",
		type:'POST',
		data: test,
		contentType : "application/json; charset=UTF-8",
		success:function(data){
			if(data==true){
				history.pushState(data,"SimpleCalendar","http://localhost:8080/m/"+ $("#startDatePicker").val());
				console.log($(".pushCalendarBtn").attr('name'));
			}
		}
	});
	
	
}