package com.calendar.sCalendar;

import java.util.List;

import com.google.api.services.calendar.model.EventReminder;

public class CalendarInputDTO {
	private String type;
	private String summary;
	private String description;
	private String timezone;
	private List<EventReminder> defaultReminders;
	
	public void setType(String type) {
		this.type = type;
	}
	
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public void setDefaultReminders(List<EventReminder> defaultReminders) {
		this.defaultReminders = defaultReminders;
	}
	public String getType() {
		return type;
	}
	public String getSummary() {
		return summary;
	}	
	public String getDescription() {
		return description;
	}

	public String getTimezone() {
		return timezone;
	}

	public List<EventReminder> getDefaultReminders() {
		return defaultReminders;
	}

}
