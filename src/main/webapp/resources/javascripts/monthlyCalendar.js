
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
	
	//높이에 따른 세로 갯수
	var colNum = 6;	//0번째 줄은 무조건 날짜

	//달력그리기
	for(var i = 0; i<row;i++){
		table+="<div class='dateLine ";
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
		table+="<table class = 'scheduleList'>";
		var start = i*7;
		for(var j = 0;j < colNum;j++){
			table+="<tr>";
			for(var x = 0; x < 7;x++){
				if(j == 0){//show date
					if(i == 0 && x < startDay){
						table += "<td class='date'>"+"   "+"</td>";
					}else{
						table += "<td class='date";
						if(m == month && dateNum == date){
							table+=" today";
						}
						if(dateNum > lastDate){
							table+="'></td>";
						}else{
							table += "'>"+dateNum+"</td>";
							dateNum++;
						}
					}
				}else{
					table += "<td class='event";
					if(m == month && x+start == date+startDay-1){
						table += " today";
					}
					if(j == colNum -1){
						table += " moreEvent";
					}
					table += "' data-index='"+(x+start)+"' data-col='"+j+"'";
					
					if(j == colNum -1){
						table+= " data-add=0";
					}
					table +="></td>";
				}
			}
			table+="</tr>";
		}
		table+="</table></div>";
	}
	document.getElementById("dates").innerHTML = table;

	printEvent(y, m, startDay, lastDate, data, colNum);
	$(".showMoreEvent").click(function(){
		var index = $(this).parent().attr('data-index');
		var clickDate = index-startDay+1;
		var top = $(this).offset().top;
		var left = $(this).offset().left;
		var div = $("#showMoreEventDiv");
		$("#showMoreEvent_Title").html(m+"월 "+clickDate+"일");
		
		var d = new Date(y,m-1,clickDate,0,0,0,0);
		clickDate = d.getTime();
		var clickDateMax = clickDate + 86400000;
		div.css('display','block');
		div.css('top',top-200);
		div.css('left',left-500);	//스크린 width따라 위치 조정
		
		var list = $("#moreEventList");
		var text = "";
		var size = data.length;
		for(var i=0;i<size;i++){
			if(data[i].start < clickDateMax && data[i].end >= clickDate){//확인
				text+="<li><a style='color:black;' title='"+data[i].summary+"' onClick ='clickEventTitle(this)' href='#' data-eventId ="+
				data[i].eventID+" data-calendarId = "+data[i].calendarID+">"+data[i].summary+"</a></li>";
			}
		}
		list.html(text);
	});
}
//이벤트 출력
function printEvent(year, month, startIndex, lastDate, data, colNum){
	var eventNum = 0;
	var dateIndex = startIndex-1;
	 var size = data.length;
	for(var i = 0; i < size; i++){
		var index=0;
		var startDateIndex=0;
		var endDateIndex=0;
		var colorCode;
		var calendarListSize = $("[type='checkbox']").size();
		for(var j=0; j < calendarListSize;j++){
			if($("[type='checkbox']").eq(j).val() == data[i].calendarID){
				colorCode = $("[type='checkbox']").eq(j).attr('data-colorCode');
				break;
			}
		}
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
		var title = "<div class='eventTitleLink'><p class='eventTime'>";
		if(data[i].startTime[0] == year && data[i].startTime[1] == month && data[i].startTime[3] != -1){
			var hour = data[i].startTime[3];
			var min = data[i].startTime[4];
			title += changeTimeForm(hour, min)+" </p>";
		}
		title += "<a title='"+data[i].summary+"' onClick ='clickEventTitle(this)' href='#' data-eventId ="+data[i].eventID+" data-calendarId = "+data[i].calendarID+">"+data[i].summary+"</a></div>";
		if(startDateIndex == endDateIndex){//하루 일정
			var col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
			if(col == colNum -1){//마지막줄인 경우
				var add = parseInt($("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").attr("data-add")) + 1;
				$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").attr("data-add",add);
				var temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
				$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").html(temp);
				//$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").addClass('moreEvent');
			}else{
				$("[data-index="+startDateIndex+"]:eq(0)").html(title);
				$("[data-index="+startDateIndex+"]:eq(0)").css('background-color',colorCode);
				$("[data-index="+startDateIndex+"]:eq(0)").css('border-bottom','1px solid white');
				$("[data-index="+startDateIndex+"]:eq(0)").removeAttr("data-index");
			}
		}else{//이어지는 일정
			var weekNum = 6;
			var colspan = 0;
			var isIn = 0;
			var col = 0;
			
			for(var n = 0; n < 6;n++){
				weekNum = 6 + 7*n;
				if(startDateIndex <= weekNum && endDateIndex <= weekNum && isIn == 0){//한 주에 있는 경우
					colspan = endDateIndex - startDateIndex +1;
					if(index == startDateIndex){
						col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
						var lastCol = $("[data-index="+endDateIndex+"]:eq(0)").attr("data-col");
						col = col > lastCol ? col:lastCol;
					}
					if(col == colNum - 1){//마지막 줄인 경우
						var td = $("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)");
						var add = parseInt(td.attr("data-add")) +1;
						td.attr("data-add",add);
						var temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
						td.html(temp);
					}else{
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").html(title);
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").css('border-bottom','1px solid white');
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
					}
					index++;
					while(index <= endDateIndex){
						if(col == colNum - 1){
							td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
							add = parseInt(td.attr("data-add")) +1;
							td.attr("data-add",add);
							temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
							td.html(temp);
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						}
						index++;
					}
					break;
				}else if(index <= weekNum && endDateIndex > weekNum){//주 넘어가는 경우
					colspan = weekNum-index+1;
					if(index == startDateIndex){
						col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
						var tempWeekNum = 0;
						var tempIndex = index;
						for(var a=0;a<6;a++){
							tempWeekNum = 6+7*a;
							if(index <= tempWeekNum && endDateIndex > tempWeekNum){
								var last = $("[data-index="+tempWeekNum+"]:eq(0)").attr("data-col");
								col = col > last ? col:last; 
							}else if(endDateIndex <= tempWeekNum){//마지막 주
								var last = $("[data-index="+endDateIndex+"]:eq(0)").attr("data-col");
								col = col > last ? col:last; 
								break;
							}	
						}
					}
					if(col == colNum-1){
						var td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
						var add = parseInt(td.attr("data-add")) +1;
						td.attr("data-add",add);
						var temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
						td.html(temp);
					}else{
						if(index == startDateIndex){
							$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").html(title);
							$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
							$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").css('border-bottom','1px solid white');
							$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
							$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
							
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").html(title);
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").css('border-bottom','1px solid white');
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
						}
					}
					index++;
					while(index <= weekNum){
						if(col == colNum - 1){
							td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
							add = parseInt(td.attr("data-add")) +1;
							td.attr("data-add",add);
							temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
							td.html(temp);
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						}
						index++;
					}
					index = weekNum+1;
					isIn = 1;
				}else if(index <= weekNum && endDateIndex <= weekNum){//마지막 주
					//console.log("last"+", "+endDateIndex);
					colspan = endDateIndex - index +1;
					if(col == colNum-1){
						var td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
						var add = parseInt(td.attr("data-add")) +1;
						td.attr("data-add",add);
						var temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
						td.html(temp);
					}else{
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").html(title);
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").css('border-bottom','1px solid white');
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
					}
					index++;
					while(index <= endDateIndex){
						if(col == colNum - 1){
							td = $("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)");
							add = parseInt(td.attr("data-add")) +1;
							td.attr("data-add",add);
							temp = "<a class='showMoreEvent' title='더보기' href='#' style='color:black;'>+"+add+"</a>";
							td.html(temp);
						}else{
							$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						}
						index++;
					}
					break;
				}
				
			}//for-n
		}
	}
}

