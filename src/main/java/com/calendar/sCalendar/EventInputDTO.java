package com.calendar.sCalendar;

import java.util.List;

import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventReminder;

public class EventInputDTO {
	private String summary;
	private String startDate;
	private String startDateTime;
	private String endDate;
	private String endDateTime;
	private String allDay;
	private String location;
	private String description;
	private String useDefault;		//email 10분전, popup 30분전
	private List<EventReminder> overrides;
	private List<InputAttendee> attendees;
	private String calendars;
	private String eventId;
	private String calendarId;
	
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public void setStartDateTime(String startDateTime) {
		this.startDateTime = startDateTime;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public void setEndDateTime(String endDateTime) {
		this.endDateTime = endDateTime;
	}
	public void setAllDay(String allDay) {
		this.allDay = allDay;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setUseDefault(String useDefault) {
		this.useDefault = useDefault;
	}
	//EventReminder-> method, minutes(0~40320 4weeks) 최대 5개
	public void setOverrides(List<EventReminder> overrides) {
		this.overrides = overrides;
	}
	public void setAttendees(List<InputAttendee> attendees) {
		this.attendees = attendees;
	}
	public void setCalendars(String calendars) {
		this.calendars = calendars;
	}
	public void setEventId(String eventId) {
		this.eventId = eventId;
	}
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}
	
	public String getSummary() {
		return summary;
	}
	public String getStartDate() {
		return startDate;
	}
	public String getStartDateTime() {
		return startDateTime;
	}
	public String getEndDate() {
		return endDate;
	}
	public String getEndDateTime() {
		return endDateTime;
	}
	public String getAllDay() {
		return allDay;
	}
	public String getLocation() {
		return location;
	}
	public String getDescription() {
		return description;
	}
	public String getUseDefault() {
		return useDefault;
	}
	public List<EventReminder> getOverrides() {
		return overrides;
	}
	public List<InputAttendee> getAttendees() {
		return attendees;
	}
	public String getCalendars() {
		return calendars;
	}
	public String getEventId() {
		return eventId;
	}
	public String getCalendarId() {
		return calendarId;
	}
}

