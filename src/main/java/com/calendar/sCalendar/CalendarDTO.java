package com.calendar.sCalendar;


public class CalendarDTO {
	private String id;
	private String summary;
	private boolean check;
	private String colorId;
	private boolean primary;
	private String accessRole;
	
	public void setId(String id) {
		this.id = id;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setCheck(boolean check) {
		this.check = check;
	}
	public void setColorId(String colorId) {
		this.colorId = colorId;
	}
	public void setPrimary(boolean primary) {
		this.primary = primary;
	}
	public void setAccessRole(String accessRole) {
		this.accessRole = accessRole;
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
	public String getColorId() {
		return colorId;
	}
	public boolean getPrimary() {
		return primary;
	}
	public String getAccessRole() {
		return accessRole;
	}
}
