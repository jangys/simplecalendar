package com.calendar.dto;

public class ACLInputDTO {
	private String id;		//rule�� id
	private String calendarId;
	private String role;
	private String value;	//scope�� value, id���� ��
	
	public String getId() {
		return id;
	}
	public String getCalendarId() {
		return calendarId;
	}
	public String getRole() {
		return role;
	}
	public String getValue() {
		return value;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
