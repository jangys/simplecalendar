package com.calendar.sCalendar;

import java.io.IOException;
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

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.Calendar.Events.Get;
import com.google.api.services.calendar.model.Event;

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
		try {
			service = gcs.getCalendarService();
			Event event = service.events().get(calendarId, eventId).execute();
			event.setSummary(request.getParameter("summary"))
			.setLocation(request.getParameter("location"))
			.setDescription(request.getParameter("description"));
			Event updatedEvent = service.events().update(calendarId, event.getId(), event).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "redirect:/m/2018-4-2";
	}
}
