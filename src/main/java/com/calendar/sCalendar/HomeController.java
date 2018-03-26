package com.calendar.sCalendar;

import java.io.IOException;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	
	public static int year;
	public static int month;
	
	//초기 화면
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		return "index";
	}
	
	@RequestMapping(value = "/MonthlyCalendar")
	public @ResponseBody ArrayList<CalendarDTO> getEventList(Locale locale, Model model){
		ArrayList<CalendarDTO> eventList = new ArrayList<>();
		GoogleCalendarService gcs = new GoogleCalendarService();
		Date date = new Date();
		if(year == 0 || month == 0) {
			year = date.getYear()+1900;
			month = date.getMonth()+1;
		}
		System.out.println(year+" , "+month);
		try {
			gcs.getEvent(year,month);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		eventList = gcs.dto;
		
		return eventList;
	}
	
	//월 뷰 요청
		@RequestMapping(value = "/getMonthlyCalendar")
		public @ResponseBody ArrayList<CalendarDTO> getBackMonthEventList(@RequestParam("year") int y, @RequestParam("month") int m , Model model,HttpServletResponse response)throws Exception{
			ArrayList<CalendarDTO> eventList = new ArrayList<>();
			GoogleCalendarService gcs = new GoogleCalendarService();
			month = m;
			year = y;
			try {
				gcs.getEvent(year,month);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			eventList = gcs.dto;
			
			return eventList;
			
		}
		
	
}
