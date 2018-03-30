package com.calendar.sCalendar;


public class CalendarDTO {
	private String id;
	private String summary;
	private boolean check;
	
	public void setId(String id) {
		this.id = id;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setCheck(boolean check) {
		this.check = check;
	}
	public String getId() {
		return id;
	}
	public String getSummary() {
		return summary;
	}
	public boolean getCheck() {
		return check;
	}
}
