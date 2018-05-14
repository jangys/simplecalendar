package com.calendar.sCalendar;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;

import com.calendar.dto.EventDTO;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;

import net.fortuna.ical4j.model.Date;
import net.fortuna.ical4j.model.DateList;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.Recur;
import net.fortuna.ical4j.model.parameter.Value;
import net.fortuna.ical4j.model.property.ExDate;

public class CalculateRecurrence {
	public void example() throws ParseException {
		Recur recur = new Recur("FREQ=WEEKLY;INTERVAL=1;BYDAY=FR;WKST=MO;UNTIL=20170428T003000Z;");
		 DateTime startDate = new DateTime("20160727T0030000Z");
		 Date endDate = recur.getUntil();
		 DateTime baseDate = new DateTime("20160727T003000Z");
		DateList dateList = recur.getDates(baseDate, startDate, endDate, Value.DATE_TIME);
		System.out.println(dateList.toString());
	}
	public ArrayList<EventDTO> getRecurrenceEvents(boolean isDateOnly, EventDTO event, int year, int month,int date,int type,ArrayList<Integer> exdateList) throws ParseException{
		ArrayList<EventDTO> list = new ArrayList<EventDTO>();
		int size = event.getRecurrence().size();
		for(int i=0;i<size;i++) {
			String rule = event.getRecurrence().get(i).substring(0,6);
			if(rule.equals("EXDATE")){
				String dateStr = event.getRecurrence().get(i).split(":")[1];
				if(exdateList == null) {
					exdateList = new ArrayList<Integer>();
				}
				if(dateStr.contains(",")) {
					String[] dateStrSplit = dateStr.split(",");
					for(int j=0;j<dateStrSplit.length;j++) {
						exdateList.add(Integer.parseInt(dateStrSplit[j]));
					}
				}else {
					exdateList.add(Integer.parseInt(dateStr.substring(0, 8)));
				}
			}
		}
		if(exdateList != null) {
			Collections.sort(exdateList);
		}
		System.out.println(event.getSummary()+" : "+event.getRecurrence());
		
		//여러날 일정 반복인 경우 기간이 28일 넘어가면 그 전날부터 조사. 
		for(int i=0;i<size;i++) {
			Recur recur = null;
			String rule = event.getRecurrence().get(i).substring(0,6);
			if(rule.equals("RRULE:")) {
				recur = new Recur(event.getRecurrence().get(i).substring(6));
			}else if(rule.equals("EXDATE")){
				continue;
			}
			//첫번째 일정 시작 날짜
			DateTime startDate = null;
			startDate = new DateTime();
			
			if(isDateOnly) {
				startDate.setTime(event.getStart()+9*3600000l+1);	//원래는 12시에서 -1 한 값가지고 있었음
			}else {
				startDate.setTime(event.getStart());
			}
			
			//첫번째 일정 끝 날짜
			DateTime endTime = new DateTime();
			endTime.setTime(event.getEnd());
			int duration = 0;
			long end = 0;
			long start = 0;
			end = endTime.getTime();
			start = startDate.getTime();
			duration = (int) ((end - start)/86400000);	//날짜 텀 구하기
			
			//기간 끝 날짜 구하기 다음달 1일 0시
			DateTime periodEndDateTime = new DateTime();
			LocalDateTime temp = LocalDateTime.of(year, month, date, 0, 0);
			switch(type) {
			case GoogleCalendarService.MONTHLY:
				temp = temp.plusMonths(1);
				break;
			case GoogleCalendarService.WEEKLY:
				temp = LocalDateTime.of(year, month,date,11,59);
				temp = temp.plusWeeks(1);
				break;
			case GoogleCalendarService.DAILY:
				temp = LocalDateTime.of(year, month,date,11,59);
				break;
			}
			ZonedDateTime zdt = temp.atZone(ZoneId.of("Asia/Seoul"));
			periodEndDateTime.setTime(zdt.toInstant().toEpochMilli());
			System.out.println(periodEndDateTime.toString());
			
			//기간 시작 날짜 구하기. 반복 일정이 하루 날짜가 아닌 경우는 텀을 구해 그에 맞게 설정
			DateTime periodStartDate = new DateTime();
			int previousMonth = 0;
			if(duration != 0) {
				previousMonth = duration/29 + 1;
			}
			LocalDateTime periodStartTemp = LocalDateTime.of(year, month-previousMonth, 1, 9, 0);
			zdt = periodStartTemp.atZone(ZoneId.systemDefault());
			periodStartDate.setTime(zdt.toInstant().toEpochMilli());
			
//			System.out.println(recur+", "+startDate+", "+periodStartDate+", "+periodEndDateTime);
			DateList dateList = recur.getDates(startDate, periodStartDate, periodEndDateTime, Value.DATE_TIME);		//반복일정 구하기
			System.out.println(dateList.toString());
			int dateSize = dateList.size();
			
//			System.out.println(endTime.toString()+", "+startDate.toString()+", "+duration+", "+dateSize);
			int exdateIndex = 0;
			int exdateListSize = -1;
			if(exdateList != null) {
				exdateListSize = exdateList.size();
			}
			
			//반복 일정 복사
			for(int j=0;j<dateSize;j++) {
				Date origin = dateList.get(j);
//				System.out.println("recurrence date : "+origin.toString());
				if(exdateIndex < exdateListSize && origin.toString().substring(0,8).equals(exdateList.get(exdateIndex).toString())) {//예외 날짜에 있는것 제외
					exdateIndex++;
					continue;
				}
				//시작 날짜가 예외 날짜보다 뒤가 되면 예외 날짜도 뒤로 가게 하기
				while(exdateIndex < exdateListSize && Integer.parseInt(origin.toString().substring(0,8)) > exdateList.get(exdateIndex)) {
					exdateIndex++;
				}
				EventDTO copyEvent = new EventDTO();
				if(isDateOnly) {
					long resultEnd = origin.getTime()+86400000l*(duration+1);
					copyEvent.setEnd(resultEnd, isDateOnly);
				}else {
					long rest = 0;
					rest = (end-start)%86400000l;
					long resultEnd = origin.getTime()+86400000l*(duration)+rest;
					copyEvent.setEnd(resultEnd, isDateOnly);
				}
				if(copyEvent.getEndTime()[1]< month || copyEvent.getEndTime()[0] < year) {//끝 날짜가 현재 보고 있는 날짜보다 전이면 리스트에 넣지 않음
					continue;
				}
				if(copyEvent.getEndTime()[1] == month && copyEvent.getEndTime()[0] == year && copyEvent.getEndTime()[2] < date) {//끝 날짜가 현재 보고 있는 날짜보다 전 날
					continue;
				}
				copyEvent.setSummary(event.getSummary());
				copyEvent.setAttendees(event.getAttendees());
				copyEvent.setCalendarID(event.getCalendarID());
				copyEvent.setEventID(event.getEventID());
				copyEvent.setDescription(event.getDescription());
				copyEvent.setLocation(event.getLocation());
				copyEvent.setOrganizer(event.getOrganizer());
				copyEvent.setRecurrence(event.getRecurrence());
				
				copyEvent.setStart(origin.getTime(),isDateOnly);
				copyEvent.setOriginalStart(event.getStart());
				list.add(copyEvent);
			}
			
		}
//		System.out.println("---------------------------------------");
//		for(int x=0;x<list.size();x++) {
//			System.out.println(list.get(x).getStartTime()[2]);
//		}
		return list;
	}

}
