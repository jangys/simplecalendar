<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Simple Calendar</title>

<style type="text/css">
	html, body{
		height:100%;
		
	}
	table{
		width:100%;
		border: 1px solid #9EBEC4;
		border-collapse: collapse;
	}
	th,td{
		border: 1px solid #9EBEC4;
	}
	td{
		width:14.2%;
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
	/*요일 줄*/
	#dayLine{
		background-color:#C2E2E8;
		height:3%;		
	}
	/*월별 캘린더 표*/
	#monthlyCalendar{
		margin: 25px auto;
		height:80%;		
	}
	/*날짜 한 칸*/
	.date{
		vertical-align: top;
	}
	/*날짜 한 줄*/
	.dateLine{
		height:13%;
	}
	/*YYYY년 MM월*/
	#calendarTitle{
		display: inline;
		font-weight: bold;
		font-size: 20px;
	}
	/*일정 한 칸*/
	.event{
		background-color:#918EDB;
		font-weight: bold;
		color: white;
		border: 1px solid #918EDB;
	}
	/*일정 표*/
	.eventList{
		border-collapse: separate;
		border: none;
	}
	/*본문*/
	#container{
		margin: 2% 5%;
		height: 100%;
	}
</style>
</head>

<body>
<div id="container">
	<form action="sCalendar" method="get">
		
		<script type="text/javascript">
			var now = new Date();
			var y = now.getFullYear();
			var m = now.getMonth()+1;
			//년, 월, 버튼 출력
			document.write("<button type='submit' value='"+m+"' name='back'> ← </button>");
			document.write("<div id='calendarTitle' style='text-align : center;'>  "+y+"년 "+m+"월"+"  </div>");
			document.write("<button type='submit' value='"+m+"' name='forward'> → </button>");
		</script>
		
	</form>
	
	<script type="text/javascript">
	//달력 출력
	function printCalendar(y, m) {    
	   var now = new Date();
	   var year = now.getFullYear();
	   var month = now.getMonth();
	   var date = now.getDate();	//현재 날짜
	
	   y = (y != undefined)? y:year;
	   m = (m != undefined)? m:month;
	   
	   var startDate = new Date(y,m,1);
	   var startDay = startDate.getDay();	//시작 요일
	   
		var lastDate = 31;
		
		m++;
		
		//마지막 날짜 계산
		if((m%2 == 0 && m<= 6) || (m%2 == 1 && m>=9)){
			lastDate = 30;
		}
		
		if(m==2 && y%4 == 0 && y%100 != 0 || y%400 == 0){
			lastDate = 29;
		}else if(m == 2){
			lastDate = 28;
		}
	   
		var row = Math.ceil((startDay+lastDate)/7);
		
		var table = "<table id='monthlyCalendar'>"+"<tr id='dayLine'>";
		table+="<th>일</th>";
		table+="<th>월</th>";
		table+="<th>화</th>";
		table+="<th>수</th>";
		table+="<th>목</th>";
		table+="<th>금</th>";
		table+="<th>토</th>";
		table+="</tr>";
		var dateNum = 1;
		
		var eventDateList = new Array();		//일정 있는 날짜 배열
		var eventSummaryList = new Array();		//일정 제목 배열
		
		<c:forEach items="${eventDate}" var="event">
			eventDateList.push("${event}");
		</c:forEach>
		<c:forEach items="${eventSummary}" var="summary">
			eventSummaryList.push("${summary}");
		</c:forEach>
		
		var eventNum = 0;
		var size = eventDateList.length;
		
		//달력그리기
		for(var i = 1; i<=row;i++){
			table+="<tr class='dateLine'>";
			if(i==1){// 첫번째 줄 앞에 비어있을 수 있기 때문
				for(var j=0;j<7;j++){
					if(j < startDay){
						table+="<td class='date'>"+"   "+"</td>";
					}else{
						table+="<td class='date'onclick='javascript:alert("+dateNum+")'>"+dateNum;	//날짜 출력
						//일정 출력
						if(size != 0 && dateNum == eventDateList[eventNum]){
							table+="<table class='eventList'>";
							while(dateNum == eventDateList[eventNum]){// 일정 여러개일 경우
								table+="<tr><td class='event'>"+eventSummaryList[eventNum]+"</td></tr>";
								eventNum++;
								if(eventNum == eventDateList.length){
									eventNum--;
									break;
								}
							}
							table+="</table>";
							if(eventNum == eventDateList.length)
								eventNum--;
						}
						table+="</td>";
						dateNum++;
					}
				}
			}else{
				for(var j=0;j<7;j++){
					if(dateNum > lastDate){
						table+="<td class='date'>"+"   "+"</td>";
					}else{
						table+="<td class='date'onclick='javascript:alert("+dateNum+")'>"+dateNum;
						if(size != 0 && dateNum == eventDateList[eventNum]){
							table+="<table class='eventList'>";
							while(dateNum == eventDateList[eventNum]){
								table+="<tr><td class='event'>"+eventSummaryList[eventNum]+"</td></tr>";
								eventNum++;
								if(eventNum == eventDateList.length){
									eventNum--;
									break;
								}
							}
							table+="</table>";
							if(eventNum == eventDateList.length)
								eventNum--;
						}
						table+="</td>";
						dateNum++;
					}
				}
			}
			table+="</tr>";
		}
		document.write(table);
		
	}
	
	
	printCalendar();
	</script>

</div>
</body>
</html>