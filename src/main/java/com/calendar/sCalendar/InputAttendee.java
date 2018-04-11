package com.calendar.sCalendar;

public class InputAttendee {
	private String email;
	private String optional;
	private String organizer;
	private String responseStatus;
	private String self;
	
	public void setEmail(String email) {
		this.email = email;
	}
	public void setOptional(String optional) {
		this.optional = optional;
	}
	public void setOrganizer(String organizer) {
		this.organizer = organizer;
	}
	public void setResponseStatus(String responseStatus) {
		this.responseStatus = responseStatus;
	}
	public void setSelf(String self) {
		this.self = self;
	}
	public String getEmail() {
		return email;
	}
	public String getOptional() {
		return optional;
	}
	public String getOrganizer() {
		return organizer;
	}
	public String getResponseStatus() {
			return responseStatus;
	}
	public String getSelf() {
		return self;
	}
	
}
