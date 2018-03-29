package com.calendar.sCalendar;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
	@RequestMapping(value = "/check/{calType}/{year}/{month}/{date}", method = RequestMethod.GET)
	public @ResponseBody ArrayList<EventDTO> getCheckedCalendarEventList(@PathVariable String calType,@PathVariable int year,
			@PathVariable int month,@PathVariable int date,HttpServletRequest request) throws IOException{
		ArrayList<EventDTO> result;
		HttpSession session = request.getSession();
		String checkedId = request.getParameter("checkId");
		System.out.println(checkedId);
		boolean check = (boolean)session.getAttribute(checkedId);
		session.removeAttribute(checkedId);
		check = check == true ? false:true;
		session.setAttribute(checkedId,check);
		System.out.println(checkedId + " - "+(boolean)session.getAttribute(checkedId));
		ArrayList<CalendarDTO> calendarList = new ArrayList<CalendarDTO>();
		Enumeration en = session.getAttributeNames();
		while(en.hasMoreElements()) {
			String id = en.nextElement().toString();
			CalendarDTO dto = new CalendarDTO();
			dto.setId(id);
			dto.setCheck((boolean)session.getAttribute(id));
			calendarList.add(dto);
		}
		result = new GoogleCalendarService().getEvent_Month(calendarList, year, month);
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
			dto.setId(id);
			dto.setCheck((boolean)session.getAttribute(id));
			calendarList.add(dto);
		}
		return calendarList;
	}
}
