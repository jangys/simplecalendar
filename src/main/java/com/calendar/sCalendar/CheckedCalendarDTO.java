package com.calendar.sCalendar;

public class CheckedCalendarDTO {
	private String id;
	private int year;
	private int month;
	private int date;
	
	public void setId(String id) {
		this.id = id;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	public void setDate(int date) {
		this.date = date;
	}
	
	public String getId() {
		return id;
	}
	public int getYear() {
		return year;
	}
	public int getMonth() {
		return month;
	}
	public int getDate() {
		return date;
	}
}
