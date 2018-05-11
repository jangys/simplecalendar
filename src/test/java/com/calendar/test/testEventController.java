package com.calendar.test;

import static org.junit.Assert.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcBuilder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.calendar.controller.EventController;
import com.calendar.dto.CalendarAndEventIdDTO;
import com.calendar.dto.CalendarDTO;
import com.calendar.dto.EventDTO;
import com.calendar.dto.EventInputDTO;
import com.calendar.sCalendar.EventProcessing;
import com.calendar.sCalendar.GoogleCalendarService;
import com.calendar.sCalendar.comparator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;

import net.sf.json.JSONObject;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class testEventController {

	private static MockMvc mockMvc;
	
	@BeforeClass
	public static void setUp() throws Exception{
		mockMvc = MockMvcBuilders.standaloneSetup(new EventController()).build();
	}
	
	@Test
	public void test1GetMonthEventList() throws Exception {
		//given
		ArrayList<String> calendarId = new ArrayList<>();
		calendarId.add("jangys9510@gmail.com");
		calendarId.add("kakikeku@gmail.com");
		ArrayList<EventDTO> expected =  getSingleEvents(2018, 5, 1, GoogleCalendarService.MONTHLY,calendarId);
		ObjectMapper mapper = new ObjectMapper();
		MockHttpSession session = new MockHttpSession();
		session.setAttribute("jangys9510@gmail.com", true);
		session.setAttribute("kakikeku@gmail.com", true);
		 MockHttpServletRequestBuilder builder = MockMvcRequestBuilders.get("/monthly/2018/5/1")
                 .session(session);
		 
		//when
		MvcResult result = this.mockMvc.perform(builder)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		EventDTO[] actual = mapper.readValue(content, EventDTO[].class);
		System.out.println(actual[0].getSummary());
		
		// then
		assertEquals(expected.size(), actual.length);
		for(int i=0;i<actual.length;i++) {
			assertEquals(expected.get(i).getStart(),actual[i].getStart());
			assertEquals(expected.get(i).getEnd(),actual[i].getEnd());
		}
	}

	@Test
	public void test2GetDailyEventList() throws Exception {
		//given
		ArrayList<String> calendarId = new ArrayList<>();
		calendarId.add("jangys9510@gmail.com");
		calendarId.add("kakikeku@gmail.com");
		ArrayList<EventDTO> expected =  getSingleEvents(2018, 5, 1, GoogleCalendarService.DAILY,calendarId);
		ObjectMapper mapper = new ObjectMapper();
		MockHttpSession session = new MockHttpSession();
		session.setAttribute("jangys9510@gmail.com", true);
		session.setAttribute("kakikeku@gmail.com", true);
		 MockHttpServletRequestBuilder builder = MockMvcRequestBuilders.get("/daily/2018/5/1")
                 .session(session);
		 
		//when
		MvcResult result = this.mockMvc.perform(builder)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		EventDTO[] actual = mapper.readValue(content, EventDTO[].class);
		System.out.println(actual[0].getSummary());
		
		// then
		assertEquals(expected.size(), actual.length);
		for(int i=0;i<actual.length;i++) {
			assertEquals(expected.get(i).getStart(),actual[i].getStart());
			assertEquals(expected.get(i).getEnd(),actual[i].getEnd());
		}
	}

	@Test
	public void test3GetWeeklyEventList() throws Exception {
		//given
		ArrayList<String> calendarId = new ArrayList<>();
		calendarId.add("jangys9510@gmail.com");
		ArrayList<EventDTO> expected =  getSingleEvents(2018, 4, 29, GoogleCalendarService.WEEKLY,calendarId);
		ObjectMapper mapper = new ObjectMapper();
		MockHttpSession session = new MockHttpSession();
		session.setAttribute("jangys9510@gmail.com", true);
		MockHttpServletRequestBuilder builder = MockMvcRequestBuilders.get("/weekly/2018/4/29")
                 .session(session);
		
		//when
		MvcResult result = testEventController.mockMvc.perform(builder)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		EventDTO[] actual = mapper.readValue(content, EventDTO[].class);
		System.out.println(actual[0].getSummary());
		
		// then
		assertEquals(expected.size(), actual.length);
		for(int i=0;i<actual.length;i++) {
			assertEquals(expected.get(i).getStart(),actual[i].getStart());
			assertEquals(expected.get(i).getEnd(),actual[i].getEnd());
		}
	}
	@Test
	public void test4InsertEvent() throws Exception {
		//given
		ObjectMapper mapper = new ObjectMapper();
		ArrayList<String> calendarId = new ArrayList<>();
		calendarId.add("93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com");
		
		EventInputDTO input = new EventInputDTO();
		input.setCalendarId("addEvent");
		input.setEventId("addEvent");
		input.setCalendars("93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com");	//testcode calendar
		input.setSummary("test");
		input.setAllDay("true");
		input.setStartDate("2018-05-11");
		input.setEndDate("2018-05-11");
		
		//when
		MvcResult result = this.mockMvc.perform(post("/updateEvent")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(asJsonString(input))
				)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals("true", content);
		ArrayList<EventDTO> expected = getSingleEvents(2018, 5, 11, GoogleCalendarService.DAILY, calendarId);
		for(int i=0;i<expected.size();i++) {
			assertEquals("test", expected.get(i).getSummary());
		}
	}
	@Test
	public void test5UpdateEvent() throws Exception {
		//given
		ArrayList<String> calendarId = new ArrayList<>();
		calendarId.add("93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com");
		ArrayList<EventDTO> before = getSingleEvents(2018, 5, 11, GoogleCalendarService.DAILY, calendarId);
		
		String eventId = before.get(0).getEventID();
		EventInputDTO input = new EventInputDTO();
		input.setCalendarId("93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com");
		input.setEventId(eventId);
		input.setCalendars("93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com");	//testcode calendar
		input.setSummary("updateTest");
		input.setAllDay("true");
		input.setStartDate("2018-05-12");
		input.setEndDate("2018-05-14");
		
		LocalDateTime start = LocalDateTime.of(2018, 5, 12, 9, 0);
		ZonedDateTime zdtStart = start.atZone(ZoneId.systemDefault());
		LocalDateTime end = LocalDateTime.of(2018, 5, 15, 9, 0);	//종일 일정은 하루 더 더하기
		ZonedDateTime zdtEnd = end.atZone(ZoneId.systemDefault());
		
		//when
		MvcResult result = this.mockMvc.perform(post("/updateEvent")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(asJsonString(input))
				)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals("true", content);
		Event actual = new GoogleCalendarService().getCalendarService().events().get(calendarId.get(0), eventId).execute();
		
		assertEquals("updateTest", actual.getSummary());
		assertEquals(zdtStart.toInstant().toEpochMilli(), actual.getStart().getDate().getValue());
		assertEquals(zdtEnd.toInstant().toEpochMilli(), actual.getEnd().getDate().getValue());
	}
	@Test
	public void test6UpdateDate() {
		fail("Not yet implemented");
	}
	@Test
	public void test7UpdateResponseStatus() {
		fail("Not yet implemented");
	}
	@Test
	public void test8DeleteEvent() throws Exception {
		//given
		ArrayList<String> calendarId = new ArrayList<>();
		calendarId.add("93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com");
		ArrayList<EventDTO> before = getSingleEvents(2018, 5, 12, GoogleCalendarService.DAILY, calendarId);
		String eventId = before.get(0).getEventID();
		String query = "calendarId="+"93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com";
		query += "&eventId="+eventId;
		
		//when
		MvcResult result = this.mockMvc.perform(get("/deleteEvent?"+query))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals("true", content);
		Event actual = new GoogleCalendarService().getCalendarService().events().get(calendarId.get(0), eventId).execute();
		assertEquals("cancelled", actual.getStatus());
	}

	@Test
	public void test9DeleteRecurrenceEvent() {
		fail("Not yet implemented");
	}
	
	public ArrayList<EventDTO> getSingleEvents(int year, int month, int date, int type,ArrayList<String> calendarId) throws IOException {
		ArrayList<EventDTO> expected = new ArrayList<>();
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
        for(int i=0;i<calendarId.size();i++) {
			Events events = new GoogleCalendarService().getCalendarService().events().list(calendarId.get(i))
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
	             tempDTO.setCalendarID(calendarId.get(i));
	             tempDTO.setSummary(event.getSummary());
	             tempDTO.setStart(start.getValue(),start.isDateOnly());
	             tempDTO.setEnd(end.getValue(),end.isDateOnly());
	             tempDTO.setEventID(event.getId());
	             tempDTO.setLocation(event.getLocation());
	             tempDTO.setDescription(event.getDescription());
	             tempDTO.setAttendees(event.getAttendees());
	             tempDTO.setGuestsCanSeeOtherGuests(guestsCanSeeOtherGuests);
	             expected.add(tempDTO);
			 }
        }
		 Collections.sort(expected,new comparator());
		 expected = new EventProcessing().arrangeOrder(expected, year, month);
		
		return expected;
	}
	public static String asJsonString(Object obj) {
	    try {
	        ObjectMapper mapper = new ObjectMapper();
	        String jsonContent = mapper.writeValueAsString(obj);
	        System.out.println(jsonContent);
	        return jsonContent;
	    } catch (Exception e) {
	        throw new RuntimeException(e);
	    }
	}
}
