package com.in10s.pushnotification.action;



import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/notification")
public class NotificationAction{
	
	int counter = 0;
	@OnOpen
		public void onOpen(Session session){			
		System.out.println("Connection open on "+session.getId());
			try{
				session.getBasicRemote().sendText("Connection establish");				
			}catch(Exception ex){
				ex.printStackTrace();
			}
		}
	
	@OnMessage
		public void onMessage(String message,Session session){
			System.out.println("onMessage called");
			try {
				if(counter < 2)
					session.getBasicRemote().sendText(message.toUpperCase()+"   times "+(counter++));
				
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
	
	@OnClose
		public void onClose(Session session){
			System.out.println("Connection closed on "+session.getId());
			try{
				session.getBasicRemote().sendText("Connection closed");
			}catch(Exception ex){
				ex.printStackTrace();
			}
		}
}
