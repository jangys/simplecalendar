package com.calendar.sCalendar;

import java.io.IOException;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.api.services.calendar.model.Event;


/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	//초기 화면
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		return "index";
	}
	
	@RequestMapping(value = "/m/{date}", method = RequestMethod.GET)
	public String refreshMonthPage(@PathVariable String date, Locale locale, Model model) {
		return "index";
	}
	@RequestMapping(value = "/d/{date}", method = RequestMethod.GET)
	public String refreshDayPage(@PathVariable String date, Locale locale, Model model) {
		return "index";
	}
	@RequestMapping(value = "/w/{date}", method = RequestMethod.GET)
	public String refreshWeekPage(@PathVariable String date, Locale locale, Model model) {
		return "index";
	}
	@RequestMapping(value = "/l/{date}", method = RequestMethod.GET)
	public String refreshListPage(@PathVariable String date, Locale locale, Model model) {
		return "index";
	}
	
	@RequestMapping(value = "/MonthlyCalendar/{date}")
	public @ResponseBody ArrayList<EventDTO> getEventList(@PathVariable String date, Locale locale, Model model,HttpServletRequest request){
		ArrayList<EventDTO> eventList = new ArrayList<>();
		GoogleCalendarService gcs = new GoogleCalendarService();
		Date curDate = new Date();
		String[] temp = date.split("-");
		int year = 0;
		int month = 0;
		if(date != null) {
			year = Integer.parseInt(temp[0]);
			month = Integer.parseInt(temp[1]);
		}else {
			year = curDate.getYear()+1900;
			month = curDate.getMonth()+1;
		}
		//System.out.println(year+" , "+month);
		try {
			eventList = gcs.getEvent_Month(new CalendarController().getCheckedCalendarList(request),year,month);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return eventList;
	}
	//월 뷰 요청
		@RequestMapping(value = "/monthly/{year}/{month}/{date}")
		public @ResponseBody ArrayList<EventDTO> getBackMonthEventList(@PathVariable int year,@PathVariable int month,@PathVariable int date, Model model,HttpServletResponse response,HttpServletRequest request)throws Exception{
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
}
