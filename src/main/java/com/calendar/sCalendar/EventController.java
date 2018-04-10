package com.calendar.sCalendar;

import java.awt.List;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.runner.Request;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.Calendar.Events.Get;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Event.Reminders;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;

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
		System.out.println(requset.getParameter("addEventDate"));
		model.addAttribute("calendarId",requset.getParameter("addEventDate"));
		
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
	public String updateEvent(EventInputDTO dto, HttpServletRequest request, Model model) {
		GoogleCalendarService gcs = new GoogleCalendarService();
		Calendar service;
		String calendarId = dto.getCalendarId();
		String eventId = dto.getEventId();
		EventDateTime start = new EventDateTime();
		EventDateTime end = new EventDateTime();
		Reminders reminders = new Reminders();
		System.out.println(dto.getSummary());
		String[] strStartDate = dto.getStartDate().split("-");
		String[] strEndDate = dto.getEndDate().split("-");
		if(dto.getAllDay() != null) {
			Date startD;
			startD = new Date(Integer.parseInt(strStartDate[0])-1900, Integer.parseInt(strStartDate[1])-1, Integer.parseInt(strStartDate[2]),9,0);	//timezone만큼 시간 설정해야함.
			System.out.println(startD.toString());
			start.setDate(new DateTime(true,startD.getTime(),startD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
			
		}else {
			String[] strStartDateTime = dto.getStartDateTime().split(":");
			System.out.println(dto.getStartDateTime());
			Date startD = new Date(Integer.parseInt(strStartDate[0])-1900, Integer.parseInt(strStartDate[1])-1, Integer.parseInt(strStartDate[2]), 
					Integer.parseInt(strStartDateTime[0]), Integer.parseInt(strStartDateTime[1]));
			start.setDateTime(new DateTime(startD)).setTimeZone("Asia/Seoul");
		}
		if(dto.getAllDay() != null) {
			Date endD;
			endD = new Date(Integer.parseInt(strEndDate[0])-1900, Integer.parseInt(strEndDate[1])-1, Integer.parseInt(strEndDate[2]),9,0);
			DateTime endDate = new DateTime(endD);
			end.setDate(new DateTime(true,endD.getTime()+86400000l,endD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
		}else {
			String[] strEndDateTime = dto.getEndDateTime().split(":");
			Date endD = new Date(Integer.parseInt(strEndDate[0])-1900, Integer.parseInt(strEndDate[1])-1, Integer.parseInt(strEndDate[2]), 
					Integer.parseInt(strEndDateTime[0]), Integer.parseInt(strEndDateTime[1]));
			end.setDateTime(new DateTime(endD)).setTimeZone("Asia/Seoul");
		}
		System.out.println(start.toString());
		System.out.println(end.toString());
		//System.out.println(startDate.toString());
		//String[] strStartDateTime = request.getParameter("startDateTime").split(":");
		//알람 default 체크
		boolean useDefault = false;
		if(dto.getOverrides() != null) {
			if(dto.getOverrides().size() == 2) {
				EventReminder eventReminder = dto.getOverrides().get(0);
				if(eventReminder.getMethod().equals("popup") && eventReminder.getMinutes() == 30) {
					EventReminder eventReminderTwo = dto.getOverrides().get(1);
					if(eventReminderTwo.getMethod().equals("email") && eventReminderTwo.getMinutes() == 10) {
						useDefault = true;
					}
				}
			}
			if(!useDefault) {
				reminders.setOverrides(dto.getOverrides());
				System.out.println(dto.getOverrides().get(0).getMethod()+", "+dto.getOverrides().get(0).getMinutes());
			}
		}
		reminders.setUseDefault(useDefault);
		EventAttendee[] attendees = new EventAttendee[] {
			new EventAttendee().setEmail("kaka@example.com"),
			new EventAttendee().setEmail("jangys9510@naver.com"),
		};
		
		if(calendarId.equals(dto.getCalendars())) {
			try {
				service = gcs.getCalendarService();
				Event event = service.events().get(calendarId, eventId).execute();
				event.setSummary(dto.getSummary())
				.setLocation(dto.getLocation())
				.setDescription(dto.getDescription())
				.setStart(start)
				.setEnd(end)
				.setReminders(reminders)
				;
				Event updatedEvent = service.events().update(calendarId, event.getId(), event).execute();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else if(!calendarId.equals(dto.getCalendars())){//calendar Id를 수정한 경우나 일정을 입력한 경우
			try {
				service = gcs.getCalendarService();
				
				if(!eventId.equals("addEvent")) {
					service.events().delete(calendarId, eventId).execute();
				}
				Event event = new Event()
						.setSummary(dto.getSummary())
						.setLocation(dto.getLocation())
						.setDescription(dto.getDescription())
						.setStart(start)
						.setEnd(end)
						.setReminders(reminders)
//						.setAttendees(Arrays.asList(attendees))
						;
				String newCalendarId = dto.getCalendars();
				service.events().insert(newCalendarId, event).execute();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return "redirect:/m/"+dto.getStartDate();
	}
}
