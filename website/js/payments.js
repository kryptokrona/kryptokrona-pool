function getTransactionUrl(id) {
    return transactionExplorer.replace('{symbol}', lastStats.config.symbol.toLowerCase()).replace('{id}', id);
}

currentPage = {
    destroy: function(){
        if (xhrGetPayments) xhrGetPayments.abort();
    },
    init: function(){
    },
    update: function(){
        updateText('paymentsTotal', lastStats.pool.totalPayments.toString());
        updateText('paymentsTotalPaid', lastStats.pool.totalMinersPaid.toString());
        updateText('paymentsMinimum', getReadableCoins(lastStats.config.minPaymentThreshold, 3));
        updateText('paymentsDenomination', getReadableCoins(lastStats.config.denominationUnit, 3));
        renderPayments(lastStats.pool.payments);
    }
};


var xhrGetPayments;
$('#loadMorePayments').click(function(){
    if (xhrGetPayments) xhrGetPayments.abort();
    xhrGetPayments = $.ajax({
        url: api + '/get_payments',
        data: {
            time: $('#payments_rows').children().last().data('time')
        },
        dataType: 'json',
        cache: 'false',
        success: function(data){
            renderPayments(data);
        }
    });
});


function getPaymentCells(payment){
    return '<td>' + formatDate(payment.time) + '</td>' +
            '<td>' + formatPaymentLink(payment.hash) + '</td>' +
            '<td>' + getReadableCoins(payment.amount, 4, true) + '</td>' +
            '<td>' + getReadableCoins(payment.fee, 4, true) + '</td>' +
            '<td>' + payment.mixin + '</td>' +
            '<td>' + payment.recipients + '</td>';
}