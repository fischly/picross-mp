
var log;

// Wait for the deviceready event before using any of Cordova's device APIs.
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    log = document.getElementById('log');

    log.addEventListener('touchstart', onTouchStart);
    log.addEventListener('touchend', onTouchEnd);
}

function onTouchStart(event) {
    log.value += '[onTouchStart] ' + event + '\n';

    console.log('[onTouchStart]', event);

}

function onTouchEnd(event) {
    log.value += '[onTouchEnd] ' + event + '\n';

    console.log('[onTouchEnd]', event);
}


