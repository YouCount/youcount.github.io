/* global developmentMode:false, ajx:false, getKey:false, getValue:false, changeText:false, noConnection:false, queryName:false, getScript:false, Chart:false, username:true, channelname:true, actualCount:false, isTutorialOn:true, internet:false, firstload:true, notFound:false, isChart:true, myLineChart1:false
*/
var shareswitch = 0; // 0 === share stuff hidden, 1 === share stuff is in transition, 2 === share stuff is showing
var navState = [null, false];
var views = [];
var extraswitch = 0;
var myLineChart2 = {};
var myLineChart3 = {};
var myLineChart4 = {};
var vids = 5;
// just to ensure that the correct page is loaded iframe and http is checked again
if (!developmentMode) {
  // 1. Check if iframe or http
  try {
    if (window.top !== window.self || window.top.location !== window.self.location) {
      window.top.location = window.self.location;
    }
  } catch(e) {
    noConnection(e);
  }
}
// MISC FUNCTIONS
// below, the ids are assigned their onclicks.
function idClickListener(ele, func) {
  document.getElementById(ele).addEventListener('click', func);
}

function queryClickListener(ele, func) {
  var elems = document.querySelectorAll(ele);
  elems.forEach(function (e) {
    e.addEventListener('click', func);
  });
}
function fx(str) {
  var ele = document.getElementById(str);
  var duration = 1000/60; // Max Fps = 60
  var interval;
  fx.xnor = function(a, b) {
    if ((a && b) || (!a && !b)) return true;
    else return false;
  }
  fx.transition = function (val, fin, change, prev, func) {
    var time = Date.now();
    var c = change * Math.round((time - prev) / duration);
    if (fx.xnor(fin > val, fin > (val + c))) {
      func(val + c);
      if (typeof window.requestAnimationFrame == 'function') {
        interval = requestAnimationFrame(function() {
          fx.transition(val + c, fin, change, time, func);
        });
      } else {
        setTimeout(function() {
          fx.transition(val + c, fin, change, time, func);
        }, duration);
      }
    } else {
      func(fin);
      cancelAnimationFrame(interval);
    }
  };
  fx.fadeIn = function (t) {
    if(window.getComputedStyle(ele).getPropertyValue('display') !== 'none') return;
    t = def(t, 400);
    
    var op;
    ele.dataset.fxOpacity = op = Number(ele.dataset.fxOpacity || ele.style.opacity || 1);
    if (ele.dataset.fxDisplay) ele.style.display = ele.dataset.fxDisplay;
    else ele.style.display = 'block';
  fx.transition(0, op, op * duration / t, Date.now(), function (v) {
      ele.style.opacity = v;
    });
  };
  fx.fadeOut = function (t) {
    if (window.getComputedStyle(ele).getPropertyValue('display') === 'none') return;
    t = def(t, 400);
    var op;
    ele.dataset.fxOpacity = op = Number(ele.dataset.fxOpacity || ele.style.opacity || 1);
    ele.dataset.fxDisplay = window.getComputedStyle(ele).getPropertyValue('display');
    fx.transition(op, 0, -1 * op * duration / t, Date.now(), function (v) {
      ele.style.opacity = v;
    });
    setTimeout(function () {
      ele.style.display = 'none';
    }, t);
  };
  return fx;
}
// this is to hide email from spam bots
var emailParts = ['manas.khurana20', 'gmail', 'com', '&#46;', '&#64;'];
document.getElementById('email').innerHTML = emailParts[0] + emailParts[4] + emailParts[1] + emailParts[3] + emailParts[2];
document.getElementById('email').href = 'mailto:' + getText('email');

