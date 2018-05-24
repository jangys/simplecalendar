package com.calendar.test;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;

import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.calendar.controller.ACLController;
import com.calendar.controller.CalendarController;
import com.calendar.dto.ACLInputDTO;
import com.calendar.sCalendar.GoogleCalendarService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.calendar.model.AclRule;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class testACLController {
	private static MockMvc mockMvc;
	private static String calendarId = "93o57qmdoijps2c0t0oo5crv04@group.calendar.google.com";
	
	private static String aclId;
	
	@BeforeClass
	public static void setUp() throws Exception{
		mockMvc = MockMvcBuilders.standaloneSetup(new ACLController()).build();
	}

	@Test
	public void test2AddACLRule() throws Exception {
		//given
		ObjectMapper mapper = new ObjectMapper();
		ACLInputDTO dto = new ACLInputDTO();
		dto.setCalendarId(calendarId); //for test code
		dto.setValue("kakikeku@gmail.com");
		dto.setRole("reader");
		//when
		MvcResult result = this.mockMvc.perform(post("/addACLRule")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new testEventController().asJsonString(dto))
				)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		System.out.println(content);
		AclRule actual = mapper.readValue(content, AclRule.class);
		
		//then
		assertEquals(dto.getRole(), actual.getRole());
		assertEquals(dto.getValue(), actual.getScope().getValue());
		aclId = actual.getId();
	}
	
	@Test
	public void test3UpdateACLRule() throws Exception {
		//given
		AclRule update = new GoogleCalendarService().getCalendarService().acl().get(calendarId, aclId).execute();
		update.setRole("freeBusyReader");
		
		//when
		MvcResult result = this.mockMvc.perform(post("/updateACLRule")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new testEventController().asJsonString(update))
				)
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals("true", content);
		AclRule actual = new GoogleCalendarService().getCalendarService().acl().get(calendarId, aclId).execute();
		assertEquals(update.getRole(), actual.getRole());
	}

	@Test
	public void test4DeleteACLRule() throws Exception {
		//given
		String query = "calendarId="+calendarId+"&id="+aclId;
		
		//when
		MvcResult result = this.mockMvc.perform(get("/deleteACLRule?"+query))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		
		//then
		assertEquals("true", content);
		try {
			AclRule actual = new GoogleCalendarService().getCalendarService().acl().get(calendarId, aclId).execute();
		}catch(IOException e) {
			assertEquals("404", e.getMessage().substring(0, 3));
		}
	}



}
