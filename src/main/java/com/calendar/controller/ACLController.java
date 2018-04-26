package com.calendar.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.calendar.dto.ACLInputDTO;
import com.calendar.dto.CalendarInputDTO;
import com.calendar.sCalendar.GoogleCalendarService;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Acl;
import com.google.api.services.calendar.model.AclRule;
import com.google.api.services.calendar.model.AclRule.Scope;


@Controller
public class ACLController {
	@RequestMapping(value="/getACLList",method = RequestMethod.GET)
	public @ResponseBody List<AclRule> getACLList(CalendarInputDTO dto) {
		List<AclRule> result =null;
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			Acl acl = service.acl().list(dto.getType()).execute();
			result = acl.getItems();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
	
	@RequestMapping(value="/addACLRule",method=RequestMethod.POST)
	public @ResponseBody AclRule addACLRule(ACLInputDTO dto) {
		AclRule acl = null;
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			Scope scope = new Scope().setType("user").setValue(dto.getValue());
			AclRule input = new AclRule().setRole(dto.getRole()).setScope(scope);
			
			acl = service.acl().insert(dto.getCalendarId(), input).execute();
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return acl;
	}
	@RequestMapping(value="/deleteACLRule",method=RequestMethod.GET)
	public @ResponseBody String deleteACLRule(ACLInputDTO dto) {
		String result = "true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			service.acl().delete(dto.getCalendarId(), dto.getId()).execute();
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = new EventController().getErrorMessage(e.getMessage());
		}
		return result;
	}
	@RequestMapping(value="/updateACLRule",method=RequestMethod.POST)
	public @ResponseBody String updateACLRule(ACLInputDTO dto) {
		String result = "true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			AclRule acl = service.acl().get(dto.getCalendarId(), dto.getId()).execute();
			 acl.setRole(dto.getRole());
			service.acl().update(dto.getCalendarId(), dto.getId(), acl).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = new EventController().getErrorMessage(e.getMessage());
		}
		return result;
	}
}