var clickList = [
  ['inputButton', function () {
    getValue();// called like this because addEventListener by default does not send empty parameter.
  }],
  ['fb', function () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getText(document.querySelector('#pageUrl input'))), '_blank');
  }],
  ['tw', function () {
    window.open('https://twitter.com/share?text=' + getText('username') + ' now has  ' + actualCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' subscribers!&url= ' + encodeURIComponent(getText(document.querySelector('#pageUrl input'))) + '&hashtags=YouCount', '_blank');
  }],
  ['lnkdIn', function () {
    window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(getText(document.querySelector('#pageUrl input'))) + '&title=' + encodeURIComponent(channelname) + '\'s%20Live%20Subscriber%20Count&source=YouCount', '_blank');
  }],
  ['tb', function () {
    window.open('http://www.tumblr.com/share/link?url=' + encodeURIComponent(getText(document.querySelector('#pageUrl input'))), '_blank');
  }],
  ['rdit', function () {
    window.open('http://www.reddit.com/submit?url=' + encodeURIComponent(getText(document.querySelector('#pageUrl input'))) + '&title=' + encodeURIComponent(channelname) + 's%20Live%20Subscriber%20Count', '_blank');
  }],
  ['link', linkshare],
  ['bg2', function () {
    if (isTutorialOn[0]) {
      tutorial(3);
    } else {
      fx('pageUrl').fadeOut(250);
      fx('bg2').fadeOut(500);
    }
  }]
];
clickList.forEach(function (e) {
  idClickListener(e[0], e[1]);
});
// below, the queries are assigned their onclicks(all elements except the ones with ids).
//
// only for single ids is a separate function created because getElementById is faster than
// querySelectorAll and there are a lot of single ids being assigned onclicks.
queryClickListener('.suggest', function (v) {
  if (v.target.dataset.id && ['Loading.','Loading..','Loading...'].indexOf(v.target.innerHTML) === -1) {
    username = v.target.dataset.id;
    var send = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&id=' + v.target.dataset.id + '&fields=items/snippet&type=channel&maxResults=1&key=';
    
    // if tutorial is on, disable it (as getvalue is not called)
    if (isTutorialOn[0]) tutorial(3);
    
    queryName(send);
  }
});
['showextra', 'hideextra'].forEach(function (e) {
  idClickListener(e, extrabutton);
});

function tutorial(n) {
  if (navState[0])handleNavButtons(navState[0]);
  isTutorialOn[0] = 1;
  isTutorialOn[1] = n+1;
  window.scrollTo(0, 0);
  var bottom = 0;
  switch (n) {
  case 0:
    changeText('username','');
    document.getElementById('input').style.zIndex = '1004';
    document.getElementById('tutorial').style.display = 'block';
    bottom = (document.getElementById('username').getBoundingClientRect()).bottom;
    document.getElementById('tutorial').style.top = (bottom + 35) + 'px';
    document.getElementById('bg2').style.display = 'block';
    document.getElementById('tutStep1').style.display = 'block';
    document.getElementById('tutStep2').style.display = 'none';
    if(!isLive) changeText('actualCount','Tutorial');
    //when clicking on 'Click Here', the username is automatically focussed.
    document.getElementById('tutorial').addEventListener('click',function(){
      if(isTutorialOn[1]===1)
        document.getElementById('username').focus();
    });

    break;
  case 1:
    document.getElementById('tutStep1').style.display = 'none';
    document.getElementById('tutStep2').style.display = 'block';
    bottom = (document.getElementById('username').getBoundingClientRect()).bottom;
    document.getElementById('tutorial').style.top = (bottom + 35) + 'px';
    break;
  case 2:
    document.getElementById('tutStep1').style.display = 'none';
    document.getElementById('tutStep2').style.display = 'block';
    document.getElementById('suggest').style.zIndex = '1004';
    bottom = (document.getElementById('suggest').getBoundingClientRect()).bottom;
    document.getElementById('tutorial').style.top = (bottom + 35) + 'px';
    document.getElementById('bg2').style.display = 'block';
    break;
  case 3:
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('bg2').style.display = 'none';
    document.getElementById('input').style.zIndex = '50';
    document.getElementById('suggest').style.zIndex = '51';
    changeText('username',channelname);
    isTutorialOn[0] = 0;
    isTutorialOn[1] = 0;
    break;
  default:
    isTutorialOn[0] = 0;
    isTutorialOn[1] = 0;
    break;
  }
}

