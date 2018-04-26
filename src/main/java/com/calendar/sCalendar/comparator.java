package com.calendar.sCalendar;

import java.util.Comparator;

import com.calendar.dto.EventDTO;

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


class comparatorEndDesc implements Comparator<EventDTO>{
	public int compare(EventDTO dto1, EventDTO dto2) {
		int ret = 0;
		if(dto1.getEnd() > dto2.getEnd()) {
			ret = -1;
		}else if(dto1.getEnd() < dto2.getEnd()) {
			ret = 1;
		}
		return ret;
	}
}

class comparatorSameDate implements Comparator<EventDTO>{
	public int compare(EventDTO dto1, EventDTO dto2) {
		int ret = 0;
		if(dto1.getStartTime()[0] == dto2.getStartTime()[0] && dto1.getStartTime()[1] == dto2.getStartTime()[1] && dto1.getStartTime()[2] == dto2.getStartTime()[2]) {
			if(dto1.getEndTime()[0] == dto2.getEndTime()[0] && dto1.getEndTime()[1] == dto2.getEndTime()[1] && dto1.getEndTime()[2] == dto2.getEndTime()[2]) {//같은날
				if(dto1.getStart() < dto2.getStart()) {
					ret = -1;
				}else if( dto1.getStart() > dto2.getStart()) {
					ret = 1;
				}else {//같은 경우
					if(dto1.getEnd() > dto2.getEnd()) {
						ret = -1;
					}else {
						ret = 1;
					}
				}
			}else {
				if(dto1.getEnd() > dto2.getEnd()) {
					ret = -1;
				}else if(dto1.getEnd() < dto2.getEnd()) {
					ret = 1;
				}
			}
		}
		return ret;
	}
}