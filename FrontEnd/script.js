//étape 2: affichage dynamique des traveaux grace a l'appel d'API 

let allWorks = []; // tableau de traveaux 
getWork();         //vharger la galerie a l'ouverture de la page

//étape 3 et 4: filtres dynamiques 

fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(FiltreCategories => {
        const filtersContainer = document.querySelector(".filtres");


        //funtion pour l'état actif des boutons 
        function setActive(btn) {
            const boutons = filtersContainer.querySelectorAll("button");

            for (let i = 0; i < boutons.length; i++) {
                boutons[i].classList.remove("tousActif"); // retirer la classe avtive sur tous les boutons 
            }

            btn.classList.add("tousActif"); // appliquer la classe avtive sur le bouton cliqué 
        }

        //  création du bouton Tous
        const tous = document.createElement("button");
        tous.innerHTML = "Tous";
        tous.dataset.category = ""; // important pour reconnaître "Tous"
        filtersContainer.appendChild(tous);

        tous.addEventListener("click", () => {
            setActive(tous); // activer le bouton tous 
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = ""; // vider la galerie

            for (let j = 0; j < allWorks.length; j++) {
                gallery.appendChild(createimage(allWorks[j].imageUrl, allWorks[j].title)); // afficher tous les traveaux 
            }
        });

        // création des boutons de catégories
        for (let i = 0; i < FiltreCategories.length; i++) {

            const text = document.createElement("button");
            text.innerHTML = FiltreCategories[i].name;
            text.dataset.category = (FiltreCategories[i].id); // lier le bouton à l'id catégorie
            filtersContainer.appendChild(text);

            text.addEventListener("click", () => {
                setActive(text);
                const gallery = document.querySelector(".gallery");
                gallery.innerHTML = ""; // vider la galerie

                const catId = (FiltreCategories[i].id);
                for (let j = 0; j < allWorks.length; j++) {
                    if ((allWorks[j].categoryId) === catId) {
                        gallery.appendChild(createimage(allWorks[j].imageUrl, allWorks[j].title));
                    }
                }
            });
        }

        //affichage des traveaux
        setActive(tous); // activer le bouton tous 
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        for (let j = 0; j < allWorks.length; j++) {
            gallery.appendChild(createimage(allWorks[j].imageUrl, allWorks[j].title));
        }
    })
    .catch(erreur => {
        console.error(erreur);
    });

//étape 5: connexion 


// passage en mode édition aprés connexion 
const afficherBandeau = document.querySelector("#edition");
const filtersContainer = document.querySelector(".filtres");
const login = document.querySelector(".login");
const logoute = document.querySelector(".logout");
const modificationBtn = document.querySelector(".boutonmodifier");

if (localStorage.getItem("token") != null) { //si connecté
    afficherBandeau.classList.add("editmodevisible"); //affiche bandeau 
    filtersContainer.classList.add("btnedit"); //cache les filtres
    login.classList.add("editmodeinvisible"); //cache login 
    logoute.classList.remove("logout"); //affiche logout
    modificationBtn.classList.remove("boutonmodifier"); //affiche le bouton modifier 
}


// étapes 6 et 7: ajout de la modale, suppression des traveaux 

// gerer l'ouverture et la fermeture de la modale 1
const modal1 = document.getElementById("modal1");
const closemodal1 = document.getElementById("closemodal");
const openmodal1 = document.getElementById("openmodal");

