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
	/*���� ��*/
	#dayLine{
		background-color:#C2E2E8;
		height:3%;		
	}
	/*���� Ķ���� ǥ*/
	#monthlyCalendar{
		margin: 25px auto;
		height:80%;		
	}
	/*��¥ �� ĭ*/
	.date{
		vertical-align: top;
	}
	/*��¥ �� ��*/
	.dateLine{
		height:13%;
	}
	/*YYYY�� MM��*/
	#calendarTitle{
		display: inline;
		font-weight: bold;
		font-size: 20px;
	}
	/*���� �� ĭ*/
	.event{
		background-color:#918EDB;
		font-weight: bold;
		color: white;
		border: 1px solid #918EDB;
	}
	/*���� ǥ*/
	.eventList{
		border-collapse: separate;
		border: none;
	}
	/*����*/
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
			//��, ��, ��ư ���
			document.write("<button type='submit' value='"+m+"' name='back'> �� </button>");
			document.write("<div id='calendarTitle' style='text-align : center;'>  "+y+"�� "+m+"��"+"  </div>");
			document.write("<button type='submit' value='"+m+"' name='forward'> �� </button>");
		</script>
		
	</form>
	
	<script type="text/javascript">
	//�޷� ���
	function printCalendar(y, m) {    
	   var now = new Date();
	   var year = now.getFullYear();
	   var month = now.getMonth();
	   var date = now.getDate();	//���� ��¥
	
	   y = (y != undefined)? y:year;
	   m = (m != undefined)? m:month;
	   
	   var startDate = new Date(y,m,1);
	   var startDay = startDate.getDay();	//���� ����
	   
		var lastDate = 31;
		
		m++;
		
		//������ ��¥ ���
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
		table+="<th>��</th>";
		table+="<th>��</th>";
		table+="<th>ȭ</th>";
		table+="<th>��</th>";
		table+="<th>��</th>";
		table+="<th>��</th>";
		table+="<th>��</th>";
		table+="</tr>";
		var dateNum = 1;
		
		var eventDateList = new Array();		//���� �ִ� ��¥ �迭
		var eventSummaryList = new Array();		//���� ���� �迭
		
		<c:forEach items="${eventDate}" var="event">
			eventDateList.push("${event}");
		</c:forEach>
		<c:forEach items="${eventSummary}" var="summary">
			eventSummaryList.push("${summary}");
		</c:forEach>
		
		var eventNum = 0;
		var size = eventDateList.length;
		
		//�޷±׸���
		for(var i = 1; i<=row;i++){
			table+="<tr class='dateLine'>";
			if(i==1){// ù��° �� �տ� ������� �� �ֱ� ����
				for(var j=0;j<7;j++){
					if(j < startDay){
						table+="<td class='date'>"+"   "+"</td>";
					}else{
						table+="<td class='date'onclick='javascript:alert("+dateNum+")'>"+dateNum;	//��¥ ���
						//���� ���
						if(size != 0 && dateNum == eventDateList[eventNum]){
							table+="<table class='eventList'>";
							while(dateNum == eventDateList[eventNum]){// ���� �������� ���
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