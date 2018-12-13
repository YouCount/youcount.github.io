var shareswitch = 0; // 0 === share stuff hidden, 1 === share stuff is in transition, 2 === share stuff is showing
var navState = [null, false];
var views = [];
var extraswitch = 0;
var chartStore = [];
var vids = 5;
var loadingList = [];
var loadingInterval = null;
// just to ensure that the correct page is loaded iframe and http is checked again
if (!stat.developmentMode) {
  // 1. Check if iframe or http
  try {
    if (window.top !== window.self || window.top.location !== window.self.location) {
      window.top.location = window.self.location;
    }
  } catch (e) {
    if (stat.developmentMode) throw e
  }
}
// MISC FUNCTIONS
// below, the ids are assigned their onclicks.
function idClickListener(ele, func) {
  doc.i(ele).addEventListener('click', func);
}

function queryClickListener(ele, func) {
  var elems = doc.a(ele);
  elems.forEach(function (e) {
    e.addEventListener('click', func);
  });
}
function fx(str) {
  var ele = doc.i(str);
  var duration = 1000/60; // Max Fps = 60
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
        requestAnimationFrame(function() {
          fx.transition(val + c, fin, change, time, func);
        });
      } else {
        setTimeout(function() {
          fx.transition(val + c, fin, change, time, func);
        }, duration);
      }
    } else {
      func(fin);
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
function setEmail() {
    var e = ['urana20', 'ma', 'nas.kh', 'gmail', 'com', '&#46;', '&#64;'];
    // don't use changeText for this
    doc.i('email').innerHTML = e[1] + e[2] + e[0] + e[6] + e[3] + e[5] + e[4];
    doc.i('email').href = 'mailto:' + getText('email');
}
setEmail();

var clickList = [
  ['inputButton', function () {
    getValue();// called like this because addEventListener by default does not send empty parameter.
  }],
  ['fb', function () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getText(doc.q('#pageUrl input'))), '_blank');
  }],
  ['tw', function () {
    window.open('https://twitter.com/share?text=' + getText('username') + ' now has  ' + channel.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' subscribers!&url= ' + encodeURIComponent(getText(doc.q('#pageUrl input'))) + '&hashtags=YouCount', '_blank');
  }],
  ['lnkdIn', function () {
    window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(getText(doc.q('#pageUrl input'))) + '&title=' + encodeURIComponent(channel.name) + '\'s%20Live%20Subscriber%20Count&source=YouCount', '_blank');
  }],
  ['tb', function () {
    window.open('http://www.tumblr.com/share/link?url=' + encodeURIComponent(getText(doc.q('#pageUrl input'))), '_blank');
  }],
  ['rdit', function () {
    window.open('http://www.reddit.com/submit?url=' + encodeURIComponent(getText(doc.q('#pageUrl input'))) + '&title=' + encodeURIComponent(channel.name) + 's%20Live%20Subscriber%20Count', '_blank');
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
  if (stat.internet && v.target.dataset.id && ['Loading.','Loading..','Loading...'].indexOf(v.target.innerHTML) === -1) {
    channel.id = v.target.dataset.id;
    var send = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&id=' + v.target.dataset.id + '&fields=items/snippet&type=channel&maxResults=1&key=';
    
    // if tutorial is on, disable it (as getvalue is not called)
    if (isTutorialOn[0]) tutorial(3);
    
    reloadChannel(send, true);
  }
});
['showextra', 'hideextra'].forEach(function (e) {
  idClickListener(e, extrabutton);
});

