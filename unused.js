function fetchWallpaper() {
	var xhttp = new XMLHttpRequest();

	xhttp.onload = function() {
		if (this.readyState == 4 && this.status == 200) {
			docElement = document.getElementById("middle");
			importElement = this.responseXML.getElementsByTagName("item")[1];

			// Parse item data into a temporary 'div' tag
			var div = document.createElement("div");
			var desc = importElement.getElementsByTagName("description")[0];
			var doc = new DOMParser().parseFromString(desc.innerHTML, "text/html");
			div.innerHTML = doc.documentElement.textContent.trim();

			var a = docElement.appendChild(document.createElement("a"));
			var image = a.appendChild(new Image());
			image.src = div.querySelector("img").src;
			a.href = importElement.getElementsByTagName("link")[0].innerHTML;

		} else {console.error("Could not load wallpaper.");}
	}
	xhttp.open("GET", "https://spaceshipsgalore.tumblr.com/rss", true);
	xhttp.send();
}


} else {
			var doc = parser.parseFromString(fileText, "text/html");
			data = doc.querySelectorAll("entry");
			if (!data.length){
				data = doc.getElementsByTagName("channel")[0].getElementsByTagName("item");
			}
			for (var i=0; i<data.length; i++){
				li = ul.appendChild(newElem("li"));
				a = li.appendChild(newElem("a"));
				link = data[i].getElementsByTagName("link")[0];
				a.href = link.textContent ? link.textContent : link.href;
				a.appendChild(document.createTextNode(data[i].getElementsByTagName("title")[0].textContent));
				textarea = a.appendChild(newElem("textarea"));

				dateTag = data[i].querySelector("pubDate, published");
				textarea.appendChild(document.createTextNode(dateTag.textContent));
				desc = data[i].getElementsByTagName("description")[0];
				if (desc){
					doc = parser.parseFromString(desc.textContent, "text/html");
					let trimmedText = doc.documentElement.textContent;
					var doc = parser.parseFromString(trimmedText, "text/html");
					trimmedText = doc.documentElement;
					textarea.appendChild(trimmedText);
				}

				a.className = "tooltipBox";
				textarea.className = "tooltipText";
				textarea.setAttribute("readonly", "true");

				if (!lastcheck || new Date(dateTag.textContent) >= lastcheck){
					a.style.color = "cyan";
					newEntry = true;
				}
			}
		}




// Surfing-waves rss
function f(e){var s,t=document.createElement("iframe"),o=window,r="";for(s=0;s<e.length;s++)r+="rssfeed[url]["+s+"]=https://"+encodeURIComponent(e[s])+"&";t.src="https://feed.surfing-waves.com/php/rssfeed.php?"+r+"&rssfeed[target]=_top&rssfeed[font_size]=12&rssfeed[title]=on&rssfeed[title_name]="+encodeURIComponent(o.rssfeed_title_name)+"&rssfeed[title_bgcolor]=%23363636&rssfeed[title_color]=%23fff&rssfeed[item_title_length]=80&rssfeed[item_title_color]=%23ccc&rssfeed[item_border_bottom]=on&rssfeed[item_date]="+(o.rssfeed_item_date?"on":"")+"&rssfeed[item_description]="+(o.rssfeed_item_description?"on":"")+"&rssfeed[item_description_color]=%23666&rssfeed[cache]="+o.rssfeed_cache,t.scrolling="no",document.getElementById("feeds").appendChild(t)}function loadFeeds(){rssfeed_title_name="eBay: 999, oracle",rssfeed_item_description="on",rssfeed_cache="2cba009caaaa790861cda61a71d6def0",f(["www.ebay.com/sch/i.html?_udhi=40.00&_geositeid=0&_sacat=139973&_nkw=%28persons+hours+doors%2C999%2Cvirtue%29+%283ds%2Cds%29+-tetsudou+-ginga+-amiibo&_dcat=139973&Region%2520Code=%2521%7CNTSC%252DU%252FC%2520%2528US%252FCanada%2529%7CPAL%7CRegion%2520Free&Game%2520Name=%2521%7C999%253A%2520Nine%2520Hours%252C%2520Nine%2520Persons%252C%2520Nine%2520Doors%7CAdventure%7CNine%2520Hours%252C%2520Nine%2520Persons%252C%2520Nine%2520Doors%7CZero%2520Escape%253A%2520Virtue%2527s%2520Last%2520Reward&_fcid=66&_sop=15&_rss=1","www.ebay.co.uk/sch/Video-Games/139973/i.html?_ftrt=901&_sop=15&_dmd=1&_udhi=39&_mPrRngCbx=1&_ipg=200&_ftrv=1&_from=R40&LH_PrefLoc=2&_dcat=139973&_rss=1&_udlo&_nkw=zelda%20oracle&rt=nc&Platform=Nintendo%2520Game%2520Boy|Nintendo%2520Game%2520Boy%2520Color|!"]),rssfeed_title_name="PhoneArena - Phones, Outside, SCP: Secret Laboratory",rssfeed_item_date="on",rssfeed_item_description="",rssfeed_cache="b9aa3a3fb265e7c37ac5c0cb3f1fd89e",f(["www.phonearena.com/feed/new-phones","www.reddit.com/r/outside/.rss","steamcommunity.com/games/700330/rss/"])};



