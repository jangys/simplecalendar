 package com.calendar.sCalendar;

public class CalculateCalendar {
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
	public void getRecurDateList() {
	}
}
