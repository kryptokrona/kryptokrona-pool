lastStats = {};
$(function() {
    $.get(api + '/stats', function(data) {
        lastStats = data;
        routePage();
    });
});

var docCookies = {
    getItem: function(sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if(!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if(vEnd) {
            switch(vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function(sKey, sPath, sDomain) {
        if(!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function(sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
};

function getReadableCoins(coins) {
    return (parseInt(coins || 0) / lastStats.config.coinUnits).toFixed(lastStats.config.coinUnits.toString().length - 1);
}

function getReadableHashRateString(hashrate) {
    hashrate = hashrate || 0;
    var i = 0;
    var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH' ];
    while(hashrate > 1000) {
        hashrate = hashrate / 1000;
        i++;
    }
    return parseFloat(hashrate).toFixed(2) + byteUnits[i];
}

window.onhashchange = function() {
    routePage();
};

function fetchLiveStats() {
    $.ajax({
        url: api + '/live_stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data) {
        //pulseLiveUpdate();
        //lastStats = data;
        //updateIndex();
        if(currentPage.update) {
            currentPage.update();
        }
    }).always(function() {
        fetchLiveStats();
    });
}

// init Handlebars template
function renderTemplate(usersData, templateId, view) {
    var source = $(templateId).html(),
        template = Handlebars.compile(source),
        context = usersData,
        html = template(context);
    $(view).html(html);
}

function sortTable() {
    var table = $(this).parents('table').eq(0),
        rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;
    if(!this.asc) {
        rows = rows.reverse()
    }
    for(var i = 0; i < rows.length; i++) {
        table.append(rows[i])
    }
}

function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}

function getCellValue(row, index) {
    return $(row).children('td').eq(index).data("sort")
}

var currentPage;
var xhrPageLoading;
function routePage(loadedCallback) {

    if(currentPage && currentPage.destroy) {
        currentPage.destroy();
    }
    $('#page').html('');
    $('#loading').show();

    if(xhrPageLoading) {
        xhrPageLoading.abort();
    }

    $('.hot_link').removeClass('active');
    var $link = $('a.hot_link[href="' + (window.location.hash || '#') + '"]');

    $link.addClass('active');
    var page = $link.data('page');

    xhrPageLoading = $.ajax({
        url: 'pages/' + page,
        cache: false,
        success: function(data) {
            $('#loading').hide();
            $('#page').show().html(data);
            currentPage && currentPage.update && currentPage.update();
            if(loadedCallback) {
                loadedCallback();
            }
        }
    });
}

