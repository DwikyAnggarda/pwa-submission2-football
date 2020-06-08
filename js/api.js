const API_KEY = "e77d24b881c24fb3bbf3b9cf41bee0b3";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2015;

const ENDPOINT_STANDING = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_ALL_TEAM = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
const ENDPOINT_TEAM_BY_ID = `${BASE_URL}teams/`;

const fetchAPI = url => {
    return fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function getAllStandings() {
    if ("caches" in window) {
        caches.match(ENDPOINT_STANDING).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_STANDING)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function getAllTeam() {
    if ("caches" in window) {
        caches.match(ENDPOINT_ALL_TEAM).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Team Data: " + data);
                    showAllTeam(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_ALL_TEAM)
        .then(data => {
            showAllTeam(data);
        })
        .catch(error => {
            console.log(error)
        })

}

function getTeamById() {
    return new Promise(function (resolve, reject) {
        // Ambil nilai query parameter (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");
        if ("caches" in window) {
            caches.match(ENDPOINT_TEAM_BY_ID + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        console.log("Team Data: " + data);
                        showTeamById(data);
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    })
                }
            })
        }

        fetchAPI(ENDPOINT_TEAM_BY_ID + idParam)
            .then(data => {
                showTeamById(data);
                resolve(data)
            })
            .catch(error => {
                console.log(error)
            })
    });
}

function showStanding(data) {
    let standings = "";
    let standingElement = document.getElementById("homeStandings");

    data.standings[0].table.forEach(function (standing) {
        let logoTeam = standing.team.crestUrl.replace(/^http:\/\//i, 'https://');
        standings += `
                <tr>
                    <td><img src="${logoTeam}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Team Name</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
}



function showAllTeam(data) {
    let squads = "";
    let teamElement = document.getElementById("teams");

    data.teams.forEach(function (team) {
        squads += `
                <a href="./detail.html?id=${team.id}" style="color:black;">
                    <div class="col s12 m4 l3" style="float: left; height: 40rem; margin: 0; padding: 5px; ">
                        <div class="card">
                            <div class="card-image" style="height : 15rem;">
                            <img src="${team.crestUrl}" style="margin: auto; padding: 1rem 1rem 0 1rem; height: 100%; width:auto; max-width: 100%; ">
                            </div>
                            <div class="card-content" style="padding-top: 0.5rem; height : 6rem;">
                            <h5><strong>${team.name}</strong></h5>
                            </div>
                            <div class="card-action">
                            <a href="./detail.html?id=${team.id}" style="float: left; ">Read More</a>
                            </div>
                        </div>
                    </div>
                </a>
                `;
    });

    teamElement.innerHTML = ` 
        <div class="row">    
        ${squads}
        </div>
    `;
}

function showTeamById(data) {
    let squads = "";
    let info = "";
    let teamElement = document.getElementById("body-content");
    let logoTeam = data.crestUrl.replace(/^http:\/\//i, 'https://');

    info += `
            <div class="card" style="text-align:center;">
                <div class="row">
                <div class="col s3 l5"></div>
                <div class="col s6 l2" style="margin-bottom: 0; padding:0; ">
                    <img src="${logoTeam}" style="padding-top: 2rem; width:100%; height: auto;" align="middle" >
                </div>
                </div>
                <div class="card-content" style="margin-top: 0;padding:0; ">
                <h3 >${data.name}</h3>
                <h5 >${data.website}</h5>
                <h6><strong>Founded on ${data.founded}. Stadion at ${data.venue}.</strong></h6>
                <br>
                </div>
        `;

    data.squad.forEach(function (member) {
        squads += `
            <tr style="text-align: center;">
                <td>${member.name}</td>
                <td>${member.nationality}</td>
                <td>${member.role}</td>
                <td>${member.position}</td>
            </tr>
    `;
    });

    teamElement.innerHTML = `
            ${info}
            <div class="card" style="padding-left: 24px; padding-right: 24px;">
                    <table class="striped responsive-table">
                        <thead>
                        <tr><h5 style="text-align: center; padding-top: 15px;"><strong>Team Players</strong><h5></tr>
                            <tr>
                                <th>Full Name</th>
                                <th>Nationality</th>
                                <th>Role</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody id="standings" >
                            ${squads}
                        </tbody>
                    </table>
                    
            </div>
            </div>
        `;
}

function getSavedTeams() {
    getAll().then(function (teams) {
        console.log(teams);
        // Menyusun komponen card artikel secara dinamis
        let squads = "";

        teams.forEach(function (team) {
            let logoTeam = team.crestUrl.replace(/^http:\/\//i, 'https://');
            squads += `
                    <a href="./detail.html?id=${team.id}&saved=true" style="color:black;">
                        <div class="col s12 m4 l3" style="float: left; height: 40rem; margin: 0; padding: 10px; ">
                            <div class="card">
                                <div class="card-image" style="height : 15rem;">
                                <img src="${logoTeam}" style="margin: auto; padding: 1rem 1rem 0 1rem; height: 100%; width:auto; max-width: 100%; ">
                                </div>
                                <div class="card-content" style="padding-top: 0.5rem; height : 6rem;">
                                <h5><strong>${team.name}</strong></h5>
                                </div>
                                <div class="card-action">
                                <a href="/detail.html?id=${team.id}&saved=true" style="float: left; ">Read More</a>
                                </div>
                            </div>
                        </div>
                    </a>
                    `;
        });

        document.getElementById("saved").innerHTML = ` 
                    <div class="row">    
                    ${squads}
                    </div>
                `;
    });
}

function getSavedTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = parseInt(urlParams.get("id"));

    getById(idParam).then(function (team) {
        console.log(team);
        showTeamById(team);
    });
}