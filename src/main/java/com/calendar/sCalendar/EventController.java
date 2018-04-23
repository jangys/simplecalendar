package com.calendar.sCalendar;

import java.awt.List;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.runner.Request;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.Calendar.Events.Get;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Event.Reminders;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;

@Controller
public class EventController {
	
	//월 뷰 요청
		@RequestMapping(value = "/monthly/{year}/{month}/{date}")
		public @ResponseBody ArrayList<EventDTO> getMonthEventList(@PathVariable int year,@PathVariable int month,@PathVariable int date, Model model,HttpServletResponse response,HttpServletRequest request)throws Exception{
			ArrayList<EventDTO> eventList = new ArrayList<>();
			GoogleCalendarService gcs = new GoogleCalendarService();
			try {
				eventList = gcs.getEvent_Month(new CalendarController().getCheckedCalendarList(request),year,month);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return eventList;
		}
	
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
	public @ResponseBody String deleteEvent(CalendarAndEventIdDTO dto){
		String result = "true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		com.google.api.services.calendar.Calendar service;
		try {
			service = gcs.getCalendarService();
			service.events().delete(dto.getCalendarId(), dto.getEventId()).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = getErrorMessage(e.getMessage());
		}
		
		return result;
	}
	@RequestMapping(value="/deleteRecurrenceEvent",method = RequestMethod.GET)
	public @ResponseBody String deleteRecurrenceEvent(CalendarAndEventIdDTO dto) {
		String result = "true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		com.google.api.services.calendar.Calendar service;
		try {
			service = gcs.getCalendarService();
			if(dto.getDeleteType() == EventInputDTO.ONLYTHIS || dto.getDeleteType() == EventInputDTO.NEXT) {
				Event updateEvent = service.events().get(dto.getCalendarId(), dto.getEventId()).execute();
				//EXDATE;TZID=Asia/Seoul:20180515T120000
				String[] strDate = dto.getStartTime().split("-");
				java.util.List<String> recurrence = updateEvent.getRecurrence();
				if(dto.getDeleteType() == EventInputDTO.ONLYTHIS) {
					String exdate = "EXDATE;TZID=Asia/Seoul:"+strDate[0]+addZero(Integer.parseInt(strDate[1]))+addZero(Integer.parseInt(strDate[2]));
					recurrence.add(exdate);
				}else {
					int removeIndex = 0;
					for(int i=0;i<recurrence.size();i++) {
						if(recurrence.get(i).substring(0, 5).equals("RRULE")) {
							removeIndex = i;
							break;
						}
					}
					recurrence.remove(removeIndex);
					recurrence.add(dto.getRrule());
				}
				updateEvent.setRecurrence(recurrence);
				service.events().update(dto.getCalendarId(), dto.getEventId(), updateEvent).execute();
			}else {
				service.events().delete(dto.getCalendarId(), dto.getEventId()).execute();
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = getErrorMessage(e.getMessage());
		}
		return result;
	}
	
	@RequestMapping(value = "/getEvent",method = RequestMethod.GET)
	public @ResponseBody Event getEventObject(CalendarAndEventIdDTO dto, Model model){
		Event result = new Event();
		result = new GoogleCalendarService().getEvent(dto.getCalendarId(), dto.getEventId());
		
		return result;
	}
	
	//내 응답 상태만 수정
	@RequestMapping(value="/updateResponseStatus",method = RequestMethod.POST)
	public @ResponseBody String updateResponseStatus(UpdateResponseDTO dto, Model model) {
		String result="true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			Calendar service = gcs.getCalendarService();
			Event event = service.events().get(dto.getCalendarId(), dto.getEventId()).execute();
			java.util.List<EventAttendee> listAttendees = event.getAttendees();
			int size = listAttendees.size();
			ArrayList<EventAttendee> attendees = new ArrayList<EventAttendee>();
			for(EventAttendee attendee : listAttendees) {
				if(attendee.getEmail().equals(dto.getUserId())) {
					System.out.println(dto.getResponseStatus());
					attendee.setResponseStatus(dto.getResponseStatus());
				}
				attendees.add(attendee);
			}
			event.setAttendees(attendees);
			service.events().update(dto.getCalendarId(), event.getId(), event).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result = getErrorMessage(e.getMessage());
		}
		return result;
	}
	//수정
	@RequestMapping(value="/updateEvent",method = RequestMethod.POST)
	public @ResponseBody String updateEvent(@RequestBody EventInputDTO dto, HttpServletRequest request, Model model) {
		GoogleCalendarService gcs = new GoogleCalendarService();
		Calendar service;
		String calendarId = dto.getCalendarId();
		String eventId = dto.getEventId();
		String eventResult="true";
		EventDateTime start = new EventDateTime();
		EventDateTime end = new EventDateTime();
		Reminders reminders = new Reminders();
		System.out.println(dto.getSummary());
		String[] strStartDate = dto.getStartDate().split("-");
		String[] strEndDate = dto.getEndDate().split("-");
		long originalStart = dto.getOriginalStartDate()[0]-dto.getOriginalStartDate()[1];
		Date updateStart = new Date();
		Date updateEnd = new Date();
		if(dto.getAllDay().equals("true")) {
			Date startD;
			startD = new Date(Integer.parseInt(strStartDate[0])-1900, Integer.parseInt(strStartDate[1])-1, Integer.parseInt(strStartDate[2]),9,0);	//timezone만큼 시간 설정해야함.
		//	System.out.println(startD.toString());
			if(dto.getUpdateType() == EventInputDTO.ALL) {
				start.setDate(new DateTime(true,originalStart+startD.getTime(),startD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
			}else {
				start.setDate(new DateTime(true,startD.getTime(),startD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
				updateStart = startD;
			}
		}else {
				String[] strStartDateTime = dto.getStartDateTime().split(":");
				System.out.println(dto.getStartDateTime());
				Date startD = new Date(Integer.parseInt(strStartDate[0])-1900, Integer.parseInt(strStartDate[1])-1, Integer.parseInt(strStartDate[2]), 
						Integer.parseInt(strStartDateTime[0]), Integer.parseInt(strStartDateTime[1]));
				System.out.println("original Start = "+startD.toString());
				if(dto.getUpdateType() == EventInputDTO.ALL) {
					start.setDateTime(new DateTime(startD.getTime()+originalStart)).setTimeZone("Asia/Seoul");
				}else {
					start.setDateTime(new DateTime(startD)).setTimeZone("Asia/Seoul");
					updateStart = startD;
				}
		}
		long originalEnd = dto.getOriginalEndDate()[0]-dto.getOriginalEndDate()[1];
		if(dto.getAllDay().equals("true")) {
			Date endD;
			endD = new Date(Integer.parseInt(strEndDate[0])-1900, Integer.parseInt(strEndDate[1])-1, Integer.parseInt(strEndDate[2]),9,0);
			if(dto.getUpdateType() == EventInputDTO.ALL) {//이미 하루 차이 나서 allday는 그래서 더해줄 필요 없음
				end.setDate(new DateTime(true,endD.getTime()+originalEnd,endD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
			}else {
				end.setDate(new DateTime(true,endD.getTime()+86400000l,endD.getTimezoneOffset())).setTimeZone("Asia/Seoul");
				updateEnd = new Date(endD.getTime());
			}
			
		}else {
			String[] strEndDateTime = dto.getEndDateTime().split(":");
			Date endD = new Date(Integer.parseInt(strEndDate[0])-1900, Integer.parseInt(strEndDate[1])-1, Integer.parseInt(strEndDate[2]), 
					Integer.parseInt(strEndDateTime[0]), Integer.parseInt(strEndDateTime[1]));
			if(dto.getUpdateType() == EventInputDTO.ALL ) {
				end.setDateTime(new DateTime(endD.getTime()+originalEnd)).setTimeZone("Asia/Seoul");
				
			}else {
				end.setDateTime(new DateTime(endD)).setTimeZone("Asia/Seoul");
				updateEnd = new Date(endD.getTime());
			}
		}
		System.out.println(start.toString());
		System.out.println(end.toString());
		//System.out.println(startDate.toString());
		//String[] strStartDateTime = request.getParameter("startDateTime").split(":");
		//알람 default 체크
		boolean useDefault = true;
		if(dto.getOverrides() != null) {
			if(dto.getOverrides().size() == dto.getDefaultReminders().size()) {
				int index = 0;
				for(EventReminder eventReminder : dto.getOverrides()) {
					EventReminder defaultReminder = dto.getDefaultReminders().get(index);
					if(!eventReminder.getMethod().equals(defaultReminder.getMethod()) || eventReminder.getMinutes() != defaultReminder.getMinutes()) {
						useDefault = false;
						break;
					}
					index++;
				}
			}else {
				useDefault = false;
			}
		}
		System.out.println("useDefault = "+useDefault);
		if(!useDefault) {
			reminders.setOverrides(dto.getOverrides());
		}
		reminders.setUseDefault(useDefault);
		System.out.println("update type : "+dto.getUpdateType());
		ArrayList<String> recurrence = new ArrayList<String>();
		if(dto.getRecurrence() != null) {
			recurrence.addAll(dto.getRecurrence());
		}
		String exdateStr = (updateStart.getYear()+1900)+addZero(updateStart.getMonth()+1)+addZero(updateStart.getDate());
		if(!dto.getAllDay().equals("true"))
			exdateStr += "T"+addZero(updateStart.getHours())+addZero(updateStart.getMinutes())+"00";
		if(dto.getUpdateType() == EventInputDTO.ONLYTHIS) {
			//EXDATE;TZID=Asia/Seoul:20180515T120000
			String exdate = "EXDATE;TZID=Asia/Seoul:"+exdateStr;
			System.out.println(exdate);
			recurrence.add(exdate);
		}
		System.out.println(reminders.getUseDefault());
		if(eventId.equals("addEvent")){//일정을 입력한 경우
			try {
				System.out.println("e  "+reminders.getUseDefault());
				service = gcs.getCalendarService();
				Event event = new Event()
						.setSummary(dto.getSummary())
						.setLocation(dto.getLocation())
						.setDescription(dto.getDescription())
						.setStart(start)
						.setEnd(end)
						.setReminders(reminders)
						.setAttendees(dto.getAttendees())
						.setRecurrence(recurrence)
						;
				String newCalendarId = dto.getCalendars();
				service.events().insert(newCalendarId, event).execute();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				eventResult = getErrorMessage(e.getMessage());
			}
			
		}else{
			try {
				service = gcs.getCalendarService();
				Event updateEvent = service.events().get(calendarId, eventId).execute();
				System.out.println("dd  "+reminders.getUseDefault());
				if(dto.getUpdateType() == EventInputDTO.ONLYTHIS) {
					updateEvent
						.setRecurrence(recurrence);
					service.events().update(calendarId, updateEvent.getId(), updateEvent).execute();
					Event event = new Event()
							.setSummary(dto.getSummary())
							.setLocation(dto.getLocation())
							.setDescription(dto.getDescription())
							.setStart(start)
							.setEnd(end)
							.setReminders(reminders)
							.setAttendees(dto.getAttendees())
							//.setRecurringEventId(eventId)
							;
					service.events().insert(calendarId, event).execute();
				}else if(dto.getUpdateType() == EventInputDTO.NEXT) {
					updateEvent.setRecurrence(dto.getOriginRecurrence());
					service.events().update(calendarId, updateEvent.getId(), updateEvent).execute();
					Event event = new Event()
							.setSummary(dto.getSummary())
							.setLocation(dto.getLocation())
							.setDescription(dto.getDescription())
							.setStart(start)
							.setEnd(end)
							.setReminders(reminders)
							.setAttendees(dto.getAttendees())
							.setRecurrence(dto.getRecurrence())
							//.setRecurringEventId(eventId)
							;
					System.out.println("update Next");
					service.events().insert(dto.getCalendars(), event).execute();
				}else {
					updateEvent.setSummary(dto.getSummary())
					.setSummary(dto.getSummary())
					.setLocation(dto.getLocation())
					.setDescription(dto.getDescription())
					.setStart(start)
					.setEnd(end)
					.setReminders(reminders)
					.setAttendees(dto.getAttendees())
					.setRecurrence(recurrence)
					;
					service.events().update(calendarId, updateEvent.getId(), updateEvent).execute();
					String newCalendarId = dto.getCalendars();
					if(!newCalendarId.equals(calendarId)) {
						System.out.println("move"+newCalendarId);
						service.events().move(calendarId, updateEvent.getId(), newCalendarId).execute();
					}
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				eventResult = getErrorMessage(e.getMessage());
				
			}
		}
		return eventResult;
	}
	public String getErrorMessage(String message) {
		String errorResult = "";
		String[] strError = message.split("message");
		if(strError.length > 1) {
			String[] error = strError[2].split(":");
			errorResult = error[1].substring(2, error[1].length()-4);
			System.out.println(errorResult);
		}
		return errorResult;
	}
	public String addZero(int num) {
		String result ="";
		if(num < 10) {
			result += "0";
		}
		result += num;
		return result;
	}
}
