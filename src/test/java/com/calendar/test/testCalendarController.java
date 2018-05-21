package com.calendar.test;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.calendar.controller.CalendarController;
import com.calendar.dto.CalendarDTO;
import com.calendar.dto.EventDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class testCalendarController {

	private static MockMvc mockMvc;
	
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
	public void test5InsertCalendar() {
		fail("Not yet implemented");
	}
	
	@Test
	public void test6UpdateCalendar() {
		fail("Not yet implemented");
	}

	@Test
	public void test7DeleteCalendar() {
		fail("Not yet implemented");
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
