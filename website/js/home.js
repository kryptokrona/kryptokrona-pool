currentPage = {
    destroy: function () {
        $('#networkLastBlockFound,#poolLastBlockFound,#yourLastShare,#marketLastUpdated').timeago(
        'dispose');
        if (xhrAddressPoll) xhrAddressPoll.abort();
        if (addressTimeout) clearTimeout(addressTimeout);
        clearInterval(intervalMarketPolling);
        for (var marketPoll in xhrMarketGets) {
            xhrMarketGets[marketPoll].abort();
        }
        if (xhrGetPayments) xhrGetPayments.abort();
    },
    init: function () {},
    update: function () {

        $('#networkLastBlockFound').timeago('update', new Date(lastStats.network.timestamp * 1000)
            .toISOString());

        updateText('networkHashrate', getReadableHashRateString(lastStats.network.difficulty / lastStats
            .config.coinDifficultyTarget) + '/sec');
        updateText('networkDifficulty', lastStats.network.difficulty.toString());
        updateText('blockchainHeight', lastStats.network.height.toString());
        updateText('networkLastReward', getReadableCoins(lastStats.network.reward, 4));
        updateText('lastHash', lastStats.network.hash.substr(0, 13) + '...').setAttribute('href',
            getBlockchainUrl(lastStats.network.hash));

        updateText('poolHashrate', getReadableHashRateString(lastStats.pool.hashrate) + '/sec');

        if (lastStats.pool.lastBlockFound) {
            var d = new Date(parseInt(lastStats.pool.lastBlockFound)).toISOString();
            $('#poolLastBlockFound').timeago('update', d);
        } else
            $('#poolLastBlockFound').removeAttr('title').data('ts', '').update('Never');

        //updateText('poolRoundHashes', lastStats.pool.roundHashes.toString());
        updateText('poolMiners', lastStats.pool.miners.toString());


        var totalFee = lastStats.config.fee;
        if (Object.keys(lastStats.config.donation).length) {
            var totalDonation = 0;
            for (var i in lastStats.config.donation) {
                totalDonation += lastStats.config.donation[i];
            }
            totalFee += totalDonation;
            updateText('poolDonations', floatToString(totalDonation) + '% to open-source devs');
        } else {
            $('#donations').hide()
        }

        updateText('poolFee', /*floatToString(totalFee)*/ totalFee + '%');


        updateText('blockSolvedTime', getReadableTime(lastStats.network.difficulty / lastStats.pool
            .hashrate));
        updateText('calcHashSymbol', lastStats.config.symbol);

        calcEstimateProfit();
    }
};


$('#networkLastBlockFound,#poolLastBlockFound,#yourLastShare,#marketLastUpdated').timeago();

function getReadableTime(seconds) {

    var units = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4, 'week'],
        [12, 'month'],
        [1, 'year']
    ];

    function formatAmounts(amount, unit) {
        var rounded = Math.round(amount);
        return '' + rounded + ' ' + unit + (rounded > 1 ? 's' : '');
    }

    var amount = seconds;
    for (var i = 0; i < units.length; i++) {
        if (amount < units[i][0])
            return formatAmounts(amount, units[i][1]);
        amount = amount / units[i][0];
    }
    return formatAmounts(amount, units[units.length - 1][1]);
}




/* Market data polling */

var intervalMarketPolling = setInterval(updateMarkets, 300000); //poll market data every 5 minutes
var xhrMarketGets = {};
updateMarkets();

function updateMarkets() {
    var completedFetches = 0;
    var marketsData = [];
    for (var i = 0; i < cryptonatorWidget.length; i++) {
        (function (i) {
            cryptonatorWidget[i] = cryptonatorWidget[i].replace('{symbol}', lastStats.config.symbol
            .toLowerCase());
            xhrMarketGets[cryptonatorWidget[i]] = $.get('https://api.cryptonator.com/api/ticker/' +
                cryptonatorWidget[i],
                function (data) {
                    if (data.error) {
                        return;
                    }
                    $('.marketRate').show();

                    marketsData[i] = data;
                    completedFetches++;
                    if (completedFetches !== cryptonatorWidget.length) return;

                    var $marketHeader = $('#marketHeader');
                    $('.marketTicker').remove();
                    for (var f = marketsData.length - 1; f >= 0; f--) {
                        var price = parseFloat(marketsData[f].ticker.price);

                        if (price > 1) price = Math.round(price * 100) / 100;
                        else price = marketsData[f].ticker.price;

                        $marketHeader.after('<div class="marketTicker">' + marketsData[f].ticker.base +
                            ': <span>' + price + ' ' + marketsData[f].ticker.target + '</span></div>');
                    }
                    $('#marketLastUpdated').timeago('update', new Date(marketsData[0].timestamp * 1000)
                        .toISOString());
                }, 'json');
        })(i);
    }
}





