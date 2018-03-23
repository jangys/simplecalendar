package com.calendar.sCalendar;

import java.io.IOException;
import java.text.DateFormat;

import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
		
		Date date = new Date();
		GoogleCalendarService gcs = new GoogleCalendarService();
		year = date.getYear()+1900;
		month = date.getMonth()+1;
		try {
			gcs.getEvent(year,month);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		int size = gcs.dto.size();
		String titleList[] = new String[size];
		int dateList[] = new int[size];
		for(int i=0;i<size;i++) {
			CalendarDTO tempDTO = gcs.dto.get(i);
			titleList[i] = tempDTO.getTitle();
			dateList[i] = tempDTO.startYMD[2];
		}
		model.addAttribute("eventDate",dateList);
		model.addAttribute("eventSummary",titleList);
		return "index";
	}
	
	//현재 월과 다른 월 요청 시
	@RequestMapping(value = "/sCalendar" , method = RequestMethod.GET)
	public String request(HttpServletRequest request,Model model) {
		
		if(request.getParameter("forward") != null && request.getParameter("back") == null) {
			int forward = Integer.parseInt(request.getParameter("forward"));
			month = forward+1;
			if(year == 0) {
				Date date = new Date();
				year = date.getYear()+1900;
			}
			if(month == 13) {
				year ++;
				month = 1;
			}
		}
		if(request.getParameter("forward") == null && request.getParameter("back") != null) {
			int back = Integer.parseInt(request.getParameter("back"));
			System.out.println(back);
			month = back-1;
			if(year == 0) {
				Date date = new Date();
				year = date.getYear()+1900;
			}
			if(month == 0) {
				year--;
				month = 12;
			}
		}
		
		GoogleCalendarService gcs = new GoogleCalendarService();
		try {
			gcs.getEvent(year,month);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		int size = gcs.dto.size();
		String titleList[] = new String[size];
		int dateList[] = new int[size];
		for(int i=0;i<size;i++) {
			CalendarDTO tempDTO = gcs.dto.get(i);
			titleList[i] = tempDTO.getTitle();
			dateList[i] = tempDTO.startYMD[2];
		}
		model.addAttribute("year", year);
		model.addAttribute("month", month);
		model.addAttribute("eventDate",dateList);
		model.addAttribute("eventSummary",titleList);
		return "MonthlyCalendar";
	}

}
