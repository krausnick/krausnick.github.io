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
    let searchInput = document.getElementById('state-input');
    let searchButton = document.getElementById('search-button');
    let hint = document.querySelector('.hint');
    searchInput.value = '';
    searchInput.style.display = 'block';
    searchButton.style.display = 'block';
    hint.style.display = 'block';
}
function setupStartPage() {
    console.log("Java-Script der Startseite geladen!");
    let searchInput = document.getElementById('state-input');
    let searchButton = document.getElementById('search-button');
    let popup = document.getElementById('popup');
    let hint = document.querySelector('.hint');
    let closePopup = document.getElementById('close-popup');

    searchButton.addEventListener('click', function () {
        let inputValue = formatInput(searchInput.value.trim());

        if (inputValue) {
            fetch(`https://dummyjson.com/users/filter?key=address.city&value=${inputValue}`)
                .then(res => res.json())
                .then(data => {
                    let filteredUsers = data.users;
                    console.log(filteredUsers);
                    displaySearchResults(filteredUsers);
                })
                .catch(error => {
                    console.error('Es ist ein Fehler bei der Abfrage aufgetreten', error);
                });
        } else {
            popup.classList.remove('hidden');
            searchInput.style.display = 'none'; 
            searchButton.style.display = 'none'; 
            hint.style.display = 'none'; 
        }
    });
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    closePopup.addEventListener('click', function () {
        popup.classList.add('hidden');
        anzeigeStartSeite();
    });
}

