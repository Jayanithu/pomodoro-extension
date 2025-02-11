chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "notification") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Pomodoro Timer",
            message: request.message,
            priority: 2
        });
    }
});