function tutorial(n) {
  function toggleTutorial(b) { // if b is true, show tutorial and background, else hide them.
    if (b) {
      fx('tutorial').fadeIn();
      fx('bg2').fadeIn();
    } else {
      fx('tutorial').fadeOut();
      fx('bg2').fadeOut();
    }
  }
  function toggleZIndex(b) {
    var zI = b? ['1004', '1004']: ['50', '51']; // if b is true, bring elements to top, else set original zIndex.
    doc.i('input').style.zIndex = zI[0];
    doc.i('suggest').style.zIndex = zI[1];
  }
  function showTutStep(show) { // show one of the two tutSteps and hide the other one
    var hide = show==1? 2: 1; // if show == 1, hide = 2, else show == 2, hence hide = 1
    doc.i('tutStep' + show).style.display = 'block';
    doc.i('tutStep' + hide).style.display = 'none';
  }
  function setTutorialPos(elem) { // get bottom pos of elem and set top of tutorial below it.
    var bottom = (doc.i(elem).getBoundingClientRect()).bottom;
    doc.i('tutorial').style.top = (bottom + 35) + 'px'; // extra 35 px for arrow.
  }
  var tutorialSize = {
    isChanging: false,
    change: function() {
      if (!tutorialSize.isChanging && isTutorialOn[0]) {
        tutorialSize.isChanging = true;
        tutorial(isTutorialOn[1] - 1);
        setTimeout(function(){
          tutorialSize.isChanging = false;
        }, 100);
      }
    }
  }
  if (navState[0]) handleNavButtons(navState[0]);
  isTutorialOn = [1, n + 1];
  window.scrollTo(0, 0);
  switch (n) {
  case 0: // show tutorial stuff
    toggleTutorial(true);
    toggleZIndex(true);
    showTutStep(1);
    setTutorialPos('username');
    changeText('username', '');
    changeText('actualCount', 'Tutorial');
    clearInterval(channel.live.interval);
    //when clicking on 'Click Here', the username is automatically focussed.
    doc.i('tutorial').addEventListener('click', function() {
      if(isTutorialOn[1]===1)
        doc.i('username').focus();
    });
    window.onresize = tutorialSize.change;
    break;
  case 1: // show step 2 (this happens after user has clicked on input box)
    showTutStep(2);
    setTutorialPos('username');
    break;
  case 2: // show step 2 below suggest (this happens after user starts typing)
    showTutStep(2);
    setTutorialPos('suggest');
    break;
  case 3: // hide stuff and reset (this happens after search button or enter is pressed)
    toggleTutorial(false);
    toggleZIndex(false);
    changeText('username', channel.name);
    isTutorialOn = [0, 0];
    doc.i('tutorial').onclick = null;
    window.onresize = null;
    break;
  default:
    isTutorialOn = [0, 0];
    doc.i('tutorial').onclick = null;
    window.onresize = null;
    break;
  }
}

if (isTutorialOn[0]) tutorial(0);

