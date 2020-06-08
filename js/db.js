let dbPromised = idb.open("football-db", 1, function (upgradeDb) {
    let teamsObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    teamsObjectStore.createIndex("name", "name", {
        unique: false
    });
});

//remove team
function removeTeam(id) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(id);
            store.delete(id.id);
            return tx.complete;
        })
        .then(function () {
            const title = 'Data Team Berhasil dihapus!';
            const options = {
                'body': `Club berhasil dihapus dari My Favorite.`,
                'badge': 'icon/icon-72x72.png',
                'icon': 'icon/icon-72x72.png',
            };
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification(title, options);
                });
            } else {
                M.toast({
                    html: 'Team berhasil dihapus'
                });
            }
            location.replace("/#teams");
        })
        .catch(function () {
            M.toast({
                html: 'Team gagal disimpan'
            });
            location.reload();
        });
}

//save team
function saveForLater(team) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team);
            store.put(team);
            return tx.complete;
        })
        .then(function () {
            const title = 'Data Team Berhasil disimpan!';
            console.log(title);
            const options = {
                'body': `Club ${team.name} sudah tersimpan, cek My Favorite.`,
                'badge': 'icon/icon-72x72.png',
                'icon': 'icon/icon-72x72.png',
                'actions': [{
                        'action': 'yes-action',
                        'title': 'Yes',
                    },
                    {
                        'action': 'no-action',
                        'title': 'No',
                    }
                ],
            };
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification(title, options);
                });
            } else {
                M.toast({
                    html: `Club ${team.name} berhasil disimpan, cek My Favorite.`
                });
            }
            location.reload();
        })
        .catch(function () {
            M.toast({
                html: 'Team gagal disimpan'
            });
            location.reload();
        });
}

//getAll teams
function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (teams) {
                resolve(teams);
            });
    });
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(id);
            })
            .then(function (team) {
                resolve(team);
            });
    });
}

//cek team di indexed db
function checkFavorite(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(id);
            }).then(function (favorite) {
                if (favorite !== undefined) {
                    resolve(true);
                }
            });
    });
}