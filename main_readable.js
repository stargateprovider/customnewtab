const REGEX_DEFAULT = "item>\\s*<title>(?<name>.+?)</title>[\\s\\S]*?<link>(?:<!\\[CDATA\\[)?(?<link>.+?)(?:\\]\\]>)?<[\\s\\S]+?pubDate>(?<date>.+?)<[\\s\\S]+?(?<desc><description>[\\s\\S]+?</description>)",
	  newElem = e=>document.createElement(e),
	  getElemById = id=>document.getElementById(id);
var quickLinksURLs = [];
	bookmarkColor = "#333",
	incognitoId = null;

function loadFeed(name, dataArray, container, lastcheck){
	var [url, regexStr, prefix] = dataArray;
	prefix = prefix ? prefix : "";
	const parser = new DOMParser();

	var details = newElem("details");
	let summary = details.appendChild(newElem("summary"));
	summary.append(name);

	let processFeed = function(resp) {
		if (!regexStr){
			regexStr = REGEX_DEFAULT;
		}
		var data = resp.matchAll(new RegExp(regexStr, "g"));

		var ul = newElem("ul");
		var a, li, textarea, match, matchGroup, doc, i = 0, newEntry = false;
		while (!(match = data.next()).done && i++ < 30) {
			matchGroup = match.value.groups;

			li = ul.appendChild(newElem("li"));
			a = li.appendChild(newElem("a"));
			a.className = "tooltipBox";
			a.href = parser.parseFromString(prefix+matchGroup.link, "text/html").documentElement.textContent;
			a.append(parser.parseFromString(matchGroup.name, "text/html").documentElement.textContent);

			textarea = a.appendChild(newElem("textarea"));
			textarea.className = "tooltipText";
			textarea.setAttribute("readonly", "true");
			textarea.append(matchGroup.date);
			if (matchGroup["desc"]){
				doc = parser.parseFromString(matchGroup.desc, "text/html");
				doc = parser.parseFromString(doc.documentElement.textContent.trim(), "text/html");
				textarea.append("\n\n"+doc.documentElement.textContent);
			}

			if (!lastcheck || new Date(matchGroup.date) >= new Date(lastcheck)){
				a.style.color = "cyan";
				newEntry = true;
			}
		}

		if (newEntry){
			details.append(ul);
			container.append(details);
		}
	};

	if (Array.isArray(url)){
		for (i=url.length; i--;){
			fetch(url[i]).then(resp=>resp.text()).then(processFeed);
		}
	} else {
		fetch(url).then(resp=>resp.text()).then(processFeed);
	}
}

function fetchFavicon(url) {
	if (/^(edge|file)/.test(url)) {
		return "";
	}
	var slashIndex = url.slice(8).indexOf('/');
	if (slashIndex > -1) {
		url = url.slice(0, slashIndex + 9);
	}
	return "https://www.google.com/s2/favicons?domain=" + url;
}

function appendToQuickLinks(links) {
	var quicklinks = getElemById('quick-links');

	for (var i=0; i < links.length; i++) {
		var div = newElem("div");
		div.className = "bookmark";
		var a = div.appendChild(newElem("a"));
		a.href = links[i].url;
		a.style.background = 'url(' +links[i].favIconUrl+ ') no-repeat center center';
		a.title = links[i].url;

		quicklinks.append(div);
		quickLinksURLs.push(links[i].url);
	}
}
function appendListToSidebar(links) {
	var ul = newElem("ul");
	nQuickLinks = quickLinksURLs.length;

	for (var i=0; i < links.length; i++) {
		var link = links[i].hasOwnProperty("tab") ? links[i].tab : links[i];
		if (!link.hasOwnProperty("url") || link.url.startsWith("chrome.//")){
			continue;
		}
		var linkIsIn = str=>link.url.includes(str);
		for (var j=0; j<nQuickLinks; j++){
			if (linkIsIn(quickLinksURLs[j])) {continue;}
		}

		//var li = ;
		var a = ul.appendChild(newElem("li")).appendChild(newElem("a"));
		a.href = link.url;
		a.append(link.title);

		var icon = new Image();
		icon.src = link.favIconUrl ? link.favIconUrl : fetchFavicon(link.url);
		a.insertAdjacentElement("afterbegin", icon);
	}
	getElemById("sidebar").append(ul);
}

