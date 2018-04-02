package com.calendar.sCalendar;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.util.DateTime;

import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class GoogleCalendarService {
    /** Application name. */
    private static final String APPLICATION_NAME =
        "SimpleCalendar";

    /** Directory to store user credentials for this application. */
    private static final java.io.File DATA_STORE_DIR = new java.io.File(
        System.getProperty("user.home"), ".credentials/calendar-java-quickstart");

    /** Global instance of the {@link FileDataStoreFactory}. */
    private static FileDataStoreFactory DATA_STORE_FACTORY;

    /** Global instance of the JSON factory. */
    private static final JsonFactory JSON_FACTORY =
        JacksonFactory.getDefaultInstance();

    /** Global instance of the HTTP transport. */
    private static HttpTransport HTTP_TRANSPORT;

    /** Global instance of the scopes required by this quickstart.
     *
     * If modifying these scopes, delete your previously saved credentials
     * at ~/.credentials/calendar-java-quickstart
     */
    private static final List<String> SCOPES =
        Arrays.asList(CalendarScopes.CALENDAR_READONLY);

    static {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            DATA_STORE_FACTORY = new FileDataStoreFactory(DATA_STORE_DIR);
        } catch (Throwable t) {
            t.printStackTrace();
            System.exit(1);
        }
    }

    /**
     * Creates an authorized Credential object.
     * @return an authorized Credential object.
     * @throws IOException
     */
    
    //����
    public static Credential authorize() throws IOException {
        // Load client secrets.
        InputStream in =
            GoogleCalendarService.class.getResourceAsStream("/client-secret.json");
        GoogleClientSecrets clientSecrets =
            GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow =
                new GoogleAuthorizationCodeFlow.Builder(
                        HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(DATA_STORE_FACTORY)
                .setAccessType("online")	//request online access
                .build();
        Credential credential = new AuthorizationCodeInstalledApp(
            flow, new LocalServerReceiver()).authorize("user");
        System.out.println(
                "Credentials saved to " + DATA_STORE_DIR.getAbsolutePath());
        return credential;
    }

    /**
     * Build and return an authorized Calendar client service.
     * @return an authorized Calendar client service
     * @throws IOException
     */
    //����
    public static com.google.api.services.calendar.Calendar
        getCalendarService() throws IOException {
        Credential credential = authorize();
        return new com.google.api.services.calendar.Calendar.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    //@SuppressWarnings("deprecation")
    //year, month�� �´� �̺�Ʈ ArrayList<CalendarDTO>�� ����
	public static ArrayList<EventDTO> getEvent_Month(ArrayList<CalendarDTO> calendarList, int year, int month) throws IOException{
    	com.google.api.services.calendar.Calendar service =
                getCalendarService();
            // List the next 10 events from the primary calendar.
            //DateTime now = new DateTime(System.currentTimeMillis());
    		Date cur = new Date(year-1900, month-1, 1);
    		ArrayList<EventDTO> dtoList = new ArrayList<EventDTO>();
    		Date nextDate;
    		if(month == 12) {
    			nextDate = new Date(year-1900 + 1,0,1);
    		}else {
    			nextDate = new Date(year-1900,month,1);
    		}

            DateTime now = new DateTime(cur);
            DateTime next = new DateTime(nextDate);
           
            int size = calendarList.size();
            for(int i=0;i<size;i++) {
            	//System.out.println(checkedCalId.get(i));
            	String id = calendarList.get(i).getId();
	            Events events = service.events().list(id)
	            	.setTimeMin(now)
	            	.setTimeMax(next)
	                .setOrderBy("startTime")
	                .setSingleEvents(true)
	                .execute();
	            List<Event> items = events.getItems();
	            if (items.size() == 0) {
	                System.out.println("No upcoming events found.");
	            } else {
	            	// System.out.println(now.toString());
	                System.out.println("Upcoming events");
	                for (Event event : items) {
	                    DateTime start = event.getStart().getDateTime();
	                    if (start == null) {
	                        start = event.getStart().getDate();
	                    }
	                    DateTime end = event.getEnd().getDateTime();
	                    if(end == null) {
	                    	end = event.getEnd().getDate();
	                    }
	                    //System.out.printf("%s (%s)\n", end, Long.toString(end.getValue()));
	                    EventDTO tempDTO = new EventDTO();
	                    tempDTO.setCalendarID(id);
	                    tempDTO.setStart(start.getValue(),start.isDateOnly());
	                    tempDTO.setSummary(event.getSummary());
	                    tempDTO.setEnd(end.getValue(),end.isDateOnly());
	                    tempDTO.setEventID(event.getId());
	                    dtoList.add(tempDTO);
	                }
	            }
            }
            dtoList = new EventProcessing().arrangeOrder(dtoList, year, month);
            return dtoList;
    }
	
	public static ArrayList<CalendarDTO> getCalendarList() throws IOException{
		ArrayList<CalendarDTO> result = new ArrayList<CalendarDTO>();
		
		com.google.api.services.calendar.Calendar service = getCalendarService();
		String pageToken = null;
	      do {
	        CalendarList calendarList = service.calendarList().list().setPageToken(pageToken).execute();
	        List<CalendarListEntry> items = calendarList.getItems();
	        for (CalendarListEntry calendarListEntry : items) {
	          //System.out.println(calendarListEntry.getSummary());
	          CalendarDTO tempDTO = new CalendarDTO();
	          tempDTO.setId(calendarListEntry.getId());
	          tempDTO.setSummary(calendarListEntry.getSummary());
	          tempDTO.setCheck(true);
	          tempDTO.setColorId(calendarListEntry.getColorId());
	          result.add(tempDTO);
	          }
	        pageToken = calendarList.getNextPageToken();
	      } while (pageToken != null);
	      
	      return result;
	}
	
	public static EventDetailDTO getEventDetail(String calendarId, String eventId) throws IOException {
		EventDetailDTO result = new EventDetailDTO();
		com.google.api.services.calendar.Calendar service = getCalendarService();
		Event event = service.events().get(calendarId, eventId).execute();
		result.setSummary(event.getSummary());
		DateTime start = event.getStart().getDateTime();
        if (start == null) {
            start = event.getStart().getDate();
        }
        DateTime end = event.getEnd().getDateTime();
        if(end == null) {
        	end = event.getEnd().getDate();
        }
        result.setStart(start.getValue(), start.isDateOnly());
        result.setEnd(end.getValue(), end.isDateOnly());
        result.setLocation(event.getLocation());
		result.setDescription(event.getDescription());
		result.setRecurrence(event.getRecurrence());
		
		return result;
	}
	
	public static Event getEvent(String calendarId, String eventId) {
		Event event = new Event();
		com.google.api.services.calendar.Calendar service;
		try {
			service = getCalendarService();
			event = service.events().get(calendarId, eventId).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return event;
	}
	
//	public static ArrayList<String> getCheckedCalendarId(ArrayList<CalendarDTO> dto){
//		ArrayList<String> result = new ArrayList<String>();
//		int size = dto.size();
//		for(int i=0;i<size;i++) {
//			if(dto.get(i).getCheck()) {
//				result.add(dto.get(i).getId());
//			}
//		}
//		return result;
//	}
//    public static void main(String[] args) throws IOException {
//        // Build a new authorized API client service.
//        // Note: Do not confuse this class with the
//        //   com.google.api.services.calendar.model.Calendar class.
//      com.google.api.services.calendar.Calendar service = getCalendarService();
//      // Ķ���� ��ȸ
//      String pageToken = null;
//      do {
//        CalendarList calendarList = service.calendarList().list().setPageToken(pageToken).execute();
//        List<CalendarListEntry> items1 = calendarList.getItems();
//        for (CalendarListEntry calendarListEntry : items1) {
//          System.out.println(calendarListEntry.getSummary());
//          System.out.println(calendarListEntry.getId());
//        }
//        pageToken = calendarList.getNextPageToken();
//      } while (pageToken != null);
//
//    }
    
}