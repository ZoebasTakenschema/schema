// Voor het inladen van het Excel-bestand
let wedstrijdData = [];
let teams = {
    'Team A': [],
    'Team B': []
};

// Functie om het Excel-bestand te uploaden en te verwerken
function uploadExcel() {
    const file = document.getElementById('excelFile').files[0];
    if (!file) return alert('Kies een bestand om te uploaden.');

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        wedstrijdData = jsonData;
        displayWedstrijden();
    };
    reader.readAsBinaryString(file);
}

// Functie om de wedstrijden weer te geven in de tabel
function displayWedstrijden() {
    const tableBody = document.querySelector("#wedstrijdTable tbody");
    tableBody.innerHTML = ''; // Clear any existing rows

    wedstrijdData.forEach(wedstrijd => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${wedstrijd['wedstrijddatum']}</td>
            <td>${wedstrijd['thuisteam']}</td>
            <td>${wedstrijd['uitteam']}</td>
            <td>${wedstrijd['scheidsrechter1'] || ''}</td>
            <td>${wedstrijd['scheidsrechter2'] || ''}</td>
            <td>${wedstrijd['timer'] || ''}</td>
            <td>${wedstrijd['scorer'] || ''}</td>
            <td>${wedstrijd['24sec-operator'] || ''}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Functie om spelers aan teams toe te wijzen
function assignPlayers() {
    const teamAInput = document.getElementById('teamA').value.split(',').map(name => name.trim());
    const teamBInput = document.getElementById('teamB').value.split(',').map(name => name.trim());
    
    teams['Team A'] = teamAInput;
    teams['Team B'] = teamBInput;

    // Werk het wedstrijdschema bij door willekeurige spelers toe te wijzen
    wedstrijdData.forEach(wedstrijd => {
        if (teams[wedstrijd['thuisteam']] && teams[wedstrijd['uitteam']]) {
            wedstrijd['scheidsrechter1'] = getRandomPlayer(teams[wedstrijd['thuisteam']]);
            wedstrijd['scheidsrechter2'] = getRandomPlayer(teams[wedstrijd['uitteam']]);
            wedstrijd['timer'] = getRandomPlayer(teams[wedstrijd['thuisteam']]);
            wedstrijd['scorer'] = getRandomPlayer(teams[wedstrijd['uitteam']]);
            wedstrijd['24sec-operator'] = getRandomPlayer(teams[wedstrijd['thuisteam']]);
        }
    });

    displayWedstrijden();
}

// Functie om willekeurige speler te selecteren
function getRandomPlayer(team) {
    const randomIndex = Math.floor(Math.random() * team.length);
    return team[randomIndex];
}