function addBookmark(event){
	event.preventDefault();

	let inputs = event.target,
		a1 = newElem("a"),
		a2 = newElem("a");
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
	let container = getElemById("quick-links");
	let bookmarks = container.childNodes;
	for (var i=0; bookmarks[++i] != event.currentTarget;);

	if (i>1){
		let removed = container.removeChild(bookmarks[i]);
		container.insertBefore(removed, bookmarks[i-1]);

		let localQuickLinks = JSON.parse(localStorage.getItem("quick-links"));
		[localQuickLinks[i-1], localQuickLinks[i-2]] = [localQuickLinks[i-2], localQuickLinks[i-1]];
		localStorage.setItem("quick-links", JSON.stringify(localQuickLinks));
	}
}
function delBookmark(event){
	event.preventDefault();
	let container = getElemById("quick-links");
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
					for (var name in result["feeds"]) {
						loadFeed(name, result["feeds"][name], feedsContainer, result[timeKey]);
					}
				});
				syncStorage.set({[timeKey]: (new Date).toString()});
			} else {
				const webfeeds = JSON.parse(localStorage.getItem("feeds"));
				const lastcheck = localStorage.getItem(timeKey);
				for (var name in webfeeds) {
					loadFeed(name, webfeeds[name], feedsContainer, lastcheck);
				}
				localStorage.setItem(timeKey, (new Date).toString());
			}
		}
		feedsContainer.addEventListener("toggle", feedsToggleHandler);
	}

	var loadStaticLinks = result=>{
		if (result["staticLinks"]) {
			jsonDataHandler(result["staticLinks"]);
		} else {
			fetch("links.json")
			.then(response => response.json())
			.then(json => {
				if (syncStorage) {
					syncStorage.set({"staticLinks": json, "feeds": {}});
				} else {
					localStorage.setItem("staticLinks", json.stringify());
					localStorage.setItem("feeds", "{}");
				}
				jsonDataHandler(json);
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

		let inputs = e.target,
			name = inputs.querySelector("[name=\"name\"]").value,
			url = inputs.querySelector("[name=\"url\"]").value,
			regex = inputs.querySelector("[name=\"regex\"]").value,
			prefix = inputs.querySelector("[name=\"prefix\"]").value;
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
		const feednames = getElemById("feednames"),
			  ul = feednames.lastChild;
		ul.textContent = "";

		var delFeed;
		var populateUl = e => {
			li = ul.appendChild(newElem("li"));
			li.append(e);
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
				delete feeds[e.target.textContent];
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

	// Eventlistener for sidebar
	var sidebar = getElemById("sidebar");
	document.addEventListener("mousemove", e => {
		if (e.altKey){
			return;
		}
		let visible = sidebar.style.display,
			sw = sidebar.offsetWidth,
			ww = window.innerWidth,
			mx = e.clientX;
		sidebar.style.display = e.clientY>5 && (ww-mx<20 || (visible && ww-sw-mx<0)) ? "flex" : "none";
	});

	// Eventlistener for searchForm
	var searchForm = getElemById("searchForm"),
		searchbar = searchForm.children[0];
	searchForm.addEventListener("click", e => {
		if (e.target.hasAttribute("formaction")) {
			e.preventDefault();
			let url = e.target.getAttribute("formaction").replace("%s", searchbar.value);
			if (e.shiftKey && chrome.windows) {
				var newWindow = ()=>chrome.windows.create({url: url, incognito: true}, w => {incognitoId = w.id;});
				if (incognitoId) {
					chrome.tabs.create({url: url, windowId: incognitoId}, e => {
						if (chrome.runtime.lastError) {
							incognitoId = null;
							newWindow();
					}});
				} else {
					newWindow();
				}
			} else {
				window.open(url, e.ctrlKey ? "_blank" : "_self");
			}
		}
	});
	// Focus on searchbar. Doesn't work in add-on form, which is intended
	searchbar.focus();
});
//window.onload = function(){}