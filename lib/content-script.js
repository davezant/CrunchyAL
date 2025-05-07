
var loginButton = document.getElementById('loginBtn');
var authToken = document.getElementById('loginAuthInput');
var frameManager = document.getElementById('extensionFrame');


if (localStorage.getItem("authToken") == null || localStorage.getItem("authToken") == undefined) {
   console.log("No auth token found, showing login button.");
} else {
   console.log("Auth token found, showing logged in view.");
   
   fetch("src/logged.html").then(html =>{
	   html.text().then(
		   body => {
			   	frameManager.innerHTML = body;
	   })
	   })

}

loginButton.addEventListener('click', function() {
   browser.tabs.create({ url: "https://anilist.co/api/v2/oauth/authorize?client_id=26416&response_type=token" });
   window.open("https://anilist.co/api/v2/oauth/authorize?client_id=26416&response_type=token" );

   console.log("Login button clicked!");
});

authToken.addEventListener('keypress', function() {

   if (event.key === 'Enter') {
      var token = authToken.value;
      console.log("Token entered: " + token);
      localStorage.setItem("authToken", token);
   }
      console.log("Auth token input detected!");
}
)

async function fetchAL(token){
	
        const uriAL = 'https://graphql.anilist.co'
        const query = 'query{Viewer{name, id, avatar{medium}}}'
        let response = await fetch(uriAL+"?query="+query,{"method":"POST","headers":{"Content-Type":"application/json","Authorization":"Bearer " + token}}).then(response => response.text().then(function (json){return json}))
	return JSON.parse(response)
	}

async function systemCrunchyALMain(){
	var data = await fetchAL(localStorage.getItem("authToken"))
   var nameOfUser = document.getElementById('name');
   var profilePicture = document.getElementById('profilePicture');
   picture = data["data"]["Viewer"]["avatar"]["medium"]
   nameUser = data["data"]["Viewer"]["name"]
   console.log(data)
	nameOfUser.textContent = nameUser
   profilePicture.src = picture;
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      console.log(URL.parse(tabs[0].url))
      console.log(URL.parse(tabs[0].url).hostname.match(RegExp("\.crunchyroll\.")))
      console.log(String(tabs[0].url.pathname).split("/")[-1])
      console.log(document.getElementById("content"))
  });
}

systemCrunchyALMain();
