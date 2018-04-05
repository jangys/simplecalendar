<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
<!DOCTYPE>
<html>
<head>
<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="/bootstrap/css/bootstrap.css" >
<script src="/bootstrap/js/bootstrap.min.js"></script>
<script src="/javascripts/monthlyCalendar.js" charset="utf-8"></script>
<script src="/javascripts/sideBar.js" charset="utf-8"></script>
<script src="/javascripts/commonContents.js" charset="utf-8"></script>

<title>Simple Calendar</title>

<style type="text/css">
	@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
	html, body{
		height:100%;
		font-family: Nanum Gothic;
		
	}
	table{
		width:100%;
		border: 1px solid #9EBEC4;
		border-collapse: collapse;
	}
	th{
		border: 1px solid #9EBEC4;
	}
	th{
		text-align: left;
	}
	td{
	
		width:14.2%;
		height:12.5%;
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
	a{
		color:white;
		
	}
	li{
		overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
	}
	/*제목 부분*/
	#title{
		padding-left: 3%;
		padding-top: 1%;
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
		width:100%;
		height:85%;
	}
	/*일별 캘린더*/
	#dayCalendar{
		display:none;
		width:100%;
		height:85%;
		border:1px solid black;
	}
	/*주별 캘린더*/
	#weekCalendar{
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
		border:1px solid black;
	}
	/*날짜 한 칸*/
	.date{
		vertical-align: top;
		height:12.5%;
		border-left: 1px solid #9EBEC4;
		border-right: 1px solid #9EBEC4;
	}
	/*스켸쥴 표*/
	#dates{
		height:100%;
	}
	/*날짜 한 줄*/
	.dateLine{
	}

	/*YYYY년 MM월*/
	#calendarTitle{
		display: inline;
		font-weight: bold;
		font-size: 20px;
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
		border-left: 1px solid #9EBEC4;
		border-right: 1px solid #9EBEC4;
	}
	/*일정 표*/
	.eventList{
		border-collapse: separate;
		border: none;
	}
	/*사이드*/
	#side{
		padding-top : 3%;
		padding-left : 2%;
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
		min-width: 930px;
	/*
		margin: 2% 5%;
		height: 85%;
		width: 80%;
		float:left;
		layout:fixed;
		*/
	}
	/*일정 요약 보여주는 작은 창*/
	#showEventSummary{
		position : absolute;
		width : 450px;
		height : 250px;
		top : 30%;
		left : 30%;
		background-color: white;
		padding : 1% 1%;
		z-index: 2;
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
		z-index: 1;
		display:none;
		flex-wrap:nowrap
	}
	/*일정 요약 header*/
	#eventSummary_Header{
		width:100%;
		height:15%;
		margin: 0% 0%;
	}
	/*일정 요약 contents*/
	#eventSummary_Contents{
		width:100%;
		height:70%;
	}
	/*일정 요약 footer*/
	#eventSummary_Footer{
		width:100%;
		height:15%;
		text-align: center;
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
</style>
</head>

<body>
<div id = "header" class = "row" style="min-width: 930px;flex-wrap: nowrap;">
	<div id="title" class = "col-sm-3">
	</div>
	<div id = "btnList" class = "col-sm-5">
		<button class = 'btn btn-info' id = 'dayBtn' type='button' value='day' name='date'>일</button>
		<button class = 'btn btn-info' id = 'weekBtn' type='button' value='week' name='week'>주</button>
		<button class = 'btn btn-info pushCalendarBtn' id = 'monthBtn' type='button' value='month' name='month'>월</button>
		<button class = 'btn btn-info' id = 'listBtn' type='button' value='list' name='list'>목록</button>
	</div>
</div>
<div id = "contents" class = "row" style="flex-wrap: nowrap;">
	<div id = "side" class = "col-sm-2 form-horizontal">
		<form>
			<div id = "checkboxList">
			</div>
		</form>
		<br><br>
		<form action="http://localhost:8080/showAddEventPage" method="get">
			<button class='btn btn-info' id='addBtn' type='submit'>일정 추가</button> 
		</form>
	</div>
	<div id="container" class = "col-sm-10">
		<div id="monthCalendar">
			<table id="week">
				<tr id="dayLine">
					<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
				</tr>
			</table>
			<div id="dates">
			</div>
		</div>
		<div id="dayCalendar">
		</div>
		<div id="weekCalendar">
		</div>
		<div id="listCalendar">
		</div>
		<div id="showEventSummary" style="border: 1px solid black">
			<div class = "row" id="eventSummary_Header">
				<div class = "col-sm-8" id="eventSummary_CalTitle"></div>
				<div class="col-sm-4" style="text-align: right; padding: 0% 0%;">
					<button class='btn btn-info' type='button' value='closeEventSummary' name='close' onclick="clickCloseEventSummary()">X</button>
				</div>
			</div>
			<div id="eventSummary_Contents"></div>
			<div id="eventSummary_Footer">
				<button id='btnDeleteEvent'class='btn btn-info' type='button' value='deleteEvent' name='delete' onclick="clickDeleteEvent(this)"  style="display: none;">삭제</button>
				<form id ='showEvent_Form'action="http://localhost:8080/showEventPage" method="GET">
					<button id='btnShowEvent' class='btn btn-info' type='submit' style="display: none;">상세보기</button>
				</form>
			</div>
		</div>
		<div id="showMoreEventDiv" style="border: 1px solid black;">
				<span id="showMoreEvent_Title"></span><button type='button' value='closeMoreEvent' name='close' onclick="clickCloseMoreEvent()" style="font-size: 12px;">X</button>
			<div id="showMoreEvent_Contents" style="overflow-y: scroll;height:89%;text-align:left;">
				<ul id="moreEventList" style="list-style: none;padding:0% 0%;">
				</ul>
			</div>
		</div>
	</div>
</div>

</div>
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
</script>
</body>
</html>