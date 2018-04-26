package com.calendar.controller;

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
	@RequestMapping(value = "/event/{calendarId}/{eventId}/{type}", method = RequestMethod.GET)
	public String refreshEventPage(@PathVariable String calendarId, @PathVariable String eventId,@PathVariable String type,Locale locale, Model model) {
		return "index";
	}
	@RequestMapping(value = "/calendar/{calendarId}/{type}", method = RequestMethod.GET)
	public String refreshCalendarPage(@PathVariable String calendarId,@PathVariable String type,Locale locale, Model model) {
		return "index";
	}
	
	@RequestMapping(value = "/showEventPage")
	public String showEventPage(HttpServletRequest requset, Locale locale, Model model) {
		return "EventDetail";
	}
	@RequestMapping(value = "/showAddEventPage")
	public String showAddEventPage(HttpServletRequest requset, Locale locale, Model model) {
		return "EventDetail";
	}	

	@RequestMapping(value = "/showCalendarPage")
	public String showCalendarPage(Model model) {
		return "CalendarDetail";
	}
}
