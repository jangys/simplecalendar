package com.calendar.sCalendar;

import com.calendar.dto.CalendarDTO;
import com.calendar.dto.EventDTO;
import com.calendar.dto.EventDetailDTO;
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
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.social.google.api.Google;

public class GoogleCalendarService {
	
	public static final int MONTHLY = 1;
	public static final int WEEKLY = 2;
	public static final int DAILY = 3;
	
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
        Arrays.asList(CalendarScopes.CALENDAR);	//READ_ONLY가 붙으면 읽는 기능 밖에 못함.. 변경후 삭제

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
    
    //인증
    public static Credential authorize() throws IOException {
        // Load client secrets.
        InputStream in =
            GoogleCalendarService.class.getResourceAsStream("/client_secret_1.json");
        GoogleClientSecrets clientSecrets =
            GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow =
                new GoogleAuthorizationCodeFlow.Builder(
                        HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(DATA_STORE_FACTORY)
                .setAccessType("offline")	
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
    //연결
    public static com.google.api.services.calendar.Calendar
        getCalendarService() throws IOException {
        Credential credential = authorize();
        return new com.google.api.services.calendar.Calendar.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    //@SuppressWarnings("deprecation")
    //year, month에 맞는 이벤트 ArrayList<EventDTO>로 저장
	public static ArrayList<EventDTO> getEvent(ArrayList<CalendarDTO> calendarList, int year, int month,int date,int type) throws IOException{
    	
		//기간 설정
		LocalDate cur = LocalDate.of(year,month,date);
		ArrayList<EventDTO> dtoList = new ArrayList<EventDTO>();
		LocalDateTime nowLocal = cur.atStartOfDay();
		ZonedDateTime nowZdt = nowLocal.atZone(ZoneId.systemDefault());
        DateTime now = new DateTime(nowZdt.toInstant().toEpochMilli());
        DateTime next = null;
        switch(type) {
        case MONTHLY:
        	LocalDateTime localM = cur.plusMonths(1).atTime(0, 0);
        	ZonedDateTime zdtM = localM.atZone(ZoneId.systemDefault());
        	next = new DateTime(zdtM.toInstant().toEpochMilli()-60000l);	//1분을 빼서 첫번째 달 마지막 일 11시 59분이 되도록 함.
        	break;
        case WEEKLY:
        	LocalDateTime local = cur.plusWeeks(1).atTime(0,0);
        	ZonedDateTime zdt = local.atZone(ZoneId.systemDefault());
        	next = new DateTime(zdt.toInstant().toEpochMilli());
        	break;
        case DAILY:
        	LocalDateTime localD = cur.plusDays(1).atTime(0,0);
        	ZonedDateTime zdtD = localD.atZone(ZoneId.systemDefault());
        	next = new DateTime(zdtD.toInstant().toEpochMilli());
        	System.out.println(next.toString());
        	break;
        }
        
        int size = calendarList.size();
        ExecutorService executorService = Executors.newFixedThreadPool(size);
        ArrayList<EventDTO> result = new ArrayList<EventDTO>();
        List<Future<ArrayList<EventDTO>>> future = new ArrayList<Future<ArrayList<EventDTO>>>();
        for(int i=0;i<size;i++) {
        	String id = calendarList.get(i).getId();
        	Callable<ArrayList<EventDTO>> task = new callable(id, now, next,type);	//스레드 만들기, 실행
        	future.add(executorService.submit(task));//결과값
        }
        try {
         	for(int i=0;i<size;i++) {
         		result.addAll(future.get(i).get());
         	}
         }catch(Exception e) {
         	e.printStackTrace();
         }
        executorService.shutdown();
        dtoList = result;
        Collections.sort(dtoList,new comparator());
        dtoList = new EventProcessing().arrangeOrder(dtoList, year, month);

        return dtoList;
    }
}

class callable implements Callable<ArrayList<EventDTO>>{
	private String id;
	private DateTime now;
	private DateTime next;
	private int type;
	public callable(String id, DateTime now, DateTime next,int type) {
		this.id = id;
		this.now = now;
		this.next = next;
		this.type = type;
	}
	@Override
	public ArrayList<EventDTO> call() {
        Events events = null;
        ArrayList<EventDTO> result = new ArrayList<EventDTO>();
        ArrayList<EventDTO> recurrence = new ArrayList<EventDTO>();
        HashMap<String, Object> recurrenceEXDATE = new HashMap<>(); 
        ArrayList<EventDTO> recurringEventList = new ArrayList<EventDTO>();
		try {
			com.google.api.services.calendar.Calendar service =
                    new GoogleCalendarService().getCalendarService();
			events = service.events().list(id)
				.setTimeMin(now)
				.setTimeMax(next)
			    .execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        List<Event> items = events.getItems();
        if (items.size() == 0) {
            System.out.println("No upcoming events found.");
        } else {
        	// System.out.println(now.toString());
            System.out.println("Upcoming events");
            
            //일정 얻기
            for (Event event : items) {
                DateTime start = null;
                boolean isDateOnly = false;
                if(event.getStart() != null) {
                	if(event.getStart().getDateTime() != null) {
                		start = event.getStart().getDateTime();
                	}else {
                		start = event.getStart().getDate();
                		isDateOnly = true;
                	}
                }else {
                	start = new DateTime(now.getValue());
                }
                DateTime end = null;
                if(event.getEnd() != null) {
                	if(event.getEnd().getDateTime() != null) {
                		end = event.getEnd().getDateTime();
                	}else {
                		end = event.getEnd().getDate();
                	}
                }else {
                	end = new DateTime(now.getValue());
                }

                if(event.getRecurringEventId() != null) {
            		String eventId = event.getRecurringEventId();
            		ArrayList<Integer> exdate = new ArrayList<>();
            		if(recurrenceEXDATE.get(eventId) != null) {
            			exdate = (ArrayList<Integer>) recurrenceEXDATE.get(eventId);
            		}
            	//	exdate.add(Integer.parseInt(event.getId().substring(event.getId().length()-8)));
            		String date;
            		if(event.getOriginalStartTime().getDate() != null) {
            			date = event.getOriginalStartTime().getDate().toString().replaceAll("-", "");
            		}else {
            			date = event.getOriginalStartTime().getDateTime().toString().substring(0, 10).replaceAll("-", "");
            		}
            		exdate.add(Integer.parseInt(date));
        			recurrenceEXDATE.put(eventId, exdate);
        			if(event.getStatus() != null && event.getStatus().equals("cancelled")) {
        				continue;
        			}
        			long endValue = end.getValue();
        			if(isDateOnly) {
        				endValue -= 86400000l;
        			}
        			if(endValue < now.getValue() || start.getValue() >= next.getValue()) {//개별 일정 중 요청한 기간에서 벗어난 일정들이 있을 수 있음
        				continue;
        			}
            	}
               // System.out.printf("%s (%s)\n", event.getSummary(), start.toString());
                boolean guestsCanSeeOtherGuests = true;
                if(event.getGuestsCanSeeOtherGuests() != null) {
                	guestsCanSeeOtherGuests = false;
                }
                EventDTO tempDTO = new EventDTO();
                tempDTO.setCalendarID(id);
                tempDTO.setSummary(event.getSummary());
                tempDTO.setStart(start.getValue(),start.isDateOnly());
                tempDTO.setEnd(end.getValue(),end.isDateOnly());
                tempDTO.setEventID(event.getId());
                tempDTO.setLocation(event.getLocation());
                tempDTO.setDescription(event.getDescription());
                tempDTO.setAttendees(event.getAttendees());
                tempDTO.setGuestsCanSeeOtherGuests(guestsCanSeeOtherGuests);
                String email = "";
                if(event.getOrganizer() != null) {
                	email = event.getOrganizer().getEmail();
                }
                tempDTO.setOrganizer(email);
                tempDTO.setRecurrence(event.getRecurrence());
                if(event.getRecurrence() != null) {
                	recurringEventList.add(tempDTO);
                }else {
                	result.add(tempDTO);
                }
            }//for
            
            //반복 일정 구하기
            for(EventDTO eventDTO : recurringEventList) {
            	boolean isDateOnly = false;
            	//Date d = new Date(now.getValue());
            	LocalDate localdate = Instant.ofEpochMilli(now.getValue()).atZone(ZoneId.systemDefault()).toLocalDate();
            	if(eventDTO.getStartTime()[3] == -1) {
            		isDateOnly = true;
            	}
            	try {
            		ArrayList<Integer> sortList = (ArrayList<Integer>)recurrenceEXDATE.get(eventDTO.getEventID());
            		if(sortList != null) {
            			Collections.sort(sortList);
            		}
					ArrayList<EventDTO> list = list = new CalculateRecurrence().getRecurrenceEvents(isDateOnly, eventDTO, localdate.getYear(), 
							localdate.getMonthValue(),localdate.getDayOfMonth(),type,sortList);
					
					if(list != null) {
						result.addAll(list);
					}else {
						result.add(eventDTO);
					}
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
            }
            result.addAll(recurrence);
        }
        return result;
	}
	
}
