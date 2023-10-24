document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('state-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');
    const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    const hint = document.querySelector('.hint');
    const noResultText = document.getElementById('no-results-title');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const closenoresultstitle = document.getElementById('close-noresultstitle');
    const noresultsdiv = document.getElementById('noresultsdiv');

    searchButton.addEventListener('click', function() {
        const inputValue = formatInput(searchInput.value.trim());

        if (inputValue) {
            fetch(`https://dummyjson.com/users/filter?key=address.city&value=${inputValue}`)
                .then(res => res.json())
                .then(data => {
                    const filteredUsers = data.users;
                    displaySearchResults(filteredUsers);
                })
                .catch(error => {
                    console.error('Es ist ein Fehler bei der Abfrage aufgetreten', error);
                });
        } else {
            popup.classList.remove('hidden');
            searchInput.style.display = 'none'; // Suchleiste ausblenden
            searchButton.style.display = 'none'; // Such-Button ausblenden
            hint.style.display = 'none'; // Hinweistext ausblenden
        }
    });
    searchInput.addEventListener('keyup', function(event) {
        if(event.key == 'Enter') {
            searchButton.click();
        }
    });

    closePopup.addEventListener('click', function() {
        popup.classList.add('hidden');
        if (!searchInput.value.trim()) {
            // Nur wenn keine Eingabe vorhanden ist, wird die Seite neu geladen
            location.reload();
        }
    });
    closenoresultstitle.addEventListener('click', function() {
        noResultText.classList.add('hidden');
        closenoresultstitle.classList.add('hidden');
            location.reload();
        
    });

    function displaySearchResults(users) {
        resultsTable.innerHTML = ''; // Leere zuerst die Tabelle
        resultsContainer.classList.add('hidden'); // Verstecke das Ergebnis-Container

        if (users.length === 0) {
            // Keine Ergebnisse gefunden
            searchInput.style.display = 'none'; // Suchleiste ausblenden
            searchButton.style.display = 'none'; // Such-Button ausblenden
            hint.style.display = 'none'; // Hinweistext ausblenden
            noresultsdiv.classList.remove('hidden');
        } else {
            // Ergebnisse gefunden
            resultsContainer.classList.remove('hidden'); // Ergebnis-Container anzeigen
            const handy = window.innerWidth;
            if(handy < 768) {
                resultsTitle.style.fontSize = "15px";
            } else {
                resultsTitle.style.fontSize = "28px";
            }
            resultsTitle.textContent = `Es konnten ${users.length} Ergebnisse gefunden werden`;
            searchInput.style.display = 'none'; // Suchleiste ausblenden
            searchButton.style.display = 'none'; // Such-Button ausblenden
            hint.style.display = 'none'; // Hinweistext ausblenden

            users.forEach(user => {
                const row = resultsTable.insertRow();
                const nameCell = row.insertCell(0);
                const idCell = row.insertCell(1);

            // Erstellen eines anklickbaren Link zum Warenkorb
            const userLink = document.createElement('a');
            userLink.textContent = `${user.firstName} ${user.lastName}`;
            userLink.href = `Ergebnisse.html?userID=${user.id}`; // Leiten Sie zur Ergebnisse-Seite mit Benutzer-ID weiter
            userLink.target = '_self'; // Öffnen des Links in einem gleichen Tab

            nameCell.appendChild(userLink);
            idCell.textContent = user.id;
            });
        }
    }

  
});
//Formatiere die Eingabe von Wohnsitzen so, dass Groß- und Kleinschreibung ignoriert werden!
function formatInput(input) {
    if (input && input.length > 0) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    return input;
}


