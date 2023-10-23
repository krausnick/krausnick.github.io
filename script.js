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
            resultsTitle.style.fontSize = "15px";
            resultsTitle.textContent = `Es konnten ${users.length} Ergebnisse gefunden werden`;
            searchInput.style.display = 'none'; // Suchleiste ausblenden
            searchButton.style.display = 'none'; // Such-Button ausblenden
            hint.style.display = 'none'; // Hinweistext ausblenden

            users.forEach(user => {
                const row = resultsTable.insertRow();
                const nameCell = row.insertCell(0);
                const idCell = row.insertCell(1);

                // Erstellen Sie einen anklickbaren Link zum Benutzerprofil
            const userLink = document.createElement('a');
            userLink.textContent = `${user.firstName} ${user.lastName}`;
            userLink.href = `Ergebnisse.html?userID=${user.id}`; // Leiten Sie zur Ergebnisse-Seite mit Benutzer-ID weiter
            userLink.target = '_self'; // Öffnen Sie den Link in einem gleichen Tab

            nameCell.appendChild(userLink);
            idCell.textContent = user.id;
            });
        }
    }

    function formatInput(input) {
        // Überprüfen, ob die Eingabe vorhanden ist und mindestens einen Buchstaben enthält
        if (input && input.length > 0) {
            // Erster Buchstabe groß, Rest klein
            return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        }
        // Wenn die Eingabe ungültig ist, gebe sie unverändert zurück
        return input;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');
    console.log("Warenkörbe für " + userID);
    // Hier fügen Sie den Wert der Benutzer-ID zum Titel hinzu
    document.title = `ShoppingData.com - User ${userID}`;

    const nichtsimeinkaufswagen = document.getElementById('nichtsimeinkaufswagen');
    const nichtsimeinkaufswagenbutton = document.getElementById('nichtsimeinkaufswagenbutton');

    // Hier können Sie eine Fetch-Anfrage durchführen, um den Warenkorb dieses Benutzers abzurufen und auf der Seite anzuzeigen.
    // Verwenden Sie die Benutzer-ID (userID) in der Anfrage-URL, um den entsprechenden Warenkorb abzurufen.

    fetch(`https://dummyjson.com/users/${userID}/carts`)
    .then(res => res.json())
    .then(data => {
        const cartContainer = document.getElementById('cart-container');
        const carts = data.carts;
        if(carts.length == 0) {
            nichtsimeinkaufswagen.classList.remove('hidden');
            nichtsimeinkaufswagenbutton.classList.remove('hidden');
        } else {
        carts.forEach(cart => {
            const cartTable = document.createElement('table');
            const cartItems = cart.products;

            // Erstellen Sie die Tabellenüberschrift
            const cartCaption = document.createElement('caption');
            cartCaption.textContent = `Warenkorb ID: ${cart.id}`;
            cartTable.appendChild(cartCaption);

            // Erstellen Sie die Tabellenüberschriften (Header)
            const cartHeader = cartTable.createTHead();
            const headerRow = cartHeader.insertRow();
            const headers = ['ID', 'Titel', 'Preis', 'Menge', 'Gesamt', 'Rabatt (%)', 'Rabattierter Preis'];
            headers.forEach(headerText => {
                const headerCell = document.createElement('th');
                headerCell.textContent = headerText;
                headerRow.appendChild(headerCell);
            });

            // Füllen Sie die Tabelle mit den Cart-Items
            const cartBody = cartTable.createTBody();
            cartItems.forEach(item => {
                const itemRow = cartBody.insertRow();
                const itemData = [item.id, item.title, item.price, item.quantity, item.total, item.discountPercentage, item.discountedPrice];
                itemData.forEach(itemText => {
                    const itemCell = itemRow.insertCell();
                    itemCell.textContent = itemText;
                });
            });

            // Fügen Sie die Tabelle zum Cart-Container hinzu
            cartContainer.appendChild(cartTable);
        });
    }
    })
    .catch(error => {
        console.error('Fehler beim Abrufen des Warenkorbs', error);
    });

    nichtsimeinkaufswagenbutton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
        



});