function displaySearchResults(users) {
    console.log("Die Suchergebnisse bzw. User werden angezeigt!");
    let resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    let resultsContainer = document.getElementById('results-container');
    let resultsTitle = document.getElementById('results-title');
    resultsTable.innerHTML = ''; // Leere zuerst die Tabelle
    resultsContainer.classList.add('hidden'); // Verstecke das Ergebnis-Container

    let searchInput = document.getElementById('state-input');
    let searchButton = document.getElementById('search-button');
    let hint = document.querySelector('.hint');

    let noresultsdiv = document.getElementById('noresultsdiv');

    let closenoresultstitle = document.getElementById('close-noresultstitle');
    closenoresultstitle.addEventListener('click', function () {
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
        let handy = window.innerWidth;
        if (handy < 768) {
            resultsTitle.style.fontSize = "15px";
        } else {
            resultsTitle.style.fontSize = "28px";
        }
        resultsTitle.textContent = `Es konnten ${users.length} Ergebnisse gefunden werden`;
        searchInput.style.display = 'none'; // Suchleiste ausblenden
        searchButton.style.display = 'none'; // Such-Button ausblenden
        hint.style.display = 'none'; // Hinweistext ausblenden
        users.forEach(user => {
            let row = resultsTable.insertRow();
            let nameCell = row.insertCell(0);
            let idCell = row.insertCell(1);

            // Erstellen eines anklickbaren Link zum Warenkorb
            let userLink = document.createElement('a');
            userLink.textContent = `${user.firstName} ${user.lastName}`;


            userLink.addEventListener('click', function () {
                userLink.href = `#/ergebnisse/${user.id}`;
            });
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
        let nichtsimeinkaudswagencontainer = document.getElementById('nichtsimeinkaufswagencontainer');
        nichtsimeinkaudswagencontainer.classList.remove('hidden');

        nichtsimeinkaufswagenbutton.addEventListener('click', function() {
            nichtsimeinkaudswagencontainer.classList.add('hidden');
        });
    
}
function setupResultsPage() {
    console.log("Java-Script der Result-Seite geladen!");
    let einkaufswagencontainer = document.getElementById('einkaufswagen-container');
    let einkaufswagentabelle = document.getElementById('carts-table').getElementsByTagName('tbody')[0];
    let cartstitle = document.getElementById('carts-title');

    let nichtsimeinkaufswagencontainer = document.getElementById('nichtsimeinkaufswagencontainer');
    let einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');

    let url = window.location.href 
    console.log(url);
    let regex = /ergebnisse\/(.*)/; 

    let match = regex.exec(url); 

    if (match) {
        let number = match[1]; 
        console.log("Die extrahierte Zahl ist: " + number);


        einkaufswagencontainer.classList.add('hidden');
        nichtsimeinkaufswagencontainer.classList.add('hidden');
        einkauswagenitemimdetail.classList.add('hidden');

        let nichtsimeinkaufswagenbutton = document.getElementById('nichtsimeinkaufswagenbutton');
        nichtsimeinkaufswagenbutton.addEventListener('click', function() {
            window.history.back();
        });

        fetch(`https://dummyjson.com/users/${number}/carts`)
            .then(res => res.json())
            .then(data => {
                let carts = data.carts;
                if (carts.length === 0) {
                    console.log("Kein Warenkorb gefunden!");
                    nichtsimeinkaufswagencontainer.classList.remove('hidden');
                } else {
                    //Wenn der aufgerufene User einen Warenkorb hat, dann erfolgt 
                    //dessen Anzeige in tabelarischer Darstellung
                    einkaufswagencontainer.classList.remove('hidden');
                    cartstitle.textContent = `Warenkorb des Users (User ID: ${number})`;
                    //Für jedes Item aus der der carts-Ressource speichern wir den Titel 
                    //und den Preis in einem Zeileneintrag in der Tabelle
                    if (einkaufswagentabelle) {
                        while (einkaufswagentabelle.rows.length > 0) {
                            einkaufswagentabelle.deleteRow(0);
                        }
                    }
                    carts.forEach(produktauswarenkorb => {


                        let einkaufswagentabelle = document.getElementById('carts-table').getElementsByTagName('tbody')[0];
                        einkaufswagentabelle.innerHTML = '';

                        produktauswarenkorb.products.forEach(item => {
                            let row = einkaufswagentabelle.insertRow();
                            let titelCell = row.insertCell(0);
                            let preisCell = row.insertCell(1);
                            let itemLink = document.createElement('a');
                            itemLink.textContent = item.title;
                            itemLink.addEventListener('click', () => {
                                console.log("Die Detailansicht des geklickten Items!");
                                itemLink.href = `#/item/${item.id}`;
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
    } else {
        console.log("Es wurde keine Übereinstimmung gefunden");
    }


}
function setupItemPage() {
    console.log("Java Script der Detailsicht des Items geladen!");

    let url = window.location.href 
    console.log(url);
    let regex = /item\/(.*)/; 

    let match = regex.exec(url); 
    let itemid = match[1]; 
    console.log(itemid);

    fetch(`https://dummyjson.com/products/${itemid}`)
        .then(res => res.json())
        .then(data => {
            let item = data;
            console.log(item);
            let itemstable = document.getElementById('items-table').getElementsByTagName('tbody')[0];
            itemstable.innerHTML = '';
            let einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');
            let einkaufswagencontainer = document.getElementById('einkaufswagen-container');
            let itemImDetailTitel = document.getElementById('itemImDetailTitel');
            einkaufswagencontainer.classList.add('hidden');
            einkauswagenitemimdetail.classList.remove('hidden');
            itemImDetailTitel.textContent = `${item.title}`;

            let row = itemstable.insertRow();
            let mengeCell = row.insertCell(0);
            let preisgesamtCell = row.insertCell(1);

            mengeCell.textContent = item.category;
            preisgesamtCell.textContent = item.brand;
        })
        .catch(error => {
            console.error("Item konnte nicht gefunden werden!", error);
        })

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
            url: /^\/$/,
            show: () => { 
                setupStartPage();
                swapContent("page-start", "Startseite");
            },
        },
        {
            url: /^\/ergebnisse\/(.*)/,
            show: () => { 
                setupResultsPage();
                swapContent("page-ergebnisse", "Ergebnisse");
            },
        },
        {
            url: /^\/item\/(.*)/,
            show: () => { 
                setupItemPage();
                swapContent("item-ergebnis", "Detailansicht");
            },
        }
    ];
    

    let router = new Router(routes);
    router.start();
});
