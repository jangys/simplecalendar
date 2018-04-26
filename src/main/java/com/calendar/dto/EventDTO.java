package com.calendar.dto;

import java.util.List;

import javax.print.DocFlavor.STRING;

import com.calendar.sCalendar.CalculateCalendar;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.EventAttendee;

public class EventDTO {
	private String calendarID;
	private String eventID;
	private String summary;
	private long start;
	private long originalStart;	//for recurrenceEvent
	private int[] startTime;
	private long end;
	private int[] endTime;
	private String location;
	private String description;
	private List<EventAttendee> attendees;
	private String organizer;
	private List<String> recurrence;
	
	public void setCalendarID(String calendarID) {
		this.calendarID = calendarID;
	}
	public void setEventID(String eventID) {
		this.eventID = eventID;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}

	public void setStart(long start, boolean isDateOnly) {
		this.start = start;
		String strStart = new DateTime(start).toString();
		startTime = new int[5];
		startTime[0] = Integer.parseInt(strStart.substring(0, 4));	//년
		startTime[1] = Integer.parseInt(strStart.substring(5,7));	//월
		startTime[2] = Integer.parseInt(strStart.substring(8,10));	//일
		if(!isDateOnly) {//시간이 있는 경우
			startTime[3] = Integer.parseInt(strStart.substring(11,13));
			startTime[4] = Integer.parseInt(strStart.substring(14,16));
			//System.out.println("hour : "+startTime[3]+" , min : "+startTime[4]);
		}else {
			startTime[3] = -1;
			this.start -= 9*3600000;	//오전 12시에서 1밀리초 뺌. 
			this.start -= 1;
		}
		
	}
	public void setOriginalStart(long originalStart) {
		this.originalStart = originalStart;
	}
	public void setEnd(long end, boolean isDateOnly) {
		this.end = end;
		endTime = new int[5];
		String strEnd = new DateTime(end).toString();
		
		endTime[0] = Integer.parseInt(strEnd.substring(0, 4));
		endTime[1] = Integer.parseInt(strEnd.substring(5,7));
		endTime[2] = Integer.parseInt(strEnd.substring(8,10));
		
		if(!isDateOnly) {//시간이 있는 경우 
			endTime[3] = Integer.parseInt(strEnd.substring(11,13));
			endTime[4] = Integer.parseInt(strEnd.substring(14,16));
			//System.out.println("hour : "+endTime[3]+" , min : "+endTime[4]);
		}else {
			endTime[2]--;
			this.end -= 86400000;
			if(endTime[2] == 0) {
				endTime[1] --;
				if(endTime[1] == 0) {
					endTime[0] --;
					endTime[1] = 12;
				}
				endTime[2] = new CalculateCalendar().getLastDay(endTime[0], endTime[1]);
			}
			endTime[3] = -1;
			//this.end += 53940001;	//23시 59분 1밀리초가 되게
		}
		
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setAttendees(List<EventAttendee> attendees) {
		this.attendees = attendees;
	}
	public void setOrganizer(String organizer) {
		this.organizer = organizer;
	}
	public void setRecurrence(List<String> recurrence) {
		this.recurrence = recurrence;
	}
	public String getCalendarID() {
		return calendarID;
	}
	public String getEventID() {
		return eventID;
	}
	public String getSummary() {
		return summary;
	}
	public long getStart() {
		return start;
	}
	public long getOriginalStart() {
		return originalStart;
	}
	public int[] getStartTime() {
		return startTime;
	}
	public long getEnd() {
		return end;
	}
	public int[] getEndTime() {
		return endTime;
	}
	public String getLocation() {
		return location;
	}
	public String getDescription() {
		return description;
	}
	public List<EventAttendee> getAttendees(){
		return attendees;
	}
	public String getOrganizer() {
		return organizer;
	}
	public List<String> getRecurrence(){
		return recurrence;
	}

}
