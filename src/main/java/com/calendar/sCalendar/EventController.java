package com.calendar.sCalendar;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.runner.Request;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.Calendar.Events.Get;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;

@Controller
public class EventController {
	
	//이벤트 디테일 요청
	@RequestMapping(value = "/showEventDetail")
	public @ResponseBody EventDetailDTO getEventDetail(CalendarAndEventIdDTO dto) {
		EventDetailDTO result = new EventDetailDTO();
		try {
			result = new GoogleCalendarService().getEventDetail(dto.getCalendarId(), dto.getEventId());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
	
	@RequestMapping(value = "/deleteEvent", method = RequestMethod.GET)
	public @ResponseBody boolean deleteEvent(CalendarAndEventIdDTO dto){
		boolean result = false;
		GoogleCalendarService gcs = new GoogleCalendarService();
		com.google.api.services.calendar.Calendar service;
		try {
			service = gcs.getCalendarService();
			service.events().delete(dto.getCalendarId(), dto.getEventId()).execute();
			result = true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
	
	@RequestMapping(value = "/showEventPage")
	public String showEventPage(HttpServletRequest requset, Locale locale, Model model) {
		model.addAttribute("eventId",requset.getParameter("eventId"));
		model.addAttribute("calendarId",requset.getParameter("calendarId"));
		
		return "EventDetail";
	}

	@RequestMapping(value = "/showAddEventPage")
	public String showAddEventPage(HttpServletRequest requset, Locale locale, Model model) {
		model.addAttribute("eventId", "addEvent");
		model.addAttribute("calendarId","addEvent");
		return "EventDetail";
	}
	
	@RequestMapping(value = "/getEvent",method = RequestMethod.GET)
	public @ResponseBody Event getEventObject(CalendarAndEventIdDTO dto, Model model){
		Event result = new Event();
		result = new GoogleCalendarService().getEvent(dto.getCalendarId(), dto.getEventId());
		
		return result;
	}
	
	//수정
	@RequestMapping(value="/updateEvent",method = RequestMethod.POST)
	public String updateEvent(HttpServletRequest request, Model model) {
		GoogleCalendarService gcs = new GoogleCalendarService();
		Calendar service;
		String calendarId = request.getParameter("calendarId");
		String eventId = request.getParameter("eventId");
		EventDateTime start = new EventDateTime();
		EventDateTime end = new EventDateTime();
		String[] strStartDate = request.getParameter("startDate").split("-");
		String[] strEndDate = request.getParameter("endDate").split("-");
		System.out.println(request.getParameter("allDay"));
		if(request.getParameter("allDay") != null) {
			Date startD;
			startD = new Date(Integer.parseInt(strStartDate[0])-1900, Integer.parseInt(strStartDate[1])-1, Integer.parseInt(strStartDate[2]),9,0);	//timezone만큼 시간 설정해야함.
			System.out.println(startD.toString());
			start.setDate(new DateTime(true,startD.getTime(),startD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
			
		}else {
			String[] strStartDateTime = request.getParameter("startDateTime").split(":");
			System.out.println(request.getParameter("startDateTime"));
			Date startD = new Date(Integer.parseInt(strStartDate[0])-1900, Integer.parseInt(strStartDate[1])-1, Integer.parseInt(strStartDate[2]), 
					Integer.parseInt(strStartDateTime[0]), Integer.parseInt(strStartDateTime[1]));
			start.setDateTime(new DateTime(startD)).setTimeZone("Asia/Seoul");
		}
		if(request.getParameter("allDay") != null) {
			Date endD;
			endD = new Date(Integer.parseInt(strEndDate[0])-1900, Integer.parseInt(strEndDate[1])-1, Integer.parseInt(strEndDate[2])+1,9,0);
			DateTime endDate = new DateTime(endD);
			
			end.setDate(new DateTime(true,endD.getTime(),endD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
			
		}else {
			String[] strEndDateTime = request.getParameter("endDateTime").split(":");
			Date endD = new Date(Integer.parseInt(strEndDate[0])-1900, Integer.parseInt(strEndDate[1])-1, Integer.parseInt(strEndDate[2]), 
					Integer.parseInt(strEndDateTime[0]), Integer.parseInt(strEndDateTime[1]));
			end.setDateTime(new DateTime(endD)).setTimeZone("Asia/Seoul");
		}
		System.out.println(start.toString());
		System.out.println(end.toString());
		//System.out.println(startDate.toString());
		//String[] strStartDateTime = request.getParameter("startDateTime").split(":");
		if(calendarId.equals(request.getParameter("calendars"))) {
			try {
				service = gcs.getCalendarService();
				Event event = service.events().get(calendarId, eventId).execute();
				event.setSummary(request.getParameter("summary"))
				.setLocation(request.getParameter("location"))
				.setDescription(request.getParameter("description"))
				.setStart(start)
				.setEnd(end)
				;
				Event updatedEvent = service.events().update(calendarId, event.getId(), event).execute();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else if(!calendarId.equals(request.getParameter("calendars"))){//calendar Id를 수정한 경우나 일정을 입력한 경우
			try {
				service = gcs.getCalendarService();
				
				if(!calendarId.equals("addEvent")) {
					service.events().delete(calendarId, eventId).execute();
				}
				Event event = new Event()
						.setSummary(request.getParameter("summary"))
						.setLocation(request.getParameter("location"))
						.setDescription(request.getParameter("description"))
						.setStart(start)
						.setEnd(end)
						;
				String newCalendarId = request.getParameter("calendars");
				service.events().insert(newCalendarId, event).execute();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return "redirect:/m/"+request.getParameter("startDate");
	}
}
