package com.calendar.sCalendar;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;

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
	@SuppressWarnings("deprecation")
	public ArrayList<EventDTO> getRecurrenceEvents(boolean isDateOnly, EventDTO event, int year, int month,ArrayList<Integer> exdateList) throws ParseException{
		ArrayList<EventDTO> list = new ArrayList<EventDTO>();
		int size = event.getRecurrence().size();
		for(int i=0;i<size;i++) {
			String rule = event.getRecurrence().get(i).substring(0,6);
			if(rule.equals("EXDATE")){
				String date = event.getRecurrence().get(i).split(":")[1];
				if(exdateList == null) {
					exdateList = new ArrayList<Integer>();
				}
				exdateList.add(Integer.parseInt(date.substring(0, 8)));
			}
		}
		if(exdateList != null) {
			Collections.sort(exdateList);
		}
		//여러날 일정 반복인 경우 기간이 28일 넘어가면 그 전날부터 조사. 
		for(int i=0;i<size;i++) {
			System.out.println(event.getRecurrence());
			Recur recur = null;
			String rule = event.getRecurrence().get(i).substring(0,6);
			if(rule.equals("RRULE:")) {
				recur = new Recur(event.getRecurrence().get(i).substring(6));
			}else if(rule.equals("EXDATE")){
				continue;
			}
			DateTime startDate = null;
			startDate = new DateTime();
			
			if(isDateOnly) {
				startDate.setTime(event.getStart()+9*3600000+1);
			}else {
				startDate.setTime(event.getStart());
			}
			Date periodEndDate = null;
			if(recur.getUntil() != null) {
				periodEndDate = recur.getUntil();
			}
			DateTime endTime = new DateTime();
			endTime.setTime(event.getEnd());
			int duration = 0;
			long end = 0;
			long start = 0;
			end = endTime.getTime();
			start = startDate.getTime();
			duration = (int) ((end - start)/86400000);
			
			if(periodEndDate == null || periodEndDate.getMonth() > month || periodEndDate.getYear() > year) {
				periodEndDate = new Date();
				int m = month+1;
				int y = year;
				if(month == 12) {
					y++;
					m = 0;
				}
				periodEndDate.setMonth(m);
				periodEndDate.setYear(y);
				periodEndDate.setDate(1);
			}
			Date periodStartDate = new Date();
			if(duration != 0) {
				int previousMonth = duration/29 + 1;
				int m = month - previousMonth;
				int y = year;
				while(m < 0) {
					y--;
					m += 11;
				}
				periodStartDate = new Date(new java.util.Date(y,m,1,9,0).getTime());
				
			}else {
				int m = month -1;
				int y = year;
				if(m == -1) {
					m = 11;
					y = year-1;
				}
				periodStartDate = new Date(new java.util.Date(y,m,1,9,0).getTime());
			}
//			System.out.println(recur+", "+startDate+", "+periodStartDate+", "+periodEndDate);
			DateList dateList = recur.getDates(startDate, periodStartDate, periodEndDate, Value.DATE_TIME);
//			System.out.println(dateList.toString());
			int dateSize = dateList.size();
			
//			System.out.println(endTime.toString()+", "+startDate.toString()+", "+duration+", "+dateSize);
			int exdateIndex = 0;
			int exdateListSize = -1;
			if(exdateList != null) {
				exdateListSize = exdateList.size();
			}
			for(int j=0;j<dateSize;j++) {
				Date origin = dateList.get(j);
//				System.out.println("recurrence date : "+origin.toString());
				if(exdateIndex < exdateListSize && origin.toString().substring(0,8).equals(exdateList.get(exdateIndex).toString())) {//예외 날짜에 있는것 제외
					exdateIndex++;
					continue;
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
				if((copyEvent.getEndTime()[1] - 1)< month || copyEvent.getEndTime()[0] < year+1900) {//끝 날짜가 현재 보고 있는 날짜보다 전이면 리스트에 넣지 않음
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

				list.add(copyEvent);
//				for(int x=0;x<list.size();x++) {
//					System.out.println(list.get(x).getStartTime()[2]);
//				}
			}
			
		}
		
		return list;
	}
	
	public int getLastDay(int year, int month) {
		int result = 31;
		if((month % 2 == 0 && month <= 6) || (month % 2 == 1 && month >= 9)){
			result = 30;
		}
		if(month == 2 && year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
			result = 29;
		}else if(month == 2){
			result = 28;
		}
		return result;
	}
}