if (isTutorialOn[0]) tutorial(0);

var tutorialSize = {
  isChanging: false,
  change: function() {
    tutorialSize.isChanging = true;
    tutorial(isTutorialOn[1] - 1);
    setTimeout(function(){
      tutorialSize.isChanging = false;
    },100);
  }
}

window.onresize = function() {
  if (!tutorialSize.isChanging && isTutorialOn[0]) {
    tutorialSize.change();
  }
}

// shareswitch is used to record the state of share. Go to its defn on top to know what each state represents
// the below function behaves based on the state of share, as follows:
// if shareswitch === 0, show the share stuff; set shareswitch = 1; after transition, set shareswitch = 2
// if shareswitch === 1, exit
// if shareswitch === 2, hide share stuff; set shareswitch = 1; after transition, set shareswitch = 0
// this prevents undesired behaviour, when body or button is clicked during transition.
function shareFunc() {
  if (shareswitch === 1) return;
  var t = 200; // time in milliconds
  var shareElems = document.querySelectorAll('.share');
  switch (shareswitch) {
  case 0:
    shareswitch = 1;
    shareElems.forEach(function (e, i) {
      setTimeout(function () {
        fx(e.id).fadeIn(t);
      }, 40 * (i + 1));
    });
    setTimeout(function () {
      shareswitch = 2;
      queryClickListener('body', shareFunc);
      navState[1] = false;
    }, t + (shareElems.length * 40));
    break;
  case 2:
    shareswitch = 1;
    navState[0] = null;
    shareElems.forEach(function (e) {
      fx(e.id).fadeOut(t);
    });
    setTimeout(function () {
      shareswitch = 0;
      document.body.removeEventListener("click", shareFunc);
      navState[1] = false;
    }, t);
    break;
  default:break;
  }
}

function handleNavButtons(n) {
  if (navState[1]) return;
  if (navState[0] !== null) {
    navState[1] = true;
    document.getElementById('bg1').style.height = '100%';
    document.getElementById('bg1').classList.add('ball');
    document.getElementById('mainPage').style.display = 'block';
    if (navState[0] === n) {
      setTimeout(function () {
        navState = [null, false];
      }, 500);
    } else {
      setTimeout(function () {
        navState = [null, false];
        handleNavButtons(n);
      }, 500);
    }
    if (navState[0] == 2 || navState[0] == 3) {
      var navStateName = ['help','code'][navState[0] - 2];
      document.getElementById(navStateName + 'Art').style.display = 'none';
      document.getElementById(navStateName + 'Art').style.opacity = '0';
      document.querySelector('.navButtonsCover[data-child="'+ navStateName +'"]').style.backgroundColor = 'transparent';
    }
  } else {
    if (n == 1) {
      if (location.hash) {
        location.href = location.href.split(location.hash)[0];
      }
      navState[0] = 1;
    } else if (n == 2 || n == 3) {
      var navStateName = ['help','code'][n - 2];
      document.getElementById('bg1').classList.remove('ball');
      document.querySelector('.navButtonsCover[data-child="' + navStateName + '"]').style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(function () {
        fx('' + navStateName + 'Art').fadeIn(200);
        document.getElementById('bg1').style.height = 'auto';
        document.getElementById('mainPage').style.display = 'none';
      }, 500);
      setTimeout(function () {
        navState[1] = false;
      }, 700);
      navState = [n, true];
    } else if (n == 4) {
      shareFunc(true);
      navState = [4, true];
    }
  }
}

