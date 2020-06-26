const REGEX_DEFAULT = "item>\\s*<title>(?<name>.+?)</title>[\\s\\S]*?<link>(?:<!\\[CDATA\\[)?(?<link>.+?)(?:\\]\\]>)?<[\\s\\S]+?pubDate>(?<date>.+?)<[\\s\\S]+?(?<desc><description>[\\s\\S]+?</description>)";
var quickLinksURLs = [];
var bookmarkColor = "#333"

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

function loadFeed(name, dataArray, container, lastcheck){
	var [url, regexStr, prefix] = dataArray;
	var prefix = prefix ? prefix : "";
	const parser = new DOMParser();

	const newElem = document.createElement.bind(document);
	var details = newElem("details");
	let summary = details.appendChild(newElem("summary"));
	summary.appendChild(document.createTextNode(name));

	let processFeed = function(file) {
		if (!regexStr){
			regexStr = REGEX_DEFAULT;
		}
		var data = file.responseText.matchAll(new RegExp(regexStr, "g"));
		
		var ul = newElem("ul");
		var a, li, textarea, newEntry, match, matchGroup, doc, i = 0, newEntry = false;
		while (!(match = data.next()).done && i++ < 30) {
			matchGroup = match.value.groups;

			li = ul.appendChild(newElem("li"));
			a = li.appendChild(newElem("a"));
			a.className = "tooltipBox";
			a.href = parser.parseFromString(prefix+matchGroup.link, "text/html").documentElement.textContent;
			a.appendChild(document.createTextNode(parser.parseFromString(matchGroup.name, "text/html").documentElement.textContent));

			textarea = a.appendChild(newElem("textarea"));
			textarea.className = "tooltipText";
			textarea.setAttribute("readonly", "true");
			textarea.appendChild(document.createTextNode(matchGroup.date));
			if (matchGroup["desc"]){
				doc = parser.parseFromString(matchGroup.desc, "text/html");
				doc = parser.parseFromString(doc.documentElement.textContent.trim(), "text/html");
				textarea.appendChild(document.createTextNode("\n\n"+doc.documentElement.textContent));
			}

			if (!lastcheck || new Date(matchGroup.date) >= lastcheck){
				a.style.color = "cyan";
				newEntry = true;
			}
		}

		if (newEntry){
			details.appendChild(ul);
			container.appendChild(details);
		}
	}

	if (Array.isArray(url)){
		for (i=url.length; i--;){
			readFile(url[i], "text/xml", processFeed);
		}
	} else {
		readFile(url, "text/xml", processFeed);
	}
}

function fetchFavicon(url) {
	if (/^(edge|file)/.test(url)) {
		return "";
	}
	slashIndex = url.slice(8).indexOf('/');
	if (slashIndex > -1) {
		url = url.slice(0, slashIndex + 9);
	}
	return "https://www.google.com/s2/favicons?domain=" + url;
}

function appendToQuickLinks(links) {
	var quicklinks = document.getElementById('quick-links');

	for (var i=0; i < links.length; i++) {
		var div = document.createElement("div");
		div.className = "bookmark";
		var a = div.appendChild(document.createElement("a"));
		a.href = links[i].url;
		a.style.background = 'url(' +links[i].favIconUrl+ ') no-repeat center center';
		a.title = links[i].url;

		quicklinks.appendChild(div);
		quickLinksURLs.push(links[i].url);
	}
}
function appendListToSidebar(links) {
	const newElem = document.createElement.bind(document)
	const container = document.getElementById("sidebar");
	var ul = newElem("ul");

	nQuickLinks = quickLinksURLs.length;
	for (var i=0; i < links.length; i++) {
		var link = links[i].hasOwnProperty("tab") ? links[i].tab : links[i];
		if (!link.hasOwnProperty("url") || link.url.startsWith("chrome.//")){
			continue;
		}
		var linkIsIn = link.url.includes.bind(link.url);
		for (var j=0; j<nQuickLinks; j++){
			if (linkIsIn(quickLinksURLs[j])) {continue;}
		}

		//var li = ;
		var a = ul.appendChild(newElem("li")).appendChild(newElem("a"));
		a.href = link.url;
		a.appendChild(document.createTextNode(link.title));

		var icon = new Image();
		icon.src = link.favIconUrl ? link.favIconUrl : fetchFavicon(link.url);
		a.insertAdjacentElement("afterbegin", icon);
	}
	container.appendChild(ul);
}

