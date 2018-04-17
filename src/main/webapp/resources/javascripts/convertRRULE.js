//recurrenceList_detail
function showRecurrenceList(startDate){
	var month = startDate.getMonth()+1;
	var date = startDate.getDate();
	var day = convertDay(startDate.getDay(),"number",false);
	var select = $("#recurrenceList_detail");
	var firstDate = new Date(startDate.getFullYear(),startDate.getMonth(),1);
	var startDay = firstDate.getDay();
	var weekNum = Math.floor((startDay+date-1)/7 +1);
	var week = weekNum > 1 ? weekNum:"";
	var text = "";
	//매일, 매주 요일,매주 주중(월-금), 매월 몇번째 요일, 매월 일,매년
	var rrule = ["FREQ=DAILY","FREQ=WEEKLY;BYDAY="+day,"FREQ=WEEKY;BYDAY=MO,TU,WE,TH,FR","FREQ=MONTHLY;BYDAY="+week+day,"FREQ=MONTHLY","FREQ=YEARLY"];
	var size = rrule.length;
	for(var i=0;i<size;i++){
		text += "<option data-rrule='RRULE:"+rrule[i]+"'>"+covertRRULEInKorean(rrule[i],month,date)+"</option>";
	}
	select.append(text);
}

function convertDay(day,type,toKorean){
	var result;
	var dayList = ["SU","MO","TU","WE","TH","FR","SA"];
	var koreanDayList = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
	switch(type){
	case "number":
		if(toKorean){
			return koreanDayList[day];
		}else{
			return dayList[day];
		}
		break;
	case "en":
		if(!toKorean){
			for(var i=0 ;i<7; i++){
				if(dayList[i] == day){
					return i;
				}
			}
		}else{
			for(var i=0 ;i<7; i++){
				if(dayList[i] == day){
					return koreanDayList[i];
				}
			}
		}
		break;
	case "kor":
		for(var i=0 ;i<7; i++){
			if(koreanDayList[i] == day){
				return i;
			}
		}
		break;
	}
	return "";
}

function covertRRULEInKorean(strRrule,month,date){
	var rruleSplit = strRrule.split(';');
	var size = rruleSplit.length;
	var result = "";
	var rrule = new Object();
	for(var i=0;i<size;i++){//until은  빼기
		var temp = rruleSplit[i].split('=');
		var name = temp[0];
		var value = temp[1];
		if(name == "FREQ"){
			rrule.FREQ = value;
		}else if(name == "INTERVAL"){
			rrule.INTERVAL = value;
		}else if(name == "BYMONTH"){
			console.log("BYMONTH 존재");
		}else{
			rrule.BYDAY = value;
		}
	}
	if(rrule.INTERVAL != undefined){
		result += rrule.INTERVAL;
		if(rrule.FREQ == "MONTHLY"){
			result += "개";
		}
	}else{
		result += "매";
	}
	switch(rrule.FREQ){
	case "DAILY":
		result += "일";
		break;
	case "WEEKLY":
		result += "주";
		break;
	case "MONTHLY":
		result += "월";
		break;
	case "YEARLY":
		result += "년";
		break;
	}
	if(rrule.INTERVAL != undefined){
		result += "마다";
	}
	if(rrule.BYDAY == undefined){
		if(rrule.FREQ == "YEARLY"){
			result += " "+month+"월 "+date+"일";
		}else if(rrule.FREQ == "MONTHLY"){
			result += " "+date+"일";
		}
	}else{
		
		if(rrule.BYDAY.length == 3){//몇번째 요일
			result += " "+rrule.BYDAY.substring(0,1)+"번째 ";
			result += convertDay(rrule.BYDAY.substring(1,3),"en",true);
		}else{
			if(rrule.BYDAY == "MO,TU,WE,TH,FR"){
				result += "주중 매일(월-금)";
			}else{
				var dayList = rrule.BYDAY.split(",");
				result += " ";
				for(var i=0;i<dayList.length;i++){
					result +=convertDay(dayList[i],"en",true);
					if(i != dayList.length-1){
						result += ",";
					}
				}
			}
		}
		
	}
	
	return result;
}