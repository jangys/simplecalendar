package com.calendar.sCalendar;

import java.text.ParseException;
import java.util.ArrayList;

import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;

import net.fortuna.ical4j.model.Date;
import net.fortuna.ical4j.model.DateList;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.Recur;
import net.fortuna.ical4j.model.parameter.Value;

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
	public ArrayList<EventDTO> getRecurrenceEvents(boolean isDateOnly, EventDTO event, int year, int month) throws ParseException{
		ArrayList<EventDTO> list = new ArrayList<EventDTO>();
		int size = event.getRecurrence().size();
		//여러날 일정 반복인 경우 기간이 28일 넘어가면 그 전날부터 조사. 
		for(int i=0;i<size;i++) {
			Recur recur = new Recur(event.getRecurrence().get(i).substring(6));
			DateTime startDate = null;
			startDate = new DateTime();
			
			if(isDateOnly) {
				startDate.setTime(event.getStart()+9*3600000+1);
			}else {
				startDate.setTime(event.getStart());
			}
			Date endDate = null;
			if(recur.getUntil() != null) {
				endDate = recur.getUntil();
			}
			DateTime endTime = new DateTime();
			endTime.setTime(event.getEnd());
			int duration = 0;
			long end = 0;
			long start = 0;
			end = endTime.getTime();
			start = startDate.getTime();
			duration = (int) ((end - start)/86400000);
			
			if(endDate == null || endDate.getMonth() > (month+1) || endDate.getYear() > year) {
				endDate = new Date();
				endDate.setMonth(month);
				endDate.setYear(year);
				endDate.setDate(getLastDay(year, month+1));
			}
			System.out.println("year = "+year+", month = "+month);
			Date periodStartDate = new Date();
			if(duration < 28) {
				periodStartDate = new Date(new java.util.Date(year,month,1,9,0).getTime());
			}else {
				int m = month -1;
				int y = year;
				if(m == -1) {
					m = 12;
					y = year-1;
				}
				periodStartDate = new Date(new java.util.Date(y,m,1,9,0).getTime());
			}
//			System.out.println(recur+", "+startDate+", "+periodStartDate+", "+endDate);
			DateList dateList = recur.getDates(startDate, periodStartDate, endDate, Value.DATE_TIME);
//			System.out.println(dateList.toString());
			int dateSize = dateList.size();
			
//			System.out.println(endTime.toString()+", "+startDate.toString()+", "+duration+", "+dateSize);
			
			for(int j=0;j<dateSize;j++) {
				EventDTO copyEvent = new EventDTO();
				copyEvent.setSummary(event.getSummary());
				copyEvent.setAttendees(event.getAttendees());
				copyEvent.setCalendarID(event.getCalendarID());
				copyEvent.setEventID(event.getEventID());
				copyEvent.setDescription(event.getDescription());
				copyEvent.setLocation(event.getLocation());
				copyEvent.setOrganizer(event.getOrganizer());
				copyEvent.setRecurrence(event.getRecurrence());
				Date origin = dateList.get(j);
//				System.out.println(origin.getTime());
				copyEvent.setStart(origin.getTime(),isDateOnly);
				if(isDateOnly) {
					copyEvent.setEnd(origin.getTime()+86400000*(duration+1), isDateOnly);
				}else {
					long rest = 0;
					rest = end%86400000;
					copyEvent.setEnd(origin.getTime()+86400000*(duration)+rest, isDateOnly);
				}
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
