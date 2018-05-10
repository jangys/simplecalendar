//recurrenceList_detail
function showRecurrenceList(startDate){
	var month = startDate.getMonth()+1;
	var date = startDate.getDate();
	var day = convertDay(startDate.getDay(),"number",false);
	var select = $("#recurrenceList_detail");
	var firstDate = new Date(startDate.getFullYear(),startDate.getMonth(),1);
	var startDay = firstDate.getDay();
	var weekNum = Math.floor((startDay+date-1)/7 +1);
	var text = "<option value='none'>없음</option>";
	//매일, 매주 요일,매주 주중(월-금), 매월 몇번째 요일, 매월 일,매년
	var rrule = ["FREQ=DAILY","FREQ=WEEKLY;BYDAY="+day,"FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","FREQ=MONTHLY;BYDAY="+weekNum+day,"FREQ=MONTHLY","FREQ=YEARLY"];
	var size = rrule.length;
	for(var i=0;i<size;i++){
		text += "<option value='RRULE:"+rrule[i]+"'>"+covertRRULEInKorean(rrule[i],month,date)+"</option>";
	}
	text += "<option id='recurCustomOption' value='custom'>맞춤 선택..</option>";
	$('#recurrenceList_detail').change(function() {
		var select = $("#recurrenceList_detail");
		//console.log(select.val());
		if(select.val() == "custom"){
			$("#makeRecurDiv").css('display','block');
			showMakeRecurDiv(startDate,weekNum);
		}else{
			select.attr('data-beforeSelect',select.val());
			$("#makeRecurDiv").css('display','none');
		}
			
	});
	select.html(text);
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
function convertRRULEToObject(strRrule){
	var rruleSplit = strRrule.split(';');
	var size = rruleSplit.length;
	var rrule = new Object();
	for(var i=0;i<size;i++){
		var temp = rruleSplit[i].split('=');
		var name = temp[0];
		var value = temp[1];
		if(name == "FREQ"){
			rrule.FREQ = value;
		}else if(name == "INTERVAL"){
			rrule.INTERVAL = value;
		}else if(name == "COUNT"){
			rrule.COUNT = value;
		}else if(name == "UNTIL"){
			rrule.UNTIL = value;
		}else if(name == "BYMONTH"){
			console.log("BYMONTH 존재");
		}else{
			rrule.BYDAY = value;
		}
	}
	return rrule;
}

function rruleToString(rrule){
	var result = "RRULE:";
	result += "FREQ="+rrule.FREQ;
	if(rrule.UNTIL != undefined){
		result += ";UNTIL="+rrule.UNTIL;
	}
	if(rrule.COUNT != undefined){
		result += ";COUNT="+rrule.COUNT;
	}
	if(rrule.INTERVAL != undefined){
		result += ";INTERVAL="+rrule.INTERVAL;
	}
	if(rrule.BYDAY != undefined){
		result += ";BYDAY="+rrule.BYDAY;
	}
	return result;
}
function covertRRULEInKorean(strRrule,month,date){
	var result = "";
	var rrule = convertRRULEToObject(strRrule);

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
		
	}//BYDAY
	
	if(rrule.UNTIL != undefined){
		$("#recurrenceList_detail").css('width','300px');
		result += ": "+rrule.UNTIL.substring(0,4)+"년"+rrule.UNTIL.substring(4,6)+"월"+rrule.UNTIL.substring(6,8)+"일 까지";
	}else if(rrule.COUNT == undefined){
		$("#recurrenceList_detail").width('180px');
	}
	if(rrule.COUNT != undefined){
		$("#recurrenceList_detail").width('250px');
		result += ": "+rrule.COUNT+"번 까지";
	}else if(rrule.UNTIL == undefined){
		$("#recurrenceList_detail").width('180px');
	}
	return result;
}
function showMakeRecurDiv(startDate,weeknum){
	var select = $("#recurrenceList_detail");
	var selected = select.attr('data-beforeSelect');
	var originalValue = select.attr('data-originalvalue');
	var selectFreq = $("#freqSelect_detail");
	var byday = $("#bydayDiv_detail");
	
	var month = $("#recurMonth_detail");
	month.children().eq(0).children().eq(1).html("매월 "+startDate.getDate()+"일");
	month.children().eq(1).children().eq(1).html("매월 "+weeknum+"번째 "+convertDay(startDate.getDay(),"number",true));
	month.children().eq(1).children().eq(1).attr('data-rrule',weeknum+convertDay(startDate.getDay(),"number",false));
	//console.log(originalValue);
	if(selected == "none"){
		if(originalValue == undefined){
			makeRecurDiv("WEEKLY",1,1);
			makeRecurDiv_EndDate("none");
		}else{
			var rrule = convertRRULEToObject(originalValue.split(":")[1]);
		}
	}else{
		var rrule = convertRRULEToObject(selected.split(":")[1]);
	}
	if(selected != "none"){
		var index;
		if(rrule.FREQ == "WEEKLY"){
			var dayList = rrule.BYDAY.split(",");
			index = new Array();
			for(var i=0;i<dayList.length;i++){
				index.push(convertDay(dayList[i],"en",false));
			}
		}else if(rrule.FREQ == "MONTHLY"){
			index = 0;
			if(rrule.BYDAY != undefined){
				index = 1;
			}
		}
		makeRecurDiv(rrule.FREQ,rrule.INTERVAL,index);
		var type = "none";
		var input;
		if(rrule.UNTIL != undefined){
			type = "UNTIL";
			var dateStr = rrule.UNTIL.toString();
			input = new Date(parseInt(dateStr.substring(0,4)), parseInt(dateStr.substring(4,6))-1,parseInt(dateStr.substring(6,8)),12);
		}
		if(rrule.COUNT != undefined){
			type = "COUNT";
			input = rrule.COUNT;
		}
		makeRecurDiv_EndDate(type,input);
	}
	$("#freqSelect_detail").change(function(){
		makeRecurDiv($("#freqSelect_detail").val(),1,-1);	//index = -1 초기화
	});
	$("input:radio[name=recurUntil]").click(function(){
		var type = $(this).val();
		var input = 1;
		if(type == "UNTIL"){
			var d = new Date($("#startDatePicker").val());
			input = new Date(d.getFullYear(),d.getMonth()+2,d.getDate(),12);
		}
		makeRecurDiv_EndDate(type,input);
	});
	$("input:checkbox[name=recurDay]").click(function(){
		checkRecurCheckBox_detail();
	});
}
function makeRecurDiv(type,input, index){
	var option = $("#freqSelect_detail").children();
	switch(type){
	case "DAILY":
		option.eq(0).prop("selected",true);
		$("#bydayDiv_detail").css('display','none');
		$("#recurMonth_detail").css('display','none');
		break;
	case "WEEKLY":
		option.eq(1).prop("selected",true);
		$("#bydayDiv_detail").css('display','block');
		$("#recurMonth_detail").css('display','none');
		var byday = $("#bydayDiv_detail");
		$("input:checkbox[name=recurDay]").prop('checked',false);
		if(index != undefined){
			if(index == -1){
				byday.children().eq(0).children().eq(0).prop('checked',true);
			}else{
				if(index.length  == undefined){
					var dayIndex = index - 1 < 0 ? 6 : index - 1;
					byday.children().eq(dayIndex).children().eq(0).prop('checked',true);
				}
				for(var i=0;i<index.length;i++){
					var dayIndex = index[i] - 1 < 0 ? 6 : index[i] - 1;
					byday.children().eq(dayIndex).children().eq(0).prop('checked',true);
				}
			}
		}else{
			byday.children().eq(0).children().eq(0).prop('checked',true);
		}
		break;
	case "MONTHLY":
		option.eq(2).prop("selected",true);
		$("#bydayDiv_detail").css('display','none');
		$("#recurMonth_detail").css('display','block');
		var month = $("#recurMonth_detail");
		if(index != undefined){
			index = index == -1 ? 0:index;
			month.children().eq(index).children().eq(0).prop('checked',true);
		}else{
			month.children().eq(0).children().eq(0).prop('checked',true);
		}
		break;
	case "YEARLY":
		option.eq(3).prop("selected",true);
		$("#bydayDiv_detail").css('display','none');
		$("#recurMonth_detail").css('display','none');
		break;
	}
	if(input != undefined || input != null){
		$("#inputInterval_detail").val(input);
	}else{
		$("#inputInterval_detail").val(1);
	}
}

