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