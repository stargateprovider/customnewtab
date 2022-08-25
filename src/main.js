const Rx="item>\\s*<title>(?<name>.+?)</title>[\\s\\S]*?<link>(?:<!\\[CDATA\\[)?(?<link>.+?)(?:\\]\\]>)?<[\\s\\S]+?pubDate>(?<date>.+?)<[\\s\\S]+?(?<desc><description>[\\s\\S]+?</description>)",_=e=>document.createElement(e),$=e=>document.getElementById(e);var y=[],bc="#333",I=null;function lf(e,t,n,l){var[a,o,r]=t,r=r||"";const s=new DOMParser;var c=_("details");c.appendChild(_("summary")).append(e);let m=function(e){o||(o=Rx);for(var t,a,i,m,k,u=e.matchAll(new RegExp(o,"g")),p=_("ul"),g=0,h=!1;!(i=u.next()).done&&g++<30;)m=i.value.groups,(t=p.appendChild(_("li")).appendChild(_("a"))).className="tooltipBox",t.href=s.parseFromString(r+m.link,"text/html").documentElement.textContent,t.append(s.parseFromString(m.name,"text/html").documentElement.textContent),(a=t.appendChild(_("textarea"))).className="tooltipText",a.setAttribute("readonly","true"),a.append(m.date),m.desc&&(k=s.parseFromString(m.desc,"text/html"),k=s.parseFromString(k.documentElement.textContent.trim(),"text/html"),a.append("\n\n"+k.documentElement.textContent)),(!l||new Date(m.date)>=new Date(l))&&(t.style.color="cyan",h=!0);h&&(c.append(p),n.append(c))};if(Array.isArray(a))for(i=a.length;i--;)fetch(a[i]).then(b=>b.text()).then(m);else fetch(a).then(b=>b.text()).then(m)}function ff(e){if(/^(edge|file)/.test(e))return"";var s=e.slice(8).indexOf("/");return s>-1&&(e=e.slice(0,s+9)),"https://www.google.com/s2/favicons?domain="+e}function x(e){for(var t=$("quick-links"),n=0;n<e.length;n++){var l=_("div");l.className="bookmark";var a=l.appendChild(_("a"));a.href=e[n].url,a.style.background="url("+e[n].favIconUrl+") no-repeat center center",a.title=e[n].url,t.append(l),y.push(e[n].url)}}function q(e){var l=_("ul");nQuickLinks=y.length;for(var a=0;a<e.length;a++){var o=e[a].hasOwnProperty("tab")?e[a].tab:e[a];if(o.hasOwnProperty("url")&&!o.url.startsWith("chrome.//")){for(var r=e=>o.url.includes(e),i=0;i<nQuickLinks;i++)r(y[i]);var s=l.appendChild(_("li")).appendChild(_("a"));s.href=o.url,s.append(o.title);var d=new Image;d.src=o.favIconUrl?o.favIconUrl:ff(o.url),s.insertAdjacentElement("afterbegin",d)}}$("sidebar").append(l)}function ab(e){e.preventDefault();let t=e.target,n=_("a"),l=_("a");n.href=t.querySelector('[placeholder="URL"]').value,l.href=t.querySelector('[placeholder="Ikooni URL"]').value;let a={url:n.href,favIconUrl:l.href};x([a]);let o=JSON.parse(localStorage.getItem("quick-links"));o.push(a),localStorage.setItem("quick-links",JSON.stringify(o))}function mb(e){e.preventDefault();let t=$("quick-links"),n=t.childNodes;for(var l=0;n[++l]!=e.currentTarget;);if(l>1){let e=t.removeChild(n[l]);t.insertBefore(e,n[l-1]);let a=JSON.parse(localStorage.getItem("quick-links"));[a[l-1],a[l-2]]=[a[l-2],a[l-1]],localStorage.setItem("quick-links",JSON.stringify(a))}}function db(e){e.preventDefault();let t=$("quick-links"),n=t.childNodes;for(var l=0;n[++l]!=e.currentTarget;);t.removeChild(n[l]);let a=JSON.parse(localStorage.getItem("quick-links"));a.splice(l-1,1),localStorage.setItem("quick-links",JSON.stringify(a))}function w(e,t){let n=document.getElementsByClassName("bookmark");bc=bc!=e?e:"#333";for(let l=n.length;l--;)n[l].removeEventListener("click",db),n[l].removeEventListener("click",mb),n[l].style.background=bc,t&&bc==e&&n[l].addEventListener("click",t)}document.addEventListener("DOMContentLoaded",function(e){var n,l;window.location.origin.startsWith("chrome-extens")?(n="2",l=chrome.storage.sync):window.location.origin.startsWith("moz-extens")&&(n="unfiled_____",l=browser.storage.sync),void 0!==n&&(chrome.sessions.getRecentlyClosed(q),chrome.topSites.get(q));let a=e=>{let n=localStorage.getItem("quick-links");n?x(JSON.parse(n)):(localStorage.setItem("quick-links",JSON.stringify(e.quickLinks)),x(e.quickLinks)),linksArrayLen=e.slowLinks.length;for(let t=0;t<linksArrayLen;q(e.slowLinks[t++]));const a=$("feeds");var o=()=>{this.removeEventListener("toggle",o);if(l)l.get(["lastcheck","feeds"],e=>{for(n in e.feeds)lf(n,e.feeds[n],a,e.lastcheck)}),l.set({lastcheck:(new Date).toString()});else{const e=JSON.parse(localStorage.getItem("feeds")),t=localStorage.getItem("lastcheck");for(n in e)lf(n,e[n],a,t);localStorage.setItem("lastcheck",(new Date).toString())}};a.addEventListener("toggle",o)};var o=e=>{e.staticLinks?a(e.staticLinks):fetch("links.json").then(e=>e.json()).then(e=>{l?l.set({staticLinks:e,feeds:{}}):(localStorage.setItem("staticLinks",JSON.stringify(e)),localStorage.setItem("feeds","{}")),a(e)})};l?l.get("staticLinks",o):o({staticLinks:JSON.parse(localStorage.getItem("staticLinks"))}),$("quick-links-add").addEventListener("click",e=>{w("#333");let n=$("bookmark-form"),l=$("quick-links-add").getBoundingClientRect().top;n.style.top=l.toString()+"px",n.style.display="block"!=n.style.display?"block":"none"}),$("bookmark-form").addEventListener("submit",ab),$("quick-links-move").addEventListener("click",e=>{w("darkblue",mb)}),$("quick-links-del").addEventListener("click",e=>{w("darkred",db)}),$("feeds-add").addEventListener("click",e=>{let n=$("feed-form"),l=$("feeds-add").getBoundingClientRect().top+20;n.style.top=l.toString()+"px",n.style.display="block"!=n.style.display?"block":"none"}),$("feed-form").addEventListener("submit",e=>{e.preventDefault();let n=e.target,a=n.querySelector('[name="name"]').value,o=n.querySelector('[name="url"]').value,r=n.querySelector('[name="regex"]').value,i=n.querySelector('[name="prefix"]').value;var s=[o];if(r&&s.push(r),i&&s.push(i),l)l.get("feeds",e=>{e.feeds[a]=s,l.set({feeds:e.feeds})});else{let e=JSON.parse(localStorage.getItem("feeds"));e[a]=s,localStorage.setItem("feeds",JSON.stringify(e))}$("feed-form").style.display="none"}),$("feeds-del").addEventListener("click",e=>{const n=$("feednames"),a=n.lastChild;var o;a.textContent="";var r=e=>{li=a.appendChild(_("li")),li.append(e)};if(l)o=(e=>{l.get("feeds",t=>{delete t.feeds[e.target.textContent],l.set({feeds:t.feeds})}),n.style.display="none"}),l.get("feeds",e=>{for(name in e.feeds)r(name)});else for(name in o=(e=>{let t=JSON.parse(localStorage.getItem("feeds"));delete t[e.target.textContent],localStorage.setItem("feeds",JSON.stringify(t)),n.style.display="none"}),parsed=JSON.parse(localStorage.getItem("feeds")),parsed)r(name);a.addEventListener("click",o),n.style.display="block"!=n.style.display?"block":"none"});const r=$("noteSection");if(r.hidden=!localStorage.getItem("showNotes"),$("btn-toggle-notes").innerHTML=r.hidden?"&#x25BD;":"&#x25B3;",r.children[0].value=localStorage.getItem("localnotes"),l)l.get(e=>{for(var t=r.children.length;t-->1;){var n="notes"+t;e[n]||(e[n]=localStorage.getItem(n)),r.children[t].value=e[n]}});else for(var i=r.children.length;i-->1;)r.children[i].value=localStorage.getItem("notes"+i);var s=()=>{localStorage.setItem("localnotes",r.children[0].value);for(var e=r.children.length;e-->1;){var t="notes"+e,n=r.children[e].value;void 0!==l?l.set({[t]:n}):localStorage.setItem(t,n)}},d=e=>{r.style.height="100%";var t=parseInt(sessionStorage.getItem("notesview"));if(isNaN(t)||4==t||e.altKey){for(var n=r.children.length;n--;)r.children[n].hidden=!1,r.children[n].style.width="49%",r.children[n].style.height="40%";t=0}else{for(n=r.children.length;n--;)t!=n&&(r.children[n].hidden=!0);let e=r.children[t++];e.hidden=!1,e.style.width="100%",e.style.height="100%",e.scrollIntoView(!0)}sessionStorage.setItem("notesview",t)},c=()=>{r.hidden?(r.hidden=!1,localStorage.setItem("showNotes",1),$("btn-toggle-notes").innerHTML="&#x25B3;"):(r.hidden=!0,localStorage.setItem("showNotes",""),$("btn-toggle-notes").innerHTML="&#x25BD;")};$("btn-save-notes").addEventListener("click",s),$("btn-resize-notes").addEventListener("click",d),$("btn-toggle-notes").addEventListener("click",c),window.addEventListener("keydown",e=>{e.ctrlKey&&"s"==e.key?(e.preventDefault(),s()):e.altKey&&"q"==e.key?(e.preventDefault(),d({altKey:!1})):e.altKey&&"w"==e.key?(e.preventDefault(),d({altKey:!0})):e.altKey&&40==e.keyCode&&(e.preventDefault(),c())});var u=$("sidebar");document.addEventListener("mousemove",e=>{if(!e.altKey){let r=u.style.display,a=u.offsetWidth,t=window.innerWidth,s=e.clientX;u.style.display=e.clientY>5&&(t-s<20||r&&t-a-s<0)?"flex":"none"}});var m=$("searchForm"),k=m.children[0];m.addEventListener("click",e=>{if(e.target.hasAttribute("formaction")){e.preventDefault();let r=e.target.getAttribute("formaction").replace("%s",k.value);if(e.shiftKey&&chrome.windows){var t=()=>chrome.windows.create({url:r,incognito:!0},e=>{I=e.id});I?chrome.tabs.create({url:r,windowId:I},e=>{chrome.runtime.lastError&&(I=null,t())}):t()}else window.open(r,e.ctrlKey?"_blank":"_self")}}),k.focus()});