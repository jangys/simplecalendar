package com.calendar.dto;

import java.util.List;

import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventReminder;

public class EventInputDTO {
	private String summary;
	private String startDate;
	private String startDateTime;
	private String endDate;
	private String endDateTime;
	private long[] originalStartDate;
	private long[] originalEndDate;
	private String allDay;
	private String location;
	private String description;
	private String useDefault;		//email 10분전, popup 30분전
	private List<EventReminder> overrides;
	private List<EventReminder> defaultReminders;
	private List<EventAttendee> attendees;
	private List<String> originRecurrence;
	private List<String> recurrence;
	private int updateType;
	private String calendars;
	private String eventId;
	private String calendarId;
	private boolean guestsCanModify;
	private boolean guestsCanInviteOthers;
	private boolean guestsCanSeeOtherGuests;
	private String transparency;
	private String visibility;
	
	
	//for updateType
	public static final int ONLYTHIS = 1;
	public static final int ALL = 2;
	public static final int NEXT = 3;
	
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
	public void setOriginalStartDate(long[] originalStartDate) {
		this.originalStartDate = originalStartDate;
	}
	public void setOriginalEndDate(long[] originalEndDate) {
		this.originalEndDate = originalEndDate;
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
	public void setDefaultReminders(List<EventReminder> defaultReminders) {
		this.defaultReminders = defaultReminders;
	}
	public void setAttendees(List<EventAttendee> attendees) {
		this.attendees = attendees;
	}
	public void setRecurrence(List<String> recurrence) {
		this.recurrence = recurrence;
	}
	public void setOriginRecurrence(List<String> originRecurrence) {
		this.originRecurrence = originRecurrence;
	}
	public void setUpdateType(int updateType) {
		this.updateType = updateType;
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
	public void setGuestsCanModify(boolean guestsCanModify) {
		this.guestsCanModify = guestsCanModify;
	}
	public void setGuestsCanInviteOthers(boolean guestsCanInviteOthers) {
		this.guestsCanInviteOthers = guestsCanInviteOthers;
	}	
	public void setGuestsCanSeeOtherGuests(boolean guestsCanSeeOtherGuests) {
		this.guestsCanSeeOtherGuests = guestsCanSeeOtherGuests;
	}	
	public void setTransparency(String transparency) {
		this.transparency = transparency;
	}
	public void setVisibility(String visibility) {
		this.visibility = visibility;
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
	public long[] getOriginalStartDate() {
		return originalStartDate;
	}
	public long[] getOriginalEndDate() {
		return originalEndDate;
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
	public List<EventReminder> getDefaultReminders(){
		return defaultReminders;
	}
	public List<EventAttendee> getAttendees() {
		return attendees;
	}
	public List<String> getRecurrence() {
		return recurrence;
	}
	public List<String> getOriginRecurrence() {
		return originRecurrence;
	}
	public int getUpdateType() {
		return updateType;
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
	public boolean getGuestsCanModify() {
		return guestsCanModify;
	}
	public boolean getGuestsCanInviteOthers() {
		return guestsCanInviteOthers;
	}
	public boolean getGuestsCanSeeOtherGuests() {
		return guestsCanSeeOtherGuests;
	}
	public String getTransparency() {
		return transparency;
	}
	public String getVisibility() {
		return visibility;
	}

}

