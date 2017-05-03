/**
 * 
 */

$(document).ready(function(){
	const applicationServerPublicKey = 'BNQHuP-J8KvloYnbho6pHKu1njRppDqNtZcaNsje-VKduVY-AMvVt_VSBgWaddmCRcEf3M7YVhm72Ih4Hl9ay8E';
	
	
	
	var isSubscribed = false;
	var swRegistration = null;

	if ('serviceWorker' in navigator && 'PushManager' in window) {
		  console.log('Service Worker and Push is supported');
		  navigator.serviceWorker.register('websocket.js', {scope: './'}).then(function(swReg) {
		    console.log('Service Worker is registered', swReg);
		    console.log("subscription.subscriptionId: ", swReg.subscriptionId);
			console.log("subscription.endpoint: ", swReg.endpoint);
			swRegistration = swReg;
			initialiseUI();
		   
		  }).catch(function(error) {
		    console.error('Service Worker Error', error);
		  });
		} else {
		  console.warn('Push messaging is not supported');
		  pushButton.textContent = 'Push Not Supported';
	}


	function initialiseUI() {
		  // Set the initial subscription value
		  swRegistration.pushManager.getSubscription()
		  .then(function(subscription) {
		    isSubscribed = !(subscription === null);

		    if (isSubscribed) {
		      console.log('User IS subscribed.');
		    } else {
		      console.log('User is NOT subscribed.');
		      subscribeUser();
		    }

		   
		  });
		}
	function subscribeUser() {
		  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
		  swRegistration.pushManager.subscribe({
		    userVisibleOnly: true,
		    applicationServerKey: applicationServerKey
		  })
		  .then(function(subscription) {
		    console.log('User is subscribed.');
		    console.log(subscription);
		    isSubscribed = true;
		  }).catch(function(err) {
		    console.log('Failed to subscribe the user: ', err);
		  });
		}
	
	function urlB64ToUint8Array(base64String) {
		  const padding = '='.repeat((4 - base64String.length % 4) % 4);
		  const base64 = (base64String + padding)
		    .replace(/\-/g, '+')
		    .replace(/_/g, '/');

		  const rawData = window.atob(base64);
		  const outputArray = new Uint8Array(rawData.length);

		  for (var i = 0; i < rawData.length; ++i) {
		    outputArray[i] = rawData.charCodeAt(i);
		  }
		  return outputArray;
		}
	
	$("#btnOnOpen").on("click",function(){
		 //console.log("subscription.subscriptionId: ", swRegistration.subscriptionId);
		socket = new WebSocket("ws://localhost:8080/PushNotification/notification");
		try{
			console.log(swRegistration);
			socket.onOpen = function(data){
				console.log("OnOpen data:-->"+data);
				socket.send("Hello there");
			}
			socket.onmessage  = function(data){
				console.log("message data::-->");
				console.log(data);
				socket.send("Hello there");
				const title = 'Push Notification';
				const options = {
						body: ''+data.data,
						icon: 'images/icon.png',
						badge: 'images/badge.png'
				};
					
					swRegistration.showNotification(title, options);
			 }
		}catch(e){
			socket.close();
		}
		
	});

});

