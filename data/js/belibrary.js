//|====================================================|
//|                    belibrary.js                    |
//|            Copyright (c) 2018 Belikhun.            |
//|      This file is licensed under MIT license.      |
//|====================================================|

function myajax({
    url = "/",
    method = "GET",
    query = Array(),
    form = Array(),
    file = null
}, callout = function () {}, progress = function () {}, error = function () {}, epass = false) {
    query.length = Object.keys(query).length;
    form.length = Object.keys(form).length;

    var xhr = new XMLHttpRequest();
    var pd = new FormData();
    if (file)
        pd.append("file", file);

    for (var i = 0; i < form.length; i++) {
        kn = Object.keys(form)[i];
        pd.append(kn, form[kn]);
    }

    for (var i = 0; i < query.length; i++) {
        if (i == 0)
            url += "?";
        var kn = Object.keys(query)[i];
        url += kn + "=" + query[kn];
        if (i < query.length - 1)
            url += "&";
    }

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            try {
                var res = JSON.parse(this.responseText);
            } catch (e) {
                if (epass == true) {
                    error(e);
                    return;
                }

                if (this.status == 0) {
                    document.lostconnect = true;
                    statbar.change(statbar.type.ERROR,
                        `HTTP ${this.status} ${this.statusText} >> Mất kết nối đến máy chủ. Đang thử kết nối lại...`,
                        true);
                } else if (this.responseText == "" || !this.responseText)
                    statbar.change(statbar.type.ERROR,
                        `HTTP ${this.status} ${this.statusText}`,
                        false);
                else
                    statbar.change(statbar.type.ERROR, e, false);
                error(e);
                return;
            }

            if (this.status != 200 || res.code != 0) {
                if (epass == true) {
                    error(res);
                    return;
                }

                statbar.change(statbar.type.ERROR,
                    `[${res.code}] HTTP ${this.status} ${this.statusText} >> ${res.description}`,
                    false);
                error(res);
            } else {
                if (document.lostconnect == true) {
                    document.lostconnect = false;
                    statbar.change(statbar.type.OK,
                        `HTTP ${this.status} ${this.statusText} >> Đã kết nối tới máy chủ.`,
                        false);
                    statbar.hide(3000);
                }
                callout(res.data);
            }
        }
    });

    xhr.upload.addEventListener("progress", function (e) {
        progress(e);
    }, false);

    xhr.open(method, url);
    xhr.send(pd);
}

function comparearray(arr1, arr2) {
    if (JSON.stringify(arr1) == JSON.stringify(arr2))
        return true;
    return false;
}

function escape_html(str) {

    if ((str === null) || (str === ""))
        return "";
    else
        str = str.toString();

    var map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "\'": "&#039;"
    };

    return str.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

function fcfn(nodes, classname) {
    for (var i = 0; i < nodes.length; i++)
        if (nodes[i].className && nodes[i].classList.contains(classname))
            return nodes[i];
}

function parsetime(secs = 0) {
    var d = "";
    if (secs < 0) {
        secs = -secs;
        d = "-";
    }
    var sec_num = parseInt(secs, 10)    
    var hours   = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    
    return {
        "h": hours,
        "m": minutes,
        "s": seconds,
        "str": d + [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    }
};

function $(selector) {
    var e = selector.slice(1, selector.length);
    switch (selector.charAt(0)) {
        case ".":
            return document.getElementsByClassName(e);
            break;
        case "#":
            return document.getElementById(e);
            break;
        default:
            return document.getElementsByTagName(selector);
    }
}