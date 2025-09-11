// This global script will stop the screen timeout using wakeLock

// After a period of inactivity the wakeLock is released,
// this is done for security and battery saving reasons.
// IE If we are no longer using the app, don't leave the screen open forever



// let timeoutDuration = 300000; // 5 minutes (in milliseconds)
let timeoutID;
let wakeLock = null;

// Function to request screen wake lock
async function requestWakeLock() {
    try {
        // Only if wakeLock is available
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Screen wake lock acquired");

            // Optional: Handle the release event (when the wake lock is released)
            wakeLock.addEventListener('release', () => {
                console.log('Wake lock released event triggered');
            });
        }
    } catch (err) {
        console.error('Failed to acquire wake lock:', err);
    }
}

// Function to release the wake lock
async function releaseWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();  // Release the wake lock
            console.log('Wake lock released');
            wakeLock = null;  // Reset the wake lock object after releasing it
        } catch (err) {
            console.error('Failed to release wake lock:', err);
        }
    } else {
        console.log('No wake lock to release');
    }
}


// Reset the release wakeLock timeout
function resetTimeout() {
    clearTimeout(timeoutID);  // Reset the previous timeout
    let timeoutDuration = fiveCrowns.settings.oSettings.getScreenTimeout() * 1000;
    // console.log('Timeout set for ', timeoutDuration, ' milliseconds');
    timeoutID = setTimeout(releaseWakeLock, timeoutDuration);  // Set a new timeout

    // Ensure the screen stays on as long as the user is active
    if (!wakeLock) {
        requestWakeLock(); // Request wake lock if it's not already active
    }
}


// Listen for user activity
window.onload = resetTimeout;  // Start the timeout when the page loads
document.onmousemove = resetTimeout;  // Reset timeout on mouse move
document.onkeydown = resetTimeout;  // Reset timeout on key press
document.onclick = resetTimeout;  // Reset timeout on click

// Optional: Detect touch or swipe events for mobile users
document.ontouchstart = resetTimeout;  // Reset timeout on touch


// Listen for visibility change to re-request wake lock if needed
document.addEventListener('visibilitychange', async function () {
    if (document.visibilityState === 'visible') {
        // Wake lock may have been released by the browser, so always try to request again
        requestWakeLock();
        resetTimeout();
    }
});
