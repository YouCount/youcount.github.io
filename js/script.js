function idClickListener(e,t){document.getElementById(e).addEventListener("click",t)}function queryClickListener(e,t){document.querySelectorAll(e).forEach(function(e){e.addEventListener("click",t)})}function fx(e){console.log(e);var t=document.getElementById(e),n=0,a=1,s=1;return fx.transition=function(e,t,a,i,o){for(var l=0;l<s;l++)setTimeout(function(){e+=Number((t-n)/s),i(e)},50*(l+1))},fx.fadeIn=function(e){e||(e=400),s=e/50,"none"==window.getComputedStyle(t).getPropertyValue("display")&&(t.dataset.fxDisplay?t.style.display=t.dataset.fxDisplay:t.style.display="block",a=t.dataset.fxOpacity||Number(t.style.opacity)||1,t.style.opacity=0,fx.transition(0,a,1,function(e){t.style.opacity=e},e),setTimeout(function(){t.style.opacity=1},e))},fx.fadeOut=function(e){e||(e=400),s=e/50,"none"!=window.getComputedStyle(t).getPropertyValue("display")&&(t.dataset.fxDisplay=window.getComputedStyle(t).getPropertyValue("display"),a=t.style.opacity?Number(t.style.opacity):1,t.dataset.fxOpacity=a,n=a,fx.transition(a,0,-1,function(e){t.style.opacity=e},e),setTimeout(function(){t.style.display="none",t.style.opacity=t.dataset.fxOpacity},e))},fx}function tutorial(e){e||(e=0),isTutorialOn=1,window.scrollTo(0,0);var t=0;switch(e){case 0:document.getElementById("username").value="",document.getElementById("input").style.zIndex="1002",document.getElementById("tutorial").style.display="block",t=document.getElementById("username").getBoundingClientRect().bottom,document.getElementById("tutorial").style.top=t+55,document.getElementById("bg2").style.display="block";break;case 1:document.getElementById("tutStep1").style.display="none",document.getElementById("tutStep2").style.display="block",t=document.getElementById("username").getBoundingClientRect().bottom,document.getElementById("tutorial").style.top=t+55;break;case 2:document.getElementById("tutStep1").style.display="none",document.getElementById("tutStep2").style.display="block",document.getElementById("suggest").style.zIndex="1002",t=document.getElementById("suggest").getBoundingClientRect().bottom,document.getElementById("tutorial").style.top=t+55,document.getElementById("bg2").style.display="block";break;case 3:document.getElementById("tutorial").style.display="none",document.getElementById("bg2").style.display="none",document.getElementById("input").style.zIndex="auto",isTutorialOn=0}}function shareFunc(e){var t=200;if(!(!0!==e&&shareswitch<2)){var n=document.querySelectorAll(".share");switch(shareswitch){case 0:shareswitch=1,n.forEach(function(e,n){setTimeout(function(){fx(e.id).fadeIn(t)},40*(n-1))}),setTimeout(function(){shareswitch=2},t+40*n.length);break;case 1:break;case 2:shareswitch=1,navState[0]=0,n.forEach(function(e,n){fx(e.id).fadeOut(t)}),setTimeout(function(){shareswitch=0},t+40*n.length)}}}function handleNavButtons(e){if(!navState[1])if(0!=navState[0])switch(navState[1]=1,document.getElementById("bg1").style.height="100%",document.getElementById("bg1").classList.add("ball"),document.getElementById("mainPage").style.display="block",navState[0]==e?setTimeout(function(){navState=[0,0]},500):setTimeout(function(){navState=[0,0],handleNavButtons(e)},500),navState[0]){case 2:document.getElementById("helpArt").style.display="none";break;case 3:document.getElementById("codeArt").style.display="none"}else switch(e){case 1:location.hash&&(location.href=location.href.split(location.hash)[0]),navState[0]=1;break;case 2:document.getElementById("bg1").classList.remove("ball"),setTimeout(function(){fx("helpArt").fadeIn(500),document.getElementById("bg1").style.height="auto",document.getElementById("mainPage").style.display="none"},500),setTimeout(function(){navState[1]=0},1e3),navState=[2,1];break;case 3:document.getElementById("bg1").classList.remove("ball"),setTimeout(function(){fx("codeArt").fadeIn(500),document.getElementById("bg1").style.height="auto",document.getElementById("mainPage").style.display="none"},500),setTimeout(function(){navState[1]=0},1e3),navState=[3,1];break;case 4:shareFunc(!0),navState[0]=4}}function trigenter(e){13===e.keyCode&&getValue()}function linkshare(){fx("pageUrl").fadeIn(250),fx("bg2").fadeIn(500)}function pushViews(e,t){AJX(e,function(e){views[t]=e.items[0].statistics.viewCount,t===2*vids-1&&upCharts()})}function extrabutton(){if(0===firstload){if(!internet||notFound||isTutorialOn)return;document.getElementById("showextra").innerHTML="LOADING...";var e=username.length>=24&&"UC"===username.substr(0,2).toUpperCase()?"id":"forUsername",t="https://www.googleapis.com/youtube/v3/channels?part=contentDetails&"+e+"="+username+"&fields=items/contentDetails/relatedPlaylists/uploads&key="+getKey();AJX(t,function(t){var n="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+t.items[0].contentDetails.relatedPlaylists.uploads+"&maxResults=50&fields=items/snippet/resourceId/videoId&key="+getKey();AJX(n,function(t){for(var n=0;t.items[n];n++)pushViews("https://www.googleapis.com/youtube/v3/videos?part=statistics&id="+t.items[n].snippet.resourceId.videoId+"&fields=items/statistics/viewCount&key="+getKey(),n);getScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.js",function(){isChart=1,document.getElementById("extra").classList.remove("extraCol"),document.getElementById("extra").classList.add("extraExp"),fx("showextra").fadeOut(),fx("hideextra").fadeIn(),extraswitch=1;for(var t=[],n=[],a=0;a<vids;a++)t[a]=views[a],n[a]="";var s={labels:n,datasets:[{label:"Views of last"+vids+" videos",fill:!1,borderColor:"rgba(255,50,50,0.5)",pointBorderColor:"rgba(255,50,50,0.5)",pointBackgroundColor:"rgba(255,50,50,1)",data:t}]};myLineChart2=new Chart(document.getElementById("myChart2").getContext("2d"),{type:"line",data:s,gridLines:{display:!1},responsive:!0,maintainAspectRatio:!1});var i=[function(){for(var e=0,t=0;t<vids;t++)e+=Number(views[t]);return e}(),function(){for(var e=0,t=vids;t<2*vids;t++)e+=Number(views[t]);return e}()],o=[Math.floor(i[0]/vids),Math.floor(i[1]/vids)],l={labels:["last "+vids+" videos","last to last "+vids+" videos"],datasets:[{label:"Average Views",borderColor:["rgba(0,0,255,1)","rgba(0,255,0,1)"],backgroundColor:["rgba(50,50,255,0.2)","rgba(50,255,50,0.2)"],hoverBackgroundColor:["rgba(0,0,255,1)","rgba(0,255,0,1)"],data:o}]};myLineChart3=new Chart(document.getElementById("myChart3").getContext("2d"),{type:"bar",data:l,gridLines:{display:!1},responsive:!0,maintainAspectRatio:!1});var d={labels:["last"+vids+" videos (total views)","last to last "+vids+" videos (total views)"],datasets:[{label:"Total Views",borderColor:["rgba(0,0,255,1)","rgba(0,255,0,1)"],backgroundColor:["rgba(50,50,255,0.2)","rgba(50,255,50,0.2)"],hoverBackgroundColor:["rgba(0,0,255,1)","rgba(0,255,0,1)"],data:[i[0],i[1]]}]};myLineChart4=new Chart(document.getElementById("myChart4").getContext("2d"),{type:"doughnut",data:d,gridLines:{display:!1},responsive:!0,maintainAspectRatio:!1}),changeText(document.getElementById("pubDate"),channeldate);var r="https://www.googleapis.com/youtube/v3/channels?part=statistics&"+e+"="+username+"&fields=items/statistics(videoCount,viewCount)&key="+getKey();AJX(r,function(e){changeText(document.getElementById("totalVideos"),e.items[0].statistics.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")),changeText(document.getElementById("totalViews"),e.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))})})})}),setTimeout(function(){document.getElementById("extraContent").style.display="block"}),setTimeout(function(){document.getElementById("showextra").innerHTML="SHOW STATS"},250),firstload=1}else 0===extraswitch?(isChart=1,fx("showextra").fadeOut(),fx("hideextra").fadeIn(),setTimeout(function(){document.getElementById("extraContent").style.display="block"})):(myLineChart1.destroy(),document.getElementById("extra").classList.add("extraCol"),document.getElementById("extra").classList.remove("extraExp"),fx("showextra").fadeIn(),fx("hideextra").fadeOut(100),setTimeout(function(){document.getElementById("extraContent").style.display="block"}),extraswitch=0,isChart=0)}function upCharts(){if(!(Number(document.getElementById("vids").value)>25)){vids=Number(document.getElementById("vids").value);for(var e=0,t=0,n=0;n<vids;n++)myLineChart2.data.labels[n]="",myLineChart2.data.datasets[0].data[n]=views[n],e+=Number(views[n]);for(n=vids;n<2*vids;n++)t+=Number(views[n]);myLineChart2.data.labels.splice(vids),myLineChart2.data.datasets[0].data.splice(vids),myLineChart2.data.datasets[0].label="Views of last "+vids+" videos",myLineChart3.data.labels=["last "+vids+" videos","last to last "+vids+" videos"],myLineChart3.data.datasets[0].data[0]=Math.floor(e/vids),myLineChart3.data.datasets[0].data[1]=Math.floor(t/vids),myLineChart4.data.labels=["last "+vids+" videos (total views)","last to last "+vids+" videos (total views)"],myLineChart4.data.datasets[0].data[0]=e,myLineChart4.data.datasets[0].data[1]=t,myLineChart2.update(),myLineChart3.update(),myLineChart4.update()}}var emailParts=["manas.khurana20","gmail","com","&#46;","&#64;"];document.getElementById("email").innerHTML=emailParts[0]+emailParts[4]+emailParts[1]+emailParts[3]+emailParts[2],document.getElementById("email").href="mailto:"+document.getElementById("email").innerHTML;var clickList=[["fb",function(){window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(document.querySelector("#pageUrl input").getAttribute("value")),"_blank")}],["tw",function(){window.open("https://twitter.com/share?text="+document.getElementById("username").value+" now has  "+actualCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")+" subscribers!&url= "+encodeURIComponent(document.querySelector("#pageUrl input").getAttribute("value"))+"&hashtags=YouCount","_blank")}],["lnkdIn",function(){window.open("https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(document.querySelector("#pageUrl input").getAttribute("value"))+"&title="+encodeURIComponent(channelname)+"'s%20Live%20Subscriber%20Count&source=YouCount","_blank")}],["tb",function(){window.open("http://www.tumblr.com/share/link?url="+encodeURIComponent(document.querySelector("#pageUrl input").getAttribute("value")),"_blank")}],["rdit",function(){window.open("http://www.reddit.com/submit?url="+encodeURIComponent(document.querySelector("#pageUrl input").getAttribute("value"))+"&title="+encodeURIComponent(channelname)+"s%20Live%20Subscriber%20Count","_blank")}],["link",linkshare],["bg2",function(){isTutorialOn?tutorial(3):(fx("pageUrl").fadeOut(250),fx("bg2").fadeOut(500))}]];clickList.forEach(function(e){idClickListener(e[0],e[1])}),queryClickListener("#input button",getValue),queryClickListener(".suggest",function(e){console.log("suggest ran"),console.log(e);var t=e.target.dataset.id;t&&getValue(t)}),["showextra","hideextra"].forEach(function(e){idClickListener(e,extrabutton)}),isTutorialOn&&tutorial();var shareswitch=0;queryClickListener("body",shareFunc);var navState=[0,0];document.getElementById("username").addEventListener("focusin",function(){isTutorialOn&&(document.getElementById("username").value="",tutorial(1)),document.getElementById("username").select()}),document.getElementById("username").addEventListener("focusout",function(){setTimeout(function(){document.getElementById("suggest").style.display="none"},200)}),document.getElementById("username").addEventListener("keyup",function(){var e=document.getElementById("username").value.trim();if(internet){if(!e||"Not Found!"===e||"Loading..."===e||"Refresh the page"===e)return document.getElementById("suggest").style.display="none",void(isTutorialOn&&tutorial(1));document.getElementById("suggest").style.display="block",AJX("https://www.googleapis.com/youtube/v3/search?part=snippet&q="+encodeURIComponent(e)+"&type=channel&maxResults=5&relevanceLanguage=en&key="+getKey(),function(e){if(!(e.pageInfo.totalResults<1)){var t=document.querySelectorAll(".suggest");t.forEach(function(e,t){e.style.display="block"}),document.querySelectorAll(".suggest div").forEach(function(n,a){try{n.dataset.id=e.items[a].snippet.channelId.trim(),n.textContent=e.items[a].snippet.title}catch(e){t[a].style.display="none"}}),document.querySelectorAll(".suggestImg").forEach(function(n,a){try{n.dataset.id=e.items[a].snippet.channelId.trim(),n.src=e.items[a].snippet.thumbnails.default.url}catch(e){t[a].style.display="none"}})}}),isTutorialOn&&tutorial(2)}else document.getElementById("username").value="Refresh the page"});for(var views=[],l=50;l>0;l--)views.push(l);var extraswitch=0,myLineChart2,myLineChart3,myLineChart4,vids=5;if(internet)for(var images=document.getElementsByTagName("img"),pl=0;pl<images.length;pl++)!images[pl].src&&images[pl].id&&"dp"!=images[pl].id&&(images[pl].src="/images/"+images[pl].id+".png");
