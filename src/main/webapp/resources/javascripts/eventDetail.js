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
			showRecurrenceList(date);
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
			var startDate = new Date(parseInt(strStartDate[0]),parseInt(strStartDate[1])-1,parseInt(strStartDate[2]),9);
			var endDate = new Date(parseInt(strEndDate[0]),parseInt(strEndDate[1])-1,parseInt(strEndDate[2]),9);
			showRecurrenceList(startDate);
			document.getElementById('startDatePicker').valueAsDate = startDate;
			document.getElementById('endDatePicker').valueAsDate = endDate;
			document.getElementById('startTimePicker').value = makeTimeForm(date.getHours(),0,0);
			document.getElementById('endTimePicker').value = makeTimeForm(date.getHours(),0,0);
		}
		
		$("#allDayCheckBox").attr('value',false);
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
						if(!getEvent){
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
	if(data.start.date != null){
		start = data.start.date.value;
		$("#allDayCheckBox").attr('checked',true);
		$("#allDayCheckBox").attr('value',true);
		$("#allDayCheckBox").attr('data-originalValue',true);
		resetTimePicker_detail();
	}else{
		start = data.start.dateTime.value;
		$("#allDayCheckBox").attr('data-originalValue',false);
		var d = new Date(data.start.dateTime.value);	
		var time = makeTimeForm(d.getHours(),d.getMinutes(),0);
		document.getElementById('startTimePicker').value = time;
		$("#startTimePicker").attr('data-originalValue',time);
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
	$("#startDatePicker").attr('data-originalValue',valueDate.getTime());
	$("#startDatePicker").attr('data-originalDateValue',start);
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
		$("#recurrenceList_detail").attr('data-originalValue',data.recurrence[0]);
		var option = $("#recurrenceList_detail").children();
		var isIn = false;
		for(var i=0;i<option.length;i++){
			if(option.eq(i).val() == data.recurrence[0]){
				option.eq(i).prop('selected',true);
				$("#recurrenceList_detail").attr('data-beforeSelect',data.recurrence[0]);
				isIn = true;
			}
		}
		if(!isIn){
			var temp = data.recurrence[0].split(':');
			var rrule = temp[1];
			var text = "<option value='RRULE:"+rrule+"' selected>"+covertRRULEInKorean(rrule,startDate.getMonth()+1,startDate.getDate())+"</option>";
			$("#recurrenceList_detail").attr('data-beforeSelect',data.recurrence[0]);
			$("#recurCustomOption").before(text);
		}
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
			text += makeAlarmForm_detail(i,defaultReminder[i].method,defaultReminder[i].minutes);
		}
		$("[data-alarmnum]").attr("data-alarmnum",size);
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
	return text;
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
	text += "<span class='detail_span'> 전</span>"
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
	var text = makeAlarmForm_detail(alarmIndex,"popup",10);
	var result = "";
	if(alarmIndex == 0){
		$("#alarmList").css('display','block');
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
function clickCancel_detail(){
	console.log("cancel");
	var typeStr = location.pathname.split('/')[4].split("&");
	var date =  $("#startDatePicker").val();
	var type = typeStr[0];
	var strDate =typeStr[1].split("-");
	switch(type){
	case 'd':
		break;
	case 'w':
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
	if(previous.recurrence != undefined && previous.recurrence[0] != input.recurrence){
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
	if(input.overrides.length == 2){
		if(input.overrides[0].method == "popup" && input.overrides[0].minutes == 30){
			if(input.overrides[1].method == "email" && input.overrides[1].minutes == 10){
				useDefault = true;
			}
		}
	}
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
	var recurrence = $("#recurrenceList_detail").val();
	console.log(recurrence);
	if(recurrence == "none"){
		recurrence = null;
	}
	//var originalStart = $("#startDatePicker").attr('data-originalDateValue')+new Date($("#startDatePicker").val()).getTime()-$("#startDatePicker").attr('data-originalValue');
	//var originalEnd = $("#endDatePicker").attr('data-originalDateValue')+new Date($("#endDatePicker").val()).getTime()-$("#endDatePicker").attr('data-originalValue');
	var originalStart = new Array();
	originalStart.push($("#startDatePicker").attr('data-originalDateValue'));
	originalStart.push($("#startDatePicker").attr('data-originalValue'));
	var originalEnd = new Array();
	originalEnd.push($("#endDatePicker").attr('data-originalDateValue'));
	originalEnd.push($("#endDatePicker").attr('data-originalValue'));
	
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
		if($("#startDatePicker").attr('data-originalvalue') != start.getTime()){
			$("[name='userType']:eq(1)").parent().css('display','none');
		}else{
			$("[name='userType']:eq(1)").parent().css('display','inline-block');
		}
		//반복 규칙이 바뀐 경우
		console.log($("#recurrenceList_detail").attr('data-originalvalue'));
		if($("#recurrenceList_detail").attr('data-originalvalue') != recurrence){
			$("[name='userType']:eq(0)").parent().css('display','none');
			$("[name='userType']:eq(1)").prop('checked',true);
		}else{
			$("[name='userType']:eq(0)").parent().css('display','inline-block');
		}
		if($("#recurrenceList_detail").attr('data-originalValue') != undefined){
			$("#recurUpdateDiv").css('display','block');
			$("#recurUpdateBtn_detail").click(function(){
				var updateTypeStr = $("[name='userType']:checked").val();
				var updateType = 0;
				switch(updateTypeStr){
				case "ONLYTHIS":
					updateType = 1;
					break;
				case "ALL":
					updateType = 2;
					break;
				case "NEXT":
					updateType = 3;
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
					break;
				case 'w':
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