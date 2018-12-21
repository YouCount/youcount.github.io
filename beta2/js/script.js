var chartStore = [];
// just to ensure that the correct page is loaded iframe and http is checked again
if (!stat.devMode) {
  // 1. Check if iframe or http
  try {
    if (window.top !== window.self || window.top.location !== window.self.location) {
      window.top.location = window.self.location;
    }
  } catch (e) {
    if (stat.devMode) throw e
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
  var duration = 1000 / 60; // Max Fps = 60
  fx.xnor = function (a, b) {
    return (a && b) || (!a && !b);
  }
  fx.transition = function (val, fin, change, prev, func) {
    var time = Date.now();
    var c = change * Math.round((time - prev) / duration);
    if (fx.xnor(fin > val, fin > (val + c))) {
      func(val + c);
      if (typeof window.requestAnimationFrame == 'function') {
        requestAnimationFrame(function () {
          fx.transition(val + c, fin, change, time, func);
        });
      } else {
        setTimeout(function () {
          fx.transition(val + c, fin, change, time, func);
        }, duration);
      }
    } else {
      func(fin);
    }
  };
  fx.fadeIn = function (t) {
    if (window.getComputedStyle(ele).getPropertyValue('display') !== 'none') return;
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

[
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
    if (tutorial.switch) {
      tutorial.func(3);
    } else {
      fx('pageUrl').fadeOut(250);
      fx('bg2').fadeOut(500);
    }
  }]
].forEach(function (e) {
    idClickListener(e[0], e[1]);
});
// below, the queries are assigned their onclicks(all elements except the ones with ids).
//
// only for single ids is a separate function created because getElementById is faster than
// querySelectorAll and there are a lot of single ids being assigned onclicks.
queryClickListener('.suggest', function (v) {
  if (stat.internet && v.target.dataset.id && ['Loading.','Loading..','Loading...'].indexOf(v.target.innerHTML) === -1) {
    // if tutorial is on, disable it (as getvalue is not called)
    if (tutorial.switch) tutorial.func(3);
    
    reloadChannel(v.target.dataset.id);
  }
});
['showextra', 'hideextra'].forEach(function (e) {
  idClickListener(e, extraToggle);
});

var tutorial = {
    switch: false,
    step: 0,
    func: function (n) {
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
            var hide = (show % 2) + 1; // if show == 1, hide = 2, else show == 2, hence hide = 1
            // var hide = show === 1 ? 2 : 1;
            doc.i('tutStep' + show).style.display = 'block';
            doc.i('tutStep' + hide).style.display = 'none';
        }
        function setTutorialPos(elem) { // get bottom pos of elem and set top of tutorial below it.
            var bottom = (doc.i(elem).getBoundingClientRect()).bottom;
            doc.i('tutorial').style.top = (bottom + 35) + 'px'; // extra 35 px for arrow.
        }
        var tutorialSize = {
            isChanging: false,
            change: function () {
                if (!tutorialSize.isChanging && tutorial.switch) {
                    tutorialSize.isChanging = true;
                    tutorial.func(tutorial.step - 1);
                    setTimeout(function () {
                        tutorialSize.isChanging = false;
                    }, 100);
                }
            }
        }
        if (handleNav.state !== null) handleNav.func(handleNav.state);
        tutorial.switch = true;
        tutorial.step = n + 1;
        window.scrollTo(0, 0);
        switch (n) {
            case 0: // show tutorial stuff
                toggleTutorial(true);
                toggleZIndex(true);
                showTutStep(1);
                setTutorialPos('username');
                changeText('username', '');
                changeText('actualCount', 'Tutorial');
                channel.live.stopInterval();
                //when clicking on 'Click Here', the username is automatically focussed.
                doc.i('tutorial').addEventListener('click', function () {
                    if (tutorial.step===1)
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
                tutorial.switch = false;
                tutorial.step = 0;
                doc.i('tutorial').onclick = null;
                window.onresize = null;
            break;
            default:
                tutorial.switch = false;
                tutorial.step = 0;
                doc.i('tutorial').onclick = null;
                window.onresize = null;
            break;
        }
    }
}

if (tutorial.switch) tutorial.func(0);

var shareButton = {
    switch: false,
    transition: false,
    func: function() {
        if (shareButton.transition) return;
        shareButton.transition = true;

        var t = 200;
        var shareElems = doc.a('.share');

        if (!shareButton.switch) {
            shareElems.forEach(function (e, i) {
                setTimeout(function () {
                    fx(e.id).fadeIn(t);
                }, 40 * (i + 1));
            });
            setTimeout(function () {
                shareButton.switch = true;
                shareButton.transition = false;
                queryClickListener('body', shareButton.func);
            }, t + (shareElems.length * 40));
        } else if (shareButton.switch) {
            handleNav.state = null;
            shareElems.forEach(function (e) {
                fx(e.id).fadeOut(t);
            });
            setTimeout(function () {
                shareButton.switch = false;
                shareButton.transition = false;
                document.body.removeEventListener("click", shareButton.func);
            }, t);
        }
    }
};
var handleNav = {
    state: null,
    transition: false,
    scrollYPos: 0,
    close: function () {
        doc.i('bg1').style.height = '100%';
        doc.i('bg1').style.position = 'fixed';
        doc.i('bg1').classList.add('ball');
        doc.i('mainPage').style.display = 'block';
        if (handleNav.state === 2 || handleNav.state === 3) {
            var name = ['help', 'code'][handleNav.state - 2];
            doc.i(name + 'Art').style.display = 'none';
            doc.i(name + 'Art').style.opacity = '0';
            doc.q('.navButtonsCover[data-child="'+ name +'"]').style.backgroundColor = 'transparent';
            window.scrollTo(0, handleNav.scrollYPos);
        }
    }, open: function (s) {
        handleNav.scrollYPos = window.scrollY;
        doc.i('bg1').classList.remove('ball');
        doc.q('.navButtonsCover[data-child="' + s + '"]').style.backgroundColor = 'rgba(0,0,0,0.5)';
        setTimeout(function () {
            window.scrollTo(0, 0);
            doc.i('bg1').style.position = 'absolute';
            doc.i('bg1').style.height = 'auto';
            doc.i('mainPage').style.display = 'none';
            fx(s + 'Art').fadeIn(200);
        }, 500);
    }, func: function (n) {
        if (handleNav.transition) return;

        if (handleNav.state !== null) {
            handleNav.transition = true;
            handleNav.close();
            setTimeout(function () {
                handleNav.state = null;
                handleNav.transition = false;
            }, 500);
            if (handleNav.state !== n) {
                setTimeout(function () {
                    handleNav.func(n);
                }, 500);
            }
        } else {
            handleNav.state = n;
            handleNav.transition = true;
            setTimeout(function () {
                handleNav.transition = false;
            }, 700);
            if (n === 1) {
                if (location.hash) {
                    location.href = location.href.split(location.hash)[0];
                }
            } else if (n === 2 || n === 3) {
                handleNav.open(['help', 'code'][n - 2]);
            } else if (n === 4) {
                shareButton.func();
            }
        }

    }
};
doc.i('username').addEventListener('keyup', function () {
    if (!suggest.isShowing) suggest.loading();

    suggest.inputChange = true;
});
var suggest = {
    containers: doc.a('.suggest'),
    texts: doc.a('.suggest div'),
    images: doc.a('.suggestImg'),
    isShowing: false,
    inputChange: false,
    interval: null,
    whenImageLoaded: function (el) {// takes image element and resolves promise when it has loaded.
        return new Promise(function (resolve) {
            el.addEventListener("load", resolve);
        });
    }, loading: function() {
        doc.i('suggest').style.display = 'block';
        
        // hide all suggest except first one which is loading...
        doc.a('.suggest').forEach(function (s, x) {
            if (x===0) {
                s.style.display = 'block';
                s.childNodes[0].style.visibility = 'hidden';
                loading.func(s.childNodes[1]);
            } else {
                s.style.display = 'none';
            }
        });
    
        if (tutorial.switch) {
            tutorial.func(2);
        }
        suggest.interval = setInterval(suggest.handle, 1000);
        suggest.isShowing = true;
    }, hide: function () {
        doc.i('suggest').style.display = 'none';
        clearInterval(suggest.interval);
        suggest.isShowing = suggest.inputChange = false;
        if (tutorial.switch) {
            tutorial.func(1);
        }
    }, handle: function () {
        try {
            if (!suggest.inputChange) return;
            if (!stat.internet) {
                changeText('username','Refresh the page');
                return;
            }
            var value = getText('username');
            if (!value || ['Not Found!', 'Loading.', 'Loading..', 'Loading...', 'Refresh the page'].indexOf(value) > -1) {
                suggest.hide();
            } else {
                // inputChange set to false so after the below request is sent, another request is sent iff input actually changes
                suggest.inputChange = false;

                ajx('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(value) + '&type=channel&maxResults=5&relevanceLanguage=en&key=' + keys.gen(),
                function (result1) {
                    if (!result1.items) throw 'undef e.items in username keyup (script.js)';
                    if (result1.pageInfo.totalResults < 1) return;

                    // populate results found in suggests
                    result1.items.forEach(function (item, i) {
                        suggest.containers[i].style.display = 'block';
                        changeText(suggest.texts[i], item.snippet.title);

                        suggest.images[i].src = item.snippet.thumbnails.default.url;
                        
                        suggest.images[i].style.visibility = 'hidden';
                        suggest.whenImageLoaded(suggest.images[i]).then(function () {
                            suggest.images[i].style.visibility = 'visible';
                        });

                        suggest.containers[i].dataset.id = suggest.texts[i].dataset.id = suggest.images[i].dataset.id = item.snippet.channelId.trim();
                    });

                    // if results found < 5, the remaning containers are hidden:
                    suggest.containers.forEach(function (c, i) {
                        if (i >= result1.items.length) {
                            c.style.display = 'none';
                        }
                    });

                    if (tutorial.switch) tutorial.func(2)
                });
            }
        } catch (err) {
            stat.error('suggest.handle: ' + err + ' (script.js)', true);
        }
    }
};
var loading = {
    list: [],
    interval: null,
    func: function (el) {
        if (el && loading.list.indexOf(el) === -1) {
            if (loading.list.length === 0) {
                loading.interval = setInterval(function () {
                    loading.func();
                }, 500);
            }
            changeText(el, 'Loading.');
            loading.list.push(el);
            } else {
                if (loading.list.length === 0) {
                    clearInterval(loading.interval);
                } else {
                    var loadList = ['Loading.', 'Loading..', 'Loading...'];
                    loading.list = loading.list.filter(function (e) {
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
}

// this shows/hides the sharable link of the page.
function linkshare() {
  fx('pageUrl').fadeIn(250);
  fx('bg2').fadeIn(500);
  if (!channel.id || !location.hash.split('#!/')[1])changeText(doc.q('#pageUrl input'),'https://youcount.github.io/');
}

if (stat.internet) {
    //downloads social and assigns it as background at the end.
    doc.a('.share').forEach(function (e) {
        e.style.backgroundImage = 'url(/images/social.png)';
    });
  }

// chart functions

for (var l = 50; l > 0; l--) channel.views.push(l);

function pushViews(url, i, cb) {
  ajx(url, function (e) {
    channel.views[i] = e.items[0].statistics.viewCount;
    //if (i === ((channel.vids * 2) - 1)) updateCharts();
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
            throw '4. undef b.items[0].statistics.videoCount or b.items[0].statistics.viewCount in extraToggle(script.js)';
        }
        changeText('totalVideos', result1.items[0].statistics.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        changeText('totalViews', result1.items[0].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        if (typeof cb === 'function') cb();
    });
}
// getChartData and getChartLabels commonly used by createCharts and updateCharts
// to retrieve data and labels.
function getChartData(i) {
    function getSum() { // get sum of 0 to x - 1 views and x to 2x views (x = value of vids)
        function sum(s, e) {// function used twice for adding in reduce below.
            return s + Number(e);
        }
        var sumRet = [];
        sumRet[0] = channel.views.slice(0, channel.vids).reduce(sum, 0);
        sumRet[1] = channel.views.slice(channel.vids, channel.vids * 2).reduce(sum, 0);
        return sumRet;
    }
    if (i === 0) { // send the live count
        return [channel.count];
    } else if (i === 1) { // send x number of views as array (x = value of vids)
        return channel.views.slice(0, channel.vids);
    } else if (i === 2) { // send mean of sums
        var sum = getSum();
        return [Math.floor(sum[0] / channel.vids), Math.floor(sum[1] / channel.vids)];
    } else if (i === 3) { // send sums
        return getSum();
    }
}
function getChartLabels(i) {
    if (i === 0) {
        return [''];
    } else if (i === 1) {
        return Array(channel.vids).fill('');
    } else if (i === 2) {
        return ['Last ' + channel.vids + ' videos', 'Last to last ' + channel.vids + ' videos'];
    } else if (i === 3) {
        return ['Last ' + channel.vids + ' videos (total views)', 'Last to last ' + channel.vids + ' videos (total views)'];
    }
}
function createCharts() {
    var chartStoreData = [];

    chartStoreData[0] = {
        labels: getChartLabels(0),
        datasets: [{
            label: 'Realtime Trend (30s)',
            fill: false,
            borderColor: 'rgba(255,50,50,0.5)',
            pointRadius: 0,
            data: getChartData(0)
        }]
    };
    chartStore[0] = new Chart(doc.i('chart0').getContext('2d'), {
        type: 'line',
        data: chartStoreData[0],
        gridLines: {display: false},
        responsive: true,
        maintainAspectRatio: false,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        precision: 0
                    }
                }]
            }
        }
    });
    chartStoreData[1] = {
        labels: getChartLabels(1),
        datasets: [{
            label: 'Views of last ' + channel.vids + ' videos',
            fill: false,
            borderColor: 'rgba(255,50,50,0.5)',
            pointBorderColor: 'rgba(255,50,50,0.5)',
            pointBackgroundColor: 'rgba(255,50,50,1)',
            data: getChartData(1)
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
        labels: getChartLabels(2),
        datasets: [{
            label: 'Average Views',
            borderColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            backgroundColor: ['rgba(50,50,255,0.2)', 'rgba(50,255,50,0.2)'],
            hoverBackgroundColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            data: getChartData(2)
        }]
    }
    chartStore[2] = new Chart(doc.i('chart2').getContext('2d'), {
        type: 'bar',
        data: chartStoreData[2],
        gridLines: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0
                    }
                }]
            }
        }
    });
    chartStoreData[3] = {
        labels: getChartLabels(3),
        datasets: [{
            label: 'Total Views',
            borderColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            backgroundColor: ['rgba(50,50,255,0.2)', 'rgba(50,255,50,0.2)'],
            hoverBackgroundColor: ['rgba(0,0,255,1)', 'rgba(0,255,0,1)'],
            data: getChartData(3)
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
// if chart script not present,
// it is loaded first and charts are created
// then extra (all the charts and other info) is shown
// stat.extra: is extra currently being shown?
function extraToggle() {
    try {
        if (!stat.internet || stat.notFound || tutorial.switch || stat.scripts.chartjs === 1) {
            return;
        }
        if (!channel.id) {
            tutorial.func(0);
        } else if (stat.scripts.chartjs === 0) {
            stat.scripts.chartjs = 1;
            loading.func('showextra');
            getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js', function () {
                getViews(function () {
                    createCharts();
                    stat.scripts.chartjs = 2;
                    extraToggle();
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

            resetChart0();
            stat.extra = false;
        }
    } catch (err) {
        if (stat.devMode) throw 'extraToggle:' + err;
    }
}
function updateCharts() {
    if (stat.scripts.chartjs <= 1) {
        stat.error('updateCharts was called chartjs was loaded', true);
        return;
    }

    channel.vids = Number(getText('vids'));
    if (channel.vids > 25) {
        channel.vids = 25;
        changeText('vids', channel.vids);
    }

    chartStore.forEach(function (cs, i) {
        if (i !== 0) { // chart0 is updated using updateCount, so is skipped here
            cs.data.datasets[0].data = getChartData(i);
            cs.data.labels = getChartLabels(i);

            if (i === 1) cs.data.datasets[0].label = 'Views of last ' + channel.vids + ' videos';
            
            cs.update();
        }
    });
}
function resetChart0() {
    channel.live.prevCounts = [];
    chartStore[0].data.labels = [];
    chartStore[0].data.datasets[0].data = [];
    chartStore[0].update();
}
