

function loadCalendarDetail(){
	var path = location.href.split('/');
	var type = checkType(path[4]);
	var baseUrl = "http://localhost:8080";
	//ko.south_korea#holiday@group.v.calendar.google.com
	$("option [value='Asia/Seoul']").prop('selected',true);
	if(type != "add"){
		var data = {
				"type":type
		};
		$.ajax({
			url:baseUrl+"/getCalendar",
			data:data,
			type:'GET',
			success:function(data){
				showCalendarDetail(data);
			}
		});
	}
}

function showCalendarDetail(data){
	
	$("#summary_calendar").attr('data-originalvalue',data.summary);
	$("#summary_calendar").attr('value',data.summary);
	if(data.timeZone != undefined){
		$("#timezone_calendar").attr('data-originalvalue',data.timeZone);
		$("option[value='"+data.timeZone+"']").prop('selected',true);
	}
	if(data.description != undefined){
		$("#description_calendar").attr('data-originalvalue',data.description);
		$("#description_calendar").val(data.description);
	}
	var path = location.href.split('/');
	var type = checkType(path[4]);
	var accessRole = data.accessRole;
	$("#accessRole_calendar").text("이 캘린더에 대한 접근 권한은 "+accessRole+"입니다.");
	if(accessRole == "reader" || accessRole == "freeBusyReader"){
		$("#btnSave_calendar").css('display','none');
	}
	if(data.defaultReminders != null){
		$("#alarmList_calendar").css('display','block');
		var result = "";
		//function makeAlarmForm_detail(alarmIndex, method, minutes,allDay)
		$("#alarmList_calendar").attr('data-alarmnum',data.defaultReminders.length);
		for(var i=0;i<data.defaultReminders.length;i++){
			result += makeAlarmForm_detail(i, data.defaultReminders[i].method, data.defaultReminders[i].minutes,false);
		}
		$("#alarmList_calendar").html(result);
		$("#alarmList_calendar").attr('data-originalValue',JSON.stringify(data.reminders));
	}
}
//알람 추가 버튼 눌렀을 시
function addAlarm_calendar(){
	var alarmIndex = parseInt($("[data-alarmnum]").attr('data-alarmnum'));
	var text;
	if(alarmIndex > 5){
		return;
	}
	text = makeAlarmForm_detail(alarmIndex,"popup",10,false);
	$("#alarmList_calendar").css('display','block');
	$("#alarmList_calendar").append(text);
	$("[data-alarmnum]").attr('data-alarmnum',alarmIndex+1);
	
}
function submitInput_calendar(){
	var path = location.href.split('/');
	var type = checkType(path[4]);
	var blank_pattern = /^\s+|\s+$/g;
	
	if($("#summary_calendar").val().replace(blank_pattern,'') == ""){
		alert("캘린더의 제목을 입력해주세요.");
	}else{
		var overrides = new Array();
		var size = $("[data-alarmNum]").attr('data-alarmNum');
		console.log(size);
		for(var i=0;i<size;i++){
			var override = new Object();
			override.method = $("[name='overrides["+i+"].method']").val().toString();
			override.minutes = (parseInt($("[name='overrides["+i+"].minutes']").val()));
			overrides.push(override);
		}
		
		var inputJSON={
			"type":type,
			"summary":$("#summary_calendar").val().toString(),
			"description": $("#description_calendar").val().toString(),
			"timezone": $("#timezone_calendar").val().toString(),
			"defaultReminders":overrides
		}
		var data = JSON.stringify(inputJSON);
		var baseUrl = "http://localhost:8080";
		$.ajax({
			url: baseUrl+"/updateCalendar",
			type:'POST',
			data: data,
			contentType : "application/json; charset=UTF-8",
			success:function(data){
				if(data=="true"){
					$.ajax({
						url:baseUrl+"/CalendarList",
						type:'GET',
						dataType :"json",
						success:function(calendar){
								printCalendarList(calendar);
								showOtherPage();
						}
					});//ajax-getCalendarList
				}else{
					alert(data);
				}
			}
		});//ajax-updatecalendar
	}
}
function checkType(type){
	var result = type;
	if(type == "ko.south_korea"){
		result = "ko.south_korea#holiday@group.v.calendar.google.com";
	}
	if(type == "contacts"){
		result = "#contacts@group.v.calendar.google.com";
	}
	return result;
}
function clickCancel_calendar(){
	console.log("cancel");
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url:baseUrl+"/CalendarList",
		type:'GET',
		dataType :"json",
		success:function(calendar){
				printCalendarList(calendar);
				showOtherPage();
		}
	});//ajax-getCalendarList
}
function showOtherPage(){
	var typeSplit =  location.href.split('/')[5].split('&');
	var type = typeSplit[0];
	var date =  typeSplit[1];
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
	//현재 페이지 초기화
	$("#container_CalendarDetail").html('');
}