var usernameKeyUp = [false, false];
// eslint-disable-next-line no-unused-vars
var usernameKeyUpInter = null;
function usernameKeyUpFunc() {
  var value = getText('username');
  if (!internet) {
    changeText('username','Refresh the page');
    return;
  }
  if (!value || ['Not Found!', 'Loading.', 'Loading..', 'Loading...', 'Refresh the page'].indexOf(value) > -1) {
    document.getElementById('suggest').style.display = 'none';
    clearInterval(usernameKeyUpInter);
    usernameKeyUp = [false, false];
    if (isTutorialOn[0]) {
      tutorial(1);
    }
    return;
  }
  ajx('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(value) + '&type=channel&maxResults=5&relevanceLanguage=en&key=' + getKey(),
    function (e) {
      try {
        if (!e.items) {
          noConnection('undef e.items in username keyup (script.js)', true);
          return;
        }
        if (e.pageInfo.totalResults < 1) {
          // if no result found, return
          return;
        }// else
        // show results in suggestions
        var suggests = document.querySelectorAll('.suggest');
        var texs = document.querySelectorAll('.suggest div');
        var imas = document.querySelectorAll('.suggestImg');

        suggests.forEach(function (s, x) {
          s.style.display = 'block';
          s.dataset.id = e.items[x].snippet.channelId.trim();
        });

        if (isTutorialOn[0]) {
          tutorial(2);
        }

        texs.forEach(function (s, x) {
          try {
            s.dataset.id = e.items[x].snippet.channelId.trim();
            changeText(s,e.items[x].snippet.title);
            imas[x].style.visibility = 'hidden';// hide old image (until new image is loaded, see below)
          } catch (err) {
            noConnection('texs.forEach: ' + err + ' (script.js)', true);
            suggests[x].style.display = 'none';
          }
        });
        
        imas.forEach(function (s, x) {
          try {
            s.dataset.id = e.items[x].snippet.channelId.trim();
            s.src = e.items[x].snippet.thumbnails.default.url;
            whenImageLoaded(s).then(function(){// show image after it has loaded
              s.style.visibility = 'visible';
            });
          } catch (err) {
            noConnection('imas.forEach: ' + err + ' (script.js)', true);
            suggests[x].style.display = 'none';
          }
        });
      } catch (err) {
        noConnection('suggest ajx: ' + err + ' (script.js)', true);
      }
    }, function () {
      noConnection('username keyup no ajx response (script.js)', true);
    });
}
function whenImageLoaded(el) {//takes image element and resolves promise when it has loaded.
  return new Promise(function(resolve){
    el.addEventListener("load", resolve);
  });
}
document.getElementById('username').addEventListener('keyup', function () {
  if (!usernameKeyUp[0]) {
    usernameKeyUp[0] = true;
    usernameKeyUp[1] = true;
    document.getElementById('suggest').style.display = 'block';

    document.querySelectorAll('.suggest').forEach(function (s, x) {//hide all suggest except first one which is loading...
      if (x===0) {
        s.style.display = 'block';
        s.childNodes[0].style.visibility = 'hidden';
        loading(s.childNodes[1]);
      } else {
        s.style.display = 'none';
      }
    });

    if (isTutorialOn[0]) {
      tutorial(2);
    }

    usernameKeyUpInter = setInterval(function () {
      if (usernameKeyUp[1]) {
        usernameKeyUpFunc();
        usernameKeyUp[1] = false;
      }
    }, 1000);
  } else {
    usernameKeyUp[1] = true;
  }
});

loadingList = [];
loadingInterval = null;
function loading(el) {
  if (el && loadingList.indexOf(el) === -1) {
    if (!loadingList.length) {
      loadingInterval = setInterval(function() {
        loading();
      }, 500);
    }
    changeText(el,'Loading.');
    loadingList.push(el);
  } else {
    if (!loadingList.length) {
      clearInterval(loadingInterval);
    } else {
      loadingList = loadingList.filter(function(e,i){
        var loadList = ['Loading.','Loading..','Loading...'];
        var x = loadList.indexOf(getText(e));
        if (x===0 || x===1) {
          changeText(e,loadList[x+1]);
          return true;
        } else if (x===2) {
          changeText(e,loadList[0]);
          return true;
        } else {
          return false;
        }
      });
    }
  }
}

