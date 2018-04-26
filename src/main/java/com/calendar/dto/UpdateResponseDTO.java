package com.calendar.dto;

public class UpdateResponseDTO {
	private String calendarId;
	private String eventId;
	private String responseStatus;
	private String userId;
	
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}
	public void setEventId(String eventId) {
		this.eventId = eventId;
	}
	public void setResponseStatus(String responseStatus) {
		this.responseStatus = responseStatus;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getCalendarId() {
		return calendarId;
	}
	public String getEventId() {
		return eventId;
	}
	public String getResponseStatus() {
		return responseStatus;
	}
	public String getUserId() {
		return userId;
	}
}
