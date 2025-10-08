//authentification de l'utilisateur 

const form = document.querySelector("#loginForm");
form.addEventListener("submit", function (e) {
    e.preventDefault();   // empcher le comportrement par defaut du formulaire  

    const email = document.querySelector("#email").value;
    const motdepasse = document.querySelector("#motdepasse").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST", // définition de la méthode de la requête: envoi de donnée
        headers: {
            "Content-Type": "application/json" //type des données envoyées 
        },
        body: JSON.stringify({ // les données envoyées
            email: email,
            password: motdepasse
        })
    })
        .then(response => {
           
            if (response.status === 200) {
                return response.json(); //retourne la réponse en json

            } else if (response.status === 401) {
                throw new Error("Erreur dans l’identifiant ou le mot de passe");

            } else if (response.status === 404) {
                throw new Error("Utilisateur introuvable.");

            } else {
                throw new Error(`Erreur ${response.status}.`);
            }
        })
        .then(response => {
            localStorage.setItem("token", response.token); // stocker le token 
            window.location.href = "index.html"; // redirection vers la page d'accueil
        })
        .catch(error => {
            document.getElementById("messageerreur").textContent = error.message;
            document.getElementById("messageerreur").style.display = "block";
        }
        );
})




