package com.calendar.sCalendar;

public class CalendarDTO {
	public int id;
	public String title;
	public String start;
	public String end;
	public String detail;
	public String calendarID;
	
	public int[] startYMD;
	public int[] endYMD;

	public void setID(int id) {
		this.id = id;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setStart(String start) {
		this.start = start;
		startYMD = new int[3];
		startYMD[0] = Integer.parseInt(start.substring(0, 4));	//³â
		startYMD[1] = Integer.parseInt(start.substring(5,7));	//¿ù
		startYMD[2] = Integer.parseInt(start.substring(8,10));	//ÀÏ
	}
	public void setEnd(String end) {
		this.end = end;
		endYMD = new int[3];
		endYMD[0] = Integer.parseInt(end.substring(0, 4));
		endYMD[1] = Integer.parseInt(end.substring(5,7));
		endYMD[2] = Integer.parseInt(end.substring(8,10));
	}
	public void setDetail(String detail) {
		this.detail = detail;
	}
	public void setCalendarID(String calendarID) {
		this.calendarID = calendarID;
	}
	public int getID() {
		return id;
	}
	public String getTitle() {
		return title;
	}
	public String getStart() {
		return start;
	}
	public String getEnd() {
		return end;
	}
	public String getDetail() {
		return detail;
	}
	public String getCalendarID() {
		return calendarID;
	}
	
	@Override
	public String toString() {
		return "CalendarDTO id="+id+", title="+title+", start="+start+", end ="+end+", detail="+detail;
	}
}