function addBookmark(event){
	event.preventDefault();

	let inputs = event.target;
	let a1 = document.createElement("a");
	let a2 = document.createElement("a");
	// Converts:
	a1.href = inputs.querySelector("[placeholder=\"URL\"]").value;
	a2.href = inputs.querySelector("[placeholder=\"Ikooni URL\"]").value;

	let obj = {"url":a1.href, "favIconUrl":a2.href};
	appendToQuickLinks([obj]);

	let localQuickLinks = JSON.parse(localStorage.getItem("quick-links"));
	localQuickLinks.push(obj);
	localStorage.setItem("quick-links", JSON.stringify(localQuickLinks));
}
function moveBookmark(event){
	event.preventDefault();
	let container = document.getElementById("quick-links");
	let bookmarks = container.childNodes;
	for (var i=0; bookmarks[++i] != event.currentTarget;);

	if (i>1){
		let removed = container.removeChild(bookmarks[i]);
		container.insertBefore(removed, bookmarks[i-1]);

		let localQuickLinks = JSON.parse(localStorage.getItem("quick-links"));
		[localQuickLinks[i-1], localQuickLinks[i-2]] = [localQuickLinks[i-2], localQuickLinks[i-1]]
		localStorage.setItem("quick-links", JSON.stringify(localQuickLinks));
	}
}
function delBookmark(event){
	event.preventDefault();
	let container = document.getElementById("quick-links");
	let bookmarks = container.childNodes;
	for (var i=0; bookmarks[++i] != event.currentTarget;);
	container.removeChild(bookmarks[i]);

	let localQuickLinks = JSON.parse(localStorage.getItem("quick-links"));
	localQuickLinks.splice(i-1, 1);
	localStorage.setItem("quick-links", JSON.stringify(localQuickLinks));
}
function setBookmarkClickEvent(bg, func=undefined){
	let bookmarks = document.getElementsByClassName("bookmark");
	bookmarkColor = bookmarkColor != bg ? bg : "#333";
	for (let i=bookmarks.length; i--;){
		bookmarks[i].removeEventListener("click", delBookmark);
		bookmarks[i].removeEventListener("click", moveBookmark);
		bookmarks[i].style.background = bookmarkColor;
		if (func && bookmarkColor == bg){
			bookmarks[i].addEventListener("click", func);
		}
	}
}


