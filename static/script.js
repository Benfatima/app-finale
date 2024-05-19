// script.js
document.addEventListener('DOMContentLoaded', function () {
    var taillePopulationContainer = document.getElementById('taillePopulationContainer');
    var nbrGenerationsContainer = document.getElementById('nbrGenerationsContainer');
    var tauxMutationContainer = document.getElementById('tauxMutationContainer');
    var nbrFourmisContainer = document.getElementById('nbrFourmisContainer');

    var radioButtons = document.querySelectorAll('input[name="algorithme"]');

    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('change', function () {
            if (this.value === 'genetique') {
                // Afficher les champs spécifiques à l'algorithme génétique
                taillePopulationContainer.style.display = 'flex';
                nbrGenerationsContainer.style.display = 'flex';
                tauxMutationContainer.style.display = 'flex';
                nbrFourmisContainer.style.display = 'none';
            } else if (this.value === 'Algo_Fourmis') {
                // Afficher les champs spécifiques à l'algorithme des loups gris
                taillePopulationContainer.style.display = 'none';
                nbrGenerationsContainer.style.display = 'none';
                tauxMutationContainer.style.display = 'none';
                nbrFourmisContainer.style.display = 'flex';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Récupérer le bouton et ajouter un gestionnaire d'événements
    const commencerBtn = document.getElementById('commencerBtn');
    commencerBtn.addEventListener('click', function () {
        // Récupérer les valeurs des champs
        var capacite = document.getElementById('capacité-bin').value;
        var dimensions = document.getElementById('dimensions').value;
        if (capacite === '' ) {
            // Afficher un message d'alerte
            alert('Veuillez saisir la capacité des bacs .');}
        if (dimensions === '' ) {
                // Afficher un message d'alerte
            alert('Veuillez saisir les dimensions de vos objets des bacs .');}
        
        const capaciteBin = parseInt(document.getElementById('capacité-bin').value);
        const dimensionsObjets = JSON.parse(document.getElementById('dimensions').value).map(Number);

        // Récupérer la valeur de l'algorithme sélectionné
        const algorithmeSelectionneInput = document.querySelector('input[name="algorithme"]:checked');
        let parametres = {};
        if (algorithmeSelectionneInput) {
            const algorithmeSelectionne = algorithmeSelectionneInput.id;
        if (algorithmeSelectionne === 'genetique') {
            parametres.taillePopulation = parseInt(document.getElementById('Taille population').value);
            parametres.nbrGenerations = parseInt(document.getElementById('Nombres générations').value);
            parametres.tauxMutation = parseFloat(document.getElementById('Taux mutation').value);
            console.log("Données envoyées au serveur :", parametres);
            console.log("Données envoyées au serveur :", dimensionsObjets);

        } else if (algorithmeSelectionne === 'Algo_Fourmis') {
            parametres.nombre_Fourmis = parseInt(document.getElementById('Nombres de fourmis').value);
            console.log("Données envoyées au serveur :", parametres);
            }} 
        else {
            alert('Veuillez choisir un algorithme');
            return;
        }
        const algorithmeSelectionne = algorithmeSelectionneInput.id;
        fetch(`/run-algorithm/${algorithmeSelectionne}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        capaciteBin: capaciteBin,
        dimensionsObjets: dimensionsObjets,
        parametres
    }),
})

        .then(response => response.json())
        .then(resultat => {
            // Vérifier si resultat.solution existe et est un tableau
            if (resultat.solution && Array.isArray(resultat.solution)) {
                // Afficher les résultats dans votre structure HTML
                const nbrElement = document.querySelector('.nbr-bin span');
                const Temps = document.querySelector('.Temps span');
                const affichage1Element = document.querySelector('.affichage1');
        
                // Afficher le nombre de boîtes utilisées dans le premier bloc
                nbrElement.textContent = `Nombre de bacs : ${resultat.nombre_boites_utilisees} `;
                Temps.textContent = `Temps de convergence :  ${resultat.time} secondes`;
                
        
                // Vous devrez personnaliser cette partie selon le format de vos résultats
                // Par exemple, si resultat.solution contient un tableau de boîtes, vous pouvez le parcourir et l'afficher.
                /*resultat.solution.forEach((boite, index) => {
                    const boiteDiv = document.createElement('div');
                    boiteDiv.textContent = `Boîte ${index + 1}: [${boite.map(objet => objet[0]).join(', ')}]`;
                    affichage1Element.appendChild(boiteDiv);
                });*/
        
                // Afficher la disposition des objets dans le deuxième bloc
                const dispositionElement = document.querySelector('.disposition .affichage1 p');
                
               // Initialiser une chaîne vide pour stocker le texte formaté
                let texteFormaté = "";
                let binsParLigne = 3;
                let binsAffiches = 0;

                // Parcourir les éléments de resultat.solution
                resultat.solution.forEach((element, index) => {
                // Ajouter le nom du bin
                texteFormaté += `bac${index + 1}[`;

                // Ajouter les éléments du bin
                texteFormaté += element.join(",");

                // Ajouter une virgule sauf pour le dernier élément
                if (index < resultat.solution.length - 1) {
                    texteFormaté += "]  ";
                } else {
                    texteFormaté += "]  ";
                }

                binsAffiches++;

                // Ajouter un saut de ligne après chaque groupe de 4 bins affichés
                if (binsAffiches === binsParLigne && index < resultat.solution.length - 1) {
                    texteFormaté += "\n";
                    binsAffiches = 0; // Réinitialiser le compteur après chaque saut de ligne
                }
                });

                // Afficher le texte formaté dans dispositionElement
                dispositionElement.textContent = texteFormaté;

        
                console.log(`Résultats de l'algorithme ${algorithmeSelectionne}:`, resultat);
            } else {
                console.error('Erreur lors de la récupération des résultats de l\'algorithme. La solution n\'est pas un tableau.');
            }
        })
        .catch(error => console.error('Erreur lors de l\'appel API:', error));
        
    });
});
function genererGraphe1() {
    // Récupérer les identifiants des benchmarks sélectionnés
    var casesCochees = document.querySelectorAll('input[name="selected_benchmarks"]:checked');
    var benchmarksSelectionnes = [];
    for (var i = 0; i < casesCochees.length; i++) {
        benchmarksSelectionnes.push(casesCochees[i].value);
    }
    
    // Envoyer les identifiants des benchmarks sélectionnés au serveur
    fetch('/generer_graphe1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selected_benchmarks: benchmarksSelectionnes })
    })
    .then(response => {
        if (response.ok) {
            // Mettre à jour l'image du graphe lorsque la réponse du serveur est réussie
            document.getElementById('graphe').src = '/graph_image';
            document.getElementById('graphe').style.display = "block";
        } else {
            console.error('Erreur lors de la génération du graphe');
        }
    })
    .catch(error => console.error('Erreur :', error));
}
function genererGraphe() {
    fetch('/generer_graphe' ,{ headers: {
        'Content-Type': 'application/json'
    }})
        .then(response => {
            if (response.ok) {
            var largeur = 600; // Largeur de la fenêtre en pixels
            var hauteur = 400; // Hauteur de la fenêtre en pixels
            var left = (screen.width - largeur) / 2; // Position horizontale centrée
            var top = (screen.height - hauteur) / 2; // Position verticale centrée
            window.open('afficher_graphe.html', 'fenetre1', 'width=' + largeur + ', height=' + hauteur + ', left=' + left + ', top=' + top);
        
            } else {
                console.error('Erreur lors de la génération du graphe');
            }
        })
        .catch(error => console.error('Erreur :', error));
        
}

$(document).ready(function () {
    $("#enregistrer-db-btn").click(function (event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien

        // Récupérer les valeurs des champs de formulaire
        var nbrObjets = $("#nbr_objets").val();
        var capaciteBin = $("#capacite-bin").val();
        var dimensions = $("#dimensions").val();

        // Créer un objet contenant les données à envoyer
        var formData = {
            nbr_objets: nbrObjets,
            capacite_bin: capaciteBin,
            dimensions: dimensions
        };

        // Envoyer les données au serveur Flask via une requête AJAX
        $.ajax({
            type: "POST",
            url: "/enregistrer-donnees", // L'URL de la route Flask pour enregistrer les données
            data: formData, // Les données à envoyer au serveur
            success: function (response) {
                // Traiter la réponse du serveur si nécessaire
                console.log(response);
            },
            error: function (error) {
                // Gérer les erreurs
                console.error("Erreur lors de l'envoi des données :", error);
            }
        });
    });
});

