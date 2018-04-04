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
import org.springframework.web.bind.annotation.RequestBody;
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
	@RequestMapping(value = "/check/m", method = RequestMethod.GET)
	public @ResponseBody ArrayList<EventDTO> getCheckedCalendarEventList(CheckedCalendarDTO checkedCal, HttpServletRequest request) throws IOException{
		ArrayList<EventDTO> result;
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
		result = new GoogleCalendarService().getEvent_Month(calendarList, checkedCal.getYear(), checkedCal.getMonth());
		return result;
	}
	
	//session ���� ���� �޷� üũ ���θ� �ٲ��༭ ����.
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
}