function makeRecurDiv_EndDate(type,input){
	var div = $("#endDateDiv_detail");
	switch(type){
	case "none":
		$("#noEndDate_detail").prop('checked',true);
		$("#endDate_detail").attr('disabled',true);
		$("#endDateCount_detail").attr('disabled',true);
		break;
	case "UNTIL":
		div.children().eq(3).children().eq(0).prop('checked',true);
		$("#endDate_detail").attr('disabled',false);
		document.getElementById('endDate_detail').valueAsDate = input;
		$("")
		$("#endDateCount_detail").attr('disabled',true);
		break;
	case "COUNT":
		div.children().eq(6).children().eq(0).prop('checked',true);
		$("#endDate_detail").attr('disabled',true);
		$("#endDateCount_detail").attr('disabled',false);
		$("#endDateCount_detail").val(input);
		break;
	}
}

function saveCustomRRULE(){
	var result = "RRULE:";
	var freq = $("#freqSelect_detail").val();
	result +="FREQ="+freq;
	var endDate = $('input:radio[name=recurUntil]:checked').val();
	switch(endDate){
	case "UNTIL":
		var date = new Date($("#endDate_detail").val());
		result +=";UNTIL="+date.getFullYear()+addZero((date.getMonth()+1))+addZero(date.getDate()); 
		break;
	case "COUNT":
		result += ";COUNT="+$("#endDateCount_detail").val();
		break;
	}
	var interval = $("#inputInterval_detail").val();
	if(interval > 1){
		result += ";INTERVAL="+interval;
	}
	switch(freq){
	case "WEEKLY":
		var checkbox = $("input:checkbox[name=recurDay]:checked");
		result += ";BYDAY="+checkbox.eq(0).val();
		for(var i=1;i<checkbox.length;i++){
			result +=","+checkbox.eq(i).val();
		}
		break;
	case "MONTHLY":
		var radio = $("input:radio[name=recurMonth]:checked");
		if(radio.val() == "day"){//N번째 요일
			result +=";BYDAY="+radio.next().attr('data-rrule');
		}
		break;
	}
	//console.log(result);
	var option = $("#recurrenceList_detail").children();
	var isIn = false;
	for(var i=0;i<option.length;i++){
		if(option.eq(i).val() == result){
			option.eq(i).prop('selected',true);
			isIn = true;
			break;
		}
	}
	if(!isIn){
		var rrule = result.split(":")[1];
		var startDate = new Date($("#startDatePicker").val());
		var text = "<option value='"+result+"' selected>"+covertRRULEInKorean(rrule,startDate.getMonth()+1,startDate.getDate())+"</option>";
		$("#recurCustomOption").before(text);
	}
	$('#makeRecurDiv').css('display','none');
}

function checkEndDate_detail(){
	var date = new Date($("#endDate_detail").val());
	var start = new Date($("#startDatePicker").val());
	if(start.getTime() > date.getTime()){
		document.getElementById('endDate_detail').valueAsDate = new Date(start.getTime()+86400000);
	}
}

function checkRecurCheckBox_detail(){
	var checkbox = $("input:checkbox[name=recurDay]:checked");
	if(checkbox.length == 0){
		var index = new Date($("#startDatePicker").val()).getDay();
		var dayIndex = index - 1 < 0 ? 6 : index - 1;
		$("#bydayDiv_detail").children().eq(dayIndex).children().eq(0).prop('checked',true);
	}
}

function cancelmakeRecurDiv(){
	$('#makeRecurDiv').css('display','none');
	var select = $('#recurrenceList_detail');
	var before = select.attr('data-beforeselect');
	
	$("[value='"+before+"']").prop('selected',true);
}

