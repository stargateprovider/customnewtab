const REGEX_DEFAULT="item>\\s*<title>(?<name>.+?)</title>[\\s\\S]*?<link>(?:<!\\[CDATA\\[)?(?<link>.+?)(?:\\]\\]>)?<[\\s\\S]+?pubDate>(?<date>.+?)<[\\s\\S]+?(?<desc><description>[\\s\\S]+?</description>)";var quickLinksURLs=[],bookmarkColor="#333";function readFile(e,t,n){var o=new XMLHttpRequest;o.overrideMimeType(t),o.open("GET",e,!0),o.onload=function(){4===o.readyState&&"200"==o.status&&n(o)},o.send(null)}function loadFeeds(e,t,n,o){var[l,r,a]=t,a=a||"",s=document.createElement.bind(document),d=s("details");d.appendChild(s("summary")).appendChild(document.createTextNode(e));var c=function(e){r||(r=REGEX_DEFAULT);for(var t,i,l,c,m,k=e.responseText.matchAll(new RegExp(r,"g")),u=new DOMParser,p=s("ul"),h=0,g=!1;!(l=k.next()).done&&h++<30;)c=l.value.groups,(t=p.appendChild(s("li")).appendChild(s("a"))).className="tooltipBox",t.href=u.parseFromString(a+c.link,"text/html").documentElement.textContent,t.appendChild(document.createTextNode(u.parseFromString(c.name,"text/html").documentElement.textContent)),(i=t.appendChild(s("textarea"))).className="tooltipText",i.setAttribute("readonly","true"),i.appendChild(document.createTextNode(c.date)),c.desc&&(m=u.parseFromString(c.desc,"text/html"),m=u.parseFromString(m.documentElement.textContent.trim(),"text/html"),i.appendChild(document.createTextNode("\n\n"+m.documentElement.textContent))),(!o||new Date(c.date)>=o)&&(t.style.color="cyan",g=!0);g&&(d.appendChild(p),n.appendChild(d))};if(Array.isArray(l))for(i=0;i<l.length;i++)readFile(l[i],"text/xml",c);else readFile(l,"text/xml",c)}function fetchFavicon(e,t=!1){return t&&(e=e.slice(0,e.slice(8).indexOf("/")+9)),"https://www.google.com/s2/favicons?domain="+e}function appendToQuickLinks(e){for(var t=document.getElementById("quick-links"),n=0;n<e.length;n++){var o=document.createElement("div");o.className="bookmark";var i=o.appendChild(document.createElement("a"));i.href=e[n].url,i.style.background="url("+e[n].favIconUrl+") no-repeat center center",i.title=e[n].url,t.appendChild(o),quickLinksURLs.push(e[n].url)}}function appendListToSidebar(e,t=!0){var n=document.createElement.bind(document),o=document.getElementById("sidebar"),i=n("ul");nQuickLinks=quickLinksURLs.length;for(var l=0;l<e.length;l++){var r=e[l].hasOwnProperty("tab")?e[l].tab:e[l];if(r.hasOwnProperty("url")&&!r.url.startsWith("chrome.//")){for(var a=r.url.includes.bind(r.url),s=0;s<nQuickLinks;s++)a(quickLinksURLs[s]);var d=i.appendChild(n("li")).appendChild(n("a"));d.href=r.url,d.appendChild(document.createTextNode(r.title));var c=new Image;c.src=r.favIconUrl?r.favIconUrl:fetchFavicon(r.url,t),d.insertAdjacentElement("afterbegin",c)}}o.appendChild(i)}function addBookmark(e){e.preventDefault();let t=e.target,n=document.createElement("a"),o=document.createElement("a");n.href=t.querySelector('[placeholder="URL"]').value,o.href=t.querySelector('[placeholder="Ikooni URL"]').value;let i={url:n.href,favIconUrl:o.href};appendToQuickLinks([i]);let l=JSON.parse(localStorage.getItem("quick-links"));l.push(i),localStorage.setItem("quick-links",JSON.stringify(l))}function moveBookmark(e){e.preventDefault();let t=document.getElementById("quick-links"),n=t.childNodes;for(var o=0;n[++o]!=e.currentTarget;);if(o>1){let e=t.removeChild(n[o]);t.insertBefore(e,n[o-1]);let i=JSON.parse(localStorage.getItem("quick-links"));[i[o-1],i[o-2]]=[i[o-2],i[o-1]],localStorage.setItem("quick-links",JSON.stringify(i))}}function delBookmark(e){e.preventDefault();let t=document.getElementById("quick-links"),n=t.childNodes;for(var o=0;n[++o]!=e.currentTarget;);t.removeChild(n[o]);let i=JSON.parse(localStorage.getItem("quick-links"));i.splice(o-1,1),localStorage.setItem("quick-links",JSON.stringify(i))}function setBookmarkClickEvent(e,t){let n=document.getElementsByClassName("bookmark");bookmarkColor=bookmarkColor!=e?e:"#333";for(let o=0;o<n.length;o++)n[o].removeEventListener("click",delBookmark),n[o].removeEventListener("click",moveBookmark),n[o].style.background=bookmarkColor,t&&bookmarkColor==e&&n[o].addEventListener("click",t)}document.addEventListener("DOMContentLoaded",function(e){var t,n,o=document.getElementById.bind(document);window.location.origin.startsWith("chrome-extension://")?(t="2",n=chrome.storage.sync):window.location.origin.startsWith("moz-extension://")&&(t="unfiled_____",n=browser.storage.sync),void 0!==t&&(chrome.sessions.getRecentlyClosed(appendListToSidebar),chrome.topSites.get(appendListToSidebar),chrome.bookmarks.getSubTree(t,function(e){let t=e[0].children;appendListToSidebar(t.find(e=>"m"==e.title).children,!1),appendListToSidebar(t.find(e=>"a"==e.title).children,!1)}));var i=o("feeds"),l=function(e){var t=JSON.parse(e);let o=JSON.parse(localStorage.getItem("quick-links"));o?appendToQuickLinks(o):(localStorage.setItem("quick-links",JSON.stringify(t.quickLinks)),appendToQuickLinks(t.quickLinks)),linksArrayLen=t.slowLinks.length;for(let e=0;e<linksArrayLen;e++)appendListToSidebar(t.slowLinks[e],!1);var l=function(){this.removeEventListener("toggle",l);var e="lastcheck",o=localStorage.getItem(e);for(obj in void 0!==n&&(n.get([e],t=>{t[e]&&(o=t[e])}),n.set({[e]:new Date})),webfeeds=t.feeds.Web,webfeeds)loadFeeds(obj,webfeeds[obj],i,o);console.log(o)};i.addEventListener("toggle",l)},r=e=>{e.staticLinks?l(e.staticLinks):readFile("links.json","application/json",e=>{responseText=e.responseText,n.set({staticLinks:responseText}),l(responseText)})};void 0!==n?n.get("staticLinks",r):r(localStorage.get("staticLinks")),o("quick-links-add").addEventListener("click",e=>{setBookmarkClickEvent("#333");let t=o("form-popup"),n=o("quick-links-add").getBoundingClientRect().top;t.style.top=n.toString()+"px",t.style.display="block"!=t.style.display?"block":"none"}),o("form-popup").addEventListener("submit",addBookmark),o("quick-links-move").addEventListener("click",e=>{setBookmarkClickEvent("darkblue",moveBookmark)}),o("quick-links-del").addEventListener("click",e=>{setBookmarkClickEvent("darkred",delBookmark)});var a=o("noteSection");if(a.hidden=!localStorage.getItem("showNotes"),o("btn-toggle-notes").innerHTML=a.hidden?"&#x25BD;":"&#x25B3;",a.children[0].value=localStorage.getItem("localnotes"),void 0!==n)n.get(e=>{for(var t=1;t<a.children.length;t++){var n="notes"+t;e[n]||(e[n]=localStorage.getItem(n)),a.children[t].value=e[n]}});else for(var s=1;s<a.children.length;s++)a.children[s].value=localStorage.getItem("notes"+s);var d=function(){localStorage.setItem("localnotes",a.children[0].value);for(var e=1;e<a.children.length;e++){var t="notes"+e,o=a.children[e].value;void 0!==n?n.set({[t]:o},()=>{}):localStorage.setItem(t,o)}},c=function(e){a.style.height="100%";var t=parseInt(sessionStorage.getItem("notesview"));if(isNaN(t)||4==t||e.altKey){for(var n=0;n<a.children.length;n++)a.children[n].hidden=!1,a.children[n].style.width="49%",a.children[n].style.height="40%";t=0}else{for(n=0;n<a.children.length;n++)t!=n&&(a.children[n].hidden=!0);let e=a.children[t++];e.hidden=!1,e.style.width="100%",e.style.height="100%",e.scrollIntoView(!0)}sessionStorage.setItem("notesview",t)},m=function(){a.hidden?(a.hidden=!1,localStorage.setItem("showNotes",1),o("btn-toggle-notes").innerHTML="&#x25B3;"):(a.hidden=!0,localStorage.setItem("showNotes",""),o("btn-toggle-notes").innerHTML="&#x25BD;")};o("btn-save-notes").addEventListener("click",d),o("btn-resize-notes").addEventListener("click",c),o("btn-toggle-notes").addEventListener("click",m),window.addEventListener("keydown",e=>{e.ctrlKey&&"s"==e.key?(e.preventDefault(),d()):e.altKey&&"q"==e.key?(e.preventDefault(),c({altKey:!1})):e.altKey&&"w"==e.key?(e.preventDefault(),c({altKey:!0})):e.altKey&&40==e.keyCode&&(e.preventDefault(),m())});var k=o("searchForm"),u=k.children[0];k.addEventListener("click",function(e){if(e.target.name){let n=e.target.name.split("&");for(var t=0;t<n.length-1;t++){let e=n[t].split("="),o=document.createElement("input");o.setAttribute("type","hidden"),o.setAttribute("name",e[0]),o.setAttribute("value",e[1]),k.appendChild(o)}u.name=n[t]}else u.name="q";k.target=e.ctrlKey?"_blank":"_self"});var p=o("sidebar");document.addEventListener("mousemove",e=>{if(e.altKey)return;let t=p.style.display,n=p.offsetWidth,o=window.innerWidth,i=e.clientX;p.style.display=e.clientY>5&&(o-i<20||t&&o-n-i<0)?"flex":"none"}),u.focus()});