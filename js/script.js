var chartStore = [];
if (!stat.devMode)
  try {
    (window.top === window.self &&
      window.top.location === window.self.location) ||
      (window.top.location = window.self.location),
      "youcount.github.io" != window.location.hostname &&
        (window.location.hostname = "youcount.github.io");
  } catch (t) {
    if (stat.devMode) throw t;
  }
function idClickListener(t, e) {
  doc.i(t).addEventListener("click", e);
}
function queryClickListener(t, e) {
  doc.a(t).forEach(function (t) {
    t.addEventListener("click", e);
  });
}
function fx(t) {
  var a = doc.i(t),
    l = 1e3 / 60;
  return (
    (fx.xnor = function (t, e) {
      return (t && e) || (!t && !e);
    }),
    (fx.transition = function (t, e, a, n, i) {
      var s = Date.now(),
        o = a * Math.round((s - n) / l);
      fx.xnor(t < e, t + o < e)
        ? (i(t + o),
          "function" == typeof window.requestAnimationFrame
            ? requestAnimationFrame(function () {
                fx.transition(t + o, e, a, s, i);
              })
            : setTimeout(function () {
                fx.transition(t + o, e, a, s, i);
              }, l))
        : i(e);
    }),
    (fx.fadeIn = function (t) {
      var e;
      "none" === window.getComputedStyle(a).getPropertyValue("display") &&
        ((t = def(t, 400)),
        (a.dataset.fxOpacity = e =
          Number(a.dataset.fxOpacity || a.style.opacity || 1)),
        a.dataset.fxDisplay
          ? (a.style.display = a.dataset.fxDisplay)
          : (a.style.display = "block"),
        fx.transition(0, e, (e * l) / t, Date.now(), function (t) {
          a.style.opacity = t;
        }));
    }),
    (fx.fadeOut = function (t) {
      var e;
      "none" !== window.getComputedStyle(a).getPropertyValue("display") &&
        ((t = def(t, 400)),
        (a.dataset.fxOpacity = e =
          Number(a.dataset.fxOpacity || a.style.opacity || 1)),
        (a.dataset.fxDisplay = window
          .getComputedStyle(a)
          .getPropertyValue("display")),
        fx.transition(e, 0, (-1 * e * l) / t, Date.now(), function (t) {
          a.style.opacity = t;
        }),
        setTimeout(function () {
          a.style.display = "none";
        }, t));
    }),
    fx
  );
}
function setEmail() {
  var t = ["urana20", "ma", "nas.kh", "gmail", "com", "&#46;", "&#64;"];
  (doc.i("email").innerHTML = t[1] + t[2] + t[0] + t[6] + t[3] + t[5] + t[4]),
    (doc.i("email").href = "mailto:" + getText("email"));
}
setEmail(),
  [
    [
      "inputButton",
      function () {
        getValue();
      },
    ],
    [
      "fb",
      function () {
        window.open(
          "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(getText(doc.q("#pageUrl input"))),
          "_blank"
        );
      },
    ],
    [
      "tw",
      function () {
        window.open(
          "https://twitter.com/share?text=" +
            getText("username") +
            " now has  " +
            channel.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            " subscribers!&url= " +
            encodeURIComponent(getText(doc.q("#pageUrl input"))) +
            "&hashtags=YouCount",
          "_blank"
        );
      },
    ],
    [
      "lnkdIn",
      function () {
        window.open(
          "https://www.linkedin.com/shareArticle?mini=true&url=" +
            encodeURIComponent(getText(doc.q("#pageUrl input"))) +
            "&title=" +
            encodeURIComponent(channel.name) +
            "'s%20Live%20Subscriber%20Count&source=YouCount",
          "_blank"
        );
      },
    ],
    [
      "tb",
      function () {
        window.open(
          "http://www.tumblr.com/share/link?url=" +
            encodeURIComponent(getText(doc.q("#pageUrl input"))),
          "_blank"
        );
      },
    ],
    [
      "rdit",
      function () {
        window.open(
          "http://www.reddit.com/submit?url=" +
            encodeURIComponent(getText(doc.q("#pageUrl input"))) +
            "&title=" +
            encodeURIComponent(channel.name) +
            "s%20Live%20Subscriber%20Count",
          "_blank"
        );
      },
    ],
    ["link", linkshare],
    [
      "bg2",
      function () {
        tutorial.switch
          ? tutorial.func(3)
          : (fx("pageUrl").fadeOut(250), fx("bg2").fadeOut(500));
      },
    ],
  ].forEach(function (t) {
    idClickListener(t[0], t[1]);
  }),
  queryClickListener(".suggest", function (t) {
    stat.internet &&
      t.target.dataset.id &&
      -1 ===
        ["Loading.", "Loading..", "Loading..."].indexOf(t.target.innerHTML) &&
      (tutorial.switch && tutorial.func(3), reloadChannel(t.target.dataset.id));
  }),
  ["showextra", "hideextra"].forEach(function (t) {
    idClickListener(t, extraToggle);
  });
