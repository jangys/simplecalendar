package com.calendar.sCalendar;

import java.util.ArrayList;
import java.util.Collections;

import com.google.api.client.util.DateTime;

public class EventProcessing {
	public ArrayList<EventDTO> arrangeOrder(ArrayList<EventDTO> dto,int year, int month){
		ArrayList<EventDTO> result = dto;
		int size = result.size();
		
		int start = -1;
		int end = -1;
		System.out.println("-----------------------------");
		for(int i=0;i<size-1;i++) {

			//���� ��¥�� �ش� ���� �ƴ� ���
			if(dto.get(i).getStartTime()[1] < month || dto.get(i).getStartTime()[0] < year) {
				if(start == -1) {
					start = i;
				}
				int index = start;
				while((index < size)  && (dto.get(index).getStartTime()[1] < month || dto.get(index).getStartTime()[0] < year)) {
					index++;
				}
				end = index-1;
				long max;
				int maxIndex;
				for(int x=start;x<end;x++) {
					max = dto.get(x).getEnd();
					maxIndex = x;
					for(int y=x+1; y<=end; y++) {
						long endValue = dto.get(x).getEnd();
						if(max <= endValue) {
							max = endValue;
							maxIndex = y;
						}
					}
					Collections.swap(result, x, maxIndex);
				}
				i=end+1;
				start = -1;
			}//if - �ش� ���� �ƴ� ���
			if(i+1 < size && dto.get(i).getStartTime()[2] == dto.get(i+1).getStartTime()[2]) {
				//System.out.println(i);
				if(start == -1) {
					start = i;
				}
				int index = start+1;
				while((index < size-1) && (dto.get(index).getStartTime()[2] == dto.get(index+1).getStartTime()[2])) {
					index += 1;
				}
				end = index;
				long max;
				int maxIndex;
				for(int x=start;x<end;x++) {
					max = -1;
					maxIndex = -1;
					for(int y=x; y<=end; y++) {
						long endValue = dto.get(y).getEnd();
						if(dto.get(y).getStartTime()[0] == dto.get(y).getEndTime()[0] && dto.get(y).getStartTime()[1] == dto.get(y).getEndTime()[1] 
								&& dto.get(y).getStartTime()[2] == dto.get(y).getEndTime()[2]) {//�Ϸ� �������� ���� ���� ��¥ ���� ���̹Ƿ� �н�
							//
						}else {
							if(max <= endValue) {
								max = endValue;
								maxIndex = y;
							}
						}
					}
					if(maxIndex != -1) {
						Collections.swap(result, x, maxIndex);
					}
				}
				i=end+1;
				start = -1;
			}
		}
		/*
		for(int i=0;i<size;i++) {
			System.out.println(result.get(i).getSummary());
		}
		*/
		return result;
	}

}
