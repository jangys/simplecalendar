
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
		table+="</table></div>";
	}
	document.getElementById("dates").innerHTML = table;

	printEvent(y, m, startDay, lastDate, data);
}

function printEvent(year, month, startIndex, lastDate, data){
	var eventNum = 0;
	var dateIndex = startIndex-1;
	 var size = data.length;
	var colorList = ["#B5B2FF","#B2CCFF","#B2EBF4","#B7F0B1","#CEFBC9","#D4F4FA","#FAED7D"];
	var colorSize = colorList.length;
	for(var i = 0; i < size; i++){
		var index=0;
		var startDateIndex=0;
		var endDateIndex=0;
		var colorCode = colorList[Math.floor(Math.random() * colorSize)]; 
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
			$("[data-index="+startDateIndex+"]:eq(0)").css('background-color',colorCode);
			$("[data-index="+startDateIndex+"]:eq(0)").removeAttr("data-index");
		}else{//이어지는 일정
			var weekNum = 6;
			var colspan = 0;
			var isIn = 0;
			var col = 0;
			
			for(var n = 0; n < 6;n++){
				weekNum = 6 + 7*n;
				if(startDateIndex <= weekNum && endDateIndex <= weekNum && isIn == 0){//한 주에 있는 경우
					colspan = endDateIndex - startDateIndex +1;
					col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
					var lastCol = $("[data-index="+endDateIndex+"]:eq(0)").attr("data-col");
					col = col > lastCol ? col:lastCol;
					$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").text(data[i].summary);
					$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
					$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
					$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
					index++;
					while(index <= endDateIndex){
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						index++;
					}
					break;
				}else if(index <= weekNum && endDateIndex > weekNum){//주 넘어가는 경우
					colspan = weekNum-index+1;
					if(index == startDateIndex){
						col = $("[data-index="+startDateIndex+"]:eq(0)").attr("data-col");
						var lastCol = $("[data-index="+weekNum+"]:eq(0)").attr("data-col");
						col = col > lastCol ? col:lastCol;
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").text(data[i].summary);
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
						$("[data-index="+startDateIndex+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
						
					}else{
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
					}
					index++;
					while(index <= weekNum){
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						index++;
					}
					index = weekNum+1;
					isIn = 1;
				}else if(index <= weekNum && endDateIndex <= weekNum){//마지막 주
					//console.log("last"+", "+endDateIndex);
					colspan = endDateIndex - index +1;
					$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").css('background-color',colorCode);
					$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").attr("colspan",colspan);
					$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").removeAttr("data-index");
					index++;
					while(index <= endDateIndex){
						$("[data-index="+index+"]"+"[data-col="+col+"]:eq(0)").remove();
						index++;
					}
					break;
				}
				
			}//for-n
		}
		
	}
}