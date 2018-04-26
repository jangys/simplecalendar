package com.calendar.dto;

import java.util.List;

import com.google.api.services.calendar.model.EventReminder;

public class CalendarDTO {
	private String id;
	private String summary;
	private boolean check;
	private String colorId;
	private boolean primary;
	private String accessRole;
	private List<EventReminder> defaultReminders;
	
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
	public void setDefaultReminders(List<EventReminder> defaultReminders) {
		this.defaultReminders = defaultReminders;
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
	public List<EventReminder> getDefaultReminders(){
		return defaultReminders;
	}
}
