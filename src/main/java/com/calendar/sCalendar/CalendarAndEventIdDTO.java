package com.calendar.sCalendar;

public class CalendarAndEventIdDTO {
	private String calendarId;
	private String eventId;
	private String startTime;
	private String rrule;
	private int deleteType;
	
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}
	public void setEventId(String eventId) {
		this.eventId = eventId;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public void setRrule(String rrule) {
		this.rrule = rrule;
	}
	public void setDeleteType(int deleteType) {
		this.deleteType = deleteType;
	}
	public String getCalendarId() {
		return calendarId;
	}
	public String getEventId() {
		return eventId;
	}
	public String getStartTime() {
		return startTime;
	}
	public String getRrule() {
		return rrule;
	}
	public int getDeleteType() {
		return deleteType;
	}

}
