package com.calendar.controller;

import java.io.File;
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
import org.springframework.web.servlet.ModelAndView;

import com.calendar.dto.CalendarAndEventIdDTO;
import com.calendar.dto.CalendarDTO;
import com.calendar.dto.CalendarInputDTO;
import com.calendar.dto.CheckedCalendarDTO;
import com.calendar.dto.EventDTO;
import com.calendar.dto.WriteICSInputDTO;
import com.calendar.sCalendar.GoogleCalendarService;
import com.calendar.sCalendar.UtilFile;
import com.calendar.sCalendar.WriteICSFile;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarList;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.EventReminder;

@Controller
public class CalendarController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	@RequestMapping(value = "/CalendarList", method = RequestMethod.GET)
	public @ResponseBody ArrayList<CalendarDTO> getCalendarList(Model model,HttpServletRequest request,HttpServletResponse response) throws IOException {
		ArrayList<CalendarDTO> result = new ArrayList<CalendarDTO>();
		
        CalendarList calendarList = new GoogleCalendarService().getCalendarService().calendarList().list().execute();
        List<CalendarListEntry> items = calendarList.getItems();
        
        for (CalendarListEntry calendarListEntry : items) {
          CalendarDTO tempDTO = new CalendarDTO();
          tempDTO.setId(calendarListEntry.getId());
          tempDTO.setSummary(calendarListEntry.getSummary());
          tempDTO.setCheck(true);
          tempDTO.setColorId(calendarListEntry.getColorId());
          tempDTO.setDefaultReminders(calendarListEntry.getDefaultReminders());
          boolean primary = true;
          if(calendarListEntry.getPrimary() == null) {
        	  primary = false;
          }
          tempDTO.setPrimary(primary);
          tempDTO.setAccessRole(calendarListEntry.getAccessRole());
          result.add(tempDTO);
        }
        
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
		String result = "";
		GoogleCalendarService gcs = new GoogleCalendarService();
		com.google.api.services.calendar.model.Calendar resultCalendar = new com.google.api.services.calendar.model.Calendar();
		try {
			Calendar service = gcs.getCalendarService();
			
			if(dto.getType().equals("add")) {
				com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();
				calendar.setSummary(dto.getSummary())
				.setDescription(dto.getDescription())
				.setTimeZone(dto.getTimezone())
				;
				com.google.api.services.calendar.model.Calendar newCalendar = service.calendars().insert(calendar).execute();
				resultCalendar = newCalendar;
				if(dto.getDefaultReminders() != null && newCalendar != null) {
					CalendarListEntry entry = service.calendarList().get(newCalendar.getId()).execute();
					entry.setDefaultReminders(dto.getDefaultReminders());
					service.calendarList().update(newCalendar.getId(), entry).execute();
				}
			}else {
				
				List<EventReminder> defaultReminders = null;
				if(dto.getDefaultReminders().size() > 0) {
					defaultReminders = dto.getDefaultReminders();
					CalendarListEntry entry = service.calendarList().get(dto.getType()).execute();
					entry
					.setDefaultReminders(defaultReminders)
					;
					service.calendarList().update(entry.getId(), entry).execute();
				}
				
				com.google.api.services.calendar.model.Calendar calendar = service.calendars().get(dto.getType()).execute();
				calendar.setSummary(dto.getSummary())
					.setDescription(dto.getDescription())
					.setTimeZone(dto.getTimezone())
					;
				resultCalendar = service.calendars().update(calendar.getId(), calendar).execute();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = new EventController().getErrorMessage(e.getMessage());
		}
		
		return resultCalendar.getId();
	}
	@RequestMapping(value = "/writeICSFile")
	public @ResponseBody String writeICSFile(WriteICSInputDTO dto) {
		String result = "";
		result = new WriteICSFile().getICSFilePath(dto.getCalendarId(),dto.getCalendarName(),dto.getTimezone(),dto.getPrimary());	
		return result;
	}
	
	@RequestMapping(value="/downloadFile")
	public ModelAndView downloadFile(@RequestParam(value="path") String path) {
		String fullPath = "C:/Users/USER/Documents/Spring_Project2/Calendar_v1/src/main/resources/"+path;
		File downFile = new File(fullPath);
		System.out.println(downFile.getAbsolutePath());
		return new ModelAndView("downloadView","calendar",downFile);
	}
}
