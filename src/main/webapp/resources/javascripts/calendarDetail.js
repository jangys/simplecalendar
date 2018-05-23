

function loadCalendarDetail(){
	var path = location.href.split('/');
	var type = checkType(path[4]);
	var baseUrl = "http://"+location.href.split('/')[2];
	//ko.south_korea#holiday@group.v.calendar.google.com
	$("option [value='Asia/Seoul']").prop('selected',true);
	if($("#userId").text() == ""){
		var baseUrl = "http://"+location.href.split('/')[2];
		$.ajax({
			url:baseUrl+"/CalendarList",
			type:'GET',
			dataType :"json",
			success:function(calendar){
					printCalendarList(calendar);
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
					}else{
						$("#aclDiv_calendar").css('display','none');
					}
			}
		});//ajax-getCalendarList
	}else{
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
		}else{
			$("#aclDiv_calendar").css('display','none');
		}
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
	if(accessRole != "owner"){//owner이 아니면 캘린더 수정할 수 없음
		$("#btnSave_calendar").css('display','none');
		$("#aclDiv_calendar").css('display','none');
	}else{
		$("#btnSave_calendar").css('display','inline');
		$("#aclDiv_calendar").css('display','block');
		var baseUrl = "http://"+location.href.split('/')[2];
		var sendData = {
				"type":type
		};
		$.ajax({
			url:baseUrl+"/getACLList",
			data:sendData,
			type:'GET',
			success:function(acl){
				showACLList(acl);
			}
		});
	}
	if(data.defaultReminders != undefined){
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
	
	//캘린더 내보내기 링크
	var linkDiv = $("#exportCalendarLink_Div");
	console.log(linkDiv);
	
	var sendData = {
			"calendarId" : data.id,
			"calendarName" : data.summary,
			"timezone" : data.timeZone,
			"primary" : $("#userId").text()
	};
	var baseUrl = "http://"+location.href.split('/')[2];
	console.log(sendData);
	$.ajax({
		url:baseUrl+"/writeICSFile",
		data:sendData,
		type:'GET',
		success:function(input){
			console.log(input);
			linkDiv.css('display','');
			var id = data.id;
			id = id.replace("@","%40");
			var link = "";
			//"<a class='noUnderLine' href='"+"https://calendar.google.com/calendar/ical/"+id+"/public/basic.ics'>캘린더 내보내기</a>";
			link += "<a class='noUnderLine btn btn-info' style='color:white;' href='/downloadFile?path="+input+"'>캘린더 내보내기</a><br><br>";
			linkDiv.html(link);
		}
	});
}
function makeACLForm(id,role,value){
	var text = "";
	text += "<li class='aclLi_calendar' data-id='"+id+"' data-originalRole='"+role+"' data-role='"+role+"' data-value='"+value+"'><span class='detail_span'>"+value+"</span>";
	text += "<select class='roleSelect_calendar form-control' style='width:310px;margin-right:10px;' onchange='changeACLSelect(this);'>"
	text += "<option value='owner'>Owner-변경 및 공유 관리</option>";
	text += "<option value='writer'>Writer-일정 변경</option>";
	text += "<option value='reader'>Reader-모든 일정 세부정보 보기</option>";
	text += "<option value='freeBusyReader'>FreeBusyReader-한가함/바쁨 정보만 보기</option>";
	text +="</select>";
	if(value != $("#userId").text()){
		text +="<a href='#' class='noUnderLine' onclick='clickDeleteACL(this); return false;'>X</a>"
	}
	text += "</li>";
	return text;
}