var tutorial = {
  switch: !1,
  step: 0,
  func: function (t) {
    function e(t) {
      t
        ? (fx("tutorial").fadeIn(), fx("bg2").fadeIn())
        : (fx("tutorial").fadeOut(), fx("bg2").fadeOut());
    }
    function a(t) {
      var e = t ? ["1004", "1004"] : ["50", "51"];
      (doc.i("input").style.zIndex = e[0]),
        (doc.i("suggest").style.zIndex = e[1]);
    }
    function n(t) {
      var e = (t % 2) + 1;
      (doc.i("tutStep" + t).style.display = "block"),
        (doc.i("tutStep" + e).style.display = "none");
    }
    function i(t) {
      var e = doc.i(t).getBoundingClientRect().bottom;
      doc.i("tutorial").style.top = e + 35 + "px";
    }
    var s = {
      isChanging: !1,
      change: function () {
        !s.isChanging &&
          tutorial.switch &&
          ((s.isChanging = !0),
          tutorial.func(tutorial.step - 1),
          setTimeout(function () {
            s.isChanging = !1;
          }, 100));
      },
    };
    switch (
      (null !== handleNav.state && handleNav.func(handleNav.state),
      (tutorial.switch = !0),
      (tutorial.step = t + 1),
      window.scrollTo(0, 0),
      t)
    ) {
      case 0:
        e(!0),
          a(!0),
          n(1),
          i("username"),
          changeText("username", ""),
          changeText("actualCount", "Tutorial"),
          channel.live.stopInterval(),
          doc.i("tutorial").addEventListener("click", function () {
            1 === tutorial.step && doc.i("username").focus();
          }),
          (window.onresize = s.change);
        break;
      case 1:
        n(2), i("username");
        break;
      case 2:
        n(2), i("suggest");
        break;
      case 3:
        e(!1),
          a(!1),
          changeText("username", channel.name),
          (tutorial.switch = !1),
          (tutorial.step = 0),
          (doc.i("tutorial").onclick = null),
          (window.onresize = null);
        break;
      default:
        (tutorial.switch = !1),
          (tutorial.step = 0),
          (doc.i("tutorial").onclick = null),
          (window.onresize = null);
    }
  },
};
tutorial.switch && tutorial.func(0);
var shareButton = {
    switch: !1,
    transition: !1,
    func: function () {
      if (!shareButton.transition) {
        shareButton.transition = !0;
        var a = 200,
          t = doc.a(".share");
        shareButton.switch
          ? shareButton.switch &&
            ((handleNav.state = null),
            t.forEach(function (t) {
              fx(t.id).fadeOut(a);
            }),
            setTimeout(function () {
              (shareButton.switch = !1),
                (shareButton.transition = !1),
                document.body.removeEventListener("click", shareButton.func);
            }, a))
          : (t.forEach(function (t, e) {
              setTimeout(function () {
                fx(t.id).fadeIn(a);
              }, 40 * (e + 1));
            }),
            setTimeout(function () {
              (shareButton.switch = !0),
                (shareButton.transition = !1),
                queryClickListener("body", shareButton.func);
            }, a + 40 * t.length));
      }
    },
  },
  handleNav = {
    state: null,
    transition: !1,
    scrollYPos: 0,
    close: function () {
      if (
        ((doc.i("bg1").style.height = "100%"),
        (doc.i("bg1").style.position = "fixed"),
        doc.i("bg1").classList.add("ball"),
        (doc.i("mainPage").style.display = "block"),
        2 === handleNav.state || 3 === handleNav.state)
      ) {
        var t = ["help", "code"][handleNav.state - 2];
        (doc.i(t + "Art").style.display = "none"),
          (doc.i(t + "Art").style.opacity = "0"),
          (doc.q(
            '.navButtonsCover[data-child="' + t + '"]'
          ).style.backgroundColor = "transparent"),
          window.scrollTo(0, handleNav.scrollYPos);
      }
    },
    open: function (t) {
      (handleNav.scrollYPos = window.scrollY),
        doc.i("bg1").classList.remove("ball"),
        (doc.q(
          '.navButtonsCover[data-child="' + t + '"]'
        ).style.backgroundColor = "rgba(0,0,0,0.5)"),
        setTimeout(function () {
          window.scrollTo(0, 0),
            (doc.i("bg1").style.position = "absolute"),
            (doc.i("bg1").style.height = "auto"),
            (doc.i("mainPage").style.display = "none"),
            fx(t + "Art").fadeIn(200);
        }, 500);
    },
    func: function (t) {
      handleNav.transition ||
        (null !== handleNav.state
          ? ((handleNav.transition = !0),
            handleNav.close(),
            setTimeout(function () {
              (handleNav.state = null), (handleNav.transition = !1);
            }, 500),
            handleNav.state !== t &&
              setTimeout(function () {
                handleNav.func(t);
              }, 500))
          : ((handleNav.state = t),
            (handleNav.transition = !0),
            setTimeout(function () {
              handleNav.transition = !1;
            }, 700),
            1 === t
              ? location.hash &&
                (location.href = location.href.split(location.hash)[0])
              : 2 === t || 3 === t
              ? handleNav.open(["help", "code"][t - 2])
              : 4 === t && shareButton.func()));
    },
  };
