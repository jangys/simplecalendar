package com.calendar.dto;


import com.google.api.client.util.DateTime;

public class EventDetailDTO {
	private String calendarSummary;
	private String summary;
	private int[] startTime;
	private int[] endTime;
	private String description;
	private String location;
	private java.util.List<java.lang.String> recurrence;
	
	public void setCalendarSummary(String calendarSummary) {
		this.calendarSummary = calendarSummary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public void setStart(long start, boolean isDateOnly) {
		String strStart = new DateTime(start).toString();
		startTime = new int[5];
		startTime[0] = Integer.parseInt(strStart.substring(0, 4));	//년
		startTime[1] = Integer.parseInt(strStart.substring(5,7));	//월
		startTime[2] = Integer.parseInt(strStart.substring(8,10));	//일
		if(!isDateOnly) {//시간이 있는 경우
			startTime[3] = Integer.parseInt(strStart.substring(11,13));
			startTime[4] = Integer.parseInt(strStart.substring(14,16));
			//System.out.println("hour : "+startTime[3]+" , min : "+startTime[4]);
		}else {
			startTime[3] = -1;
		}
	}

	public void setEnd(long end, boolean isDateOnly) {
		endTime = new int[5];
		String strEnd = new DateTime(end).toString();
		endTime[0] = Integer.parseInt(strEnd.substring(0, 4));
		endTime[1] = Integer.parseInt(strEnd.substring(5,7));
		endTime[2] = Integer.parseInt(strEnd.substring(8,10));
		
		if(!isDateOnly) {//시간이 있는 경우 
			endTime[3] = Integer.parseInt(strEnd.substring(11,13));
			endTime[4] = Integer.parseInt(strEnd.substring(14,16));
			//System.out.println("hour : "+endTime[3]+" , min : "+endTime[4]);
		}else {
			endTime[2]--;
			if(endTime[2] == 0) {
				endTime[1] --;
				if(endTime[1] == 0) {
					endTime[0] --;
					endTime[1] = 12;
				}
				endTime[2] = getLastDay(endTime[0], endTime[1]);
			}
			endTime[3] = -1;
		}
		
	}
	public void setDescription(String description) {
		this.description = description;
		if(description == null) {
			this.description = "없음";
		}
	}
	public void setLocation(String location) {
		this.location = location;
		if(location == null) {
			this.location = "없음";
		}
	}
	public void setRecurrence(java.util.List<java.lang.String> recurrence) {
		this.recurrence = recurrence;
	}
	public String getCalendarSummary() {
		return calendarSummary;
	}
	public String getSummary() {
		return summary;
	}
	public int[] getStartTime() {
		return startTime;
	}
	public int[] getEndTime() {
		return endTime;
	}
	public String getDescription() {
		return description;
	}
	public String getLocation() {
		return location;
	}
	public java.util.List<java.lang.String> getRecurrence(){
		return recurrence;
	}
	public int getLastDay(int year, int month) {
		int result = 31;
		if((month % 2 == 0 && month <= 6) || (month % 2 == 1 && month >= 9)){
			result = 30;
		}
		if(month == 2 && year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
			result = 29;
		}else if(month == 2){
			result = 28;
		}
		return result;
	}
}