//ACL list 보여주기
function showACLList(data){
	console.log(data);
	var size = data.length;
	var text = "";
	var calendarId = location.href.split('/')[4];
	for(var i=0;i<size;i++){
		text = "";
		if(data[i].scope.value.split("@")[1] == "group.calendar.google.com"){
			continue;
		}
		text = makeACLForm(data[i].id,data[i].role,data[i].scope.value);
		$("#aclList_calendar").append(text);
		$("option[value='"+data[i].role+"']").last().prop('selected',true);
		if(data[i].scope.value == $("#userId").text()){//사용자의 아이디에 대한 캘린더 권한 수정 막기
			$(".roleSelect_calendar").last().attr("disabled",true);
		}
		if(data[i].scope.value == calendarId){//캘린더 원래 주인
			$(".roleSelect_calendar").last().attr("disabled",true);
		}
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
//캘린더 공유 추가 눌렀을 시
function addACLRole_calendar(btn){
	var regExp = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	//if($(input).val().match(regExp)){
	var email = $(btn).prevAll().eq(2).val().toString();
	console.log(email);
	if(email.match(regExp)){
		var size = $("#aclList_calendar").children().length;
		for(var i=0;i<size;i++){
			if($("#aclList_calendar").children().eq(i).attr('data-value') == email){
				alert("이미 존재하는 사람입니다.");
				return;
			}
		}
		var role = $(btn).prev().val().toString();
		var path = location.href.split('/');
		var calendarId = checkType(path[4]);
		var data={
			"id":"add",
			"role":role,
			"calendarId":calendarId,
			"value":email
		};
		var baseUrl = "http://"+location.href.split('/')[2];
		$.ajax({
			url:baseUrl+"/addACLRule",
			data:data,
			type:'POST',
			success:function(data){
				var text = makeACLForm(data.id,data.role,data.scope.value);
				$("#aclList_calendar").append(text);
				$("option[value='"+data.role+"']").last().prop('selected',true);
			}
		});
	}else{
		alert('이메일 형식으로 입력해주세요.');
	}
}
//캘린더 ACL 삭제 누를 시
function clickDeleteACL(btn){
	var path = location.href.split('/');
	var calendarId = checkType(path[4]);
	var id = $(btn).parent().attr('data-id').toString();
	var data={
			"id":id,
			"calendarId":calendarId
	};
	var baseUrl = "http://"+location.href.split('/')[2];
	$.ajax({
		url:baseUrl+"/deleteACLRule",
		data:data,
		type:'GET',
		success:function(data){
			if(data=="true"){
				$(btn).parent().remove();
			}else{
				alert(data);
			}
		}
	});
	return false;	//클릭 새로고침 방지
}

function changeACLSelect(select){
	var role = $(select).val();
	var originalRole = $(select).parent().attr('data-role').toString();
	if(role != originalRole){
		var result = confirm("권한을 변경하시겠습니까?");
		if(result){
			$(select).attr('disabled',true);
			var id = $(select).parent().attr('data-id').toString();
			var path = location.href.split('/');
			var calendarId = checkType(path[4]);
			var data={
					"id":id,
					"calendarId":calendarId,
					"role":role
			};
			var baseUrl = "http://"+location.href.split('/')[2];
			$.ajax({
				url:baseUrl+"/updateACLRule",
				data:data,
				type:'POST',
				success:function(data){
					if(data=="true"){
						alert('수정이 완료되었습니다.');
						$(select).parent().attr('data-role',role);
						$(select).attr('disabled',false);
					}else{
						alert(data);
						$(select).attr('disabled',false);
					}
				}
			});
		}
	}
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
		var baseUrl = "http://"+location.href.split('/')[2];
		$.ajax({
			url: baseUrl+"/updateCalendar",
			type:'POST',
			data: data,
			contentType : "application/json; charset=UTF-8",
			success:function(data){
				if(data.indexOf("@") != -1){
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
	showOtherPage();
}
function showOtherPage(){
	var typeSplit =  location.href.split('/')[5].split('&');
	var type = typeSplit[0];
	var date =  typeSplit[1];
	var strDate =date.split("-");
	
	changeStyle(type);
	requestCalendar(strDate[0],strDate[1],strDate[2],false,type);
	//현재 페이지 초기화
	$("#container_CalendarDetail").html('');
}