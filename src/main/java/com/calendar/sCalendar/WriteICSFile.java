package com.calendar.sCalendar;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttachment;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;
import com.google.api.services.calendar.model.Events;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.extensions.parameter.Filename;
import net.fortuna.ical4j.model.Date;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.Dur;
import net.fortuna.ical4j.model.TimeZone;
import net.fortuna.ical4j.model.TimeZoneRegistry;
import net.fortuna.ical4j.model.TimeZoneRegistryFactory;
import net.fortuna.ical4j.model.component.VAlarm;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.parameter.Cn;
import net.fortuna.ical4j.model.parameter.CuType;
import net.fortuna.ical4j.model.parameter.PartStat;
import net.fortuna.ical4j.model.parameter.Role;
import net.fortuna.ical4j.model.parameter.Rsvp;
import net.fortuna.ical4j.model.parameter.TzId;
import net.fortuna.ical4j.model.parameter.XParameter;
import net.fortuna.ical4j.model.property.Action;
import net.fortuna.ical4j.model.property.Attach;
import net.fortuna.ical4j.model.property.Attendee;
import net.fortuna.ical4j.model.property.CalScale;
import net.fortuna.ical4j.model.property.Clazz;
import net.fortuna.ical4j.model.property.Created;
import net.fortuna.ical4j.model.property.Description;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStamp;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.LastModified;
import net.fortuna.ical4j.model.property.Location;
import net.fortuna.ical4j.model.property.Method;
import net.fortuna.ical4j.model.property.Organizer;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.RRule;
import net.fortuna.ical4j.model.property.RecurrenceId;
import net.fortuna.ical4j.model.property.Sequence;
import net.fortuna.ical4j.model.property.Status;
import net.fortuna.ical4j.model.property.Summary;
import net.fortuna.ical4j.model.property.Transp;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.model.property.Version;
import net.fortuna.ical4j.model.property.XProperty;
import net.fortuna.ical4j.validate.ValidationException;

public class WriteICSFile {
	
