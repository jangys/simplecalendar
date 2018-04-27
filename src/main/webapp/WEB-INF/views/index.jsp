<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
 <!DOCTYPE>
<html>
<head>
<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="/bootstrap/css/bootstrap.css" >
<link rel="stylesheet" href="/css/EventDetail_style.css" >
<link rel="stylesheet" href="/css/CalendarDetail_style.css" >

<script src="/bootstrap/js/bootstrap.min.js"></script>
<script src="/javascripts/monthlyCalendar.js" charset="utf-8"></script>
<script src="/javascripts/sideBar.js" charset="utf-8"></script>
<script src="/javascripts/commonContents.js" charset="utf-8"></script>
<script src="/javascripts/listCalendar.js" charset="utf-8"></script>
<script src="/javascripts/convertRRULE.js" charset="utf-8"></script>
<script src="/javascripts/eventDetail.js" charset="utf-8"></script>
<script src="/javascripts/calendarDetail.js" charset="utf-8"></script>
<script src="/javascripts/weeklyCalendar.js" charset="utf-8"></script>

<title>Simple Calendar</title>

<style type="text/css">
	@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
	html, body{
		height:100%;
		margin:0;
		font-family: Nanum Gothic;
	}
	table{
		width:100%;
		border-bottom: 1px solid #9EBEC4;
	}
	th{
	/*
		border-top: 1px solid #9EBEC4;
		border-left: 1px solid #9EBEC4;
		border-right: 1px solid #9EBEC4;
		*/
		text-align: left;
	}
	td{
		width:14.2%;
		padding:0px;
	}
	form{
		display: inline;
		margin: 0 auto;
	}
	button{
		background-color: white;
		border: 1px solid white;
		font-weight: bold;
		font-size:20px;
	}
	li{
		overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
	}
	p{
		margin:0 0;
	}
	/*제목 부분*/
	#title{
		padding-left: 3%;
		padding-top: 1%;
		min-width: 540px;
	}
	/*일, 주, 월, 목록 선택하는 버튼 div*/
	#btnList{
		padding-top: 1%;
	}
	/*요일 표*/
	#week{
		width:100%;
		height:3%;
	}
	/*요일 줄*/
	#dayLine{
		background-color:#C2E2E8;
		height:100%;		
	}
	/*월별 캘린더 표*/
	#monthCalendar{
		/*margin: 25px auto;*/
		position:relative;
		width:100%;
		height:100%;
		display:none;
	}
	/*일별 캘린더*/
	#dayCalendar{
		display:none;
		width:100%;
		height:85%;
		border:1px solid black;
	}
	/*목록 캘린더*/
	#listCalendar{
		display:none;
		width:100%;
		height:85%;
		overflow:hidden;
		overflow-y:scroll;
	}
	/*날짜 한 칸*/
	.date{
		vertical-align: top;
		height:12.5%;
	}
	/*스켸쥴 표*/
	#dates{
		height:97%;
	}
	/*날짜 한 줄*/
	.dateLine{
		position:relative;
	}

	/*YYYY년 MM월*/
	#calendarTitle{
		display: inline;
		font-weight: bold;
		font-size: 20px;
	}
	/*링크 기본 색 검은색*/
	.noUnderLine{
		color: black;
	}
	/*링크 마우스 올릴 시 밑줄 없애기*/
	.noUnderLine:hover{
		text-decoration: none;
		color: #c3c3c3;
	}
	
	
	/*일정 한 칸*/
	.event{
	/*
		background-color:#918EDB;
		font-weight: bold;
		color: white;
		border: 1px solid #918EDB;
		*/
		height:12.5%;

		position:relative;
		z-index:1;
		border-left: 1px solid #c3c3c3;
		border-right: 1px solid #c3c3c3;
	}
	/*날짜 부분*/
	.date{
		position:relative;
		z-index:1;
		border-left: 1px solid #c3c3c3;
		border-right: 1px solid #c3c3c3;
	}
	/*일정이 들어간 칸*/
	.eventFill{
		height:12.5%;
		position:relative;
		z-index:4;
		padding-left: 0.5px;
		padding-right: 0.5px;
		padding-top:0px;
		padding-bottom:0px;
		border-left: 1px solid #c3c3c3;
		border-right: 1px solid #c3c3c3;
	}
	/*일정 표*/
	.eventList{
		border-collapse: separate;
		border: none;
	}
	/*일정 날짜 큰 칸*/
	.dateIndexTd{
		
	}
	/*사이드*/
	#side{
		padding-top : 3%;
		padding-left : 2%;
		width:20%;
		display:inline-block;
		vertical-align:top;
		min-width: 270px;
	/*
		margin: auto 1%;
		width:5%;
		border: 1px solid #918EDB;
		float:left;
		layout:fixed;
		*/
	}
	/*달력 제목 체크박스 리스트*/
	#checkboxList{
		width:100%;
	}
	/*본문*/ 
	#container{
		padding : 1% 1%;
		position : relative;
		min-width: 920px;
		min-height: 246px;
		width:75%;
		display:inline-block;
	/*
		margin: 2% 5%;
		height: 85%;
		width: 80%;
		float:left;
		layout:fixed;
		*/
	}
	/*일정 상세페이지 본문*/
	#container_EventDetail{
		padding : 1% 1%;
		width:100%;
		position: relative;
		z-index: 1;
	}
	/*일정 요약 보여주는 작은 창*/
	#showEventSummary{
		position : absolute;
		width : 450px;
		height : 200px;
		top : 30%;
		left : 30%;
		background-color: white;
		padding : 1% 1%;
		z-index: 10;
		display: none;
	}
	/*일정 더보기 작은 창*/
	#showMoreEventDiv{
		position : absolute;
		width : 200px;
		height : 200px;
		top : 30%;
		left : 30%;
		background-color: white;
		padding : 1% 1%;
		text-align:right;
		z-index: 9;
		display:none;
		flex-wrap:nowrap
	}
	/*일정 요약 header*/
	#eventSummary_Header{
		width:100%;
		height:20%;
		margin: 0% 0%;
	}
	/*일정 요약 contents*/
	#eventSummary_Contents{
		width: 93%;
		height:60%;
		margin: 0 auto;
	}
	/*일정 요약 contents안 p*/
	.eventSummaryContents_p{
		margin-bottom : 3px;	
	}
	/*일정 요약 contents안 span(정보 제목)*/
	.eventSummaryContents_span{
		color: #5c5c5c;
		margin-right : 15px;
	}
	/*일정 요약 footer*/
	#eventSummary_Footer{
		width:100%;
		height:20%;
		text-align: center;
		
	}
	/*참석자 목록 보여주는 창*/
	#showAttendeesList{
		width:300px;
		height:140px;
		border: 1px solid #c3c3c3;
		position:absolute;
		background-color: white;
		top:30%;
		z-index:11;
		display:none;
	}
	/*오늘 날짜 표시*/
	.today{
		background-color: #FFE08C;
	}
	/*날짜와 일정*/
	.scheduleList{
		height:100%;
		table-layout: fixed;
	}
	/*날짜 전체 칸*/
	.dayList{
		height:100%;
		table-layout: fixed;
		position:absolute;
		top:0;
		left:0;
		z-index:2;
		border:none;
	}
	/*일정 한 줄*/
	.dateLineTr{
		padding : 0px;
	}
	/*4주일때*/
	.week4{
		height:25%;
	}
	/*5주일때*/
	.week5{
		height:20%;
	}
	/*6주일때*/
	.week6{
		height:16.6%;
	}
	/*side쪽 미니 캘린더 날짜 한 칸 span*/
	.miniCalendar_Date{
		width:14.1%;
		display:inline-block;
	}
	/*side쪽 미니 캘린더 오늘 날짜 표시*/
	.miniCalendar_today{
		color:white;
		width:25px;
		height:25px;
		-webkit-border-radius:12.5px;
		-moz-border-radius:12.5px;
		background-color:#97D7E5	!important;
		font-weight:bold;
	}
	/*side쪽 미니 캘린더 클릭 날짜 표시*/
	.miniCalendar_clickDate{
		width:25px;
		height:25px;
		-webkit-border-radius:12.5px;
		-moz-border-radius:12.5px;
		background-color:#c3c3c3;
	}
	/*캘린더 버튼 눌렀을 시*/
	.pushCalendarBtn{
		background-color:black;
	}
	/*일정 시간 부분*/
	.eventTime{
		display:inline;
	}
	/*일정 제목 링크 부분*/
	.eventTitleLink{
		overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
		height:95%;
		margin-left:2px;
		margin-right:2px;
		cursor: pointer;
	}
	/*일정 더보기 링크 부분*/
	.moreEvent{
		color:black;
		text-align: right;
	}
	/*일정 요약 보여주는 작은 창에 있는 태그 p*/
	.eventSummaryContents_p{
		overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
	}
	/*날짜 칸 눌렀을때*/
	.clickDate{
		background-color: #EAEAEA;
		opacity: 0.5;
		cursor: default;
	}
	/*더보기 링크가 있는 칸*/
	.moreEvent{
		position: relative;
		z-index:4;
	}
	/*이벤트 요약 정보에서 반복 일정 정보*/
	#eventSummaryRecurrence{
		font-size: small;
	}	
	/*체크박스 모양 만들기*/
	.checkboxDiv{
		width:20px;
		height: 20px;
		display:inline-block;
		text-align: center;
		margin-right: 5px;
	}
	
	/*List Calendar*/
	/*일정 들어가는 한 날짜(여러줄)*/
	.listRowGroup{
		border-bottom: 1px solid #c3c3c3;
	}
	/*일정 한 줄*/
	.listRow{
		width:100%;
		margin-top:10px;
		margin-bottom:10px;
	}
	/*일정 날짜*/
	.listDate{
		display: inline-block;
		width:100px;
		margint-right:10px;
	}
	/*일정 캘린더 색*/
	.listCalendar{
		display: inline-block;
		width:20px;
		margin-right:10px;
	}
	/*원*/
	.calendarCircle{
		width:10px;
		height:10px;
		-webkit-border-radius:5px;
		-moz-border-radius:5px;
	}
	/*일정 시간*/
	.listTime{
		display:inline-block;
		width:185px;
		margin-right:10px;
	}
	/*일정 제목*/
	.listSummary{
		display:inline-block;
		width:60%;
	}
	
	/*반복 일정 수정 완료 시 나오는 창*/
	#recurUpdateDiv{
		position:absolute;
		top:30%;
		left:35%;
		border: 1px solid #c3c3c3;
		background-color:white;
		z-index: 11;
		width: 350px;
		height : 200px;
		display: none;
	}
	
	/*일별,주별 캘린더 이름은 주별 기준*/
	/*주별 캘린더 큰 틀*/
	#weekCalendar{
		display:none;
		width:100%;
		height:970px;
	}
	/*주별,일별 캘린더 헤더 부분*/
	#header_weekly{
		width:100%;
	}
	/*주별 캘린더 시간 일정들 큰 부분*/
	#container_weekly{
		width:100%;
		height: 776px;	/*height 970*0.8 추후 종일 일정 사이즈 따라 변경됨*/
		border:1px solid #c3c3c3;
		overflow:hidden;
		overflow-y:scroll;
	}
	/*주별 캘린더 시간 일정틀 부분*/
	#contents_weekly{
		width:93%;
		height:1000px;
		position:relative;
		float:left;
	}
	/*주별 캘린더 날짜 부분*/
	#title_weekly{
		width:91.6%;
		height:65px;
		float:left;
		display: inline-block;
	}
	/*주별 캘린더 종일 일정 부분*/
	#allDay_weekly{
		width:93%;
		height:129px;
		position:relative;
		float:left;
		display: inline-block;
		overflow:hidden;
		overflow-y:scroll;
	}
	/*주별 캘린도 일 부분*/
	.dateP_weekly{
		font-weight:bold;
		font-size: 22px;
		margin-bottom:5px;
	}
	/*주별 캘린더 요일 부분*/
	.dayP_weekly{
		font-size:16px;
	}
	/*주별 캘린더 칸 나누기 위한 표*/
	.table_weekly{
		border-collapse:collapse;
		border:none;
		height:100%;
		width:100%;
		table-layout: fixed;
	}
	/*주별 캘린더 본문 중 side-시간, 종일 표시*/
	.sideDiv_weekly{
		float:left;
		border-bottom:1px solid #c3c3c3;
		border-left:1px solid #c3c3c3;
		width:7%;
		text-align:right;
		padding-top:5px;
		padding-right:5px;
		display:none;
	}
	/*주별 캘린더 종일 일정 표*/
	#alldayTable_weekly{
		height:98%;
	}
