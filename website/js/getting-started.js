currentPage = {
    destroy: function(){

    },
    init: function(){
    },
    update: function(){
        var portsJson = JSON.stringify(lastStats.config.ports);
        if (lastPortsJson !== portsJson) {
            if (lastStats.config.paymentIdSupported) {
              document.getElementById('paymentThreshold').innerHTML = (lastStats.config.paymentIdMinPaymentAmount / lastStats.config.denominationUnit).toFixed(Math.log(lastStats.config.denominationUnit)/Math.log(10)) + ' ' + lastStats.config.symbol
              if (document.getElementById('paymentIdWallet').style.display == 'none') {
                document.getElementById('paymentIdWallet').style.display = ''
              } else {
                document.getElementById('paymentIdWallet').style.display = 'none'
              }
              if (document.getElementById('exchangeMining').style.display == 'none') {
                document.getElementById('exchangeMining').style.display = ''
              } else {
                document.getElementById('exchangeMining').style.display = 'none'
               }
            }

            lastPortsJson = portsJson;
            var $miningPortChildren = [];
            for (var i = 0; i < lastStats.config.ports.length; i++) {
                var portData = lastStats.config.ports[i];
                var $portChild = $(miningPortTemplate);
                $portChild.find('.miningPort').text(portData.port);
                $portChild.find('.miningPortDiff').text(portData.difficulty);
                $portChild.find('.miningPortDesc').text(portData.desc);
                $miningPortChildren.push($portChild);
            }
            $miningPorts.empty().append($miningPortChildren);
        }

        updateTextClasses('exampleHost', poolHost);
        updateTextClasses('examplePort', lastStats.config.ports[0].port.toString());

    }
};

document.getElementById('easyminer_link').setAttribute('href', easyminerDownload);
document.getElementById('miningPoolHost').textContent = poolHost;

var lastPortsJson = '';
var $miningPorts = $('#miningPorts');
var miningPortTemplate = $miningPorts.html();
$miningPorts.empty();