// this shows/hides the sharable link of the page.
function linkshare() {
  fx('pageUrl').fadeIn(250);
  fx('bg2').fadeIn(500);
  if (!username || !location.hash.split('#!/')[1])changeText(document.querySelector('#pageUrl input'),'https://youcount.github.io/');
}
for (var l = 50; l > 0; l--)views.push(l);
function pushViews(url, i) {
  ajx(url, function (e) {
    views[i] = e.items[0].statistics.viewCount;
    if (i === ((vids * 2) - 1))upCharts();
  });
}
// this is used to show/hide the chart.
// if the chart is loading for the first time (ie firstload=0),
// first the script of chart is downloaded and then it is loaded.
function extrabutton() {
  if (!username) tutorial(0);
  else if (firstload === 0) {
    if (!internet || notFound || isTutorialOn[0]) return;
    loading('showextra');
    var url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=' + username + '&fields=items/contentDetails/relatedPlaylists/uploads&key=' + getKey();
    try {
      ajx(url, function (e) {
        if (!e.items[0].contentDetails.relatedPlaylists.uploads) {
          noConnection( '2. undef e.items[0].contentDetails.relatedPlaylists.uploads in extrabutton(script.js)');
          return;
        }
        var url2 = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + e.items[0].contentDetails.relatedPlaylists.uploads + '&maxResults=50&fields=items/snippet/resourceId/videoId&key=' + getKey();
        ajx(url2, function (f) {
          if (!f.items) {
            noConnection( '3. undef e.items in extrabutton(script.js)');
            return;
          }
          for (var i = 0; f.items[i]; i++) {
            var url3 = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' + f.items[i].snippet.resourceId.videoId + '&fields=items/statistics/viewCount&key=' + getKey();
            pushViews(url3, i);
          }
          getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.js', function () {
            isChart = 1;
            fx('showextra').fadeOut();
            document.getElementById('hideextra').style.display = 'block';
            document.getElementById('extraContent').style.display = 'block';
            extraswitch = 1;

            var data1 = [];
            var labels1 = [];
            for (var j = 0; i < vids; j++) {
              data1[j] = views[j];
              labels1[j] = '';
            }
            var myLineChart2Data = {
              labels: labels1,
              datasets: [{
                label: 'Views of last ' + vids + ' videos',
                fill: false,
                borderColor: 'rgba(255,50,50,0.5)',
                pointBorderColor: 'rgba(255,50,50,0.5)',
                pointBackgroundColor: 'rgba(255,50,50,1)',
                data: data1
              }]
            };
            myLineChart2 = new Chart(document.getElementById('myChart2').getContext('2d'), {
              type: 'line',
              data: myLineChart2Data,
              gridLines: {
                display: false
              },
              responsive: true,
              maintainAspectRatio: false
            });
            var totviews = [(function () {
              var tot = 0;
              for (var k = 0; k < vids; k++) {
                tot += Number(views[k]);
              }
              return tot;
            })(), (function () {
              var tot = 0;
              for (var x = vids; x < (vids * 2); x++) {
                tot += Number(views[x]);
              }
              return tot;
            })()];
            var data2 = [Math.floor(totviews[0] / vids), Math.floor(totviews[1] / vids)];
            var labels2 = ['last ' + vids + ' videos', 'last to last ' + vids + ' videos'];
            var myLineChart3Data = {
              labels: labels2,
              datasets: [{
                label: 'Average Views',
                borderColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
                backgroundColor: ['rgba(50,50,255,0.2)', 'rgba(50,255,50,0.2)'],
                hoverBackgroundColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
                data: data2
              }]
            };
            myLineChart3 = new Chart(document.getElementById('myChart3').getContext('2d'), {
              type: 'bar',
              data: myLineChart3Data,
              gridLines: {
                display: false
              },
              responsive: true,
              maintainAspectRatio: false
            });
            var data3 = [totviews[0], totviews[1]];
            var labels3 = ['last ' + vids + ' videos (total views)', 'last to last ' + vids + ' videos (total views)'];
            var myLineChart4Data = {
              labels: labels3,
              datasets: [{
                label: 'Total Views',
                borderColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
                backgroundColor: ['rgba(50,50,255,0.2)', 'rgba(50,255,50,0.2)'],
                hoverBackgroundColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
                data: data3
              }]
            };
            myLineChart4 = new Chart(document.getElementById('myChart4').getContext('2d'), {
              type: 'doughnut',
              data: myLineChart4Data,
              gridLines: {
                display: false
              },
              responsive: true,
              maintainAspectRatio: false
            });
            var url4 = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + username + '&fields=items/statistics(videoCount,viewCount)&key=' + getKey();
            ajx(url4, function (b) {
              if (!b.items[0].statistics.videoCount || !b.items[0].statistics.viewCount) {
                noConnection( '4. undef b.items[0].statistics.videoCount or b.items[0].statistics.viewCount in extrabutton(script.js)');
                return;
              }
              changeText(document.getElementById('totalVideos'), b.items[0].statistics.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
              changeText(document.getElementById('totalViews'), b.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            });
            firstload = 1;
            upCharts();
          });
        });
      }, function () {
        noConnection('1. extrabutton no response from ajx (script.js)');
      });
    } catch (e) {
      noConnection(e);
    }
  } else {
    changeText('showextra','Show Stats');
    if (extraswitch === 0) {
      isChart = 1;
      fx('showextra').fadeOut();
      fx('hideextra').fadeIn();
      document.getElementById('extraContent').style.display = 'block';
      extraswitch = 1;
    } else {
      myLineChart1.destroy();
      fx('showextra').fadeIn();
      fx('hideextra').fadeOut(100);
      document.getElementById('extraContent').style.display = 'none';
      extraswitch = 0;
      isChart = 0;
    }
  }
}