document.addEventListener("DOMContentLoaded", function(e) {
	const getElemById = document.getElementById.bind(document);

	// Determine if we are local
	var otherBookmarksId, syncStorage;
	if (window.location.origin.startsWith("chrome-extension://")){
		otherBookmarksId = "2";
		syncStorage = chrome.storage.sync;
	} else if (window.location.origin.startsWith("moz-extension://")){
		otherBookmarksId = "unfiled_____";
		syncStorage = browser.storage.sync;
	}
	//console.log("Using " + (syncStorage ? "synced" : "local") + " storage");

	if (otherBookmarksId !== undefined){
		// Load links from bookmarks and recently closed
		chrome.sessions.getRecentlyClosed(appendListToSidebar);
		chrome.topSites.get(appendListToSidebar);
		chrome.bookmarks.getSubTree(otherBookmarksId, function(bookmarkTree){
			let otherBookmarks = bookmarkTree[0].children;
			appendListToSidebar(otherBookmarks.find(e => e.title=="m").children);
			appendListToSidebar(otherBookmarks.find(e => e.title=="a").children);
		});
	}

	// Load links and feeds from file
	let jsonDataHandler = staticData => {
		let localQuickLinks = localStorage.getItem("quick-links");
		if (localQuickLinks) {
			appendToQuickLinks(JSON.parse(localQuickLinks));
		} else {
			localStorage.setItem("quick-links", JSON.stringify(staticData.quickLinks));
			appendToQuickLinks(staticData.quickLinks);
		}

		linksArrayLen = staticData.slowLinks.length;
		for (let i=0; i < linksArrayLen;
			appendListToSidebar(staticData.slowLinks[i++])
		);

		const feedsContainer = getElemById("feeds");

		var feedsToggleHandler = ()=>{
			this.removeEventListener("toggle", feedsToggleHandler);
			const timeKey = "lastcheck"; //Key to Time
			
			if (syncStorage) {
				syncStorage.get([timeKey, "feeds"], result => {
					for (name in result["feeds"]) {
						loadFeed(name, result["feeds"][name], feedsContainer, result[timeKey]);
					}
				});
				syncStorage.set({[timeKey]: new Date});
			} else {
				const webfeeds = JSON.parse(localStorage.getItem("feeds"));
				const lastcheck = localStorage.getItem(timeKey);
				for (name in webfeeds) {
					loadFeed(name, webfeeds[name], feedsContainer, lastcheck);
				}
				localStorage.setItem(timeKey, new Date);
			}
		}
		feedsContainer.addEventListener("toggle", feedsToggleHandler);
	}

	var loadStaticLinks = result=>{
		if (result["staticLinks"]) {
			jsonDataHandler(result["staticLinks"]);
		} else {
			readFile("links.json",
				"application/json",
				file => {
					responseText = file.responseText;
					parsed = JSON.parse(responseText);
					if (syncStorage) {
						syncStorage.set({"staticLinks": parsed, "feeds": {}});
					} else {
						localStorage.setItem("staticLinks", responseText);
						localStorage.setItem("feeds", "{}")
					}
					jsonDataHandler(parsed);
				});
		}
	}

	if (syncStorage) {
		syncStorage.get("staticLinks", loadStaticLinks);
	} else {
		loadStaticLinks({"staticLinks": JSON.parse(localStorage.getItem("staticLinks"))});
	}

	// Bind bookmark editing buttons
	getElemById("quick-links-add").addEventListener("click", e=>{
		setBookmarkClickEvent("#333");
		let form = getElemById("bookmark-form");
		let top = getElemById("quick-links-add").getBoundingClientRect().top;
		form.style.top = top.toString() + "px";
		form.style.display = form.style.display != "block" ? "block" : "none";
	});
	getElemById("bookmark-form").addEventListener("submit", addBookmark);
	getElemById("quick-links-move").addEventListener("click", e=>{
		setBookmarkClickEvent("darkblue", moveBookmark)});
	getElemById("quick-links-del").addEventListener("click", e=>{
		setBookmarkClickEvent("darkred", delBookmark)});

	// Bind feed editing buttons
	getElemById("feeds-add").addEventListener("click", e=>{
		let form = getElemById("feed-form");
		let top = getElemById("feeds-add").getBoundingClientRect().top + 20;
		form.style.top = top.toString() + "px";
		form.style.display = form.style.display != "block" ? "block" : "none";
	});
	getElemById("feed-form").addEventListener("submit", e=>{
		e.preventDefault();

		let inputs = e.target;
		let name = inputs.querySelector("[name=\"name\"]").value;
		let url = inputs.querySelector("[name=\"url\"]").value;
		let regex = inputs.querySelector("[name=\"regex\"]").value;
		let prefix = inputs.querySelector("[name=\"prefix\"]").value;
		var arr = [url];
		if (regex) arr.push(regex);
		if (prefix) arr.push(prefix);

		if (syncStorage) {
			syncStorage.get("feeds", result=>{
				result["feeds"][name] = arr;
				syncStorage.set({"feeds": result["feeds"]});
			});
		} else {
			let feeds = JSON.parse(localStorage.getItem("feeds"));
			feeds[name] = arr;
			localStorage.setItem("feeds", JSON.stringify(feeds));
		}
		getElemById("feed-form").style.display = "none";
	});
	getElemById("feeds-del").addEventListener("click", event => {
		const feednames = getElemById("feednames");
		const ul = feednames.lastChild;
		ul.textContent = "";

		var delFeed;
		var populateUl = e => {
			li = ul.appendChild(document.createElement("li"));
			li.appendChild(document.createTextNode(e));
		};

		if (syncStorage) {
			delFeed = e => {
				syncStorage.get("feeds", result=>{
					delete result["feeds"][e.target.textContent];
					syncStorage.set({"feeds": result["feeds"]});
				});
				feednames.style.display = "none";
			}
			syncStorage.get("feeds", result=>{for (name in result["feeds"]) populateUl(name)});
		} else {
			delFeed = e => {
				let feeds = JSON.parse(localStorage.getItem("feeds"));
				feeds.pop(e);
				localStorage.setItem("feeds", JSON.stringify(feeds));
				feednames.style.display = "none";
			}
			parsed=JSON.parse(localStorage.getItem("feeds"));
			for (name in parsed) populateUl(name);
		}

		ul.addEventListener("click", delFeed);
		feednames.style.display = feednames.style.display != "block" ? "block" : "none";
	});


	// Load notes
	const noteSection = getElemById("noteSection");
	noteSection.hidden = !localStorage.getItem("showNotes");
	getElemById("btn-toggle-notes").innerHTML = noteSection.hidden?"&#x25BD;":"&#x25B3;";

	var notepad = noteSection.children[0];
	notepad.value = localStorage.getItem("localnotes");

	// Load synced notes
	if (syncStorage) {
		syncStorage.get(result => {
			for (var i = noteSection.children.length; i-->1;) {
				var key = "notes" + i;
				if (!result[key]) result[key] = localStorage.getItem(key);
				noteSection.children[i].value = result[key];
			}
		});
	} else {
		for (var i = noteSection.children.length; i-->1;) {
			noteSection.children[i].value = localStorage.getItem("notes" + i);
		}
	}
	
	// Eventlisteners for notes
	var saveNotes = ()=>{
		localStorage.setItem("localnotes", noteSection.children[0].value);

		for (var i = noteSection.children.length; i-->1;) {
			var key = "notes" + i;
			var value = noteSection.children[i].value;
			if (syncStorage !== undefined) {
				syncStorage.set({[key]: value});
			} else {
				localStorage.setItem(key, value);
			}
		}
	};
	var resizeNotes = e=>{
		noteSection.style.height = "100%";
		var view = parseInt(sessionStorage.getItem("notesview"));

		if (isNaN(view) || view == 4 || e.altKey) {
			for (var i = noteSection.children.length; i--;) {
				noteSection.children[i].hidden = false;
				noteSection.children[i].style.width = "49%";
				noteSection.children[i].style.height = "40%";
			}
			view = 0;
		} else {
			for (var i = noteSection.children.length; i--;) {
				if (view != i) noteSection.children[i].hidden = true;
			}
			let notepad = noteSection.children[view++];
			notepad.hidden = false;
			notepad.style.width = "100%";
			notepad.style.height = "100%";
			notepad.scrollIntoView(true);
		}

		sessionStorage.setItem("notesview", view);
	};
	var toggleNotes = ()=>{
		if (noteSection.hidden){
			noteSection.hidden = false;
			localStorage.setItem("showNotes", 1);
			getElemById("btn-toggle-notes").innerHTML = "&#x25B3;";

		}else{
			noteSection.hidden = true;
			localStorage.setItem("showNotes", "");
			getElemById("btn-toggle-notes").innerHTML = "&#x25BD;";
		}
	};

	getElemById("btn-save-notes").addEventListener("click", saveNotes);
	getElemById("btn-resize-notes").addEventListener("click", resizeNotes);
	getElemById("btn-toggle-notes").addEventListener("click", toggleNotes);
	window.addEventListener("keydown", e=>{
		if (e.ctrlKey && e.key == "s"){
			e.preventDefault();
			saveNotes();
		}
		else if (e.altKey && e.key == "q"){
			e.preventDefault();
			resizeNotes({altKey:false});
		}
		else if (e.altKey && e.key == "w"){
			e.preventDefault();
			resizeNotes({altKey:true});
		}
		else if (e.altKey && e.keyCode == 40){
			e.preventDefault();
			toggleNotes();
		}
	});

	// Eventlistener for searchForm
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
			searchbar.name = parameters[j];
		}else{
			searchbar.name = "q";
		}
		searchForm.target = e.ctrlKey ? "_blank" : "_self";
	});

	// Eventlistener for sidebar
	var sidebar = getElemById("sidebar");
	document.addEventListener("mousemove", e => {
		if (e.altKey){
			return;
		}
		let visible = sidebar.style.display;
		let sw = sidebar.offsetWidth;
		let ww = window.innerWidth;
		let mx = e.clientX;
		sidebar.style.display = e.clientY>5 && (ww-mx<20 || (visible && ww-sw-mx<0)) ? "flex" : "none";
	});

	// Focus on searchbar. Doesn't work in add-on form, which is intended
	searchbar.focus();
});
//window.onload = function(){}