function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var c, ca = decodedCookie.split(';');
	for(var i=0; i<ca.length; i++) {
		c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function includeHTML() {
	var z, i, elmnt, file, xhttp;
	/* Loop through a collection of all HTML elements: */
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = z[i];
		/*search for elements with a certain atrribute:*/
		file = elmnt.getAttribute("w3-include-html");
		if (file) {
			/* Make an HTTP request using the attribute value as the file name: */
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {elmnt.innerHTML += this.responseText;}
					if (this.status == 404) {elmnt.innerHTML += " imported page not found.";}
					/* Remove the attribute, and call this function once more: */
					elmnt.removeAttribute("w3-include-html");
					includeHTML();
				}
			}
			xhttp.open("GET", file, true);
			xhttp.send();
			/* Exit the function: */
			return;
		}
	}
}


// Sama hea, mis fetch().then()
function readFile(file, type, callback) {
	const rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType(type);
	rawFile.open("GET", file, true);
	rawFile.onload = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile);
		}
	}
	rawFile.send(null);
}


// Vana kaval lahendus submiti jaoks
var searchForm = getElemById("searchForm");
var searchbar = searchForm.children[0];
searchForm.addEventListener("click", function(e){
	if (e.target.name){
		let parameters = e.target.name.split("&");
		for (var j=0; j<parameters.length-1; j++){

			let pair = parameters[j].split("=");
			let input = document.createElement("input");
			input.setAttribute("type", "hidden");
			input.setAttribute("name", pair[0]);
			input.setAttribute("value", pair[1]);
			searchForm.appendChild(input);
		}
		console.log(parameters)
		searchbar.name = parameters[j];
	}else{
		searchbar.name = "q";
	}
	searchForm.target = e.ctrlKey ? "_blank" : "_self";
});


// Faviconid JS-ga infolehel
function loadFavicons() {
	var i, icon, links = document.querySelectorAll("li > a");
	for (i=0; i<links.length; i++) {
		if (links[i].href.match(/[/.]youtu[.b][be][e.]/)) {
			icon = new Image(); //document.createElement("img");
			icon.src = "https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico";
			icon.alt = "yt";
		}
		else if (links[i].href.indexOf(".bitchute.") > -1) {
			icon = new Image();
			icon.src = "images/icon_bitchute.png";
			icon.alt = "";
		}
		else if (links[i].href.indexOf("telegram") > -1) {
			icon = new Image();
			icon.src = "https://www.telegram.ee/wp-content/themes/telegram/favicon/favicon.ico";
			icon.alt = "telegram";
		}
		else if (links[i].href.indexOf("in5d") > -1) {
			icon = new Image();
			icon.src = "https://in5d.com/wp-content/uploads/2019/03/cropped-favicon5-32x32.jpg";
			icon.alt = "in5d";
		}
		else {continue;}
		//links[i].prepend(icon);
	}
}
// Sellisel juhul vaja järgmist css koodi ka:
/*
li > a > img{
	max-width:16px;
	margin-right:5px;
	margin-bottom:1px;
	vertical-align:text-bottom;
}
*/
/*
.scrollTop{
	padding: 0 6px 0 6px;
}
.scrollTop > div{
	width: 0; 
	height: 0; 
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 9px solid var(--main_border_color);
	padding-bottom: 3px;
	text-indent: -1ch;
	font-weight: bold;
	margin: 2px 0 5px 0;
}
*/


// Load bookmark folders
chrome.bookmarks.getSubTree(otherBookmarksId, function(bookmarkTree){
	let otherBookmarks = bookmarkTree[0].children;
	appendListToSidebar(otherBookmarks.find(e => e.title=="m").children);
	appendListToSidebar(otherBookmarks.find(e => e.title=="a").children);
});