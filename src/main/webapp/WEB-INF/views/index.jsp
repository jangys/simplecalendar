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
	#monthlyCalendar{
		/*margin: 25px auto;*/
		width:100%;
		height:100%;		
	}
	/*날짜 한 칸*/
	.date{
		vertical-align: top;
		height:12.5%;
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
	}
	/*일정 표*/
	.eventList{
		border-collapse: separate;
		border: none;
	}
	/*본문*/
	#container{
		margin: 2% 5%;
		height: 85%;
	}
	/*오늘 날짜 표시*/
	#today{
		background-color: #E8FFFF;
	}
	/*날짜와 일정*/
	.scheduleList{
		height:100%;
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
			var date = 1;
			var postData = {'year' : month, 'month' : year};
			month--;
			if(month == 0){
				year--;
				month = 12;
			}
			var pageUrl = "/"+year+"-"+month+"-"+date;
			var baseUrl = "http://localhost:8080";
	
			$.ajax({
				url: baseUrl+"/monthly/"+year+"/"+month+"/"+date,
				type:'GET',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType:"json",
				success:function(data){
					console.log(data.length);
					showTitle(year,month);
					printCalendar(year,month-1,data);
					history.replaceState(data,"SimpleCalendar",pageUrl);
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
			var date = 1;
			var postData = {'year' : month, 'month' : year};
			month++;
			if(month == 13){
				year++;
				month = 1;
			}
			var pageUrl = "/"+year+"-"+month+"-"+date;
			var baseUrl = "http://localhost:8080";
	
			$.ajax({
				url: baseUrl+"/monthly/"+year+"/"+month+"/"+date,
				type:'GET',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType:"json",
				success:function(data){
					console.log(data.length);
					showTitle(year,month);
					printCalendar(year,month-1,data);
					history.replaceState(data,"SimpleCalendar",pageUrl);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown){
		        	alert(errorThrown);
		        }
			});
		});
</script>
<div id="container">
	<div id="monthlyCalendar">
		<table id="week">
			<tr id="dayLine">
				<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
			</tr>
		</table>
		<table id="dates">
		</table>
	</div>
		
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
		            console.log(location.pathname);
		            var path = location.pathname.split('/');
		            var now = new Date();
		            var year = now.getFullYear();
		            var month = now.getMonth()+1;
		            //url에서 현재 년,월 추출
		            if(location.pathname != '/'){
		            	var fullDate = path[1].split('-')
		            	year = parseInt(fullDate[0]);
		            	month = parseInt(fullDate[1]);
		            }
		            showTitle(year, month);
		            printCalendar(year,month-1,data);
		            
		        }
		    });
		}
		
	</script>
	<script type="text/javascript">
	//달력 출력
	function printCalendar(y, m, data) {    
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
		
		var table = "";
		
		var dateNum = 1;
	
		//달력그리기
		for(var i = 0; i<row;i++){
			table+="<tr class='dateLine ";
			switch(row){
			case 4:
				table+="week4'>";
				break;
			case 5:
				table+="week5'>";
				break;
			case 6:
				table+="week6'>";
				break;
			}
			table+="<td colspan='7'><table class = 'scheduleList'>";
			var start = i*7;
			for(var j = 0;j < 7;j++){
				table+="<tr>";
				for(var x = 0; x < 7;x++){
					if(j == 0){//show date
						if(i == 0 && x < startDay){
							table += "<td class='date'>"+"   "+"</td>";
						}else{
							table += "<td class='date'";
							if(m == month && dateNum == date){
								table+=" id = 'today'";
							}
							if(dateNum > lastDate){
								table+="></td>";
							}else{
								table += ">"+dateNum+"</td>";
								dateNum++;
							}
						}
					}else{
						table += "<td class='event' data-index='"+(x+start)+"' data-col="+j+"></td>";
					}
				}
				table+="</tr>";
			}
			table+="</table></td></tr>";
		}
		document.getElementById("dates").innerHTML = table;

		printEvent(y, m, startDay, lastDate, data);
	}
	
	function printEvent(year, month, startIndex, lastDate, data){
		var eventNum = 0;
		var dateIndex = startIndex-1;
		 var size = data.length;
		
		for(var i = 0; i < size; i++){
			var index=0;
			var startDateIndex=0;
			var endDateIndex=0;
			if(data[i].startTime[1] < month || data[i].startTime[0] < year){//2017-12 ~ 2018-3
				index = startIndex;
			}else{
				index = data[i].startTime[2] + startIndex -1;
			}
			startDateIndex = index;
			if(data[i].endTime[1] > month || data[i].endTime[0] > year){
				endDateIndex = lastDate + startIndex - 1;
			}else{
				endDateIndex = data[i].endTime[2] + startIndex -1;
			}
			
			if(startDateIndex == endDateIndex){//하루 일정
				$("[data-index="+startDateIndex+"]:eq(0)").text(data[i].summary);
				$("[data-index="+startDateIndex+"]:eq(0)").css('background-color','#918EDB');
				$("[data-index="+startDateIndex+"]:eq(0)").removeAttr("data-index");
			}else{//이어지는 일정
				var weekNum = 6;
				var colspan = 0;
				var isIn = 0;
				for(var n = 0; n < 6;n++){
					weekNum = 6 + 7*n;
					if(startDateIndex <= weekNum && endDateIndex <= weekNum && isIn == 0){//한 주에 있는 경우
						colspan = endDateIndex - startDateIndex +1;
						$("[data-index="+startDateIndex+"]:eq(0)").text(data[i].summary);
						$("[data-index="+startDateIndex+"]:eq(0)").css('background-color','#918EDB');
						$("[data-index="+startDateIndex+"]:eq(0)").attr("colspan",colspan);
						$("[data-index="+startDateIndex+"]:eq(0)").removeAttr("data-index");
						index++;
						while(index <= endDateIndex){
							$("[data-index="+index+"]:eq(0)").remove();
							index++;
						}
						break;
					}else if(index <= weekNum && endDateIndex > weekNum){//주 넘어가는 경우
						colspan = weekNum-index+1;
						console.log(startDateIndex + " , "+endDateIndex+" , "+weekNum);
						if(index == startDateIndex){
							$("[data-index="+startDateIndex+"]:eq(0)").text(data[i].summary);
							$("[data-index="+startDateIndex+"]:eq(0)").css('background-color','#918EDB');
							$("[data-index="+startDateIndex+"]:eq(0)").attr("colspan",colspan);
							$("[data-index="+startDateIndex+"]:eq(0)").removeAttr("data-index");
						}else{
							$("[data-index="+index+"]:eq(0)").css('background-color','#918EDB');
							$("[data-index="+index+"]:eq(0)").attr("colspan",colspan);
							$("[data-index="+index+"]:eq(0)").removeAttr("data-index");
						}
						index++;
						while(index <= weekNum){
							$("[data-index="+index+"]:eq(0)").remove();
							index++;
						}
						index = weekNum+1;
						isIn = 1;
					}else if(index <= weekNum && endDateIndex <= weekNum){//마지막 주
						console.log("last"+", "+endDateIndex);
						colspan = endDateIndex - index +1;
						$("[data-index="+index+"]:eq(0)").css('background-color','#918EDB');
						$("[data-index="+index+"]:eq(0)").attr("colspan",colspan);
						$("[data-index="+index+"]:eq(0)").removeAttr("data-index");
						index++;
						while(index <= endDateIndex){
							$("[data-index="+index+"]:eq(0)").remove();
							index++;
						}
						break;
					}
					
				}//for-n
			}
			
		}
	}
	
	</script>

</div>
</body>
</html>