	public String getICSFilePath(String calendarId, String calendarName, String timezone, String primary) {
		String result = "";
		ArrayList<Event> eventList = getEventList(calendarId);
		try {
			result = writeICSFilePath(eventList,calendarId, calendarName,timezone,primary);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
	
	public ArrayList<Event> getEventList(String calendarId){
		ArrayList<Event> eventList = new ArrayList<>();
		try {
			Calendar service = new GoogleCalendarService().getCalendarService();
			String pageToken = null;
			do {
				Events events = service.events().list(calendarId).setPageToken(pageToken).execute();
				eventList.addAll(events.getItems());
				pageToken = events.getNextPageToken();
			}while(pageToken != null);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return eventList;
	}
	
	public String writeICSFilePath(ArrayList<Event> eventList,String calendarId, String calendarName,String timezone,String primary) throws URISyntaxException, FileNotFoundException {
		String path = "";
		String calFile="D:/Java Spring/Project2/Calendar_v1/src/main/resources/calendar.ics";
		FileOutputStream fout = new FileOutputStream(calFile);
		net.fortuna.ical4j.model.Calendar calendar = new net.fortuna.ical4j.model.Calendar();
		//setting calendar
		calendar.getProperties().add(new ProdId("-//Google Inc//Google Calendar 70.9054//EN"));
		calendar.getProperties().add(Version.VERSION_2_0);
		calendar.getProperties().add(CalScale.GREGORIAN);
		calendar.getProperties().add(new XProperty("X-WR-CALNAME", calendarName));
		System.out.println(timezone);
		calendar.getProperties().add(new XProperty("X-WR-TIMEZONE", timezone));
		
		//setting timezone
		TimeZoneRegistry registry = TimeZoneRegistryFactory.getInstance().createRegistry();
		VTimeZone vt = registry.getTimeZone(timezone).getVTimeZone();
		calendar.getComponents().add(vt);
		
		//for default reminder
		CalendarListEntry entry = null;
		try {
			entry = new GoogleCalendarService().getCalendarService().calendarList().get(calendarId).execute();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//setting events
		for(Event event : eventList) {
			VEvent vEvent = new VEvent();
			//set time
			DtStart dtStart = null;
			DtEnd dtEnd = null;
			if(event.getStart().getDate() != null) {//allday
				Date start = new Date(event.getStart().getDate().getValue());
				Date end = new Date(event.getEnd().getDate().getValue());
				dtStart= new DtStart(start);
				dtEnd = new DtEnd(end);
			}else {
				DateTime start = new DateTime(event.getStart().getDateTime().getValue());
				DateTime end = new DateTime(event.getEnd().getDateTime().getValue());
				dtStart= new DtStart(start);
				dtEnd = new DtEnd(end);
			}
			if(event.getStart().getTimeZone() != null) {
				dtStart.getParameters().add(new TzId(event.getStart().getTimeZone()));
			}
			if(event.getEnd().getTimeZone() != null) {
				dtEnd.getParameters().add(new TzId(event.getEnd().getTimeZone()));
			}
			vEvent.getProperties().add(dtStart);
			vEvent.getProperties().add(dtEnd);
			
			//set summary
			vEvent.getProperties().add(new Summary(event.getSummary()));
			//set create time
			vEvent.getProperties().add(new Created(new DateTime(event.getCreated().getValue())));
			//set last-modified
			vEvent.getProperties().add(new LastModified(new DateTime(event.getUpdated().getValue())));
			//set sequence
			vEvent.getProperties().add(new Sequence(event.getSequence()));
			//set orgainzer
			URI mailToURI = new URI("mailto",event.getOrganizer().getEmail(),null);
			Organizer organizer = new Organizer(mailToURI);
			organizer.getParameters().add(new Cn(event.getOrganizer().getEmail()));
			vEvent.getProperties().add(organizer);
			//set uid
			vEvent.getProperties().add(new Uid(event.getICalUID()));
			//set status
			if(event.getStatus() == null) {
				vEvent.getProperties().add(Status.VEVENT_CONFIRMED);
			}else {
				switch(event.getStatus()) {
				case "confirmed":
					vEvent.getProperties().add(Status.VEVENT_CONFIRMED);
					break;
				case "tentative":
					vEvent.getProperties().add(Status.VEVENT_TENTATIVE);
					break;
				case "cancelled":
					vEvent.getProperties().add(Status.VEVENT_CANCELLED);
					break;
				}
			}
			//set transp
			if(event.getTransparency() == null) {
				vEvent.getProperties().add(Transp.OPAQUE);
			}else {
				vEvent.getProperties().add(Transp.TRANSPARENT);
			}
			//set Description
			vEvent.getProperties().add(new Description(event.getDescription()));
			//set Location
			vEvent.getProperties().add(new Location(event.getLocation()));
			//set Attendee
			if(event.getAttendees() != null) {
				List<EventAttendee> attendees = event.getAttendees();
				for(int i=0;i<attendees.size();i++) {
					Attendee a = new Attendee(new URI("mailto",attendees.get(i).getEmail(),null));
					a.getParameters().add(CuType.INDIVIDUAL);
					if(attendees.get(i).getOptional() != null) {
						a.getParameters().add(Role.OPT_PARTICIPANT);
					}else {
						a.getParameters().add(Role.REQ_PARTICIPANT);
					}
					switch(attendees.get(i).getResponseStatus()) {
					case "needsAction":
						a.getParameters().add(PartStat.NEEDS_ACTION);
						break;
					case "declined":
						a.getParameters().add(PartStat.DECLINED);
						break;
					case "tentative":
						a.getParameters().add(PartStat.TENTATIVE);
						break;
					case "accepted":
						a.getParameters().add(PartStat.ACCEPTED);
						break;
					}
					String displayName = attendees.get(i).getEmail();
					if(attendees.get(i).getDisplayName() != null) {
						displayName = attendees.get(i).getDisplayName();
					}
					a.getParameters().add(new Cn(displayName));
					String guestsNum = "0";
					if(attendees.get(i).getAdditionalGuests() != null) {
						guestsNum = attendees.get(i).getAdditionalGuests().toString();
					}
					a.getParameters().add(new XParameter("X-NUM-GUESTS",guestsNum));
					vEvent.getProperties().add(a);
				}
			}
			//setting attach
			if(event.getAttachments() != null) {
				for(EventAttachment attachment : event.getAttachments()) {
					Attach attach = new Attach(new URI(attachment.getFileUrl()));
					attach.getParameters().add(new Filename(attachment.getTitle()));
				}
			}
			//setting rrule
			if(event.getRecurrence() != null) {
				for(String rrule : event.getRecurrence()) {
					try {
						RRule rule = new RRule(rrule.split(":")[1]);
						vEvent.getProperties().add(rule);
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			//setting recurrence id
			if(event.getOriginalStartTime() != null) {
				EventDateTime dateTime = event.getOriginalStartTime();
				RecurrenceId recurrenceId = null;
				if(dateTime.getDate() != null) {
					recurrenceId = new RecurrenceId(new Date(dateTime.getDate().getValue()));
				}else {
					recurrenceId = new RecurrenceId(new DateTime(dateTime.getDateTime().getValue()));
				}
				if(dateTime.getTimeZone() != null) {
					recurrenceId.getParameters().add(new TzId(dateTime.getTimeZone()));
				}
				vEvent.getProperties().add(recurrenceId);
			}
			//setting class
			if(event.getVisibility() != null) {
				Clazz clazz = null;
				switch(event.getVisibility()) {
				case "private":
					clazz = new Clazz("PRIVATE");
					break;
				case "confidential":
					clazz = new Clazz("CONFIDENTIAL");
					break;
				}
				vEvent.getProperties().add(clazz);
			}
			
			//setting alarm
			if(event.getReminders() != null) {
				if(event.getReminders().getUseDefault()) {//default reminder ¾²¸é
					for(EventReminder reminder : entry.getDefaultReminders()) {
						int minutes = -reminder.getMinutes();
						int hours = minutes/60;
						if(hours > 0){
							minutes = minutes%60;
						}
						int days = hours/24;
						if(days > 0) {
							hours = days%24;
						}
						VAlarm vAlarm = new VAlarm(new Dur(days, hours, minutes, 0));
						switch(reminder.getMethod()) {
						case "popup":
							vAlarm.getProperties().add(Action.DISPLAY);
							vAlarm.getProperties().add(new Description("This is an event reminder"));
							break;
						case "email":
							vAlarm.getProperties().add(Action.EMAIL);
							vAlarm.getProperties().add(new Description("This is an event reminder"));
							vAlarm.getProperties().add(new Summary("Alarm notification"));
							vAlarm.getProperties().add(new Attendee(new URI("mailto",primary,null)));
							break;
						}
						vEvent.getAlarms().add(vAlarm);
					}
				}else {//default reminder ¾È¾¸
					if(event.getReminders().getOverrides() != null) {
						for(EventReminder reminder : event.getReminders().getOverrides()) {
							int minutes = -reminder.getMinutes();
							int hours = minutes/60;
							if(hours < 0){
								minutes = minutes%60;
							}
							int days = hours/24;
							if(days < 0) {
								hours = days%24;
							}
							VAlarm vAlarm = new VAlarm(new Dur(days, hours, minutes, 0));
							switch(reminder.getMethod()) {
							case "popup":
								vAlarm.getProperties().add(Action.DISPLAY);
								vAlarm.getProperties().add(new Description("This is an event reminder"));
								break;
							case "email":
								vAlarm.getProperties().add(Action.EMAIL);
								vAlarm.getProperties().add(new Description("This is an event reminder"));
								vAlarm.getProperties().add(new Summary("Alarm notification"));
								vAlarm.getProperties().add(new Attendee(new URI("mailto",primary,null)));
								break;
							}
							vEvent.getAlarms().add(vAlarm);
						}
					}
				}
			}
			calendar.getComponents().add(vEvent);
		}
		
		CalendarOutputter outputter = new CalendarOutputter();
		try {
			outputter.output(calendar,fout);
		} catch (ValidationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		path = "/calendar.ics";
		return path;
	}
}