/* Hash Profitability Calculator */

$('#calcHashRate').keyup(calcEstimateProfit).change(calcEstimateProfit);

$('#calcHashUnits > li > a').click(function (e) {
    e.preventDefault();
    $('#calcHashUnit').text($(this).text()).data('mul', $(this).data('mul'));
    calcEstimateProfit();
});

function calcEstimateProfit() {
    try {
        var rateUnit = Math.pow(1024, parseInt($('#calcHashUnit').data('mul')));
        var hashRate = parseFloat($('#calcHashRate').val()) * rateUnit;
        var profit = (hashRate * 86400 / lastStats.network.difficulty) * lastStats.network.reward;
        if (profit) {
            updateText('calcHashAmount', getReadableCoins(profit, 2, true));
            return;
        }
    } catch (e) {}
    updateText('calcHashAmount', '');
}



/* Payouts */

function getPayoutLevel(address) {
    $.ajax({
        url: api + '/get_miner_payout_level?address=' + address,
        dataType: 'json',
        cache: 'false'
    }).done(function (data) {
        if (data.level != undefined) {
            $('#yourPayoutRate').val(data.level);
        }
    });
}

function setPayoutLevel(address, level) {
    $.ajax({
        url: api + '/set_miner_payout_level?address=' + address + '&level=' + level,
        dataType: 'json',
        cache: 'false'
    }).done(function (data) {
        if (data.status == 'done') {
            $('#action_update_message').text('Done! Your payout level was set');
            $('#action_update_message').removeClass().addClass('alert alert-success');
        } else {
            $('#action_update_message').text('OOPS! Something went wrong: ' + data.status);
            $('#action_update_message').removeClass().addClass('alert alert-danger');
        }
    });
}

$('#payoutSetButton').click(function () {
    var address = $('#yourStatsInput').val();
    var level = $('#yourPayoutRate').val();
    setPayoutLevel(address, level);
});

updateText('min_payout', getReadableCoins(lastStats.config.minPaymentThreshold, 2));
if (lastStats.config.paymentIdSupported) {
    updateText('min_payout_paymentid', ' with Payment ID: ' + getReadableCoins(lastStats.config
        .paymentIdMinPaymentAmount, 2))
}

/* Stats by mining address lookup */

function getPaymentCells(payment) {
    return '<td>' + formatDate(payment.time) + '</td>' +
        '<td>' + formatPaymentLink(payment.hash) + '</td>' +
        '<td>' + getReadableCoins(payment.amount, 4, true) + '</td>' +
        '<td>' + payment.mixin + '</td>';
}

var xhrAddressPoll;
var addressTimeout;

$('#lookUp').click(function () {

    var address = $('#yourStatsInput').val().trim();
    if (!address) {
        $('#yourStatsInput').focus();
        return;
    }

    $('#addressError').hide();
    $('.yourStats').hide();
    $('#payments_rows').empty();

    $('#lookUp > span:first-child').hide();
    $('#lookUp > span:last-child').show();


    if (xhrAddressPoll) xhrAddressPoll.abort();
    if (addressTimeout) clearTimeout(addressTimeout);

    function fetchAddressStats(longpoll) {
        xhrAddressPoll = $.ajax({
            url: api + '/stats_address',
            data: {
                address: address,
                longpoll: longpoll
            },
            dataType: 'json',
            cache: 'false',
            success: function (data) {

                $('#lookUp > span:last-child').hide();
                $('#lookUp > span:first-child').show();

                if (!data.stats) {
                    $('.yourStats, .userChart').hide();
                    $('#addressError').text(data.error).show();

                    if (addressTimeout) clearTimeout(addressTimeout);
                    addressTimeout = setTimeout(function () {
                        fetchAddressStats(false);
                    }, 2000);

                    return;
                }


                $('#addressError').hide();

                if (data.stats.lastShare)
                    $('#yourLastShare').timeago('update', new Date(parseInt(data.stats
                        .lastShare) * 1000).toISOString());
                else
                    updateText('yourLastShare', 'Never');

                updateText('yourHashrateHolder', (data.stats.hashrate || '0 H') + '/sec');
                updateText('yourHashes', (data.stats.hashes || 0).toString());
                updateText('yourPaid', getReadableCoins(data.stats.paid));
                updateText('yourPendingBalance', getReadableCoins(data.stats.balance));

                renderPayments(data.payments);

                $('.yourStats').show();

                xhrRenderUserCharts = $.ajax({
                    url: api + '/stats_address?address=' + address + '&longpoll=false',
                    cache: false,
                    dataType: 'json',
                    success: function (data) {
                        createUserCharts(data);
                    }
                });

                docCookies.setItem('mining_address', address, Infinity);

                fetchAddressStats(true);

            },
            error: function (e) {
                if (e.statusText === 'abort') return;
                $('#addressError').text('Connection error').show();

                if (addressTimeout) clearTimeout(addressTimeout);
                addressTimeout = setTimeout(function () {
                    fetchAddressStats(false);
                }, 2000);

            }
        });
    }
    fetchAddressStats(false);
});

