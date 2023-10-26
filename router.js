class Router {
    constructor(routes) {
        this._routes = routes;
        this._started = false;

        window.addEventListener("hashchange", () => this._handleRouting());
    }

    start() {
        this._started = true;
        this._handleRouting();
    }

    stop() {
        this._started = false;
    }

    _handleRouting() {
        let url = location.hash.slice(1); 

        if (url.length === 0) {
            url = "/";
        }

        let matches = null;
        let route = this._routes.find(p => matches = url.match(p.url));

        if (!route) {
            console.error(`Keine Route zur URL ${url} gefunden!`);
            return;
        }

        route.show(matches);
    }
}
function anzeigeStartSeite() {
    const searchInput = document.getElementById('state-input');
    const searchButton = document.getElementById('search-button');
    const hint = document.querySelector('.hint');
    searchInput.value = '';
    searchInput.style.display = 'block';
    searchButton.style.display = 'block';
    hint.style.display = 'block';
}
function setupStartPage() {
    console.log("Java-Script der Startseite geladen!");
    const searchInput = document.getElementById('state-input');
    const searchButton = document.getElementById('search-button');
    const popup = document.getElementById('popup');
    const hint = document.querySelector('.hint');
    const closePopup = document.getElementById('close-popup');

    searchButton.addEventListener('click', function() {
        const inputValue = formatInput(searchInput.value.trim());

        if (inputValue) {
            fetch(`https://dummyjson.com/users/filter?key=address.city&value=${inputValue}`)
                .then(res => res.json())
                .then(data => {
                    const filteredUsers = data.users;
                    console.log(filteredUsers);
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
        anzeigeStartSeite();
    });

    // Hier kannst du den JavaScript-Code spezifisch für die Startseite einfügen
    // Füge Funktionen und Logik für die Startseite hinzu.
    // Zum Beispiel: Event-Listener, API-Anfragen, usw.
}
var geklickteuserid = '';

function displaySearchResults(users) {
    console.log("Die Suchergebnisse bzw. User werden angezeigt!");
    const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    const resultsContainer = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');
    const searchcontainer = document.getElementById('search-container');
    resultsTable.innerHTML = ''; // Leere zuerst die Tabelle
    resultsContainer.classList.add('hidden'); // Verstecke das Ergebnis-Container

    const searchInput = document.getElementById('state-input');
    const searchButton = document.getElementById('search-button');
    const hint = document.querySelector('.hint');

    const noresultsdiv = document.getElementById('noresultsdiv');
    const noResultText = document.getElementById('no-results-title');

    const closenoresultstitle = document.getElementById('close-noresultstitle');
    closenoresultstitle.addEventListener('click', function() {
        noresultsdiv.classList.add('hidden');
            anzeigeStartSeite();
        
    });

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
        userLink.href = `#/ergebnisse/`; 
        
        
        userLink.addEventListener('click', function() {
            geklickteuserid = '';
            geklickteuserid = user.id;
        });
        
        
        
        
        // Leiten Sie zur Ergebnisse-Seite mit Benutzer-ID weiter
    // Öffnen des Links in einem gleichen Tab

        nameCell.appendChild(userLink);
        idCell.textContent = user.id;
        });
    }
}
function formatInput(input) {
    if (input && input.length > 0) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    return input;
}
function keineItemsImEinkauwagen() {
        const nichtsimeinkaudswagencontainer = document.getElementById('nichtsimeinkaufswagencontainer');
        nichtsimeinkaudswagencontainer.classList.remove('hidden');

        nichtsimeinkaufswagenbutton.addEventListener('click', function() {
            window.location.href = '#/';
            nichtsimeinkaudswagencontainer.classList.add('hidden');
        });
    
}
function setupResultsPage() {
    console.log("Java-Script der Result-Seite geladen!");
    const einkaufswagencontainer = document.getElementById('einkaufswagen-container');
    const einkaufswagentabelle = document.getElementById('carts-table').getElementsByTagName('tbody')[0];
    const cartstitle = document.getElementById('carts-title');

    console.log(geklickteuserid);

    fetch(`https://dummyjson.com/users/${geklickteuserid}/carts`)
    .then(res => res.json())
    .then(data => {
        const carts = data.carts;
        if(carts.length == 0) {
            //Falls der aufgerufene User keinen Warenkorb hat, wird 
            //folgende Funktion aufgerufen
            keineItemsImEinkauwagen();
        } else {
            //Wenn der aufgerufene User einen Warenkorb hat, dann erfolgt 
            //dessen Anzeige in tabelarischer Darstellung
        einkaufswagencontainer.classList.remove('hidden');
        cartstitle.textContent = `Warenkorb des Users (User ID: ${geklickteuserid})`;
        //Für jedes Item aus der der carts-Ressource speichern wir den Titel 
        //und den Preis in einem Zeileneintrag in der Tabelle
        carts.forEach(produktauswarenkorb => {
            produktauswarenkorb.products.forEach(item => {
                const row = einkaufswagentabelle.insertRow();
                const titelCell = row.insertCell(0);
                const preisCell = row.insertCell(1);

                const itemLink = document.createElement('a');
                itemLink.textContent = item.title;
                //Füge jedem Namen der Items die Möglichkeit hinzu
                //auf ihn zu klicken um in die Detailansicht des 
                //Items zu gelangen, für die Detailansicht wird 
                //die Funktion aufgerufen und das spezifische Item 
                //aus dem Warenkorb übergeben
                titelCell.addEventListener('click', () => {
                    console.log("Die Detailansicht des geklickten Items!");
                    const itemstable = document.getElementById('items-table').getElementsByTagName('tbody')[0];
                    const einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');
                    const einkaufswagencontainer = document.getElementById('einkaufswagen-container');
                    const itemImDetailTitel = document.getElementById('itemImDetailTitel');
                    einkaufswagencontainer.classList.add('hidden');
                    einkauswagenitemimdetail.classList.remove('hidden');
                    itemImDetailTitel.textContent = `${item.title}`;

                const row = itemstable.insertRow();
                const mengeCell = row.insertCell(0);
                const preisgesamtCell = row.insertCell(1);

                mengeCell.textContent = item.quantity;
                preisgesamtCell.textContent = item.total;
                });
                titelCell.appendChild(itemLink);
                preisCell.textContent = item.price;
            });
        });
    }
    })
    .catch(error => {
        console.error('Fehler beim Abrufen des Warenkorbs', error);
    });

}

window.addEventListener("load", () => {
    let swapContent = (id, title) => {
        document.querySelectorAll("main").forEach(mainElement => {
            mainElement.classList.add("hidden");
        })

        let element = document.querySelector(`#${id}`);
        if (element) element.classList.remove("hidden");

        document.title = `${title} | ShoppingData.com`;
    }

    let routes = [
        {
            url: "^/$",
            show: () => { setupStartPage();
                swapContent("page-start", "Startseite");
            },
        },
        {
            url: "^/ergebnisse/$",
            show: () => { setupResultsPage();
                swapContent("page-ergebnisse", "Ergebnisse");
            },
        }
    ];

    let router = new Router(routes);
    router.start();
});
