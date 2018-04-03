package com.calendar.sCalendar;

import java.util.Comparator;

public class comparator implements Comparator<EventDTO>{
	public int compare(EventDTO dto1, EventDTO dto2) {
		int ret = 0;
			if(dto1.getStart() < dto2.getStart()) {
				ret = -1;
			}else if(dto1.getStart() == dto2.getStart()){
				if(dto1.getEnd() > dto2.getEnd()) {
					ret = -1;
				}else if(dto1.getEnd() == dto2.getEnd()) {
					ret = 0;
				}
				else if(dto1.getEnd() < dto2.getEnd()){
					ret = 1;
				}
			}else {
				ret = 1;
			}
		return ret;
	}
	
}
