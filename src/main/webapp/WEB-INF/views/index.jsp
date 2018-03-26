<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="UTF-8"%>
<!DOCTYPE>
<html>
<head>
<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="/bootstrap/css/bootstrap.css">
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
	/*오늘 날짜 표시*/
	#today{
		background-color: #E8FFFF;
	}
</style>
</head>

<body>
<div id="header">
</div>
<script type="text/javascript">
		function showTitle(y,m){
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth()+1;
			var input = "";
			
			y = (y != undefined)? y:year;
			m = (m != undefined)? m:month;
			
			input += "<form>";
			//년, 월, 버튼 출력
			input += "<button class = 'btn btn-primary' id = 'backBtn' type='button' value='"+y+"' name='back'> ← </button>";
			input += "<div id='calendarTitle' style='text-align : center;'>  "+y+"년 "+m+"월"+"  </div>";
			input += "<button type='button' id = 'forwardBtn' value='"+m+"' name='forward'> → </button>";
			input += "</form>";
			document.getElementById("header").innerHTML = input;
		}
		//showTitle();
		//back 버튼
		$(document).on('click','#backBtn',function(){
			var year = $('#backBtn').val();
			var month = $('#forwardBtn').val();
			var postData = {'year' : month, 'month' : year};
			month--;
			if(month == 0){
				year--;
				month = 12;
			}
			$.ajax({
				url:"getMonthlyCalendar?year="+year+"&month="+month,
				type:'GET',
				data:postData,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType:"json",
				success:function(data){
					console.log(data.length);
					showTitle(year,month);
					printCalendar(year,month-1,data);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown){
		        	alert(errorThrown);
		        }
			});
		});
		
		//forward 버튼
		$(document).on('click','#forwardBtn',function(){
			var year = $('#backBtn').val();
			var month = $('#forwardBtn').val();
			var postData = {'year' : month, 'month' : year};
			month++;
			if(month == 13){
				year++;
				month = 1;
			}
			$.ajax({
				url:"getMonthlyCalendar?year="+year+"&month="+month,
				type:'GET',
				data:postData,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType:"json",
				success:function(data){
					console.log(data.length);
					showTitle(year,month);
					printCalendar(year,month-1,data);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown){
		        	alert(errorThrown);
		        }
			});
		});
</script>
<div id="container">
	<table id="monthlyCalendar">
	</table>
		
	<script type="text/javascript">
		$(document).ready(function(){
			getList();
		});
		function getList(){
			$.ajax({
		        url:'MonthlyCalendar',
		        type:'GET',
		        dataType : "json",
		        success:function(data){
		            console.log(data.length);
					showTitle();
		            year = $('#backBtn').val();
		            month = $('#forwardBtn').val();
		            printCalendar(year,month-1,data);
		        }
		    });
		}
		
	</script>
	<script type="text/javascript">
	//달력 출력
	function printCalendar(y, m,eventList) {    
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
		month++;
		
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
		
		var table = "<tr id='dayLine'>";
		table+="<th>일</th>";
		table+="<th>월</th>";
		table+="<th>화</th>";
		table+="<th>수</th>";
		table+="<th>목</th>";
		table+="<th>금</th>";
		table+="<th>토</th>";
		table+="</tr>";
		
		var dateNum = 1;
		var eventNum = 0;
		var size = eventList.length;
		if(size > 0){
			while( eventNum < size && eventList[eventNum].startTime[1] != m){
				eventNum++;
			}
		}
		//달력그리기
		for(var i = 1; i<=row;i++){
			table+="<tr class='dateLine'>";
			if(i==1){// 첫번째 줄 앞에 비어있을 수 있기 때문
				for(var j=0;j<7;j++){
					if(j < startDay){
						table+="<td class='date'>"+"   "+"</td>";
					}else{
						table+="<td class='date'onclick='javascript:alert("+dateNum+")'";
						if(dateNum == date && m == month){
							table+=" id = 'today'";
						}
						table += ">"+dateNum;	//날짜 출력
						//일정 출력
						if(size != 0 && eventNum < size && dateNum == eventList[eventNum].startTime[2]){
							table+="<table class='eventList'>";
							while(dateNum == eventList[eventNum].startTime[2]){// 일정 여러개일 경우
								table+="<tr><td class='event'>"+eventList[eventNum].summary+"</td></tr>";
								eventNum++;
								if(eventNum == size){
									eventNum--;
									break;
								}
							}
							table+="</table>";
							if(eventNum == size)
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
						table+="<td class='date'onclick='javascript:alert("+dateNum+")'";
						if(dateNum == date && m == month){
							table+=" id = 'today'";
						}
						table += ">"+dateNum;
						if(size != 0 && eventNum < size && dateNum == eventList[eventNum].startTime[2]){
							table+="<table class='eventList'>";
							while(dateNum == eventList[eventNum].startTime[2]){
								table+="<tr><td class='event'>"+eventList[eventNum].summary+"</td></tr>";
								eventNum++;
								if(eventNum == size){
									eventNum--;
									break;
								}
							}
							table+="</table>";
							if(eventNum == size)
								eventNum--;
						}
						table+="</td>";
						dateNum++;
					}
				}
			}
			table+="</tr>";
		}
		document.getElementById("monthlyCalendar").innerHTML = table;
	}
	</script>

</div>
</body>
</html>