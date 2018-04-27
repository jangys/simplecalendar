package com.calendar.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.junit.runner.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.calendar.dto.CalendarDTO;
import com.calendar.dto.CalendarInputDTO;
import com.calendar.dto.CheckedCalendarDTO;
import com.calendar.dto.EventDTO;
import com.calendar.sCalendar.GoogleCalendarService;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;

@Controller
public class CalendarController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	@RequestMapping(value = "/CalendarList", method = RequestMethod.GET)
	public @ResponseBody ArrayList<CalendarDTO> getCalendarList(Model model,HttpServletRequest request,HttpServletResponse response) throws IOException {
		ArrayList<CalendarDTO> result;
		result = new GoogleCalendarService().getCalendarList();
		HttpSession session = request.getSession();
		int size = result.size();
		for(int i=0;i<size;i++) {
			String id = result.get(i).getId();
			if(session.getAttribute(id) == null) {
				session.setAttribute(id, true);
			}else {
				boolean check = (boolean)session.getAttribute(id);
				result.get(i).setCheck(check);
			}
		}
		Enumeration en = session.getAttributeNames();
		while(en.hasMoreElements()) {
			String id = en.nextElement().toString();
			boolean exist = false;
			for(int i=0; i< size;i++) {
				if(id.equals(result.get(i).getId())) {
					exist = true;
				}
			}//for
			if(!exist) {
				System.out.println("remove : "+id);
				session.removeAttribute(id);
			}
		}
		return result;
	}
	@RequestMapping(value = "/check/{type}", method = RequestMethod.GET)
	public @ResponseBody ArrayList<EventDTO> getCheckedCalendarEventList(@PathVariable String type,CheckedCalendarDTO checkedCal, HttpServletRequest request) throws IOException{
		ArrayList<EventDTO> result = null;
		HttpSession session = request.getSession();
		boolean check = (boolean)session.getAttribute(checkedCal.getId());
		session.removeAttribute(checkedCal.getId());
		check = check == true ? false:true;
		session.setAttribute(checkedCal.getId(),check);
		System.out.println(checkedCal.getId() + " - "+(boolean)session.getAttribute(checkedCal.getId()));
		ArrayList<CalendarDTO> calendarList = new ArrayList<CalendarDTO>();
		Enumeration en = session.getAttributeNames();
		while(en.hasMoreElements()) {
			String id = en.nextElement().toString();
			boolean checkAtt = (boolean)session.getAttribute(id);
			if(checkAtt) {
			CalendarDTO dto = new CalendarDTO();
			dto.setId(id);
			dto.setCheck(checkAtt);
			calendarList.add(dto);
			}
		}
		switch(type) {
		case "m":
			result = new GoogleCalendarService().getEvent(calendarList, checkedCal.getYear(), checkedCal.getMonth(),1,GoogleCalendarService.MONTHLY);
			break;
		case "l":
			result = new GoogleCalendarService().getEvent(calendarList, checkedCal.getYear(), checkedCal.getMonth(),1,GoogleCalendarService.MONTHLY);
			break;
		case "w":
			result = new GoogleCalendarService().getEvent(calendarList, checkedCal.getYear(), checkedCal.getMonth(),checkedCal.getDate(),GoogleCalendarService.WEEKLY);
			break;
		case "d":
			result = new GoogleCalendarService().getEvent(calendarList, checkedCal.getYear(), checkedCal.getMonth(),checkedCal.getDate(),GoogleCalendarService.DAILY);
			break;
		}
		
		return result;
	}
	
	//session 정보 따라 달력 체크 여부를 바꿔줘서 전송.
	public ArrayList<CalendarDTO> getCheckedCalendarList(HttpServletRequest request) throws IOException{
		HttpSession session = request.getSession();
		ArrayList<CalendarDTO> calendarList = new ArrayList<CalendarDTO>();
		Enumeration en = session.getAttributeNames();
		while(en.hasMoreElements()) {
			String id = en.nextElement().toString();
			CalendarDTO dto = new CalendarDTO();
			boolean check = (boolean)session.getAttribute(id);
			if(check) {
				dto.setId(id);
				dto.setCheck(true);
				calendarList.add(dto);
			}
		}
		return calendarList;
	}
	@RequestMapping(value="/getCalendar",method = RequestMethod.GET)
	public @ResponseBody CalendarListEntry getCalendar(CalendarInputDTO dto){
		CalendarListEntry calendar = new CalendarListEntry();
		GoogleCalendarService gcs = new GoogleCalendarService();
		System.out.println(dto.getType());
		try {
			Calendar service= gcs.getCalendarService();
			calendar = service.calendarList().get(dto.getType()).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return calendar;
	}
	@RequestMapping(value = "/deleteCalendar", method = RequestMethod.GET)
	public @ResponseBody String deleteCalendar(CalendarInputDTO dto) {
		String result="true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			service.calendars().delete(dto.getType()).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = new EventController().getErrorMessage(e.getMessage());
		}
		
		return result;
	}
	
	@RequestMapping(value = "/updateCalendar", method = RequestMethod.POST)
	public @ResponseBody String updateCalendar(@RequestBody CalendarInputDTO dto) {
		String result="true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			
			if(dto.getType().equals("add")) {
				com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();
				calendar.setSummary(dto.getSummary())
				.setDescription(dto.getDescription())
				.setTimeZone(dto.getTimezone())
				;
				com.google.api.services.calendar.model.Calendar newCalendar = service.calendars().insert(calendar).execute();
				if(dto.getDefaultReminders() != null && newCalendar != null) {
					CalendarListEntry entry = service.calendarList().get(newCalendar.getId()).execute();
					entry.setDefaultReminders(dto.getDefaultReminders());
					service.calendarList().update(newCalendar.getId(), entry).execute();
				}
			}else {
				CalendarListEntry entry = service.calendarList().get(dto.getType()).execute();
				entry
				.setSummary(dto.getSummary())
				.setDescription(dto.getDescription())
				.setTimeZone(dto.getTimezone())
				.setDefaultReminders(dto.getDefaultReminders())
				;
				service.calendarList().update(entry.getId(), entry).execute();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = new EventController().getErrorMessage(e.getMessage());
		}
		
		return result;
	}
	
}
