    function supportsNavigationTiming() {
        return !!(window.performance && window.performance.timing);
    }
    if (supportsNavigationTiming()) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                var timing = window.performance.timing;
                var timingData = {
                    userTime: (timing.loadEventEnd - timing.navigationStart),
                    dns: (timing.domainLookupEnd - timing.domainLookupStart),
                    tcp: (timing.connectEnd - timing.connectStart),
                    requestTime: (timing.responseEnd - timing.requestStart),
                    fetchTime: (timing.responseEnd - timing.fetchStart),
                    domTime: (timing.domComplete - timing.domLoading),
                    loadTime: (timing.loadEventEnd - timing.loadEventStart)
                };
                var elem = document.createElement('pre');
                elem.innerHTML = JSON.stringify(timingData);
                document.body.insertBefore(elem, document.body.firstChild);
		elem.style.fontSize = '20pt';
            }, 0);
        }, false);
    }
