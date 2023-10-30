
//Die Klasse "Router" 1:1 übernommen wie sie bereitgestellt wurde um SPA-Prinzip mit Router-Klasse umzusetzen!

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

/* 
    Diese Funktion zeigt die Suchleiste, den Suchbutton und einen Hinweistext auf der Startseite an, 
    indem sie die entsprechenden HTML-Elemente einblendet. 
*/


function anzeigeStartSeite() {
    let searchInput = document.getElementById('state-input');
    let searchButton = document.getElementById('search-button');
    let hint = document.querySelector('.hint');
    searchInput.value = '';
    searchInput.style.display = 'block';
    searchButton.style.display = 'block';
    hint.style.display = 'block';
}

/*  
    In der setupStartPage-Funktion wird die Hauptfunktionalität für die Startseite implementiert, 
    wozu auch die Verlinkung der Benutzer in den Suchergebnissen gehört. Diese Verlinkung ermöglicht es Benutzern, 
    auf einen bestimmten Benutzer in den Suchergebnissen zu klicken, um weitere Details anzuzeigen:

    1. Die setupStartPage-Funktion reagiert auf das Klickereignis des Suchbuttons oder die Eingabe der Enter-Taste, 
    nachdem der Benutzer einen Suchbegriff eingegeben hat. Dies ist der Ausgangspunkt für die Suche nach Benutzern.

    2. Bevor die Suche durchgeführt wird, wird die Funktion formatInput aufgerufen, um sicherzustellen, 
    dass die Eingabe des Benutzers formatiert ist. Diese Formatierung umfasst die Großschreibung des ersten Buchstabens 
    und die Kleinschreibung des restlichen Textes. Dadurch ist die Groß- und Kleinschreibung bei der Sucheingabe irrelevant. 

    3. Nach der Formatierung wird eine API-Anfrage an den Server gesendet, um die Benutzer zu erhalten, 
    die dem eingegebenen Suchbegriff bzw. Wonhort entsprechen. 
    Die Ergebnisse werden in der displaySearchResults-Funktion verarbeitet.
*/

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

/* 
    4. In der displaySearchResults-Funktion werden die selektierten User in einer Tabelle, mit Name und UserID, 
    auf der Startseite angezeigt. 
    Für jeden Benutzer in den Suchergebnissen wird ein anklickbarer Link erstellt. 
    5. Diese Links sind so programmiert, dass sie auf die Ergebnisseite für den jeweiligen Benutzer verweisen. 
    Wenn ein Benutzer auf seinen Namen klickt, wird die URL geändert, und die Benutzer-ID wird als Parameter übergeben.

    Durch diese Verlinkung und die Verwendung der Benutzer-ID in der URL ermöglicht 
    die setupStartPage-Funktion die Navigation zu den Warenkorbdetails eines bestimmten Benutzers, 
    also auf die Main-Page "page-ergebnisse", 
    nachdem dieser in den Suchergebnissen ausgewählt wurde. 
 */

