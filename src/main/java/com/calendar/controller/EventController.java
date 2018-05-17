package com.calendar.controller;

import java.awt.List;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.Locale;
import java.util.TimeZone;

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

import com.calendar.dto.CalendarAndEventIdDTO;
import com.calendar.dto.EventDTO;
import com.calendar.dto.EventDetailDTO;
import com.calendar.dto.EventInputDTO;
import com.calendar.dto.UpdateEventDateDTO;
import com.calendar.dto.UpdateResponseDTO;
import com.calendar.sCalendar.GoogleCalendarService;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.Calendar.Events.Get;
import com.google.api.services.calendar.Calendar.Events.Update;
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
		public @ResponseBody ArrayList<EventDTO> getMonthEventList(@PathVariable int year,@PathVariable int month,@PathVariable int date, HttpServletRequest request)throws Exception{
			ArrayList<EventDTO> eventList = new ArrayList<>();
			GoogleCalendarService gcs = new GoogleCalendarService();
			try {
				eventList = gcs.getEvent(new CalendarController().getCheckedCalendarList(request),year,month,1,GoogleCalendarService.MONTHLY);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return eventList;
		}
		
	//일 뷰 요청
	@RequestMapping(value = "/daily/{year}/{month}/{date}")
	public @ResponseBody ArrayList<EventDTO> getDailyEventList(@PathVariable int year,@PathVariable int month,@PathVariable int date, Model model,HttpServletResponse response,HttpServletRequest request)throws Exception{
		ArrayList<EventDTO> eventList = new ArrayList<>();
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			eventList = gcs.getEvent(new CalendarController().getCheckedCalendarList(request),year,month,date,GoogleCalendarService.DAILY);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return eventList;
	}
	//주 뷰 요청
	@RequestMapping(value = "/weekly/{year}/{month}/{date}")
	public @ResponseBody ArrayList<EventDTO> getWeeklyEventList(@PathVariable int year,@PathVariable int month,@PathVariable int date, Model model,HttpServletResponse response,HttpServletRequest request)throws Exception{
		ArrayList<EventDTO> eventList = new ArrayList<>();
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			eventList = gcs.getEvent(new CalendarController().getCheckedCalendarList(request),year,month,date,GoogleCalendarService.WEEKLY);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return eventList;
	}
//	//이벤트 디테일 요청
//	@RequestMapping(value = "/showEventDetail")
//	public @ResponseBody EventDetailDTO getEventDetail(CalendarAndEventIdDTO dto) {
//		EventDetailDTO result = new EventDetailDTO();
//		try {
//				com.google.api.services.calendar.Calendar service = new GoogleCalendarService().getCalendarService();
//				Event event = service.events().get(dto.getCalendarId(), dto.getEventId()).execute();
//				result.setSummary(event.getSummary());
//				DateTime start = event.getStart().getDateTime();
//		        if (start == null) {
//		            start = event.getStart().getDate();
//		        }
//		        DateTime end = event.getEnd().getDateTime();
//		        if(end == null) {
//		        	end = event.getEnd().getDate();
//		        }
//		        result.setStart(start.getValue(), start.isDateOnly());
//		        result.setEnd(end.getValue(), end.isDateOnly());
//		        result.setLocation(event.getLocation());
//				result.setDescription(event.getDescription());
//				result.setRecurrence(event.getRecurrence());
//				
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		return result;
//	}
	
	//이벤트 삭제
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
	
	//반복 일정 삭제
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
	
	//이벤트 하나만
	@RequestMapping(value = "/getEvent",method = RequestMethod.GET)
	public @ResponseBody Event getEventObject(CalendarAndEventIdDTO dto, Model model){
		Event result = new Event();
		
		try {
			result = new GoogleCalendarService().getCalendarService().events().get(dto.getCalendarId(), dto.getEventId()).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
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
	
	//이벤트 날짜 수정
	@RequestMapping(value="/updateEventDate",method=RequestMethod.POST)
	public @ResponseBody String updateEventDate(@RequestBody UpdateEventDateDTO dto, Model model) {
		String result = "true";
		GoogleCalendarService gcs = new GoogleCalendarService();
		
		try {
			Calendar service = gcs.getCalendarService();
			Event event = service.events().get(dto.getCalendarId(), dto.getEventId()).execute();
			EventDateTime start = new EventDateTime();
			EventDateTime end = new EventDateTime();
			EventDateTime originalStartTime = new EventDateTime();
			System.out.println(dto.getIsAllDay());
			if(dto.getIsAllDay()) {//종일 일정인 경우
				ZonedDateTime zdt = LocalDateTime.now().atZone(ZoneId.systemDefault());
				int offset = zdt.getOffset().getTotalSeconds()/60;
				start.setDate(new DateTime(true, dto.getStartDate(), offset));
				end.setDate(new DateTime(true, dto.getEndDate(), offset));
				originalStartTime.setDate(new DateTime(true, dto.getOriginalStartTime(), offset));
			}else {//시간이 있는 일정인 경우
				start.setDateTime(new DateTime(dto.getStartDate()));
				end.setDateTime(new DateTime(dto.getEndDate()));
				originalStartTime.setDateTime(new DateTime(dto.getOriginalStartTime()));
			}
			event.setStart(start)
				.setEnd(end)
				;
			if(dto.getIsRecurrence()) {//반복 일정을 옮기는 경우
				Event instance = new Event()
						.setSummary(event.getSummary())
						.setLocation(event.getLocation())
						.setDescription(event.getDescription())
						.setStart(start)
						.setEnd(end)
						.setReminders(event.getReminders())
						.setAttendees(event.getAttendees())
						.setRecurringEventId(dto.getEventId())
						.setOriginalStartTime(originalStartTime)
						.setGuestsCanInviteOthers(event.getGuestsCanInviteOthers())
						.setGuestsCanModify(event.getGuestsCanModify())
						.setGuestsCanSeeOtherGuests(event.getGuestsCanSeeOtherGuests())
						.setVisibility(event.getVisibility())
						.setTransparency(event.getTransparency())
						;
				service.events().insert(dto.getCalendarId(), instance).execute();
			}else {
				service.events().update(dto.getCalendarId(), dto.getEventId(), event).execute();
			}
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
		EventDateTime originalStartTime = new EventDateTime();
		Reminders reminders = new Reminders();
		System.out.println(dto.getSummary());
		String[] strStartDate = dto.getStartDate().split("-");
		String[] strEndDate = dto.getEndDate().split("-");
		long originalStart = 0;
		
		if(dto.getOriginalStartDate() != null)
			originalStart = dto.getOriginalStartDate()[0]-dto.getOriginalStartDate()[1]; // 0-> 첫번째 일정의 시작 날짜, 1-> 이 반복 일정의 원래 날짜	//2->첫번째 일정이 종일이었는지 여부 0-false, 1-true
		
		LocalDateTime updateStart = null;
		LocalDateTime dt = LocalDateTime.now();
		ZonedDateTime zdt = dt.atZone(ZoneId.systemDefault());
		int offset = zdt.getOffset().getTotalSeconds()/60;
		
		if(dto.getAllDay().equals("true")) {//시작이 종일 날짜인 경우
			//시작 날짜 구하기
			LocalDate startD = LocalDate.of(Integer.parseInt(strStartDate[0]), Integer.parseInt(strStartDate[1]), Integer.parseInt(strStartDate[2]));
			long startDValue = startD.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli();
			
			if(dto.getUpdateType() == EventInputDTO.ALL) {//반복일정 수정인 경우 모든 일정 수정
				start.setDate(new DateTime(true,originalStart+startDValue,offset));
			}else {//반복 일정 수정 그 외
				start.setDate(new DateTime(true,startDValue,offset));
				updateStart = startD.atTime(9,0);
			}
		}else {//시작이 시간이 있는 날짜
			//시작 날짜 구하기
			String[] strStartDateTime = dto.getStartDateTime().split(":");
			System.out.println(dto.getStartDateTime());
			LocalDateTime startDT = LocalDateTime.of(Integer.parseInt(strStartDate[0]), Integer.parseInt(strStartDate[1]), 
					Integer.parseInt(strStartDate[2]), Integer.parseInt(strStartDateTime[0]), Integer.parseInt(strStartDateTime[1]));
			zdt = startDT.atZone(ZoneId.systemDefault());
			long startDTValue = zdt.toInstant().toEpochMilli();
			
			//반복 일정인 경우
			if(dto.getUpdateType() == EventInputDTO.ALL) {
				start.setDateTime(new DateTime(startDTValue+originalStart)).setTimeZone("Asia/Seoul");
			}else {
				start.setDateTime(new DateTime(startDTValue)).setTimeZone("Asia/Seoul");
				updateStart = startDT;
			}
		}
		
		if(dto.getUpdateType() == EventInputDTO.ONLYTHIS) {//반복 일정 수정 중 한개만 수정
			if(dto.getOriginalStartDate()[2] == 1) {//첫번째 반복 일정이 종일 일정이었을 경우
				originalStartTime.setDate(new DateTime(true,dto.getOriginalStartDate()[1],offset)).setTimeZone("Asia/Seoul");
			}else {
				originalStartTime.setDateTime(new DateTime(dto.getOriginalStartDate()[1])).setTimeZone("Asia/Seoul");
				System.out.println(originalStartTime.toString());
			}
		}
		
		//일정 끝 날짜 구하기
		long originalEnd = 0;
		if(dto.getOriginalEndDate() != null)
			originalEnd = dto.getOriginalEndDate()[0]-dto.getOriginalEndDate()[1];
		
		if(dto.getAllDay().equals("true")) {//종일 일정
			LocalDate endD = LocalDate.of(Integer.parseInt(strEndDate[0]), Integer.parseInt(strEndDate[1]), Integer.parseInt(strEndDate[2]));
			long endDValue = endD.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli();
			if(dto.getUpdateType() == EventInputDTO.ALL) {//이미 하루 차이 나서 allday는 그래서 더해줄 필요 없음
				end.setDate(new DateTime(true,endDValue+originalEnd,offset)).setTimeZone("Asia/Seoul");
				if(dto.getOriginalStartDate()[2] == 0) {//첫번째 반복 일정이 시간이 있는 일정이었을 경우
					end.setDate(new DateTime(true,endDValue+originalEnd+86400000l,offset)).setTimeZone("Asia/Seoul");
				}
			}else {
				end.setDate(new DateTime(true,endDValue+86400000l,offset)).setTimeZone("Asia/Seoul");
			}
			
		}else {//시간이 있는 일정
			String[] strEndDateTime = dto.getEndDateTime().split(":");
			LocalDateTime endDT = LocalDateTime.of(Integer.parseInt(strEndDate[0]), Integer.parseInt(strEndDate[1]), Integer.parseInt(strEndDate[2]), 
					Integer.parseInt(strEndDateTime[0]), Integer.parseInt(strEndDateTime[1]));
			zdt = endDT.atZone(ZoneId.systemDefault());
			long endDTValue = zdt.toInstant().toEpochMilli();
			
			//반복 일정 수정인 경우
			if(dto.getUpdateType() == EventInputDTO.ALL ) {
				System.out.println("0 : "+new DateTime(dto.getOriginalEndDate()[0]).toString() + " 1 : "+new DateTime(dto.getOriginalEndDate()[1]).toString() + " endD : "+endDT.toString());
				end.setDateTime(new DateTime(endDTValue+originalEnd)).setTimeZone("Asia/Seoul");
				if(dto.getOriginalStartDate()[2] == 1) {//첫번째 반복 일정이 종일 일정이었을 경우
					end.setDateTime(new DateTime(endDTValue+originalEnd-86400000l)).setTimeZone("Asia/Seoul");	// 종일 일정이었으면 하루가 더 더해져 있으니깐
				}
			}else {
				end.setDateTime(new DateTime(endDTValue)).setTimeZone("Asia/Seoul");
			}
		}
		System.out.println(start.toString());
		System.out.println(end.toString());
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
		
		//반복 룰 추가
		ArrayList<String> recurrence = new ArrayList<String>();
		if(dto.getRecurrence() != null) {
			recurrence.addAll(dto.getRecurrence());
		}
		
		Event event = new Event()
				.setSummary(dto.getSummary())
				.setLocation(dto.getLocation())
				.setDescription(dto.getDescription())
				.setStart(start)
				.setEnd(end)
				.setReminders(reminders)
				.setAttendees(dto.getAttendees())
				.setGuestsCanInviteOthers(dto.getGuestsCanInviteOthers())
				.setGuestsCanModify(dto.getGuestsCanModify())
				.setGuestsCanSeeOtherGuests(dto.getGuestsCanSeeOtherGuests())
				.setVisibility(dto.getVisibility())
				.setTransparency(dto.getTransparency())
				;
		if(eventId.equals("addEvent")){//일정을 입력한 경우
			try {
				System.out.println("e  "+reminders.getUseDefault());
				service = gcs.getCalendarService();
				event.setRecurrence(recurrence);
				
				String newCalendarId = dto.getCalendars();
				service.events().insert(newCalendarId, event).execute();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				eventResult = getErrorMessage(e.getMessage());
			}
			
		}else{//수정인 경우
			try {
				service = gcs.getCalendarService();
				if(dto.getUpdateType() == EventInputDTO.ONLYTHIS) {	//반복 일정 한개만 수정
					event.setRecurringEventId(eventId)
						.setOriginalStartTime(originalStartTime);
					service.events().insert(dto.getCalendars(), event).execute();
					
				}else if(dto.getUpdateType() == EventInputDTO.NEXT) {//반복 일정 향후 일정 수정
					Event updateEvent = service.events().get(calendarId, eventId).execute();
					updateEvent.setRecurrence(dto.getOriginRecurrence());
					service.events().update(calendarId, updateEvent.getId(), updateEvent).execute();
					event.setRecurrence(dto.getRecurrence());
					
					service.events().insert(dto.getCalendars(), event).execute();
				}else {//반복 일정 모든 일정 수정, 그외 수정
					Event updateEvent = service.events().get(calendarId, eventId).execute();
					updateEvent
					.setSummary(dto.getSummary())
					.setLocation(dto.getLocation())
					.setDescription(dto.getDescription())
					.setStart(start)
					.setEnd(end)
					.setReminders(reminders)
					.setAttendees(dto.getAttendees())
					.setRecurrence(recurrence)
					.setGuestsCanInviteOthers(dto.getGuestsCanInviteOthers())
					.setGuestsCanModify(dto.getGuestsCanModify())
					.setGuestsCanSeeOtherGuests(dto.getGuestsCanSeeOtherGuests())
					.setVisibility(dto.getVisibility())
					.setTransparency(dto.getTransparency())
					;
					System.out.println("update Events");
					service.events().update(calendarId, updateEvent.getId(), updateEvent).execute();
					String newCalendarId = dto.getCalendars();
					if(!newCalendarId.equals(calendarId)) {	// 캘린더 옮긴 경우
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
	//오류 메시지 추출
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
	//한자리 수 앞에 0 더하기
	public String addZero(int num) {
		String result ="";
		if(num < 10) {
			result += "0";
		}
		result += num;
		return result;
	}
}
