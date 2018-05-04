package com.calendar.dto;

public class UpdateEventDateDTO {
	private String eventId;
	private String calendarId;
	private long startDate;
	private long endDate;
	private boolean isAllDay;
	private boolean recurrence;
	private long originalStartTime;
	
	public String getEventId() {
		return eventId;
	}
	public String getCalendarId() {
		return calendarId;
	}
	public long getStartDate() {
		return startDate;
	}	
	public long getEndDate() {
		return endDate;
	}
	public boolean getIsAllDay() {
		return isAllDay;
	}
	public boolean getIsRecurrence() {
		return recurrence;
	}	
	public long getOriginalStartTime() {
		return originalStartTime;
	}	
	
	public void setEventId(String eventId) {
		this.eventId = eventId;
	}
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}
	public void setStartDate(long startDate) {
		this.startDate = startDate;
	}
	public void setEndDate(long endDate) {
		this.endDate = endDate;
	}
	public void setRecurrence(boolean recurrence) {
		this.recurrence = recurrence;
	}
	public void setAllDay(boolean isAllDay) {
		this.isAllDay = isAllDay;
	}
	public void setOriginalStartTime(long originalStartTime) {
		this.originalStartTime = originalStartTime;
	}
}