var urlWalletAddress = location.search.split('wallet=')[1] || 0;

var address = urlWalletAddress || docCookies.getItem('mining_address');

var xhrRenderUserCharts;

function createUserCharts(data) {
    for (var chart in userGraphStat) {
        if (data['charts'][chart] && data['charts'][chart].length) {
            var graphData = getGraphData(data['charts'][chart], chart == 'payments');
            userGraphStat[chart].tooltipValueLookups = {
                names: graphData.names
            };
            $('[data-chart=user_' + chart + ']').show().find('.chart').sparkline(graphData.values, userGraphStat[
                chart]);
        }
    }
}

if (address) {
    $('#yourStatsInput').val(address);
    $('#lookUp').click();
    getPayoutLevel(address);
}

$('#yourStatsInput').keyup(function (e) {
    if (e.keyCode === 13)
        $('#lookUp').click();
});

var xhrGetPayments;
$('#loadMorePayments').click(function () {
    if (xhrGetPayments) xhrGetPayments.abort();
    xhrGetPayments = $.ajax({
        url: api + '/get_payments',
        data: {
            time: $('#payments_rows').children().last().data('time'),
            address: address
        },
        dataType: 'json',
        cache: 'false',
        success: function (data) {
            renderPayments(data);
        }
    });
});



/* Show stats of the currency */

function getGraphData(rawData, fixValueToCoins) {
    var graphData = {
        names: [],
        values: []
    };
    if (rawData) {
        for (var i = 0, xy; xy = rawData[i]; i++) {
            graphData.names.push(new Date(xy[0] * 1000).toUTCString());
            graphData.values.push(fixValueToCoins ? getReadableCoins(xy[1], 4, true) : xy[1]);
        }
    }


    return graphData;
}

function createCharts(data) {
    if (data.hasOwnProperty("charts")) {
        var graphData = {
            profit: getGraphData(data.charts.profit),
            diff: getGraphData(data.charts.difficulty),
            hashrate: getGraphData(data.charts.hashrate),
            price: getGraphData(data.charts.price),
            workers: getGraphData(data.charts.workers)
        };

        for (var graphType in graphData) {
            if (graphData[graphType].values.length > 1) {
                var settings = jQuery.extend({}, currencyGraphStat);
                settings.tooltipValueLookups = {
                    names: graphData[graphType].names
                };
                var $chart = $('[data-chart=' + graphType + '] .chart');
                $chart.closest('.chartWrap').show();
                $chart.sparkline(graphData[graphType].values, settings);
            }
        }
    }
}

function loadStatistics() {
    $.get(api + '/stats', function (stats) {
        if (stats) {
            showStats(stats)
        }
    });
}

function showStats(stats) {
    $('#cur_diff').text(stats.network.difficulty);
    $('#cur_hashrate').text(getReadableHashRateString(stats.pool.hashrate) + '/s');
    $('#cur_workers').text(stats.pool.miners);

    // Some values aren't available in stats.
    // Get the values from charts data.

    if (stats.hasOwnProperty('charts')) {
        var priceData = stats.charts.price;
        $('#cur_price').text(priceData ? priceData[priceData.length - 1][1] : '---');
    }
    if (stats.hasOwnProperty('charts')) {
        var profitValue;
        var profitData = stats.charts.profit;

        if (profitData) {
            profitValue = profitData[profitData.length - 1][1];
            if (profitValue) {
                profitValue = profitValue.toPrecision(3).toString().replace(/(.*?)e(\+|\-)(\d+)/,
                    '$1<sup>10<sup>$2$3</sup></sup>');
            } else {
                profitValue = '---';
            }
        } else {
            profitValue = '---';
        }
        $('#cur_profit').html(profitValue);
    }
}




var xhrRenderCharts;

$(function () {
    xhrRenderCharts = $.ajax({
        url: api + '/stats',
        cache: false,
        success: createCharts
    });
});