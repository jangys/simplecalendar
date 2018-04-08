

function saveIsCheck(){
	
}
function getCalendarList(){
	var baseUrl = "http://localhost:8080";
	$.ajax({
		url:baseUrl+"/CalendarList",
		type:'GET',
		dataType :"json",
		success:function(data){
			printCalendarList(data);
			getList();
		}
	});
}
//<label><input type="checkbox" value="1">Option1</label>
function printCalendarList(data){
	var checkList = "";
	var size = data.length;
	var colorList = ["#B5B2FF","#B2CCFF","#B2EBF4","#B7F0B1","#CEFBC9","#D4F4FA","#FAED7D"];
	for(var i=0;i<size;i++){
		var colorCode = colorList[parseInt(data[i].colorId)%colorList.length];
		checkList += "<label"+" style='color:"+colorCode+"'><input type='checkbox' value = '"+data[i].id+"' data-originalCalendarId = '"+data[i].id+"'";
		if(data[i].check == true){
			checkList +=" checked";
		}
		checkList +=" onClick='clickCheckbox(this)' data-colorCode = '"+colorCode+"' data-accessRole = '"+data[i].accessRole+"'>"+data[i].summary+"</label><br/>";
	}
	document.getElementById("checkboxList").innerHTML = checkList;
}

///check/{checkedId}/{calType}/{year}/{month}/{date}
function clickCheckbox(box){
	var path = location.pathname.split('/');
	var year;
	var month;
	var date;
	if(location.pathname != '/'){
      	var fullDate = path[2].split('-');
      	year = parseInt(fullDate[0]);
      	month = parseInt(fullDate[1]);
      	date = parseInt(fullDate[2]);
     }else{
    	 var now = new Date();
    	 year = now.getFullYear();
    	 month = now.getMonth()+1;
    	 date = now.getDate();
     }
	requestCheckCalendar(year,month,date,box);
}
function requestCheckCalendar(year,month,date,box){
	var baseUrl = "http://localhost:8080";
	var path = location.pathname.split('/');
	//console.log(box.value);
	var data = {
			"id" : box.value,
			"year" : year,
			"month" : month,
			"date" : date
	};
	$.ajax({
		url:baseUrl+"/check"+"/m",
		type:'GET',
		data : data,
		dataType :"json",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			switch(path[1]){
		    case 'd':
		  	  //request, print 추가
		  	  break;
		    case 'w':
		  	  break;
		    case 'm':
		      printCalendar(year,month-1,data);
		  	  break;
		    case 'l':
		  	  printList(year,month,data);
		  	  break;
		    }
			
		}
	});
}