var xhrGetTransaction;

currentPage = {
    destroy: function () {
        if (xhrGetTransaction) xhrGetTransaction.abort();
    },
    init: function () {
        renderTransaction();
    },
    update: function () {}
};

function renderTransaction() {
    if (xhrGetTransaction) xhrGetTransaction.abort();
    xhrGetTransaction = $.ajax({
        url: api_blockexplorer + '/json_rpc',
        method: "POST",
        data: JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_transaction_json",
            params: {
                hash: urlParam('hash')
            }
        }),
        dataType: 'json',
        cache: 'false',
        success: function (data) {
            transaction = data.result.txDetails;
            inputs = data.result.tx.vin;
            outputs = data.result.tx.vout;
            block = data.result.block;
            console.log(JSON.stringify(inputs));

            updateText('transaction.hash', transaction.hash);
            updateText('transaction.amount_out', getReadableCoins(transaction.amount_out));
            updateText('transaction.fee', getReadableCoins(transaction.fee));
            updateText('transaction.mixin', transaction.mixin);
            if (!transaction.mixin)
                $('#div_transaction_mixin').hide();
            updateText('transaction.paymentId', transaction.paymentId);
            if (!transaction.paymentId)
                $('#div_transaction_paymentId').hide();
            updateText('transaction.size', transaction.size);

            updateTextLinkable('block.hash', formatBlockLink(block.hash));
            updateText('block.height', block.height);
            updateText('block.timestamp', formatDate(block.timestamp));
            renderInputs(inputs);
            renderOutputs(outputs);
        }
    });
}


function getInputCells(input) {
    return '<td>' + getReadableCoins(input.value.amount) + '</td>' +
        '<td>' + input.value.k_image + '</td>';
}


function getInputRowElement(input, jsonString) {

    var row = document.createElement('tr');
    row.setAttribute('data-json', jsonString);
    row.setAttribute('data-k_image', input.value.k_image);
    row.setAttribute('id', 'inputRow' + input.value.k_image);

    row.innerHTML = getInputCells(input);

    return row;
}

function renderInputs(inputResults) {

    var $inputsRows = $('#inputs_rows');

    for (var i = 0; i < inputResults.length; i++) {

        var input = inputResults[i];
        if (!input.value.amount)
            continue;

        var inputJson = JSON.stringify(input);

        var existingRow = document.getElementById('inputRow' + input.value.k_image);

        if (existingRow && existingRow.getAttribute('data-json') !== inputJson) {
            $(existingRow).replaceWith(getInputRowElement(input, inputJson));
        } else if (!existingRow) {

            var inputElement = getInputRowElement(input, inputJson);
            $inputsRows.append(inputElement);
        }

    }
}


function getOutputCells(output) {
    return '<td>' + getReadableCoins(output.amount) + '</td>' +
        '<td>' + output.target.data.key + '</td>';
}


function getOutputRowElement(output, jsonString) {

    var row = document.createElement('tr');
    row.setAttribute('data-json', jsonString);
    row.setAttribute('data-k_image', output.target.data.key);
    row.setAttribute('id', 'outputRow' + output.target.data.key);

    row.innerHTML = getOutputCells(output);

    return row;
}

function renderOutputs(outputResults) {

    var $outputsRows = $('#outputs_rows');

    for (var i = 0; i < outputResults.length; i++) {

        var output = outputResults[i];

        var outputJson = JSON.stringify(output);

        var existingRow = document.getElementById('outputRow' + output.target.data.key);

        if (existingRow && existingRow.getAttribute('data-json') !== outputJson) {
            $(existingRow).replaceWith(getOutputRowElement(output, outputJson));
        } else if (!existingRow) {

            var outputElement = getOutputRowElement(output, outputJson);
            $outputsRows.append(outputElement);
        }

    }
}