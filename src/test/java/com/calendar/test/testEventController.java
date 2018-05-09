package com.calendar.test;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnit;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcBuilder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.calendar.controller.EventController;
import com.calendar.dto.CalendarDTO;
import com.calendar.dto.EventDTO;
import com.calendar.sCalendar.EventProcessing;
import com.calendar.sCalendar.GoogleCalendarService;
import com.calendar.sCalendar.comparator;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;

@RunWith(org.mockito.junit.MockitoJUnitRunner.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class testEventController {

	@InjectMocks
	private EventController eventcontroller;
	private MockMvc mockMvc;
	
	private static ArrayList<CalendarDTO> calendarList;
	
	@BeforeClass
	public static void setUp() {
		 calendarList = new ArrayList<>();
		 CalendarDTO calDTO = new CalendarDTO();
		 calDTO.setId("jangys9510@gmail.com");
		 calendarList.add(calDTO);
	}
	
	@Before
	public void setUpMock() throws Exception{
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(eventcontroller).build();
	}
	
	@Test
	public void test1GetMonthEventList() throws Exception {
		//when
//		ArrayList<EventDTO> result = new EventController().getMonthEventList(2018, 5, 1, )
//		ArrayList<EventDTO> expect =  getSingleEvents(2018, 5, 1, GoogleCalendarService.MONTHLY);
		MvcResult result = this.mockMvc.perform(get("/monthly/2018/5/1"))
				.andExpect(status().isOk())
				.andReturn();
		System.out.println(result.toString());
		//then
//		assertEquals(expect.size(), result.size());
//		for(int i=0;i<result.size();i++) {
//			assertEquals(expect.get(i).getStart(), result.get(i).getStart());
//			assertEquals(expect.get(i).getEnd(), result.get(i).getEnd());
//		}
	}

	@Test
	public void test2GetDailyEventList() {
		fail("Not yet implemented");
	}

	@Test
	public void test3GetWeeklyEventList() {
		fail("Not yet implemented");
	}

	@Test
	public void test4DeleteEvent() {
		fail("Not yet implemented");
	}

	@Test
	public void test5DeleteRecurrenceEvent() {
		fail("Not yet implemented");
	}

	@Test
	public void test6UpdateResponseStatus() {
		fail("Not yet implemented");
	}

	@Test
	public void test7UpdateEventDate() {
		fail("Not yet implemented");
	}

	@Test
	public void test8UpdateEvent() {
		fail("Not yet implemented");
	}
	
	public ArrayList<EventDTO> getSingleEvents(int year, int month, int date, int type) throws IOException {
		ArrayList<EventDTO> expect = new ArrayList<>();
		LocalDate cur = LocalDate.of(year,month,date);
		LocalDateTime nowLocal = cur.atStartOfDay();
		ZonedDateTime nowZdt = nowLocal.atZone(ZoneId.systemDefault());
        DateTime now = new DateTime(nowZdt.toInstant().toEpochMilli());
    	 DateTime next = null;
         switch(type) {
         case GoogleCalendarService.MONTHLY:
         	LocalDateTime localM = cur.plusMonths(1).atTime(0, 0);
         	ZonedDateTime zdtM = localM.atZone(ZoneId.systemDefault());
         	next = new DateTime(zdtM.toInstant().toEpochMilli()-60000l);	
         	break;
         case GoogleCalendarService.WEEKLY:
         	LocalDateTime local = cur.plusWeeks(1).atTime(0,0);
         	ZonedDateTime zdt = local.atZone(ZoneId.systemDefault());
         	next = new DateTime(zdt.toInstant().toEpochMilli());
         	break;
         case GoogleCalendarService.DAILY:
         	LocalDateTime localD = cur.plusDays(1).atTime(0,0);
         	ZonedDateTime zdtD = localD.atZone(ZoneId.systemDefault());
         	next = new DateTime(zdtD.toInstant().toEpochMilli());
         	System.out.println(next.toString());
         	break;
         }
		Events events = new GoogleCalendarService().getCalendarService().events().list(calendarList.get(0).getId())
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
             tempDTO.setCalendarID(calendarList.get(0).getId());
             tempDTO.setSummary(event.getSummary());
             tempDTO.setStart(start.getValue(),start.isDateOnly());
             tempDTO.setEnd(end.getValue(),end.isDateOnly());
             tempDTO.setEventID(event.getId());
             tempDTO.setLocation(event.getLocation());
             tempDTO.setDescription(event.getDescription());
             tempDTO.setAttendees(event.getAttendees());
             tempDTO.setGuestsCanSeeOtherGuests(guestsCanSeeOtherGuests);
             expect.add(tempDTO);
		 }
		 Collections.sort(expect,new comparator());
		 expect = new EventProcessing().arrangeOrder(expect, 2018, 5);
		
		return expect;
	}

}
