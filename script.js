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
//Funktion die die Suchseite der ersten Main-Page settet!
function anzeigeStartSeite() {
    //Suchleiste & Suchbutton & Hinweistext von "page-start" einblenden
    let searchInput = document.getElementById('state-input');
    let searchButton = document.getElementById('search-button');
    let hint = document.querySelector('.hint');
    searchInput.value = '';
    searchInput.style.display = 'block';
    searchButton.style.display = 'block';
    hint.style.display = 'block';
}
//Hier wird der Script-Code für die Main: page-start geladen!
function setupStartPage() {
    console.log("Java-Script der Startseite geladen!");
    let searchInput = document.getElementById('state-input');
    let searchButton = document.getElementById('search-button');
    let popup = document.getElementById('popup');
    let hint = document.querySelector('.hint');
    let closePopup = document.getElementById('close-popup');

    searchButton.addEventListener('click', function () {
        //Der Eingabe-Wert wird durch die funktion "formatInput" jeweilig formatiert zurückgegeben,
        //damit die Groß- und Kleinschreibung egal ist 
        let inputValue = formatInput(searchInput.value.trim());

        if (inputValue) {
            fetch(`https://dummyjson.com/users/filter?key=address.city&value=${inputValue}`)
                .then(res => res.json())
                .then(data => {
                    let filteredUsers = data.users;
                    console.log(filteredUsers);
                    //Selektierte User werden in Funktion "displaySearchResults" übergeben
                    //und Funktion wird aufgerufen
                    displaySearchResults(filteredUsers);
                })
                .catch(error => {
                    console.error('Es ist ein Fehler bei der Abfrage aufgetreten', error);
                });
        } else {
            //Hier wird der Hinweistext eingeblendet, 
            //falls der User keine Eingabe tätigt und die Suche startet
            popup.classList.remove('hidden');
            searchInput.style.display = 'none'; 
            searchButton.style.display = 'none'; 
            hint.style.display = 'none'; 
        }
    });
    //Hier wird ermöglicht, dass man auch durch die Enter-Taste die Suche starten kann,
    //ohne auf den Button klicken zu müssen
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    //Um wieder Suchstartseite einblenden, wenn man auf Zurück-Button klickt
    closePopup.addEventListener('click', function () {
        popup.classList.add('hidden');
        anzeigeStartSeite();
    });
}
//Funktion die bei der ersten Main-Page die Userergebnisse darstellt
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

            // Erstellen eines anklickbaren Link zum Warenkorb
            let userLink = document.createElement('a');
            userLink.textContent = `${user.firstName} ${user.lastName}`;

            //Jedem Namen des Users wird Listener hinzugefügt, dass man auf die andere Main-Page kommt,
            //also die den Warenkorb des aufgerufenen Users darstellt, Hierbei wird auch die 
            //jeweilige UserID in die URL übergeben, um diese später wieder zugetten um über diese
            //in der Ressource "carts" den jeweiligen Warenkorb zu finden
            userLink.addEventListener('click', function () {
                userLink.href = `#/ergebnisse/${user.id}`;
            });
            nameCell.appendChild(userLink);
            idCell.textContent = user.id;
        });


    }
}
//Durch diese Funktion ist bei der Eingabe des Wohnortes für die Suche der jeweiligen User, die Groß- und 
//Kleinschreibung egal!
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
//Hier wird der Script-Code für die Main: page-ergebnisse geladen!
function setupResultsPage() {
    console.log("Java-Script der Result-Seite geladen!");
    let einkaufswagencontainer = document.getElementById('einkaufswagen-container');
    let einkaufswagentabelle = document.getElementById('carts-table').getElementsByTagName('tbody')[0];
    let cartstitle = document.getElementById('carts-title');

    let nichtsimeinkaufswagencontainer = document.getElementById('nichtsimeinkaufswagencontainer');
    let einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');

    let url = window.location.href //Die URL speichern in Variable "url"
    console.log(url); //Ausgabe der URL in Konsole um Konsistenz zu prüfen
    let regex = /ergebnisse\/(.*)/; //Hier wird die Regex-Regel festgelegt

    let match = regex.exec(url); 
    //Hier wird aus der URL die jeweilige UserID extrahiert um mithilfe dieser
    //später dann den Warenkorb zu ermitteln

    if (match) {
        let number = match[1]; //Match ist ein Array und über Index 1 wird die extrahierte UserID  in Variable 
                                //"Number" gespeichert
        console.log("Die extrahierte Zahl ist: " + number); 
        //Konsolenausgabe der extrahierten UserID um Konsistenz und erfolgreiche Extrahierung festzustellen!


        einkaufswagencontainer.classList.add('hidden');
        nichtsimeinkaufswagencontainer.classList.add('hidden');
        einkauswagenitemimdetail.classList.add('hidden');

        let nichtsimeinkaufswagenbutton = document.getElementById('nichtsimeinkaufswagenbutton');
        nichtsimeinkaufswagenbutton.addEventListener('click', function() {
            window.history.back();
        });
        //Hier wird die extrahierte UserID in der Variable "number" bei der fetch-Abfrage übergeben um den 
        //zugehörigen Warenkorb zu ermitteln
        fetch(`https://dummyjson.com/users/${number}/carts`)
            .then(res => res.json())
            .then(data => {
                let carts = data.carts;
                if (carts.length === 0) {
                    //Falls der User keinen Warenkorb hat!
                    console.log("Kein Warenkorb gefunden!");
                    nichtsimeinkaufswagencontainer.classList.remove('hidden');
                } else {
                    //Wenn der aufgerufene User einen Warenkorb hat, dann erfolgt 
                    //dessen Anzeige in tabelarischer Darstellung
                    einkaufswagencontainer.classList.remove('hidden');
                    cartstitle.textContent = `Warenkorb des Users (User ID: ${number})`;
                    //Für jedes Item aus der der carts-Ressource speichern wir den Titel 
                    //und den Preis in einem Zeileneintrag in der Tabelle


                    //Hier leeren wir die Tabelle um konsistente und richtige Daten für 
                    //den jeweiligen Warenkorb zu setzen 
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
                            //Jedem Item aus dem Warenkorb, Event-Listener hinzufügen
                            //das man durch das klicken auf das Item auf eine neue Main-Page
                            //geleitet wird die "item-ergebnis"
                            //Hier erfolgt das gleiche Prinzip, dass in die URL zusätzlich die ItemID
                            //des geklickten Items übergeben wird um später diese extrahieren zu können 
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
//Hier wird der Script-Code für die Main: item-ergebnis geladen! 
function setupItemPage() {
    console.log("Java Script der Detailsicht des Items geladen!");

    //Gleiches Vorgehen wie auch bei der Results-Page, dieses mal wird aber nicht die UserID gegettet,
    //sondern die jeweilige ItemID worauf der User vorherig geklickt hat
    //Mit dieser ItemID werden die weiteren abgefragten Details des jeweiligen Items abgerufen aus der
    //Ressource "products", da jedes Item aus einem Warenkorb, einen jeweiligen Datensatz in der Ressource
    //"products" vorweist. In diesem stehen Informationen über das Item wie Beschreibung, Brand etc.
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
//Notwendige Methode, dass entsprechend der Main-Content geswaped wird also Single-Page-Prinzip, mit zusätzlichem
//Aufruf für jeweilige Funktion die den notwendigen Skript-Code für die jeweilige Main-Page läd!
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
