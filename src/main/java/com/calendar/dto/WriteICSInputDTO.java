package com.calendar.dto;

public class WriteICSInputDTO {
	private String calendarId;
	private String calendarName;
	private String timezone;
	private String primary;
	
	public String getCalendarId() {
		return calendarId;
	}
	public String getCalendarName() {
		return calendarName;
	}
	public String getTimezone() {
		return timezone;
	}	
	public String getPrimary() {
		return primary;
	}	
	
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}
	public void setCalendarName(String calendarName) {
		this.calendarName = calendarName;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public void setPrimary(String primary) {
		this.primary = primary;
	}
	
}