doc.i("username").addEventListener("keyup", function () {
  suggest.isShowing || suggest.load(), (suggest.inputChange = !0);
});
var suggest = {
    containers: doc.a(".suggest"),
    texts: doc.a(".suggest div"),
    images: doc.a(".suggestImg"),
    isShowing: !1,
    inputChange: !1,
    interval: null,
    whenImageLoaded: function (e) {
      return new Promise(function (t) {
        e.addEventListener("load", t);
      });
    },
    load: function () {
      (doc.i("suggest").style.display = "block"),
        doc.a(".suggest").forEach(function (t, e) {
          0 === e
            ? ((t.style.display = "block"),
              (t.childNodes[0].style.visibility = "hidden"),
              loading.func(t.childNodes[1]))
            : (t.style.display = "none");
        }),
        tutorial.switch && tutorial.func(2),
        (suggest.interval = setInterval(suggest.handle, 1e3)),
        (suggest.isShowing = !0);
    },
    hide: function () {
      (doc.i("suggest").style.display = "none"),
        clearInterval(suggest.interval),
        (suggest.isShowing = suggest.inputChange = !1),
        tutorial.switch && tutorial.func(1);
    },
    handle: function () {
      try {
        if (!suggest.inputChange) return;
        if (!stat.internet)
          return void changeText("username", "Refresh the page");
        var t = getText("username");
        !t ||
        -1 <
          [
            "Not Found!",
            "Loading.",
            "Loading..",
            "Loading...",
            "Refresh the page",
          ].indexOf(t)
          ? suggest.hide()
          : ((suggest.inputChange = !1),
            ajx(
              "https://api.subscribercounter.nl/api/youtube-subscriber-count/" +
                encodeURIComponent(t),
              function (a) {
                if (!a.items)
                  throw "undef e.items in username keyup (script.js)";
                a.pageInfo.totalResults < 1 ||
                  (a.items.forEach(function (t, e) {
                    (suggest.containers[e].style.display = "block"),
                      changeText(suggest.texts[e], t.snippet.title),
                      (suggest.images[e].src =
                        t.snippet.thumbnails.default.url),
                      (suggest.images[e].style.visibility = "hidden"),
                      suggest
                        .whenImageLoaded(suggest.images[e])
                        .then(function () {
                          suggest.images[e].style.visibility = "visible";
                        }),
                      (suggest.containers[e].dataset.id =
                        suggest.texts[e].dataset.id =
                        suggest.images[e].dataset.id =
                          t.snippet.channelId.trim());
                  }),
                  suggest.containers.forEach(function (t, e) {
                    e >= a.items.length && (t.style.display = "none");
                  }),
                  tutorial.switch && tutorial.func(2));
              }
            ));
      } catch (t) {
        stat.error("suggest.handle: " + t + " (script.js)", !0);
      }
    },
  },
  loading = {
    list: [],
    interval: null,
    func: function (t) {
      if (t && -1 === loading.list.indexOf(t))
        0 === loading.list.length &&
          (loading.interval = setInterval(function () {
            loading.func();
          }, 500)),
          changeText(t, "Loading."),
          loading.list.push(t);
      else if (0 === loading.list.length) clearInterval(loading.interval);
      else {
        var a = ["Loading.", "Loading..", "Loading..."];
        loading.list = loading.list.filter(function (t) {
          var e = a.indexOf(getText(t));
          return 0 <= e && (changeText(t, a[(e + 1) % 3]), !0);
        });
      }
    },
  };
