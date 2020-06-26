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
	var otherBookmarksId;
	if (window.location.origin.startsWith("chrome-extension://")){
		otherBookmarksId = "2";
	} else if (window.location.origin.startsWith("moz-extension://")){
		otherBookmarksId = "unfiled_____";
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

	// Load links from file
	let jsonDataHandler = responseText => {
		var staticData = JSON.parse(responseText);
		
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
	}

	let staticLinks = localStorage.getItem("staticLinks");
	if (staticLinks) {
		jsonDataHandler(staticLinks);
	} else {
		readFile("links.json",
			"application/json",
			file => {
				responseText = file.responseText;
				localStorage.setItem("staticLinks", responseText);
				jsonDataHandler(responseText);
			});
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

	// Load notes
	const notepad = getElemById("notepad");
	notepad.value = localStorage.getItem("localnotes");
	notepad.hidden = !localStorage.getItem("showNotes");
	getElemById("btn-toggle-notes").innerHTML = notepad.hidden?"&#x25BD;":"&#x25B3;";
	
	// Eventlisteners for notes
	var saveNotes = ()=>{
		localStorage.setItem("localnotes", notepad.value);
	};
	var resizeNotes = ()=>{
		if (notepad.style.width=="100%") {
			notepad.style.width = "57%";
			notepad.style.height = "50%";
		} else {
			notepad.style.width = "100%";
			notepad.style.height = "100%";
			notepad.scrollIntoView(true);
		}
	};
	var toggleNotes = ()=>{
		if (notepad.hidden){
			notepad.hidden = false;
			localStorage.setItem("showNotes", 1);
			getElemById("btn-toggle-notes").innerHTML = "&#x25B3;";

		}else{
			notepad.hidden = true;
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
			resizeNotes();
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