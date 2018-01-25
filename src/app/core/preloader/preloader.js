(function(global) {

    global.paceOptions = {
        document: true,
        eventLag: true,
        restartOnPushState: false,
        restartOnRequestAfter: false,
        ajax: {
            trackMethods: ['POST', 'GET']
        }
    };

})(window);