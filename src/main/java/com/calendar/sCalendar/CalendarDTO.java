package com.calendar.sCalendar;


public class CalendarDTO {
	private String id;
	private String summary;
	private String description;
	private boolean check;
	
	public void setId(String id) {
		this.id = id;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setDescription(String description) {
		this.description = description;
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
	public String getDescription() {
		return description;
	}
	public boolean getCheck() {
		return check;
	}
}
