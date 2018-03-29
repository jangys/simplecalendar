package com.calendar.sCalendar;

import com.google.api.client.util.DateTime;

public class EventDTO {
	private String calendarID;
	private String calendarSummary;
	private String eventID;
	private String summary;
	private DateTime start;
	private int[] startTime;
	private DateTime end;
	private int[] endTime;
	private String description;
	private String location;

	public void setCalendarID(String calendarID) {
		this.calendarID = calendarID;
	}
	public void setCalendarSummary(String calendarSummary) {
		this.calendarSummary = calendarSummary;
	}
	public void setEventID(String eventID) {
		this.eventID = eventID;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setStart(DateTime start) {
		this.start = start;
		String strStart = start.toString();
		startTime = new int[5];
		
		startTime[0] = Integer.parseInt(strStart.substring(0, 4));	//년
		startTime[1] = Integer.parseInt(strStart.substring(5,7));	//월
		startTime[2] = Integer.parseInt(strStart.substring(8,10));	//일
		if(strStart.length() >= 13) {//시간이 있는 경우
			startTime[3] = Integer.parseInt(strStart.substring(11,13));
			startTime[4] = Integer.parseInt(strStart.substring(14,16));
			//System.out.println("hour : "+startTime[3]+" , min : "+startTime[4]);
		}else {
			startTime[3] = -1;
		}
		
	}

	public void setEnd(DateTime end) {
		this.end = end;
		endTime = new int[5];
		String strEnd = end.toString();
		endTime[0] = Integer.parseInt(strEnd.substring(0, 4));
		endTime[1] = Integer.parseInt(strEnd.substring(5,7));
		endTime[2] = Integer.parseInt(strEnd.substring(8,10));
		
		if(strEnd.length() >= 13) {//시간이 있는 경우 
			endTime[3] = Integer.parseInt(strEnd.substring(11,13));
			endTime[4] = Integer.parseInt(strEnd.substring(14,16));
			//System.out.println("hour : "+endTime[3]+" , min : "+endTime[4]);
		}else {
			endTime[2]--;
			if(endTime[2] == 0) {
				endTime[1] --;
				if(endTime[1] == 0) {
					endTime[0] --;
					endTime[1] = 12;
				}
				endTime[2] = new CalculateCalendar().getLastDay(endTime[0], endTime[1]);
			}
			endTime[3] = -1;
		}
		
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getCalendarID() {
		return calendarID;
	}
	public String getCalendarSummary() {
		return calendarSummary;
	}
	public String getEventID() {
		return eventID;
	}
	public String getSummary() {
		return summary;
	}
	public DateTime getStart() {
		return start;
	}
	public int[] getStartTime() {
		return startTime;
	}
	public DateTime getEnd() {
		return end;
	}
	public int[] getEndTime() {
		return endTime;
	}
	public String getDescription() {
		return description;
	}
	public String getLocation() {
		return location;
	}
}
