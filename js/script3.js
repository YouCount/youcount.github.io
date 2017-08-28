/* global developmentMode:false, ajx:false, getKey:false, getValue:false, changeText:false, noConnection:false, queryName:false, getScript:false, Chart:false, username:true, channelname:true, actualCount:false, isTutorialOn:true, internet:false, firstload:true, notFound:false, isChart:true, myLineChart1:false
*/
var shareswitch = 0;
var navState = [0, 0];
var views = [];
var extraswitch = 0;
var myLineChart2;
var myLineChart3;
var myLineChart4;
var vids = 5;
// just to ensure that the correct page is loaded iframe and http is checked again
if (!developmentMode) {
  // 1. Check if iframe or http
  if (window.top !== window.self || window.top.location !== window.self.location) {
    window.top.location = window.self.location;
  } else if (window.location.hostname !== 'youcount.github.io' || window.top.location.hostname !== 'youcount.github.io') {
    window.location.hostname = 'youcount.github.io';
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
  var ini = 0;
  var op = 1;
  var parts = 1;
  fx.transition = function (value, fin, sign, func) {
    var val = value;
    for (var i = 0; i < parts; i++) {
      setTimeout(function () { // eslint-disable-line no-loop-func
        val += Number((fin - ini) / parts);
        func(val);
      }, 50 * (i + 1));
    }
  };
  fx.fadeIn = function (ti) {
    var t;
    if (!ti) t = 400;
    else t = ti;
    parts = t / 50;
    if (window.getComputedStyle(ele).getPropertyValue('display') === 'none') {
      if (ele.dataset.fxDisplay)ele.style.display = ele.dataset.fxDisplay;
      else ele.style.display = 'block';
      op = ele.dataset.fxOpacity || Number(ele.style.opacity) || 1;
      ele.style.opacity = 0;
      fx.transition(0, op, 1, function (v) {ele.style.opacity = v; }, t);
    }
  };
  fx.fadeOut = function (ti) {
    var t;
    if (!ti) t = 400;
    else t = ti;
    parts = t / 50;
    if (window.getComputedStyle(ele).getPropertyValue('display') !== 'none') {
      ele.dataset.fxDisplay = window.getComputedStyle(ele).getPropertyValue('display');
      if (ele.style.opacity)op = Number(ele.style.opacity); else op = 1;
      ele.dataset.fxOpacity = op;
      ini = op;
      fx.transition(op, 0, -1, function (v) {ele.style.opacity = v;}, t);
      setTimeout(function () {
        ele.style.display = 'none';
        ele.style.opacity = ele.dataset.fxOpacity;
      }, t);
    }
  };
  return fx;
}
// this is to hide email from spam bots
var emailParts = ['manas.khurana20', 'gmail', 'com', '&#46;', '&#64;'];
document.getElementById('email').innerHTML = emailParts[0] + emailParts[4] + emailParts[1] + emailParts[3] + emailParts[2];
document.getElementById('email').href = 'mailto:' + document.getElementById('email').innerHTML;

var clickList = [
  ['fb', function () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.querySelector('#pageUrl input').getAttribute('value')), '_blank');
  }],
  ['tw', function () {
    window.open('https://twitter.com/share?text=' + document.getElementById('username').value + ' now has  ' + actualCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' subscribers!&url= ' + encodeURIComponent(document.querySelector('#pageUrl input').getAttribute('value')) + '&hashtags=YouCount', '_blank');
  }],
  ['lnkdIn', function () {
    window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(document.querySelector('#pageUrl input').getAttribute('value')) + '&title=' + encodeURIComponent(channelname) + '\'s%20Live%20Subscriber%20Count&source=YouCount', '_blank');
  }],
  ['tb', function () {
    window.open('http://www.tumblr.com/share/link?url=' + encodeURIComponent(document.querySelector('#pageUrl input').getAttribute('value')), '_blank');
  }],
  ['rdit', function () {
    window.open('http://www.reddit.com/submit?url=' + encodeURIComponent(document.querySelector('#pageUrl input').getAttribute('value')) + '&title=' + encodeURIComponent(channelname) + 's%20Live%20Subscriber%20Count', '_blank');
  }],
  ['link', linkshare],
  ['bg2', function () {
    if (isTutorialOn) {
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
queryClickListener('#input button', getValue);
queryClickListener('.suggest', function (v) {
  if (v.target.dataset.id) {
    username = v.target.dataset.id;
    var send = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&id=' + v.target.dataset.id + '&fields=items/snippet&key=';
    queryName(send);
  }
});
['showextra', 'hideextra'].forEach(function (e) {
  idClickListener(e, extrabutton);
});

function tutorial(p) {
  if (navState[0])handleNavButtons(navState[0]);
  var n;
  if (!p) n = 0;
  else n = p;
  isTutorialOn = 1;
  window.scrollTo(0, 0);
  var bottom = 0;
  switch (n) {
  case 0:
    document.getElementById('username').value = '';
    document.getElementById('input').style.zIndex = '1004';
    document.getElementById('tutorial').style.display = 'block';
    bottom = (document.getElementById('username').getBoundingClientRect()).bottom;
    document.getElementById('tutorial').style.top = (bottom + 35) + 'px';
    document.getElementById('bg2').style.display = 'block';
    document.getElementById('tutStep1').style.display = 'block';
    document.getElementById('tutStep2').style.display = 'none';
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
    isTutorialOn = 0;
    break;
  default:
    break;
  }
}

if (isTutorialOn) tutorial();

// this function gives the share button its clicking function.
// if the button is clicked (ie shareswitch === 0),
// the sharing features are shown, meanwhile the shareswitch is set to 1.
// After transition is over, shareswitch === 2. running the func again will do the opposite
// When shareswitch === 1, it represents the transition, so the function will simply quit
// Hence neither body nor button when clicked during transition won't be able to do anything
function shareFunc(isButton) {
  var t = 200; // time in milliconds
  if (isButton !== true && shareswitch < 2) {
    return;
  }
  var shareElems = document.querySelectorAll('.share');
  switch (shareswitch) {
  case 0:
    shareswitch = 1;
    shareElems.forEach(function (e, i) {
      setTimeout(function () {
        fx(e.id).fadeIn(t);
      }, 40 * (i - 1));
    });
    setTimeout(function () {
      shareswitch = 2;
    }, t + shareElems.length * 40);
    break;
  case 1:break;
  case 2:
    shareswitch = 1;
    navState[0] = 0;
    shareElems.forEach(function (e) {
      fx(e.id).fadeOut(t);
    });
    setTimeout(function () {
      shareswitch = 0;
    }, t + shareElems.length * 40);
    break;
  default:break;
  }
}
queryClickListener('body', shareFunc);

function handleNavButtons(n) {
  if (navState[1]) return;
  if (navState[0] !== 0) {
    navState[1] = 1;
    document.getElementById('bg1').style.height = '100%';
    document.getElementById('bg1').classList.add('ball');
    document.getElementById('mainPage').style.display = 'block';
    if (navState[0] === n) {
      setTimeout(function () {
        navState = [0, 0];
      }, 500);
    } else {
      setTimeout(function () {
        navState = [0, 0];
        handleNavButtons(n);
      }, 500);
    }
    switch (navState[0]) {
    case 2:
      document.getElementById('helpArt').style.display = 'none';
      document.getElementById('helpArt').style.opacity = '0';
      document.querySelector('.navButtonsCover[data-child="helpButton"]').style.backgroundColor = 'transparent';
      break;
    case 3:
      document.getElementById('codeArt').style.display = 'none';
      document.getElementById('codeArt').style.opacity = '0';
      document.querySelector('.navButtonsCover[data-child="code"]').style.backgroundColor = 'transparent';
      break;
    default: break;
    }
  } else {
    switch (n) {
    case 1:
      if (location.hash) {
        location.href = location.href.split(location.hash)[0];
      }
      navState[0] = 1;
      break;
    case 2:
      document.getElementById('bg1').classList.remove('ball');
      document.querySelector('.navButtonsCover[data-child="helpButton"]').style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(function () {
        fx('helpArt').fadeIn(500);
        document.getElementById('bg1').style.height = 'auto';
        document.getElementById('mainPage').style.display = 'none';
      }, 500);
      setTimeout(function () {
        navState[1] = 0;
      }, 1000);
      navState = [2, 1];
      break;
    case 3:
      document.getElementById('bg1').classList.remove('ball');
      document.querySelector('.navButtonsCover[data-child="code"]').style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(function () {
        fx('codeArt').fadeIn(500);
        document.getElementById('bg1').style.height = 'auto';
        document.getElementById('mainPage').style.display = 'none';
      }, 500);
      setTimeout(function () {
        navState[1] = 0;
      }, 1000);
      navState = [3, 1];
      break;
    case 4:
      shareFunc(true);
      navState[0] = 4;
      break;
    default: break;
    }
  }
}
// this thing gives the search box it's effects (material design thing + fading in search button)
// when it is clicked or focussed upon and effectively hides them as well.
document.getElementById('username').addEventListener('focusin', function () {
  if (isTutorialOn) {
    document.getElementById('username').value = '';
    tutorial(1);
  }
  document.getElementById('username').select();
  document.getElementById('inputButton').style.display = 'block';
});
document.getElementById('username').addEventListener('focusout', function () {
  setTimeout(function () {
    document.getElementById('suggest').style.display = 'none';
    document.getElementById('inputButton').style.display = 'none';
    if (usernameKeyUp[0]) {
      clearInterval(usernameKeyUpInter);
      usernameKeyUp = [false, false];
    }
  }, 200);
});

var usernameKeyUp = [false, false];
// eslint-disable-next-line no-unused-vars
var usernameKeyUpInter;
function usernameKeyUpFunc() {
  var value = document.getElementById('username').value.trim();
  if (!internet) {
    document.getElementById('username').value = 'Refresh the page';
    return;
  }
  if (!value || value === 'Not Found!' || value === 'Loading...' || value === 'Refresh the page') {
    document.getElementById('suggest').style.display = 'none';
    clearInterval(usernameKeyUpInter);
    usernameKeyUp = [false, false];
    if (isTutorialOn) {
      tutorial(1);
    }
    return;
  }
  ajx('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(value) + '&type=channel&maxResults=5&relevanceLanguage=en&key=' + getKey(),
    function (e) {
      try {
        if (!e.items) {
          noConnection('undef e.items in username keyup (script.js)');
          return;
        }
        if (e.pageInfo.totalResults < 1) {
          // if no result found, return
          return;
        }// else
        // show results in suggestions
        var suggests = document.querySelectorAll('.suggest');
        suggests.forEach(function (s, x) {
          s.style.display = 'block';
          s.dataset.id = e.items[x].snippet.channelId.trim();
        });
        document.querySelectorAll('.suggest div').forEach(function (s, x) {
          try {
            s.dataset.id = e.items[x].snippet.channelId.trim();
            s.textContent = e.items[x].snippet.title;
          } catch (err) {
            suggests[x].style.display = 'none';
          }
        });
        document.querySelectorAll('.suggestImg').forEach(function (s, x) {
          try {
            s.dataset.id = e.items[x].snippet.channelId.trim();
            s.src = e.items[x].snippet.thumbnails.default.url;
          } catch (err) {
            suggests[x].style.display = 'none';
          }
        });
      } catch (err) {
        noConnection(err);
      }
    }, function () {
      noConnection('username keyup no ajx response (script.js)');
    });
}
document.getElementById('username').addEventListener('keyup', function () {
  if (!usernameKeyUp[0]) {
    usernameKeyUp[0] = true;
    usernameKeyUp[1] = true;
    document.getElementById('suggest').style.display = 'block';

    if (isTutorialOn) {
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
// this allows inputting of value using enter.
function trigenter(e) { // eslint-disable-line no-unused-vars
  if (e.keyCode === 13) {
    getValue();
  }
}

// this shows/hides the sharable link of the page.
function linkshare() {
  fx('pageUrl').fadeIn(250);
  fx('bg2').fadeIn(500);
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
  if (firstload === 0) {
    if (!internet || notFound || isTutorialOn) return;
    document.getElementById('showextra').innerHTML = 'LOADING...';
    var reqType = (username.length >= 24 && username.substr(0, 2).toUpperCase() === 'UC') ? 'id' : 'forUsername';
    var url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&' + reqType + '=' + username + '&fields=items/contentDetails/relatedPlaylists/uploads&key=' + getKey();
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
            fx('hideextra').fadeIn();
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
                label: 'Views of last' + vids + ' videos',
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
            var labels3 = ['last' + vids + ' videos (total views)', 'last to last ' + vids + ' videos (total views)'];
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
            var url4 = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&' + reqType + '=' + username + '&fields=items/statistics(videoCount,viewCount)&key=' + getKey();
            ajx(url4, function (b) {
              if (!b.items[0].statistics.videoCount || !b.items[0].statistics.viewCount) {
                noConnection( '4. undef b.items[0].statistics.videoCount or b.items[0].statistics.viewCount in extrabutton(script.js)');
                return;
              }
              changeText(document.getElementById('totalVideos'), b.items[0].statistics.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
              changeText(document.getElementById('totalViews'), b.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            });
          });
        });
      }, function () {
        noConnection('1. extrabutton no response from ajx (script.js)');
      });
    } catch (e) {
      noConnection(e);
    }
    setTimeout(function () {
      document.getElementById('extraContent').style.display = 'block';
    }, 250);
    firstload = 1;
  } else {
    document.getElementById('showextra').innerHTML = 'SHOW STATS';
    if (extraswitch === 0) {
      isChart = 1;
      fx('showextra').fadeOut();
      fx('hideextra').fadeIn();
      setTimeout(function () {
        document.getElementById('extraContent').style.display = 'block';
      });
      extraswitch = 1;
    } else {
      myLineChart1.destroy();
      fx('showextra').fadeIn();
      fx('hideextra').fadeOut(100);
      setTimeout(function () {
        document.getElementById('extraContent').style.display = 'none';
      });
      extraswitch = 0;
      isChart = 0;
    }
  }
}

function upCharts() {
  if (Number(document.getElementById('vids').value) > 25) return;
  vids = Number(document.getElementById('vids').value);
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

// images are loaded after the whole page is loaded (since it has a big download size and sends multiple requests).
if (internet) {
  var images = document.getElementsByTagName('img');
  for (var pl = 0; pl < images.length; pl++) {
    if (!images[pl].src && images[pl].id && images[pl].id !== 'dp') {
      images[pl].src = '/images/' + images[pl].id + '.png';
    }
  }
}
