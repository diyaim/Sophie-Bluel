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


