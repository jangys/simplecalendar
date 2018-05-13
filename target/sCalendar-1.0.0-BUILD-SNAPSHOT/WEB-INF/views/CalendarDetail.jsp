<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
 <!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Simple Calendar</title>
</head>
<body>
	<div id="calendarDetailContents">
		<div id="calendarDetail_container">
			<span class='detail_span'>캘린더 제목</span><input id="summary_calendar" class="form-control calendarForm" type="text" name="summary"><br><br>
			<span class='detail_span'>캘린더 설명</span>
			<textarea id="description_calendar" class="form-control" rows="5" id="memo" style="display:block; width:84%;" name="description"></textarea> <br/><br>
			<span class='detail_span'>타임존 Timezone</span><select id="timezone_calendar" name="timezone" class="form-control" style="width:30%;">
			   <option value="Etc/GMT+12">(GMT-12:00) International Date Line West</option>
			   <option value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
			   <option value="Pacific/Honolulu">(GMT-10:00) Hawaii</option>
			   <option value="US/Alaska">(GMT-09:00) Alaska</option>
			   <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
			   <option value="America/Tijuana">(GMT-08:00) Tijuana, Baja California</option>
			   <option value="US/Arizona">(GMT-07:00) Arizona</option>
			   <option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
			   <option value="US/Mountain">(GMT-07:00) Mountain Time (US & Canada)</option>
			   <option value="America/Managua">(GMT-06:00) Central America</option>
			   <option value="US/Central">(GMT-06:00) Central Time (US & Canada)</option>
			   <option value="America/Mexico_City">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
			   <option value="Canada/Saskatchewan">(GMT-06:00) Saskatchewan</option>
			   <option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
			   <option value="US/Eastern">(GMT-05:00) Eastern Time (US & Canada)</option>
			   <option value="US/East-Indiana">(GMT-05:00) Indiana (East)</option>
			   <option value="Canada/Atlantic">(GMT-04:00) Atlantic Time (Canada)</option>
			   <option value="America/Caracas">(GMT-04:00) Caracas, La Paz</option>
			   <option value="America/Manaus">(GMT-04:00) Manaus</option>
			   <option value="America/Santiago">(GMT-04:00) Santiago</option>
			   <option value="Canada/Newfoundland">(GMT-03:30) Newfoundland</option>
			   <option value="America/Sao_Paulo">(GMT-03:00) Brasilia</option>
			   <option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires, Georgetown</option>
			   <option value="America/Godthab">(GMT-03:00) Greenland</option>
			   <option value="America/Montevideo">(GMT-03:00) Montevideo</option>
			   <option value="America/Noronha">(GMT-02:00) Mid-Atlantic</option>
			   <option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
			   <option value="Atlantic/Azores">(GMT-01:00) Azores</option>
			   <option value="Africa/Casablanca">(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
			   <option value="Etc/Greenwich">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
			   <option value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
			   <option value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
			   <option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
			   <option value="Europe/Sarajevo">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
			   <option value="Africa/Lagos">(GMT+01:00) West Central Africa</option>
			   <option value="Asia/Amman">(GMT+02:00) Amman</option>
			   <option value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</option>
			   <option value="Asia/Beirut">(GMT+02:00) Beirut</option>
			   <option value="Africa/Cairo">(GMT+02:00) Cairo</option>
			   <option value="Africa/Harare">(GMT+02:00) Harare, Pretoria</option>
			   <option value="Europe/Helsinki">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
			   <option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
			   <option value="Europe/Minsk">(GMT+02:00) Minsk</option>
			   <option value="Africa/Windhoek">(GMT+02:00) Windhoek</option>
			   <option value="Asia/Kuwait">(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
			   <option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
			   <option value="Africa/Nairobi">(GMT+03:00) Nairobi</option>
			   <option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</option>
			   <option value="Asia/Tehran">(GMT+03:30) Tehran</option>
			   <option value="Asia/Muscat">(GMT+04:00) Abu Dhabi, Muscat</option>
			   <option value="Asia/Baku">(GMT+04:00) Baku</option>
			   <option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
			   <option value="Asia/Kabul">(GMT+04:30) Kabul</option>
			   <option value="Asia/Yekaterinburg">(GMT+05:00) Yekaterinburg</option>
			   <option value="Asia/Karachi">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
			   <option value="Asia/Calcutta">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
			   <option value="Asia/Calcutta">(GMT+05:30) Sri Jayawardenapura</option>
			   <option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
			   <option value="Asia/Almaty">(GMT+06:00) Almaty, Novosibirsk</option>
			   <option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
			   <option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
			   <option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
			   <option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
			   <option value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
			   <option value="Asia/Kuala_Lumpur">(GMT+08:00) Kuala Lumpur, Singapore</option>
			   <option value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
			   <option value="Australia/Perth">(GMT+08:00) Perth</option>
			   <option value="Asia/Taipei">(GMT+08:00) Taipei</option>
			   <option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
			   <option value="Asia/Seoul" selected>(GMT+09:00) Seoul</option>
			   <option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
			   <option value="Australia/Adelaide">(GMT+09:30) Adelaide</option>
			   <option value="Australia/Darwin">(GMT+09:30) Darwin</option>
			   <option value="Australia/Brisbane">(GMT+10:00) Brisbane</option>
			   <option value="Australia/Canberra">(GMT+10:00) Canberra, Melbourne, Sydney</option>
			   <option value="Australia/Hobart">(GMT+10:00) Hobart</option>
			   <option value="Pacific/Guam">(GMT+10:00) Guam, Port Moresby</option>
			   <option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
			   <option value="Asia/Magadan">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
			   <option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
			   <option value="Pacific/Fiji">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
			   <option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
			</select>
			
			<br><br>
			<span class='detail_span'>기본 알람</span><ul id="alarmList_calendar" style="list-style: none; padding:0% 0%; display:none;" data-alarmNum="0"></ul>
			<button id="btnAddAlarm_calendar" class="btn btn-info" type="button" onclick="addAlarm_calendar();">알람 추가</button><br><br>
			<p id="accessRole_calendar"></p>
			<div id="aclDiv_calendar">
				<p>캘린더 공유 설정</p>
				<div style="vertical-align: top; margin-bottom:10px;">
					<span class='detail_span'>공유할 사람의 이메일</span><input type="text" class="form-control calendarForm" style="width:25%;">
					<span class="detail_span">공유 권한</span>
					<select id="aclSelect_calendar" class="form-control" style="width:310px;">
						<option value="owner">Owner-변경 및 공유 관리</option>
						<option value="writer">Writer-일정 변경</option>
						<option value="reader">Reader-모든 일정 세부정보 보기</option>
						<option value="freeBusyReader">FreeBusyReader-한가함/바쁨 정보만 보기</option>
					</select>
					<button type='button' class='btn btn-info' onclick="addACLRole_calendar(this);">추가</button>
				</div>
				<ul style="list-style: none;" id="aclList_calendar">
				</ul>
			</div>
			<br>
			<div  id='exportCalendarLink_Div' style='display:none;'>
			</div>
			<button id="btnSave_calendar" class="btn btn-info" type="button" name="save" value="true" onclick="submitInput_calendar();">저장</button>
			<button id="btnCancel_calendar" class="btn btn-info" type="button" onclick="clickCancel_calendar();">취소</button>
		</div>
	</div>
</body>
</html>