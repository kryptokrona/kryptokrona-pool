var block, xhrGetBlock;

currentPage = {
    destroy: function () {
        if (xhrGetBlock) xhrGetBlock.abort();
    },
    init: function () {
        renderInitialBlocks();
    },
    update: function () {}
};

function renderInitialBlocks() {
    if (xhrGetBlock) xhrGetBlock.abort();
    xhrGetBlock = $.ajax({
        url: api_blockexplorer + '/json_rpc',
        method: "POST",
        data: JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_block_json",
            params: {
                hash: urlParam('hash')
            }
        }),
        dataType: 'json',
        cache: 'false',
        success: function (data) {
            block = data.result.block;
            updateText('block.hash', block.hash);
            updateText('block.height', block.height);
            updateText('block.timestamp', formatDate(block.timestamp));
            updateText('block.difficulty', block.difficulty);
            updateText('block.orphan', block.orphan_status ? "yes" : "no");
            updateText('block.transactions', block.transactions.length);
            updateText('block.transactionsSize', block.transactionsCumulativeSize);
            updateText('block.blockSize', block.blockSize);
            updateText('block.currentTxsMedian', block.sizeMedian);
            updateText('block.effectiveTxsMedian', block.effectiveSizeMedian);
            updateText('block.rewardPenalty', block.penalty + "%");
            updateText('block.baseReward', getReadableCoins(block.baseReward));
            updateText('block.transactionsFee', getReadableCoins(block.totalFeeAmount));
            updateText('block.reward', getReadableCoins(block.reward));
            updateText('block.totalCoins', getReadableCoins(block.alreadyGeneratedCoins));
            updateText('block.totalTransactions', block.alreadyGeneratedTransactions);
            renderTransactions(block.transactions)
        }
    });
}

function getTransactionCells(transaction) {
    return '<td>' + formatPaymentLink(transaction.hash) + '</td>' +
        '<td>' + getReadableCoins(transaction.fee, 4, true) + '</td>' +
        '<td>' + getReadableCoins(transaction.amount_out, 4, true) + '</td>' +
        '<td>' + transaction.size + '</td>';
}


function getTransactionRowElement(transaction, jsonString) {

    var row = document.createElement('tr');
    row.setAttribute('data-json', jsonString);
    row.setAttribute('data-hash', transaction.hash);
    row.setAttribute('id', 'transactionRow' + transaction.hash);

    row.innerHTML = getTransactionCells(transaction);

    return row;
}

function renderTransactions(transactionResults) {

    var $transactionsRows = $('#transactions_rows');

    for (var i = 0; i < transactionResults.length; i++) {

        var transaction = transactionResults[i];

        var transactionJson = JSON.stringify(transaction);

        var existingRow = document.getElementById('transactionRow' + transaction.hash);

        if (existingRow && existingRow.getAttribute('data-json') !== transactionJson) {
            $(existingRow).replaceWith(getTransactionRowElement(transaction, transactionJson));
        } else if (!existingRow) {

            var transactionElement = getTransactionRowElement(transaction, transactionJson);
            $transactionsRows.append(transactionElement);
        }

    }
}