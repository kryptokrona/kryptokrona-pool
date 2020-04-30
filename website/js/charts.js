var currencyGraphStat = {
    type: 'line',
    width: '100%',
    height: '75',
    lineColor: '#7b7b7b',
    fillColor: '#7b7b7b25',
    spotColor: null,
    minSpotColor: null,
    maxSpotColor: null,
    highlightLineColor: '#012a3075',
    spotRadius: 3,        
    chartRangeMin: 0,
    drawNormalOnTop: false,
    tooltipFormat: '<b>{{y}}</b>, {{offset:names}}'
};

var userGraphStat = {
    hashrate: {
        type: 'line',
        width: '100%',
        height: '180',
        lineColor: '#7b7b7b',
        fillColor: '#7b7b7b25',
        spotColor: null,
        minSpotColor: null,
        maxSpotColor: null,
        highlightLineColor: '#012a3075',
        spotRadius: 3,
        drawNormalOnTop: false,
        chartRangeMin: 0,
        tooltipFormat: '<b>{{y}}</b>, {{offset:names}}'
    },
    payments: {
        type: 'line',
        width: '100%',
        height: '180',
        lineColor: '#7b7b7b',
        fillColor: '#7b7b7b25',
        spotColor: null,
        minSpotColor: null,
        maxSpotColor: null,
        highlightLineColor: '#012a3075',
        spotRadius: 3,
        drawNormalOnTop: false,
        chartRangeMin: 0,
        tooltipFormat: '<b>{{y}}</b>, {{offset:names}}'
    }
};

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});