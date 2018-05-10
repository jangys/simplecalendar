package com.calendar.test;

import static org.junit.Assert.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.calendar.dto.CalendarDTO;
import com.calendar.dto.EventDTO;
import com.calendar.sCalendar.EventProcessing;
import com.calendar.sCalendar.GoogleCalendarService;
import com.calendar.sCalendar.comparator;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;

public class testGoogleCalendarService {
	ArrayList<EventDTO> singleEventList;
	ArrayList<CalendarDTO> calendarList;
	
	@Before
	public void setUp() throws IOException {
		singleEventList = new ArrayList<>();
		LocalDate cur = LocalDate.of(2018,5,1);
		LocalDateTime nowLocal = cur.atStartOfDay();
		ZonedDateTime nowZdt = nowLocal.atZone(ZoneId.systemDefault());
        DateTime now = new DateTime(nowZdt.toInstant().toEpochMilli());
        LocalDateTime localM = cur.plusMonths(1).atTime(0, 0);
    	ZonedDateTime zdtM = localM.atZone(ZoneId.systemDefault());
    	DateTime next = new DateTime(zdtM.toInstant().toEpochMilli()-60000l);
		Events events = new GoogleCalendarService().getCalendarService().events().list("primary")
				.setTimeMin(now)
				.setTimeMax(next)
				.setSingleEvents(true)
				.execute();
		 List<Event> items = events.getItems();
		 for (Event event : items) {
             DateTime start = null;
             boolean isDateOnly = false;
             if(event.getStart() != null) {
             	if(event.getStart().getDateTime() != null) {
             		start = event.getStart().getDateTime();
             	}else {
             		start = event.getStart().getDate();
             		isDateOnly = true;
             	}
             }else {
             	start = new DateTime(now.getValue());
             }
             DateTime end = null;
             if(event.getEnd() != null) {
             	if(event.getEnd().getDateTime() != null) {
             		end = event.getEnd().getDateTime();
             	}else {
             		end = event.getEnd().getDate();
             	}
             }else {
             	end = new DateTime(now.getValue());
             }
             boolean guestsCanSeeOtherGuests = true;
             if(event.getGuestsCanSeeOtherGuests() != null) {
             	guestsCanSeeOtherGuests = false;
             }
             EventDTO tempDTO = new EventDTO();
             tempDTO.setCalendarID("jangys9510@gmail.com");
             tempDTO.setSummary(event.getSummary());
             tempDTO.setStart(start.getValue(),start.isDateOnly());
             tempDTO.setEnd(end.getValue(),end.isDateOnly());
             tempDTO.setEventID(event.getId());
             tempDTO.setLocation(event.getLocation());
             tempDTO.setDescription(event.getDescription());
             tempDTO.setAttendees(event.getAttendees());
             tempDTO.setGuestsCanSeeOtherGuests(guestsCanSeeOtherGuests);
             singleEventList.add(tempDTO);
		 }
		 Collections.sort(singleEventList,new comparator());
		 singleEventList = new EventProcessing().arrangeOrder(singleEventList, 2018, 5);
		 calendarList = new ArrayList<>();
		 CalendarDTO calDTO = new CalendarDTO();
		 calDTO.setId("jangys9510@gmail.com");
		 calendarList.add(calDTO);
	}
	
	@Test
	public void testGetEvent() throws IOException {
		//when
		ArrayList<EventDTO> result = new GoogleCalendarService().getEvent(calendarList, 2018, 5,1,1);
		
		//then
		assertEquals(singleEventList.size(), result.size());
		for(int i=0;i<result.size();i++) {
			assertEquals(singleEventList.get(i).getStart(), result.get(i).getStart());
			assertEquals(singleEventList.get(i).getEnd(), result.get(i).getEnd());
		}
	}
	

}
