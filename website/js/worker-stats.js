function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
// Fetches the workers that are known for an address and creates the graphs.
function fetchAddressWorkers(address) {
    $.ajax({
        url: api + '/stats_address',
        data: {
            address: address,
        },
        dataType: 'json',
        cache: 'false',
        success: function (data) {
            for (var i = 0; i < data.workers.length; i++) {
                getWorkerGraphData(data.workers[i], address, function (graphData, rangeMax) {
                    var new_id = 'chart_' + graphData[0].name;
                    var $template = $("#worker_chart").clone().prop('id', new_id);
                    if (graphData[0].y.length < 5) {
                        $template.append('<br>Not enough data yet for worker: ' + graphData[0].name);
                        $template.appendTo("#graphs");
                    } else {
                        var layout = {
                            title: 'Hashrate worker: ' + graphData[0].name,
                            autosize: false,
                            width: 1000,
                            height: 300,
                            yaxis: {
                                autorange: false,
                                range: [0, rangeMax + 500],
                                type: 'linear'
                            }
                        }
                        $template.appendTo("#graphs");
                        Plotly.newPlot(new_id, graphData, layout);
                    }
                    $('#' + new_id).show();
                });
            }
        }
    });
}
// Gets worker graph data.
function getWorkerGraphData(worker, address, dataHandler) {
    var worker_address = address + '+' + worker;
    $.ajax({
        url: api + '/stats_worker',
        data: {
            address: worker_address,
        },
        dataType: 'json',
        cache: 'false',
        success: function (data) {
            var graphData = {
                names: [],
                values: []
            };
            var rangeMax = 0;
            for (var i = 0; i < data['charts']['hashrate'].length; i++) {
                xy = data['charts']['hashrate'][i];
                graphData.names.push(new Date(xy[0] * 1000).toUTCString());
                if (xy[1] > rangeMax) {
                    rangeMax = xy[1];
                }
                graphData.values.push(xy[1]);
            }
            dataHandler([{
                x: graphData.names,
                y: graphData.values,
                type: 'scatter',
                name: worker,
                mode: 'lines',
                fill: 'tonexty',
                connectgaps: true,
                autosize: false
            }], rangeMax);
        }
    });
}

loadScript("https://cdn.plot.ly/plotly-1.2.0.min.js", function () {
    var urlWalletAddress = location.search.split('wallet=')[1] || 0;
    var address = urlWalletAddress || docCookies.getItem('mining_address');
    if (address) {
        $('#yourAddress').val(address);
        fetchAddressWorkers(address);
    }
});
$('#addressSetButton').click(function () {
    $("#graphs").empty();
    var address = $('#yourAddress').val();
    fetchAddressWorkers(address);
});