function displaySearchResults(users) {
    console.log("Die Suchergebnisse bzw. User werden angezeigt!");
    let resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    let resultsContainer = document.getElementById('results-container');
    let resultsTitle = document.getElementById('results-title');
    resultsTable.innerHTML = ''; // Die Tabelle jedes Mal leeren, vor erneuter Erstellung
    resultsContainer.classList.add('hidden');

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

/*
    Durch diese Funktion wird bei der Eingabe des Wohnortes für die Suche der jeweiligen User, die Groß- und 
    Kleinschreibung ignoriert!
*/

function formatInput(input) {
    if (input && input.length > 0) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    return input;
}

/* 
    Die setupResultsPage-Funktion ist verantwortlich für die Darstellung der Ergebnisseite, 
    auf der die Warenkorbdetails eines ausgewählten Benutzers angezeigt werden. 

    6. Die setupResultsPage-Funktion beginnt damit, die aktuelle URL der Seite zu erfassen. 
    Mithilfe einer Regulären Ausdrucks (Regex) wird die Benutzer-ID aus der URL extrahiert.
    Die Benutzer-ID ist ein wichtiger Parameter, da sie verwendet wird, 
    um die Warenkorbdetails des ausgewählten Benutzers abzurufen.

    7. Nachdem die Benutzer-ID erfolgreich extrahiert wurde, überprüft die Funktion, 
    ob es für diesen Benutzer einen Warenkorb gibt. Wenn kein Warenkorb vorhanden ist, 
    wird eine Nachricht angezeigt, die dem Benutzer mitteilt, dass kein Warenkorb gefunden wurde.
    Dies geschieht durch das Ein- und Ausblenden entsprechender HTML-Elemente.

    8. Wenn ein Warenkorb für den ausgewählten Benutzer vorhanden ist, 
    ruft die Funktion die Warenkorbdetails von der API ab. Dies erfolgt durch eine Fetch-Anfrage an den Server. 
    Die Benutzer-ID wird verwendet, um den entsprechenden Warenkorb zu identifizieren.

    9. Nach dem erfolgreichen Abrufen der Warenkorbdetails werden diese in einer Tabelle auf der Seite angezeigt. 
    Dafür wird die HTML-Tabelle aktualisiert, indem Zeilen für jedes Produkt im Warenkorb erstellt werden. 
    Die Produkttitel und Preise werden in den Tabellenzellen platziert.

    10. Gleiches Prinzip wie bei der displaySearchResults-Funktion: 
    Für jedes Item aus dem Warenkorb wird ein anklickbarer Link erstellt.
    Die ItemID des geklickten Items wird in URL übergeben und entsprechende 
    Main-Page "item-ergebnis" & setupItemPage-Funktion wird geswapped bzw. aufgerufen.
*/

function setupResultsPage() {
    console.log("Java-Script der Result-Seite geladen!");
    let einkaufswagencontainer = document.getElementById('einkaufswagen-container');
    let einkaufswagentabelle = document.getElementById('carts-table').getElementsByTagName('tbody')[0];
    let cartstitle = document.getElementById('carts-title');

    let nichtsimeinkaufswagencontainer = document.getElementById('nichtsimeinkaufswagencontainer');
    let einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');

    let url = window.location.href 
    console.log(url); //Ausgabe der URL in Konsole um Konsistenz zu prüfen
    let regex = /ergebnisse\/(.*)/; 

    let match = regex.exec(url);

    if (match) {
        let number = match[1]; 
        console.log("Die extrahierte Zahl ist: " + number);
        //Konsolenausgabe der extrahierten UserID um Konsistenz und erfolgreiche Extrahierung festzustellen!


        einkaufswagencontainer.classList.add('hidden');
        nichtsimeinkaufswagencontainer.classList.add('hidden');
        einkauswagenitemimdetail.classList.add('hidden');

        let nichtsimeinkaufswagenbutton = document.getElementById('nichtsimeinkaufswagenbutton');
        nichtsimeinkaufswagenbutton.addEventListener('click', function () {
            window.history.back();
        });
        fetch(`https://dummyjson.com/users/${number}/carts`)
            .then(res => res.json())
            .then(data => {
                let carts = data.carts;
                if (carts.length === 0) {
                    //Falls der User keinen Warenkorb hat!
                    console.log("Kein Warenkorb gefunden!");
                    nichtsimeinkaufswagencontainer.classList.remove('hidden');
                } else {
                    einkaufswagencontainer.classList.remove('hidden');
                    cartstitle.textContent = `Warenkorb des Users (User ID: ${number})`;

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

/* 
    11. Item-ID wird aus der URL extrahiert nach gleichem Prinzip wie oben

    12. Nachdem die Item-ID erfolgreich aus der URL extrahiert wurde, verwendet die Funktion diese, 
    um die Details des Elements (die Marke und die Kategorie) aus der API abzurufen.

    13. Nach dem Abrufen der Elementdetails werden diese Informationen (Titel, Marke und Kategorie) auf der Seite angezeigt
*/

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
            //Hier wird die ItemID auf der Konsole ausgegeben um erfolgreiche Extrahierung nachzuvollziehen!
            let itemstable = document.getElementById('items-table').getElementsByTagName('tbody')[0];
            itemstable.innerHTML = '';
            let einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');
            let einkaufswagencontainer = document.getElementById('einkaufswagen-container');
            let itemImDetailTitel = document.getElementById('itemImDetailTitel');
            einkaufswagencontainer.classList.add('hidden');
            einkauswagenitemimdetail.classList.remove('hidden');
            itemImDetailTitel.textContent = `${item.title}`; //Der Titel des Items

            let row = itemstable.insertRow();
            let kategoryCell = row.insertCell(0);
            let brandCell = row.insertCell(1);

            kategoryCell.textContent = item.category; //Die zugehörige Kategorie des Items
            brandCell.textContent = item.brand; //Die Marke des Items
        })
        .catch(error => {
            console.error("Item konnte nicht gefunden werden!", error);
        })

}

/*
    Notwendige Methode, dass entsprechend der Main-Content geswaped wird also Single-Page-Prinzip, 
    mit zusätzlichem Aufruf für jeweilige Funktion die den notwendigen Skript-Code für die jeweilige Main-Page läd!
*/

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
