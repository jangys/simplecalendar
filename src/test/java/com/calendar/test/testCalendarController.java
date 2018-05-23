package com.calendar.test;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.util.ArrayList;

import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.calendar.controller.CalendarController;
import com.calendar.dto.CalendarDTO;
import com.calendar.dto.CalendarInputDTO;
import com.calendar.dto.EventDTO;
import com.calendar.sCalendar.GoogleCalendarService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.calendar.model.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventReminder;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class testCalendarController {

	private static MockMvc mockMvc;
	private static String calendarId;
	
	@BeforeClass
	public static void setUp() throws Exception{
		mockMvc = MockMvcBuilders.standaloneSetup(new CalendarController()).build();
	}
	
	@Test
	public void test1GetCalendarList() throws Exception {
		//given
		ObjectMapper mapper = new ObjectMapper();
		MockHttpSession session = new MockHttpSession();
		session.setAttribute("jangys10@gmail.com", true);	//wrong calendar id
		session.setAttribute("asdf", true);	//wrong calendar id
		MockHttpServletRequestBuilder builder = MockMvcRequestBuilders.get("/CalendarList")
				.session(session);
		 
		//when
		MvcResult result = this.mockMvc.perform(builder)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		CalendarDTO[] actual = mapper.readValue(content, CalendarDTO[].class);
		
		//then
		//current number of calendars = 7
		assertEquals(7, actual.length);
	}

	@Test
	public void test2GetCheckedCalendarEventList() {
		fail("Not yet implemented");
	}

	@Test
	public void test3GetCheckedCalendarList() {
		fail("Not yet implemented");
	}

	@Test
	public void test4GetCalendar() {
		fail("Not yet implemented");
	}
	
	@Test
	public void test5InsertCalendar() throws Exception {
		//given
		CalendarInputDTO dto = new CalendarInputDTO();
		dto.setType("add");
		dto.setDescription("forTesting");
		dto.setSummary("testCode2");
		dto.setTimezone("Asia/Seoul");
		ArrayList<EventReminder> defaultReminders = new ArrayList<>();
		EventReminder reminder = new EventReminder();
		reminder.setMethod("email");
		reminder.setMinutes(100);
		defaultReminders.add(reminder);
		dto.setDefaultReminders(defaultReminders);
		
		//when
		MvcResult result = this.mockMvc.perform(post("/updateCalendar")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new testEventController().asJsonString(dto))
				)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		calendarId = content;
		CalendarListEntry calendar = new GoogleCalendarService().getCalendarService().calendarList().get(calendarId).execute();
		assertNotNull(calendar);
		assertEquals(dto.getDescription(),calendar.getDescription());
		assertEquals(dto.getSummary(), calendar.getSummary());
		assertEquals(dto.getTimezone(), calendar.getTimeZone());
		assertEquals(dto.getDefaultReminders(), calendar.getDefaultReminders());
	}
	
	@Test
	public void test6UpdateCalendar() throws Exception {
		//given
		CalendarInputDTO beforeUpdate = new CalendarInputDTO();
		beforeUpdate.setSummary("changeTitle");
		beforeUpdate.setDescription("change Description");
		beforeUpdate.setTimezone("America/Montevideo");
		ArrayList<EventReminder> defaultReminders = new ArrayList<>();
		EventReminder reminder = new EventReminder();
		reminder.setMethod("popup");
		reminder.setMinutes(10);
		defaultReminders.add(reminder);
		beforeUpdate.setType(calendarId);
		beforeUpdate.setDefaultReminders(defaultReminders);
		
		//when
		MvcResult result = this.mockMvc.perform(post("/updateCalendar")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new testEventController().asJsonString(beforeUpdate))
				)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals(calendarId, content);
		CalendarListEntry calendar = new GoogleCalendarService().getCalendarService().calendarList().get(content).execute();
		assertNotNull(calendar);
		assertEquals(beforeUpdate.getDescription(),calendar.getDescription());
		assertEquals(beforeUpdate.getSummary(), calendar.getSummary());
		assertEquals(beforeUpdate.getTimezone(), calendar.getTimeZone());
		assertEquals(beforeUpdate.getDefaultReminders(), calendar.getDefaultReminders());
	}

	@Test
	public void test7DeleteCalendar() throws Exception {
		String query = "type="+calendarId;
		//when
		MvcResult result = this.mockMvc.perform(get("/deleteCalendar?"+query))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals("true", content);
		try {
			CalendarListEntry calendar = new GoogleCalendarService().getCalendarService().calendarList().get(calendarId).execute();
		} catch (IOException e) {
			assertEquals("404", e.getMessage().substring(0, 3));
		}
	}

	@Test
	public void test8WriteICSFile() {
		fail("Not yet implemented");
	}

	@Test
	public void test9DownloadFile() {
		fail("Not yet implemented");
	}

}
