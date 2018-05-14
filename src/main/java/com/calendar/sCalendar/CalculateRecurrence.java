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
		
		//������ ���� �ݺ��� ��� �Ⱓ�� 28�� �Ѿ�� �� �������� ����. 
		for(int i=0;i<size;i++) {
			Recur recur = null;
			String rule = event.getRecurrence().get(i).substring(0,6);
			if(rule.equals("RRULE:")) {
				recur = new Recur(event.getRecurrence().get(i).substring(6));
			}else if(rule.equals("EXDATE")){
				continue;
			}
			//ù��° ���� ���� ��¥
			DateTime startDate = null;
			startDate = new DateTime();
			
			if(isDateOnly) {
				startDate.setTime(event.getStart()+9*3600000l+1);	//������ 12�ÿ��� -1 �� �������� �־���
			}else {
				startDate.setTime(event.getStart());
			}
			
			//ù��° ���� �� ��¥
			DateTime endTime = new DateTime();
			endTime.setTime(event.getEnd());
			int duration = 0;
			long end = 0;
			long start = 0;
			end = endTime.getTime();
			start = startDate.getTime();
			duration = (int) ((end - start)/86400000);	//��¥ �� ���ϱ�
			
			//�Ⱓ �� ��¥ ���ϱ� ������ 1�� 0��
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
			
			//�Ⱓ ���� ��¥ ���ϱ�. �ݺ� ������ �Ϸ� ��¥�� �ƴ� ���� ���� ���� �׿� �°� ����
			DateTime periodStartDate = new DateTime();
			int previousMonth = 0;
			if(duration != 0) {
				previousMonth = duration/29 + 1;
			}
			LocalDateTime periodStartTemp = LocalDateTime.of(year, month-previousMonth, 1, 9, 0);
			zdt = periodStartTemp.atZone(ZoneId.systemDefault());
			periodStartDate.setTime(zdt.toInstant().toEpochMilli());
			
//			System.out.println(recur+", "+startDate+", "+periodStartDate+", "+periodEndDateTime);
			DateList dateList = recur.getDates(startDate, periodStartDate, periodEndDateTime, Value.DATE_TIME);		//�ݺ����� ���ϱ�
			System.out.println(dateList.toString());
			int dateSize = dateList.size();
			
//			System.out.println(endTime.toString()+", "+startDate.toString()+", "+duration+", "+dateSize);
			int exdateIndex = 0;
			int exdateListSize = -1;
			if(exdateList != null) {
				exdateListSize = exdateList.size();
			}
			
			//�ݺ� ���� ����
			for(int j=0;j<dateSize;j++) {
				Date origin = dateList.get(j);
//				System.out.println("recurrence date : "+origin.toString());
				if(exdateIndex < exdateListSize && origin.toString().substring(0,8).equals(exdateList.get(exdateIndex).toString())) {//���� ��¥�� �ִ°� ����
					exdateIndex++;
					continue;
				}
				//���� ��¥�� ���� ��¥���� �ڰ� �Ǹ� ���� ��¥�� �ڷ� ���� �ϱ�
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
				if(copyEvent.getEndTime()[1]< month || copyEvent.getEndTime()[0] < year) {//�� ��¥�� ���� ���� �ִ� ��¥���� ���̸� ����Ʈ�� ���� ����
					continue;
				}
				if(copyEvent.getEndTime()[1] == month && copyEvent.getEndTime()[0] == year && copyEvent.getEndTime()[2] < date) {//�� ��¥�� ���� ���� �ִ� ��¥���� �� ��
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