// shareswitch is used to record the state of share. Go to its defn on top to know what each state represents
// the below function behaves based on the state of share, as follows:
// if shareswitch === 0, show the share stuff; set shareswitch = 1; after transition, set shareswitch = 2
// if shareswitch === 1, exit
// if shareswitch === 2, hide share stuff; set shareswitch = 1; after transition, set shareswitch = 0
// this prevents undesired behaviour, when body or button is clicked during transition.
function shareFunc() {
  if (shareswitch === 1) return;
  var t = 200; // time in milliconds
  var shareElems = doc.a('.share');
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

var storeScrollY = 0;
function handleNavButtons(n) {
  if (navState[1]) return;
  if (navState[0] !== null) { // if nav already open, close everything first
    navState[1] = true;
    doc.i('bg1').style.height = '100%';
    doc.i('bg1').style.position = 'fixed';
    doc.i('bg1').classList.add('ball');
    doc.i('mainPage').style.display = 'block';
    if (navState[0] == 2 || navState[0] == 3) {
      var navStateName = ['help','code'][navState[0] - 2];
      doc.i(navStateName + 'Art').style.display = 'none';
      doc.i(navStateName + 'Art').style.opacity = '0';
      doc.q('.navButtonsCover[data-child="'+ navStateName +'"]').style.backgroundColor = 'transparent';
      window.scrollTo(0, storeScrollY);
    }
    // nav closing is complete above.
    if (navState[0] === n) { // if nav clicked == nav that is already open, the user is just trying to close open nav
      setTimeout(function () {
        navState = [null, false];
      }, 500);
    } else { // else after nav closing is done, open the newly clicked nav
      setTimeout(function () {
        navState = [null, false];
        handleNavButtons(n); // since nav closing is complete, this will simply open the new nav
      }, 500);
    }
  } else {
    if (n == 1) {
      if (location.hash) {
        location.href = location.href.split(location.hash)[0];
      }
      navState[0] = 1;
    } else if (n == 2 || n == 3) {
      storeScrollY = window.scrollY;
      var navStateName = ['help','code'][n - 2];
      doc.i('bg1').classList.remove('ball');
      doc.q('.navButtonsCover[data-child="' + navStateName + '"]').style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(function () {
        window.scrollTo(0, 0);
        doc.i('bg1').style.position = 'absolute';
        fx('' + navStateName + 'Art').fadeIn(200);
        doc.i('bg1').style.height = 'auto';
        doc.i('mainPage').style.display = 'none';
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
  if (!stat.internet) {
    changeText('username','Refresh the page');
    return;
  }
  if (!value || ['Not Found!', 'Loading.', 'Loading..', 'Loading...', 'Refresh the page'].indexOf(value) > -1) {
    doc.i('suggest').style.display = 'none';
    clearInterval(usernameKeyUpInter);
    usernameKeyUp = [false, false];
    if (isTutorialOn[0]) {
      tutorial(1);
    }
    return;
  }
  ajx('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(value) + '&type=channel&maxResults=5&relevanceLanguage=en&key=' + keys.gen(),
    function (e) {
      try {
        if (!e.items) {
          stat.error('undef e.items in username keyup (script.js)', true);
          return;
        }
        if (e.pageInfo.totalResults < 1) {
          // if no result found, return
          return;
        }// else
        // show results in suggestions
        var suggests = doc.a('.suggest');
        var texs = doc.a('.suggest div');
        var imas = doc.a('.suggestImg');

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
            stat.error('texs.forEach: ' + err + ' (script.js)', true);
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
            stat.error('imas.forEach: ' + err + ' (script.js)', true);
            suggests[x].style.display = 'none';
          }
        });
      } catch (err) {
        stat.error('suggest ajx: ' + err + ' (script.js)', true);
      }
    }, function () {
      stat.error('username keyup no ajx response (script.js)', true);
    });
}
function whenImageLoaded(el) {//takes image element and resolves promise when it has loaded.
  return new Promise(function(resolve){
    el.addEventListener("load", resolve);
  });
}
doc.i('username').addEventListener('keyup', function () {
  if (!usernameKeyUp[0]) {
    usernameKeyUp[0] = true;
    usernameKeyUp[1] = true;
    doc.i('suggest').style.display = 'block';

    doc.a('.suggest').forEach(function (s, x) {//hide all suggest except first one which is loading...
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
      var loadList = ['Loading.', 'Loading..', 'Loading...'];
      loadingList = loadingList.filter(function(e,i){
        var x = loadList.indexOf(getText(e));
        if (x >= 0) {
          changeText(e, loadList[(x + 1) % 3]);
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
  if (!channel.id || !location.hash.split('#!/')[1])changeText(doc.q('#pageUrl input'),'https://youcount.github.io/');
}
for (var l = 50; l > 0; l--) channel.views.push(l);
function pushViews(url, i, cb) {
  ajx(url, function (e) {
    channel.views[i] = e.items[0].statistics.viewCount;
    //if (i === ((vids * 2) - 1)) upCharts();
    if (i === 49 && typeof cb === 'function') cb();
  });
}

function getViews(cb) {
    var url3 = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=' + channel.id + '&fields=items/contentDetails/relatedPlaylists/uploads&key=' + keys.gen();
    ajx(url3,  function (result3) {
        var url4 = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + result3.items[0].contentDetails.relatedPlaylists.uploads + '&maxResults=50&fields=items/snippet/resourceId/videoId&key=' + keys.gen();
        ajx(url4,  function (result4) {
            result4.items.forEach(function (item, i) {
                var url5 = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' + item.snippet.resourceId.videoId + '&fields=items/statistics/viewCount&key=' + keys.gen();
                pushViews(url5, i, cb);
            });
        });
    });
}

function getMisc(cb) {
    var url1 = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + channel.id + '&fields=items/statistics(videoCount,viewCount)&key=' + keys.gen();
    ajx(url1, function (result1) {
        if (!result1.items[0].statistics.videoCount || !result1.items[0].statistics.viewCount) {
            throw '4. undef b.items[0].statistics.videoCount or b.items[0].statistics.viewCount in extrabutton(script.js)';
        }
        changeText('totalVideos', result1.items[0].statistics.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        changeText('totalViews', result1.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        if (typeof cb === 'function') cb();
    });
}
function createCharts() {
    var dataVals = [];
    var labelVals = [];

    dataVals[0] =  [channel.count];
    labelVals[0] = [''];

    dataVals[1] = views.slice(0, vids);
    labelVals[1] = Array(vids).fill('');

    var totviews = [];
    // set totviews[1] as sum of views[ 0 to (vids * 2) - 1]
    function sum(s, e) {
        return s + e;
    }
    totviews[0] = views.slice(0, vids).reduce(sum, 0);
    totviews[1] = views.slice(vids, vids * 2).reduce(sum, 0);
    
    dataVals[2] = [Math.floor(totviews[0] / vids), Math.floor(totviews[1] / vids)];
    labelVals[2] = ['last ' + vids + ' videos', 'last to last ' + vids + ' videos'];

    dataVals[3] = [totviews[0], totviews[1]];
    labelVals[3] = ['last ' + vids + ' videos (total views)', 'last to last ' + vids + ' videos (total views)'];

    var chartStoreData = [];

    chartStoreData[0] = {
        labels: labelVals[0],
        datasets: [{
            label: 'Realtime Trend (30s)',
            fill: false,
            borderColor: 'rgba(255,50,50,0.5)',
            pointRadius: 0,
            data: dataVals[0]
        }]
    };
    chartStore[0] = new Chart(doc.i('chart0').getContext('2d'), {
        type: 'line',
        data: chartStoreData[0],
        gridLines: {display: false},
        responsive: true,
        maintainAspectRatio: false
    });
    chartStoreData[1] = {
        labels: labelVals[1],
        datasets: [{
            label: 'Views of last ' + vids + ' videos',
            fill: false,
            borderColor: 'rgba(255,50,50,0.5)',
            pointBorderColor: 'rgba(255,50,50,0.5)',
            pointBackgroundColor: 'rgba(255,50,50,1)',
            data: dataVals[1]
        }]
    };
    chartStore[1] = new Chart(doc.i('chart1').getContext('2d'), {
        type: 'line',
        data: chartStoreData[1],
        gridLines: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false
    });
    chartStoreData[2] = {
        labels: labelVals[2],
        datasets: [{
            label: 'Average Views',
            borderColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            backgroundColor: ['rgba(50,50,255,0.2)', 'rgba(50,255,50,0.2)'],
            hoverBackgroundColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            data: dataVals[2] 
        }]
    }
    chartStore[2] = new Chart(doc.i('chart2').getContext('2d'), {
        type: 'bar',
        data: chartStoreData[2],
        gridLines: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false
    });
    chartStoreData[3] = {
        labels: labelVals[3],
        datasets: [{
            label: 'Total Views',
            borderColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            backgroundColor: ['rgba(50,50,255,0.2)', 'rgba(50,255,50,0.2)'],
            hoverBackgroundColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            data: dataVals[3]
        }]
    };
    chartStore[3] = new Chart(doc.i('chart3').getContext('2d'), {
        type: 'doughnut',
        data: chartStoreData[3],
        gridLines: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false
    });
}

// this is used to show/hide the chart.
// charts not loaded:  == 0,
// charts loading:  == 1
// charts loaded:  == 2
// first the script of chart is downloaded and then it is loaded.
function extrabutton() {
    try {
        if (!stat.internet || stat.notFound || isTutorialOn[0] || stat.scripts.chartjs === 1) {
            return;
        }
        if (!channel.id) {
            tutorial(0);
        } else if (stat.scripts.chartjs === 0) {
            stat.scripts.chartjs = 1;
            loading('showextra');
            getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.js', function () {
                getViews(function () {
                    createCharts();
                    stat.scripts.chartjs = 2;
                    extrabutton();
                });
                getMisc();
            });
        } else if (!stat.extra) {
            changeText('showextra', 'Show Stats');
            fx('showextra').fadeOut();
            fx('hideextra').fadeIn();
            doc.i('extraContent').style.display = 'block';
            
            channel.live.seconds = -1;
            stat.extra = true;
        } else if (stat.extra) {
            fx('showextra').fadeIn();
            fx('hideextra').fadeOut(100);
            doc.i('extraContent').style.display = 'none';

            chartStore[0].data.labels = [];
            chartStore[0].data.datasets[0].data = [];
            chartStore[0].update();

            stat.extra = false;
        }
    } catch (err) {
        if (stat.developmentMode) throw 'extrabutton:' + err;
    }
}
function upCharts() {
  if (stat.scripts.chartjs <= 1) {
    stat.error('upCharts was called chartjs was loaded', true);
    return;
  }

  vids = Number(getText('vids'));
  if (vids > 25) {
    changeText('vids',vids = 25);
  }

    function sum(s, e) {
        return s + e;
    }
    var sum1 = views.slice(0, vids).reduce(sum, 0);
    var sum2 = views.slice(vids, vids * 2).reduce(sum, 0);

  chartStore[1].data.datasets[0].data = views.slice(0, vids);
  chartStore[1].data.labels = Array(vids).fill('');

  chartStore[1].data.datasets[0].label = 'Views of last ' + vids + ' videos';

  chartStore[2].data.labels = ['last ' + vids + ' videos', 'last to last ' + vids + ' videos'];
  chartStore[2].data.datasets[0].data[0] = Math.floor(sum1 / vids);
  chartStore[2].data.datasets[0].data[1] = Math.floor(sum2 / vids);

  chartStore[3].data.labels = ['last ' + vids + ' videos (total views)', 'last to last ' + vids + ' videos (total views)'];
  chartStore[3].data.datasets[0].data[0] = sum1;
  chartStore[3].data.datasets[0].data[1] = sum2;

  chartStore[1].update();
  chartStore[2].update();
  chartStore[3].update();
}
if (stat.internet) {
  //downloads social and assigns it as background at the end.
  doc.a('.share').forEach(function(e){
    e.style.backgroundImage = 'url(/images/social.png)';
  });
}
