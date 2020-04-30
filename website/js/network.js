currentPage = {
    destroy: function(){
    },
    init: function(){
        updateText('network-symbol', lastStats.config.symbol);
    },
    update: function(){
        const NETWORK_STAT_MAP = new Map(networkStat[lastStats.config.symbol.toLowerCase()]);
        NETWORK_STAT_MAP.forEach((url, host, map) => {
            $.getJSON(url + '/stats', (data, textStatus, jqXHR) => {
                updateText('height-'+host, data.network.height);
                updateText('hashrate-'+host, data.pool.hashrate+' H/s');
                updateText('miners-'+host, data.pool.miners);
                updateText('totalFee-'+host, calculateTotalFee(data)+'%');
                updateText('lastBlockFound-'+host, new Date(parseInt(data.pool.lastBlockFound)).toLocaleString());
            });
        });
    }
};

const NETWORK_STAT_MAP = new Map(networkStat[lastStats.config.symbol.toLowerCase()]);
NETWORK_STAT_MAP.forEach((url, host, map) => {
    $.getJSON(url + '/stats', (data, textStatus, jqXHR) => {
        $('#network_rows').append('<tr>' +
            '<td id=host-'+host+'><a target=blank href=http://'+host+'>'+host+'</a> ('+data.config.symbol+')</td>' +
            '<td id=height-'+host+'>'+data.network.height+'</td>' +
            '<td id=hashrate-'+host+'>'+data.pool.hashrate+'&nbsp;H/s</td>' +
            '<td id=miners-'+host+'>'+data.pool.miners+'</td>' +
            '<td id=totalFee-'+host+'>'+calculateTotalFee(data)+'%</td>' +
            '<td id=lastBlockFound-'+host+'>'+new Date(parseInt(data.pool.lastBlockFound)).toLocaleString()+'</td>' +
        '</tr>');
    });
});

function calculateTotalFee(config) {
    let totalFee = config.config.fee;
    for (let property in config.config.donation) {
        if (config.config.donation.hasOwnProperty(property)) {
            totalFee += config.config.donation[property];
        }
    }
    return totalFee;
}