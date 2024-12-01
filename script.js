const leagueID = 357; // The year and league id doesn't change, so they are constants
const year = 2022;

async function getTeamsInLeague() {
    if (!document.getElementById('team-container')) { // this only runs if the teamsContainer hasn't been made yet
    const allTeams = await fetchTeamsInLeague();
    console.log(allTeams);

    const teamContainer = document.createElement('div')
    teamContainer.className = 'team-container';
    teamContainer.id = 'team-container'
    document.body.appendChild(teamContainer)

    allTeams.response.forEach(i => { // for every team in the response
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';

        const teamImage = document.createElement('img');
        teamImage.src = i.team.logo;
        teamImage.alt = i.team.name;
        teamCard.appendChild(teamImage);

        const teamDetails = document.createElement('div');
        teamDetails.className = 'team-details';

        const teamName = document.createElement('h1');
        teamName.textContent = i.team.name;
        teamDetails.appendChild(teamName);

        const teamFounded = document.createElement('h3');
        teamFounded.textContent = "Founded: " + i.team.founded;
        teamDetails.appendChild(teamFounded);

        const stadiumName = document.createElement('h3');
        stadiumName.textContent = "Stadium Name: " + i.venue.name;
        teamDetails.appendChild(stadiumName);

        const stadiumCapacity = document.createElement('h3');
        stadiumCapacity.textContent = "Stadium Capacity: " + i.venue.capacity;
        teamDetails.appendChild(stadiumCapacity);

        const stadiumAddress = document.createElement('h3');
        stadiumAddress.textContent = "Stadium Address: " + i.venue.address + ", " + i.venue.city;
        teamDetails.appendChild(stadiumAddress);

        const teamButton = document.createElement('button');
        teamButton.id = i.team.id;
        teamButton.textContent = "See Players";
        teamButton.setAttribute('onclick', `getPlayersFromTeam(${i.team.id})`); // make the button, when clicked it runs the getPlayersFromTeam function, with the team id passed in as a arguement
        teamDetails.appendChild(teamButton);

        teamCard.appendChild(teamDetails);
        teamContainer.appendChild(teamCard);
    });
}
};

async function fetchTeamsInLeague() {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${leagueID}&season=${year}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '12c3ec53b0msha444e311dcb662fp19498bjsn43c7861443f4',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getPlayersFromTeam(teamID) {
    if (!!document.getElementById('playerContainerTitle')) { //  this only runs if the playerContainerTitle has been made
        document.getElementById('playerContainerTitle').remove(); // delete the playerContainerTitle element
    }
    const playerContainerTitle = document.createElement('h1');
    playerContainerTitle.innerHTML = 'All Players';
    playerContainerTitle.id = 'playerContainerTitle';
    document.body.appendChild(playerContainerTitle);
    
    if (!!document.getElementById('playerContainer')) { //  this only runs if the playerContainerTitle has been made
        document.getElementById('playerContainer').remove() // delete the playerContainerTitle element
    }
    const playerContainer = document.createElement('div');
    playerContainer.id = 'playerContainer';
    playerContainer.className = 'player-container';
    document.body.appendChild(playerContainer);

    const teamInfo = await fetchPlayersFromTeam(teamID);
    console.log(teamInfo);

    teamInfo.response.forEach(i => {  // for every team in the response
        const checkedPositions = choosePositions();

        if (checkedPositions.includes(i.statistics[0].games.position)) {
            const playerCard = document.createElement('div');
            playerCard.classList = 'player-card';
    
            const playerImage = document.createElement('img');
            playerImage.src = i.player.photo;
            playerImage.alt = i.player.firstname + " " + i.player.lastname;
            playerCard.appendChild(playerImage);
    
            const playerDetails = document.createElement('div');
            playerDetails.className = 'player-details';
    
            const playerName = document.createElement('h3');
            playerName.textContent = i.player.firstname + " " + i.player.lastname;
            playerDetails.appendChild(playerName);
    
            const playerPosition = document.createElement('h3');
            playerPosition.textContent = "Position: " + i.statistics[0].games.position; // statistics is divivied by leagues, but premier division is alwats first, so it's set to check [0]
            playerDetails.appendChild(playerPosition);
    
            const playerAge = document.createElement('h3');
            playerAge.textContent = "Age: " + i.player.age;
            playerDetails.appendChild(playerAge);
    
            const playerNationality = document.createElement('h3');
            playerNationality.textContent = "Nationality: " + i.player.nationality;
            playerDetails.appendChild(playerNationality);
    
            const playerAppearences = document.createElement('h3');
            playerAppearences.textContent = `Appearances in the ${year} premier division: ${i.statistics[0].games.appearences}`;
            playerDetails.appendChild(playerAppearences);
    
            playerCard.appendChild(playerDetails);
            playerContainer.appendChild(playerCard);
        }
    });
}

async function fetchPlayersFromTeam(teamID) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/players?team=${teamID}&season=${year}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '12c3ec53b0msha444e311dcb662fp19498bjsn43c7861443f4',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

function choosePositions() {
    const checkedPositions = []; // list for checked boxes
    
    if (document.getElementById("GoalkeeperCheckbox").checked) // if this checkbox is checked...
        checkedPositions.push("Goalkeeper"); // add the position to the list
    if (document.getElementById("DefenderCheckbox").checked)
        checkedPositions.push("Defender");
    if (document.getElementById("MidfielderCheckbox").checked)
        checkedPositions.push("Midfielder");
    if (document.getElementById("AttackerCheckbox").checked)
        checkedPositions.push("Attacker");

    return checkedPositions; // return the list
}