</style>
</head>

<body>
<div id = "header" class = "row" style="min-width: 930px;flex-wrap: nowrap; width:90%;margin-left:0; diplay:none;">
	<div id="title" class = "col-sm-3">
	</div>
	<div id = "btnList" class = "col-sm-5">
		<button class = 'btn btn-info' id = 'dayBtn' type='button' value='day' name='date'>일</button>
		<button class = 'btn btn-info' id = 'weekBtn' type='button' value='week' name='week'>주</button>
		<button class = 'btn btn-info' id = 'monthBtn' type='button' value='month' name='month'>월</button>
		<button class = 'btn btn-info' id = 'listBtn' type='button' value='list' name='list'>목록</button>
	</div>
</div>
<div id = "contents"  style="width:100%; min-width: 1200px; height:90%;">
	<div id = "side" class = "form-horizontal">
		<div id="miniCalendar" style="width:100%;height:242px; border:1px solid #c3c3c3; margin-bottom:15px;">
			<div id="miniCalendar_Header" style="width:100%; height:15%; text-align:center; padding-top:2%;">
				<a href="#" class="noUnderLine" onclick="clickMiniCalendarNextBtn(false); return false;">&lt;</a>
				<span style="margin:0 1%;"></span>
				<a href="#" class="noUnderLine" onclick="clickMiniCalendarNextBtn(true); return false;">&gt;</a>
			</div>
			<div id="miniCalendar_Contents"style="width:100%; height:85%;">
			</div>
		</div>
		<form>
			<div id = "checkboxList">
			</div>
		</form>
		<br>
		<button class='btn btn-info' type='button' style="margin-bottom: 10px;" onclick="goToCalendarPage('add');">캘린더 추가</button>
		<br>
			<input type="text" id="addEventDate" style="display: none;" name="addEventDate">
			<button class='btn btn-info' id='addBtn' type='button' name='addBtn' value='0' onclick="$('#addEventDate').attr('value',0); goToEventPage('add');">일정 추가</button>
			 
	</div>
	<div id="container" style="height:100%;">
		<div id="monthCalendar" data-colnum='0'>
			<table id="week">
				<tr id="dayLine">
					<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
				</tr>
			</table>
			<div id="dates" onselectstart="return false">
			</div>
		</div>
		<div id="weekCalendar">
			<div id="header_weekly">
				<div style="margin: 0 0;">
					<div class='sideDiv_weekly' style='border-top:1px solid #c3c3c3; height:65px;'><span>날짜</span></div>
					<div id="title_weekly">
					</div>
				</div>
				<div>
					<div class='sideDiv_weekly' style='height:129px;position:relative;'><span>종일</span>
						<a id='moreAllDay_weekly' style='position:absolute;top:80%;right:10%;' href='#' class='noUnderLine' onclick='clickMoreAllDay_weekly(this); return false;'>∧</a>
					</div>
					<div id="allDay_weekly">
					</div>
				</div>
			</div>
			<div id="container_weekly">
				<div>
					<div class='sideDiv_weekly' style='border-right:1px solid #c3c3c3; border-bottom:none; border-left:none; border-top:none; height:1000px;'><p>시간</p></div>
					<div id="contents_weekly">
					</div>
				</div>
			</div>
		</div>
		<div id="dayCalendar">
		</div>
		<div id="listCalendar">
			<div id="listCalendar_Contents" style="border-top:1px solid #c3c3c3;">
			</div>
		</div>
		<div id="showEventSummary" style="border: 1px solid #c3c3c3">
			<div class = "row" id="eventSummary_Header">
				<div class = "col-sm-8" id="eventSummary_CalTitle"></div>
				<div class="col-sm-4" style="text-align: right; padding: 0% 0%;">
					<button class='btn btn-info' type='button' value='closeEventSummary' name='close' onclick="clickCloseEventSummary()">X</button>
				</div>
			</div>
			<div id="eventSummary_Contents"></div>
			<div id="eventSummary_Footer">
				<button id='btnDeleteEvent'class='btn btn-info' type='button' value='deleteEvent' name='delete' onclick="clickDeleteEvent(this)"  style="display: none; height:95%; line-height: 5px;">삭제</button>
					<button id='btnShowEvent' class='btn btn-info' type='button' style="display: none; height:95%; line-height: 5px;" onclick="goToEventPage('show');">상세보기</button>
			</div>
		</div>
		<div id="showAttendeesList">
			<div style="width:95%; height:15%; text-align:right; margin:auto;">
				<a href="#" class="noUnderLine" onclick="$('#showAttendeesList').css('display','none'); return false;">X</a>
			</div>
			<div id="attendeesList_Contentes" style="overflow-y:scroll; height:72%; width:95%; margin:auto; margin-bottom:8px; margin-top:8px;">
				<ul id="attendeesList" style="list-style:none;padding:0% 0%;">
				</ul>
			</div>
		</div>
		<div id="showMoreEventDiv" style="border: 1px solid #c3c3c3;">
				<span id="showMoreEvent_Title"></span><button type='button' value='closeMoreEvent' name='close' onclick="clickCloseMoreEvent()" style="font-size: 12px;">X</button>
			<div id="showMoreEvent_Contents" style="overflow-y: scroll;height:89%;text-align:left;">
				<ul id="moreEventList" style="list-style: none;padding:0% 0%;">
				</ul>
			</div>
		</div>
		<div id="recurUpdateDiv">
			<div style="width:100%; height:22.5%; text-align:right; padding:1%; ">
				<button type='button' class="btn btn-info" onclick="$('#recurUpdateDiv').css('display','none');">X</button>
			</div>
			<div style="width:100%; height:55%; text-align:left; padding: 3%;">
				<form>
					<label><input type="radio" name="userType" checked="checked" value="ONLYTHIS">이 일정만 삭제</label><br>
					<label><input type="radio" name="userType" value="ALL">모든 반복 일정들 삭제</label><br>
					<label><input type="radio" name="userType" value="NEXT">이 일정과 향후 반복 일정들 삭제</label>
				</form>
			</div>
			<div style="width:100%; height:22.5%; text-align:center; padding-bottom:1%;">
				<button type='button' class="btn btn-info" id='recurDeleteBtn' onclick="clickDeleteRecurrenceEvent();">확인</button>
				<button type='button' class="btn btn-info" style='margin-left:5px;' onclick="$('#recurUpdateDiv').css('display','none');">취소</button>
			</div>
		</div>
	</div>
	<div id="container_EventDetail" style="">
	</div>
	<div id="container_CalendarDetail"></div>
