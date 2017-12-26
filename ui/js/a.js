(function() {
    function getScript(url, doc) {
        var doc = doc || document;
        var script = doc.createElement('script');
        script.src = url;
		// doc.head.appendChild(script).parentNode.removeChild(script);
        doc.head.appendChild(script);
    }

    if (qt.webChannelTransport) {
		// getScript('../js/qwebchannel.js');
        // getScript('../js/desktop.js');
    } else {
        getScript('');
        getScript('./webim.js');
    }
})();

