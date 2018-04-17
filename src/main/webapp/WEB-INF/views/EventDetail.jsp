<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Simple Calendar</title>
</head>
<div id="container_ShowEventDetail">
	<h4 id="eventDateTitle"></h4>
	<div id="contents_detail">
			<span class='detail_span'>제목</span><input id="summary_detail" class="form-control" type="text" name="summary"><br><br>
			<span class='detail_span'>일시</span>
				<input id="startDatePicker" class="form-control datePick_detail" type="date" name="startDate" required onblur="checkDate_detail();">
				 <input id="startTimePicker" class="form-control timePick_detail" type="time" name="startDateTime" onclick="resetTimePicker_detail();" onblur="checkTime_detail();">
				<span> - </span>
				<input id="endDatePicker" class="form-control datePick_detail" type="date" name="endDate" required onblur="checkDate_detail();">
				 <input id="endTimePicker" class="form-control timePick_detail" type="time" name="endDateTime" onclick="resetTimePicker_detail();"  onblur="checkTime_detail();">
			 <label><input id="allDayCheckBox" type='checkbox' name="allDay" onclick="resetTimePicker_detail();"> 종일</label>
			 <br/><br/>
			 <span class='detail_span'>반복</span>
			 <select id="recurrenceList_detail" class="form-control" style="width:160px;">
			 	<option data-rrule="none">없음</option>
			 </select>
			 <br/><br/>
			<span class='detail_span'>장소</span><input id="location_detail" class="form-control" type="text" name="location" ><br/><br>
			<span class='detail_span'>메모</span><textarea id="description_detail" class="form-control" rows="5" id="memo" style="display:block; width:84%;" name="description"></textarea> <br/><br>
			<span class='detail_span'>알람</span><ul id="alarmList" style="list-style: none; padding:0% 0%; display:none;" data-alarmNum="0"></ul>
			<button id="btnAddAlarm" class="btn btn-info" type="button" onclick="addAlarm_detail()">알람 추가</button><br><br>
			<span class='detail_span'>캘린더</span><select class="form-control" id="calendarList_detail" name="calendars" onchange="changeCalendarList_detail(this);"></select><br><br>
			<span>초기 생성자 : </span><span id="creator_detail"></span><br><br>
			<span id="isOrganizerCalendar"></span><br>
			<span class='detail_span'>참석자</span><input id="attendee" class="form-fontrol" type="email" onkeypress="addAttendee_detail(this);" >
			<span id="attendeesDiv_detail">
				<span style="margin-left:10%;">내 참석 여부 </span>
				<select id="responseList" class="form-control" style="display:inline; width:135px;" onchange="changeMyResponseStatus_detail(this);">
					<option value="accepted">수락</option>
					<option value="declined">거절</option>
					<option value="tentative">미정</option>
					<option value="needsAction">대기</option>
				</select>
			</span>
			<br>
			<ul id="attendeeList" style="list-style:none; padding: 0% 0%; " data-attNum="0">
				</ul>
			<input id="calendarId_detail" type="text" style="display:none;" name="calendarId">
			<input id="eventId_detail" type="text" style="display:none;" name="eventId">
			<br/>
			<button id="btnSave_detail" class="btn btn-info" type="button" name="save" value="true" onclick="submitInput_detail();">저장</button>
			<button id="btnCancel_detail" class="btn btn-info" type="button" onclick="clickCancel_detail();">취소</button>
	</div>
</div>
</body>

</html>