function upCharts() {
  if (!firstload) {
    noConnection('upCharts was called before firstload==1', true);
    return;
  }
  vids = Number(getText('vids'));
  if (vids > 25) {
    changeText('vids',vids = 25);

  }
  var sum1 = 0;
  var sum2 = 0;
  for (var i = 0; i < vids; i++) {
    myLineChart2.data.labels[i] = '';
    myLineChart2.data.datasets[0].data[i] = views[i];
    sum1 += Number(views[i]);
  }
  for (i = vids; i < (vids * 2); i++)sum2 += Number(views[i]);
  myLineChart2.data.labels.splice(vids);
  myLineChart2.data.datasets[0].data.splice(vids);
  myLineChart2.data.datasets[0].label = 'Views of last ' + vids + ' videos';

  myLineChart3.data.labels = ['last ' + vids + ' videos', 'last to last ' + vids + ' videos'];
  myLineChart3.data.datasets[0].data[0] = Math.floor(sum1 / vids);
  myLineChart3.data.datasets[0].data[1] = Math.floor(sum2 / vids);

  myLineChart4.data.labels = ['last ' + vids + ' videos (total views)', 'last to last ' + vids + ' videos (total views)'];
  myLineChart4.data.datasets[0].data[0] = sum1;
  myLineChart4.data.datasets[0].data[1] = sum2;

  myLineChart2.update();
  myLineChart3.update();
  myLineChart4.update();
}
if (internet) {
  //downloads social and assigns it as background at the end.
  document.querySelectorAll('.share').forEach(function(e){
    e.style.backgroundImage = 'url(/images/social.png)';
  });
  // images are loaded after the whole page is loaded (since it has a big download size and sends multiple requests).
  /*
  var images = document.getElementsByTagName('img');
  for (var pl = 0; pl < images.length; pl++) {
    if (!images[pl].src && images[pl].id && images[pl].id !== 'dp') {
      images[pl].src = '/images/' + images[pl].id + '.png';
    }
  
  }
  */
}
