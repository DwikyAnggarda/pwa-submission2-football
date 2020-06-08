let webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BDKGAY-RztE1Q_KbW3qh6H_gwZR_ec33bj8faouiW9su5y3eki49pWA1PAg1jlxOPOKM0N5Lme8mjff8Bzb2cTU",
    "privateKey": "GwwvKJuJ9rJ_ccQ-OBgn9Xs8MIplLhCovHqAKfo2Lc4"
};

webPush.setVapidDetails(
    'mailto:dwiky.amin@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fFDID05HjiE:APA91bFc5yNtnyvpI1qyULi1cRE8zajhRfL8bKX_jd4AKEy5argALgDLD5MfYr35WtbzJjkRBY-hhnUX54FUPJx8cSfFlvvKgmENeRJpODkt2Lx2f8db7-yc3lpxF5DyuppVl-_6ulLL",
    "keys": {
        "p256dh": "BN/pUEopqe0rQI0aP0gZcXpxL4DNYyjREBu0NS64aLbtYUUNSdNUN7vQlCQNWH0/QVB69YwS8X756eBuqu7IP8s=",
        "auth": "LR+QddwdDMyTC7C4gFquLg=="
    }
};

let payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

let options = {
    gcmAPIKey: '516877005149',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);