function linkshare() {
  fx("pageUrl").fadeIn(250),
    fx("bg2").fadeIn(500),
    (channel.id && location.hash.split("#!/")[1]) ||
      changeText(doc.q("#pageUrl input"), "https://youcount.github.io/");
}
stat.internet &&
  doc.a(".share").forEach(function (t) {
    t.style.backgroundImage = "url(/images/social.png)";
  });
for (var l = 50; 0 < l; l--) channel.views.push(l);
function pushViews(t, e, a) {
  ajx(t, function (t) {
    (channel.views[e] = t.items[0].statistics.viewCount),
      49 === e && "function" == typeof a && a();
  });
}
function getViews(a) {
  var t =
    "https://api.subscribercounter.nl/api/youtube-contentDetails/" +
    channel.id;
  ajx(t, function (t) {
    var e =
      "https://api.subscribercounter.nl/api/youtube-playlist/" +
      t.items[0].contentDetails.relatedPlaylists.uploads;
    ajx(e, function (t) {
      t.items.forEach(function (t, e) {
        pushViews(
          "https://api.subscribercounter.nl/api/youtube-videos/" +
            t.snippet.resourceId.videoId,
          e,
          a
        );
      });
    });
  });
}
function getMisc(e) {
  var t =
    "https://api.subscribercounter.nl/api/youtube-subscribercount/" +
    channel.id;
  ajx(t, function (t) {
    if (!t.items[0].statistics.videoCount || !t.items[0].statistics.viewCount)
      throw "4. undef b.items[0].statistics.videoCount or b.items[0].statistics.viewCount in extraToggle(script.js)";
    changeText(
      "totalVideos",
      t.items[0].statistics.videoCount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    ),
      changeText(
        "totalViews",
        t.items[0].statistics.viewCount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      ),
      "function" == typeof e && e();
  });
}
function getChartData(t) {
  function e() {
    function t(t, e) {
      return t + Number(e);
    }
    var e = [];
    return (
      (e[0] = channel.views.slice(0, channel.vids).reduce(t, 0)),
      (e[1] = channel.views.slice(channel.vids, 2 * channel.vids).reduce(t, 0)),
      e
    );
  }
  if (0 === t) return [channel.count];
  if (1 === t) return channel.views.slice(0, channel.vids);
  if (2 !== t) return 3 === t ? e() : void 0;
  var a = e();
  return [Math.floor(a[0] / channel.vids), Math.floor(a[1] / channel.vids)];
}
function getChartLabels(t) {
  return 0 === t
    ? [""]
    : 1 === t
    ? Array(channel.vids).fill("")
    : 2 === t
    ? [
        "Last " + channel.vids + " videos",
        "Last to last " + channel.vids + " videos",
      ]
    : 3 === t
    ? [
        "Last " + channel.vids + " videos (total views)",
        "Last to last " + channel.vids + " videos (total views)",
      ]
    : void 0;
}
function createCharts() {
  var t = [];
  (t[0] = {
    labels: getChartLabels(0),
    datasets: [
      {
        label: "Realtime Trend (30s)",
        fill: !1,
        borderColor: "rgba(255,50,50,0.5)",
        pointRadius: 0,
        data: getChartData(0),
      },
    ],
  }),
    (chartStore[0] = new Chart(doc.i("chart0").getContext("2d"), {
      type: "line",
      data: t[0],
      gridLines: { display: !1 },
      responsive: !0,
      maintainAspectRatio: !1,
      options: { scales: { yAxes: [{ ticks: { precision: 0 } }] } },
    })),
    (t[1] = {
      labels: getChartLabels(1),
      datasets: [
        {
          label: "Views of last " + channel.vids + " videos",
          fill: !1,
          borderColor: "rgba(255,50,50,0.5)",
          pointBorderColor: "rgba(255,50,50,0.5)",
          pointBackgroundColor: "rgba(255,50,50,1)",
          data: getChartData(1),
        },
      ],
    }),
    (chartStore[1] = new Chart(doc.i("chart1").getContext("2d"), {
      type: "line",
      data: t[1],
      gridLines: { display: !1 },
      responsive: !0,
      maintainAspectRatio: !1,
    })),
    (t[2] = {
      labels: getChartLabels(2),
      datasets: [
        {
          label: "Average Views",
          borderColor: ["rgba(0,0,255,1)", "rgba(0,255,0,1)"],
          backgroundColor: ["rgba(50,50,255,0.2)", "rgba(50,255,50,0.2)"],
          hoverBackgroundColor: ["rgba(0,0,255,1)", "rgba(0,255,0,1)"],
          data: getChartData(2),
        },
      ],
    }),
    (chartStore[2] = new Chart(doc.i("chart2").getContext("2d"), {
      type: "bar",
      data: t[2],
      gridLines: { display: !1 },
      responsive: !0,
      maintainAspectRatio: !1,
      options: { scales: { yAxes: [{ ticks: { min: 0 } }] } },
    })),
    (t[3] = {
      labels: getChartLabels(3),
      datasets: [
        {
          label: "Total Views",
          borderColor: ["rgba(0,0,255,1)", "rgba(0,255,0,1)"],
          backgroundColor: ["rgba(50,50,255,0.2)", "rgba(50,255,50,0.2)"],
          hoverBackgroundColor: ["rgba(0,0,255,1)", "rgba(0,255,0,1)"],
          data: getChartData(3),
        },
      ],
    }),
    (chartStore[3] = new Chart(doc.i("chart3").getContext("2d"), {
      type: "doughnut",
      data: t[3],
      gridLines: { display: !1 },
      responsive: !0,
      maintainAspectRatio: !1,
    }));
}
function extraToggle() {
  try {
    if (
      !stat.internet ||
      stat.notFound ||
      tutorial.switch ||
      1 === stat.scripts.chartjs
    )
      return;
    channel.id
      ? 0 === stat.scripts.chartjs
        ? ((stat.scripts.chartjs = 1),
          loading.func("showextra"),
          getScript(
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js",
            function () {
              getViews(function () {
                createCharts(), (stat.scripts.chartjs = 2), extraToggle();
              }),
                getMisc();
            }
          ))
        : stat.extra
        ? stat.extra &&
          (fx("showextra").fadeIn(),
          fx("hideextra").fadeOut(100),
          (doc.i("extraContent").style.display = "none"),
          resetChart0(),
          (stat.extra = !1))
        : (changeText("showextra", "Show Stats"),
          fx("showextra").fadeOut(),
          fx("hideextra").fadeIn(),
          (doc.i("extraContent").style.display = "block"),
          (channel.live.seconds = 0),
          (stat.extra = !0))
      : tutorial.func(0);
  } catch (t) {
    if (stat.devMode) throw "extraToggle:" + t;
  }
}
function updateCharts() {
  stat.scripts.chartjs <= 1
    ? stat.error("updateCharts was called chartjs was loaded", !0)
    : ((channel.vids = Number(getText("vids"))),
      25 < channel.vids &&
        ((channel.vids = 25), changeText("vids", channel.vids)),
      chartStore.forEach(function (t, e) {
        0 !== e &&
          ((t.data.datasets[0].data = getChartData(e)),
          (t.data.labels = getChartLabels(e)),
          1 === e &&
            (t.data.datasets[0].label =
              "Views of last " + channel.vids + " videos"),
          t.update());
      }));
}
function resetChart0() {
  (channel.live.seconds = 0),
    (channel.live.prevCounts = []),
    (chartStore[0].data.labels = []),
    (chartStore[0].data.datasets[0].data = []),
    chartStore[0].update();
}
