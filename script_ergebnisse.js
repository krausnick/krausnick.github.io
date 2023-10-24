document.addEventListener('DOMContentLoaded', function() {
    //Die User ID aus der URL getten um dessen Warenkorb über die Refrenz der UserID 
    //abfragen zu können
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');
    const einkaufswagencontainer = document.getElementById('einkaufswagen-container');
    const einkaufswagentabelle = document.getElementById('carts-table').getElementsByTagName('tbody')[0];
    const cartstitle = document.getElementById('carts-title');

    fetch(`https://dummyjson.com/users/${userID}/carts`)
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
        document.title = `ShoppingData.com - User ${userID}`;
        cartstitle.textContent = `Warenkorb des Users (User ID: ${userID})`;
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
                    zeigeDetailsDesItemsAn(item);
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

   
    //Diese Funktion wird aufgerufen wenn man die Detailansicht eines bestimmten
    //Items aus der Warenkorbliste aufruft
    function zeigeDetailsDesItemsAn(item) {
        const itemstable = document.getElementById('items-table').getElementsByTagName('tbody')[0];
        const einkauswagenitemimdetail = document.getElementById('einkauswagenitemimdetail');
        const itemImDetailTitel = document.getElementById('itemImDetailTitel');
        einkaufswagencontainer.classList.add('hidden');
        einkauswagenitemimdetail.classList.remove('hidden');
        itemImDetailTitel.textContent = `${item.title}`;
    
                const row = itemstable.insertRow();
                const mengeCell = row.insertCell(0);
                const preisgesamtCell = row.insertCell(1);
    
                mengeCell.textContent = item.quantity;
                preisgesamtCell.textContent = item.total;
    }
});
//Diese Funktion wird bei keinem gefundenen Warenkorb aufgerufen
function keineItemsImEinkauwagen() {
    const nichtsimeinkaudswagencontainer = document.getElementById('nichtsimeinkaufswagencontainer');
    nichtsimeinkaudswagencontainer.classList.remove('hidden');
        document.title = `ShoppingData.com - kein User`;
}
//Füge dem return-button ein event hinzu, dass man zurück auf die Startseite kommt
nichtsimeinkaufswagenbutton.addEventListener('click', function() {
    window.location.href = 'index.html';
});