</div>
<p style="display:none;" id='userId'></p>
<script type="text/javascript">
	function clickCloseMoreEvent(){
		$('#moreEventList').html('');
		$("#showMoreEvent_Contents").scrollTop(0);
		$('#showMoreEventDiv').css('display','none');
	}
	function clickCloseEventSummary(){
		$('#showEventSummary').css('display','none');
		$('#btnShowEvent').css('display','none');
		$('#btnDeleteEvent').css('display','none');
		$('#eventSummary_Contents').html('');
	}
	function goToEventPage(type){
		$.ajax({
			url: "http://localhost:8080/showEventPage",
			dataType: "text",
			success: function(data){
				changeStyle("event",data);
				var calendarId;
				var eventId;
				var path = location.pathname.split('/');
				var url ="http://localhost:8080/event/";
				switch(type){
					case "add":
						calendarId = $("#addEventDate").attr('value');
						eventId = "addEvent";
						 url += calendarId+"/"+eventId+"/"+path[1]+"&"+path[2];
						break;
					case "show":
						calendarId = $("#btnDeleteEvent").attr("data-calendarid");
						eventId = $("#btnDeleteEvent").attr("data-eventid");
						url += calendarId+"/"+eventId+"/"+path[1]+"&"+path[2];
						if($("#eventSummaryRecurrence").length == 1){//상세보기일때만! 일정 요약창 내용 안지워서 반복 남아 있을 수 있음
							url += "&"+$(".eventSummaryContents_p:eq(1)").attr('data-startdate')+"&"+$(".eventSummaryContents_p:eq(1)").attr('data-enddate');
						}
						break;
				}
				history.pushState(data,"Simple Calendar-Add/Update Event",url);
				loadEventDetail();
			}
		});
	}
</script>
<div style='display:none;'>Icons made by <a href="https://www.flaticon.com/authors/tutsplus" title="TutsPlus">TutsPlus</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
</body>
</html>