//ouvrir la modal et charger les traveaux 
openmodal1.addEventListener("click", () => {
    modal1.setAttribute("aria-hidden", "false");

    fetch("http://localhost:5678/api/works") // récuperer les données 
        .then(response => response.json()) // transformer le retour de la requete en json
        .then(data => {
            const modalgallery1 = document.querySelector(".gallery1"); // récupération de la div qui contient les images du html
            modalgallery1.innerHTML = ""; //vider la galerie

            for (let i = 0; i < data.length; i++) {
                // créations des éléments HTML
                const figure1 = document.createElement("figure");
                const imageModal1 = document.createElement("img");
                const poubelle = document.createElement("button");

                const id = data[i].id;// récuperer l'id de l'image 
                figure1.dataset.id = id; //stocker l'id

                imageModal1.src = data[i].imageUrl; // source de l'image
                poubelle.className = "bouton-poubelle";
                poubelle.innerHTML = '<i class="fa-solid fa-trash-can"></i>';//création du bouton poubelle

                console.log(figure1.dataset);
                console.log(id);

                // supprimer les images
                poubelle.addEventListener("click", () => {

                    console.log(figure1);
                    const token = localStorage.getItem("token");

                    fetch(`http://localhost:5678/api/works/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            console.log("status : ", response.status)

                            if (response.status === 200 || response.status === 204) {
                                figure1.remove();//supprimer du Dom
                                getWork() //télévharger la nouvelle version des traveaux

                            } else if (response.status === 401) {
                                alert("non autorisé");
                            } else if (response.status === 500) {
                                alert("Erreur serveur (500)");
                            } else {
                                alert("suppression impossible");
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            alert(`Erreur réseau : ${error.message}`);
                        }
                        )
                })
                // ajouter les éléments dans le Dom
                figure1.appendChild(imageModal1); // ajout des images à l'élément figure
                figure1.appendChild(poubelle);
                modalgallery1.appendChild(figure1);
            }

        })
})
//fermer la modal avec le bouton +
closemodal1.addEventListener("click", () => {
    modal1.setAttribute("aria-hidden", "true");
})
//fermer la modal au click en dehors de la modal 
modal1.addEventListener("click", (e) => {
    if (e.target === modal1) {
        modal1.setAttribute("aria-hidden", "true");
    }
});




// les functions 
// récupération des travaux 
function getWork() {
    fetch("http://localhost:5678/api/works") // Récupérer les données
        .then(response => response.json()) // Transformer la réponse en JSON
        .then(data => {
            const worksGallery = document.querySelector(".gallery"); // Sélection de la galerie
            worksGallery.innerHTML = ""; // Vider la galerie avant de la remplir

            for (let i = 0; i < data.length; i++) {
                // Création des éléments
                const figure = createimage(data[i].imageUrl, data[i].title);
                worksGallery.appendChild(figure);
            }

            allWorks = data; // Stocker les traveaux
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des travaux :", error);
        });
}

// fonction pour créer les images 
function createimage(imageUrl, title) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img")
    const captionElement = document.createElement("figcaption");

    imageElement.src = imageUrl; // afficher les images

    console.log(imageElement);
    captionElement.innerText = title; // afficher les titres
    figureElement.appendChild(imageElement); // ajout des images à l'élément figure
    figureElement.appendChild(captionElement); //ajout des titres à l'élément figure


    return figureElement;
}

// deconnexion: function appelée en html 
function logout() {
    localStorage.removeItem("token");
    location.reload();

}


//étape 3 et 4: affichage dynamique
// récupération des filtres
// fetch("http://localhost:5678/api/categories")
//     .then(response => response.json())
//     .then(filtre => {
//         const filtres = document.querySelector(".filtres");

//         // création du bouton tous

//         const tous = document.createElement("button");
//         tous.innerHTML = "Tous";
//         tous.classList.add("tousActif");
//         tous.dataset.category = "";
//         filtres.appendChild(tous);

//         // tous.addEventListener("click", () => {

//         //     const gallery = document.querySelector(".gallery");
//         //     gallery.innerHTML = ""; // vider la galerie

//         //     // afficher toutes les images
//         //     for (let j = 0; j < allWorks.length; j++) {
//         //         const figure = createimage(allWorks[j].imageUrl, allWorks[j].title); //appel de la function pour afficher les images
//         //         gallery.appendChild(figure);
//         //     }
//         // });

//         //creation des filtres
//         for (let i = 0; i < filtre.length; i++) {
//             const text = document.createElement("button");
//             text.innerHTML = filtre[i].name;

//             text.dataset.category = filtre[i].id;
//             filtres.appendChild(text);
//         }


//         //??????????????????????????????????????????????
//         filtres.childNodes.forEach((element) => {
//             element.addEventListener("click", () => {
//                 filtres.childNodes.forEach((element) => {
//                     element.classList.remove("tousActif");
//                 })
//                 element.classList.add("tousActif")
//                 const gallery = document.querySelector(".gallery");
//                 gallery.innerHTML = ""; // vider la galerie

//                 for (let j = 0; j < allWorks.length; j++) {
//                     console.log(element);
//                     console.log(allWorks[j]);
//                     if (allWorks[j].categoryId == element.dataset.category) {
//                         const figurelement = createimage(allWorks[j].imageUrl, allWorks[j].title); //appel de la function pour afficher les images
//                         gallery.appendChild(figurelement);

//                     } else if (allWorks[j].categoryId === null) {
//                         const figurelement = createimage(allWorks[j].imageUrl, allWorks[j].title); //appel de la function pour afficher les images
//                         gallery.appendChild(figurelement);
//                     }
//                 }
//             });
//         })
//     })