function clickEventTitle(event){
	var baseUrl = "http://localhost:8080";
	var data={
		"calendarId" : event.getAttribute('data-calendarId'),
		"eventId" : event.getAttribute('data-eventId')
	};
	$.ajax({
		url:baseUrl+"/showEventDetail",
		type:'GET',
		data : data,
		dataType :"json",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			var contents = "<p> 제목 : "+data.summary+"</p>";
			contents += "<p> 일시 : "+data.startTime[0]+"."+addZero(data.startTime[1])+"."+addZero(data.startTime[2]);
			var check = -1;
			for(var i = 0;i<5;i++){
				if(data.startTime[i] != data.endTime[i]){
					check = i;
					break;
				}
			}
			var endTimeString;
			if(check == -1){
				contents += "</p>";
			}else{
				endTimeString = data.endTime[0]+"."+addZero(data.endTime[1])+"."+addZero(data.endTime[2]);
				if(data.startTime[3] != -1){//시간이 있는 경우
					contents += " " +changeTimeForm(data.startTime[3],data.startTime[4]) + " ~ ";
					if(check != 3){//같은 날이 아닌 경우
						contents += endTimeString;
					}
					contents += " " +changeTimeForm(data.endTime[3],data.endTime[4]);	//시간 추가
				}else{//시간이 없는 경우
					contents += " ~ "+endTimeString;
				}
				contents += "</p>";
			}
			contents += "<p> 장소 : "+data.location+"</p>";
			contents += "<p> 내용 : "+data.description+"</p>";
			
			$('#eventSummary_Contents').html(contents);
			var text = "<input type='text' name='calendarId' style='display:none' value='"+event.getAttribute('data-calendarId')+"' />";
			text += "<input type='text' name='eventId' style='display:none' value='"+event.getAttribute('data-eventId')+"' />";
			text += "<button id='btnShowEvent' class='btn btn-info' type='submit'>상세보기</button>";
			$('#btnDeleteEvent').attr('data-calendarId',event.getAttribute('data-calendarId'));
			$('#btnDeleteEvent').attr('data-eventId',event.getAttribute('data-eventId'));
			$('#showEvent_Form').html(text);
		}
	});
	$('#showEventSummary').css('display','block');
}
function clickDeleteEvent(button){
	var result;
	var baseUrl = "http://localhost:8080";
	var data={
			"calendarId" : button.getAttribute('data-calendarId'),
			"eventId" : button.getAttribute('data-eventId')
		};
	result= confirm('정말 삭제하시겠습니까?');
	if(result == true){
		console.log("delete");
		$.ajax({
			url:baseUrl+"/deleteEvent",
			type:'GET',
			data : data,
			dataType :"json",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success:function(data){
				if(data == true){
					alert('삭제가 완료되었습니다.');
					$(this).attr('disabled',false);
					location.reload();
					count=0;
				}
				else{
					alert('삭제 오류');
					$(this).attr('disabled',false);
					count=0;
				}
			}
		});
	}else{
		alert('취소 되었습니다.');
		$(this).attr('disabled',false);
		count=0;
	}
}
function addZero(data){
	var result = "";
	if(data < 10){
		result +="0";
	}
	result += data;
	return result;
}
function changeTimeForm(hour, min){
	var result = "";
	if(hour < 12){
		result += "오전 ";
		
	}else{
		result += "오후 ";
		if(hour > 12){
			hour -= 12;
		}
	}
	result+=addZero(hour)+":"+addZero(min);
	return result;
}