const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');
const ICalendar = require('./iCalendar.js');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { transferableAbortSignal } = require('node:util');
const { Console } = require('node:console');

const rl = readline.createInterface({ input, output });


class Main{
    universite;

    constructor(){
        this.importationDonneEtCreationObjets();
        this.afficherMenu();
    }

    async afficherMenu(){
        console.log("**************************************************");
        console.log("Bienvenue sur ce programme de gestion d'universite");
        console.log("");
        let answer = await this.questionAsync('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \nChoix --> ')
            if(answer=='1'){
                await this.menuClasseAssocieCours();
            }
            else if(answer=='2'){
                await this.menuCapaciteSalle();
            }
            else if(answer=='3'){
                await this.menuDisponibiliteDuneSalle();
            }
            else if(answer=='4'){
                await this.menuSalleLibrePourUnCreaneau();
            }
            else if(answer=='5'){
                await this.menuExportEmploiDuTemps();
            }
            else if(answer=='6'){
                await this.menuVisualisationTauxOccupationSalles();
            }else if(answer=='7'){
                await this.menuClassementSalleParCapaciteDoccupation();
            }

            answer = this.questionAsync('\n\nVeux tu continuer? \nChoix --> ')
                console.log(`${answer}`);
                if(answer=="oui"){
                    console.clear();
                    this.afficherMenu();
                }else{
                    rl.close();
                }
    }

    async menuExportEmploiDuTemps(){
        console.clear();
        let iCal = new ICalendar(this.universite.listeCours);
        //await iCal.execution();
        let cours = []
        let continuer = "oui"
        let nomsCours = await iCal.recupererNomsCours()
        while (continuer === "oui"){
            let nomCours = await iCal.questionUtilisateurNomCours(nomsCours)
            let infoCours = await iCal.recupererCours(nomCours)
            if (infoCours !== true){
                cours.push([nomCours,infoCours])
            }
            continuer = await iCal.questionAsync("Veux-tu continuer ? oui/non")
        }
        await iCal.creerICalendar(cours)

    }

    menuDisponibiliteDuneSalle(){
        
        
    }

    menuVisualisationTauxOccupationSalles(){
    }

    importationDonneEtCreationObjets(){
        const fichier = new Fichier('./Data/data.txt');
        this.universite = fichier.creationEcoleParLectureFichier();
    }

    //menu de la SPEC1 : 
    //permet d'obtenir les salles asssociés à un cours
    async menuClasseAssocieCours(){
        console.clear();
        console.log("**************************************************");
        console.log("*** Voici les salles qui sont accosiées à un cours ***")

        const sallesCours = new Map();
        let listeSalle = new Array();

        //on récup tous les cours de l'universite
        let listeCours = this.universite.getCours();
        listeCours.forEach(cours=>console.log(`${cours.nom}`));
        
        listeCours.forEach((cours) => {
            
            cours.getCreneaux().forEach((creneau) => {
                //on récupère les salles qui sont associés à tous les créneaux d'un cours
                listeSalle.push(creneau.salle.nom);
            })

            let listeSalleIdentique = new Set(listeSalle);
            sallesCours.set(cours.nom, listeSalleIdentique);

            listeSalleIdentique = [];
            listeSalle = [];
        })

        //affichage :
        // sallesCours.forEach((valueSet,key)=>{
        //     console.log(`Cours : ${key}, Salles :`);
        //     valueSet.forEach(value=>{
        //         console.log(value);
        //     })
        // })  
        
        const coursDemande = await this.questionAsync("ecrire le nom du cours : ")
        if(sallesCours.has(coursDemande)){
            console.log(`Le cours ${coursDemande} est associé aux salles :`);
            sallesCours.get(coursDemande).forEach((salle)=>console.log(salle));
        }else{
            console.log("Le cours demandé n'est pas dispensé dans cet établissement");
        }

    }

    questionAsync(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    }
    


        // Méthode pour afficher la capacité d'une salle donnée :
        async menuCapaciteSalle() {
            // on stock le tableau des salles et de leurs capacité dans la variable CapaciteSalles
            let CapaciteSalles = this.CreationTableauCapacite();
            const SalleDemander = await this.questionAsync("Écrire le nom de la salle : ");
            let trouve = false;
            //on parcourt le tableau
            CapaciteSalles.forEach(CapaciteSalle => {
                //si le nom de la salle correspond au nom de la salle demandée on affiche sa capacité
                if (CapaciteSalle.nom === SalleDemander) {
                    console.log(`La capacité maximum de la salle ${SalleDemander} est de ${CapaciteSalle.capacite}`);
                    trouve = true;
                }
            });
            //si la salle n'a pas été trouvé dans le tableau
            if (!trouve){
                console.log("Cette salle n'existe pas.");
                this.menuCapaciteSalle();
            }
        }

        // Méthode pour créer un tableau avec la capacité et les salles données :
        CreationTableauCapacite() {
            let maxCapacite = 0;
            let CapaciteSalles = [];

            // On parcourt les différents cours de l'université
            for (let i in this.universite.listeCours) {
                // On parcourt les différents créneaux du cours
                for (let j in this.universite.listeCours[i].creneau) {
                    // On récupère le nom de la salle
                    let NomSalle = this.universite.listeCours[i].creneau[j].salle.nom;
                    let SalleExistante = false;

                    // On parcourt le tableau des salles et des capacités
                    CapaciteSalles.forEach(CapaciteSalle => {
                        // Si la salle existe déjà
                        if (CapaciteSalle.nom === NomSalle) {
                            SalleExistante = true;
                            // On met à jour la capacité du tableau si elle est inférieure
                            if (CapaciteSalle.capacite < this.universite.listeCours[i].creneau[j].nombreEleve) {
                                CapaciteSalle.capacite = this.universite.listeCours[i].creneau[j].nombreEleve;
                            }
                        }
                    });

                    // Si la salle n'existe pas
                    if (!SalleExistante) {
                        // On crée une nouvelle ligne avec la salle et sa capacité
                        let NouvellePersonne = {
                            nom: this.universite.listeCours[i].creneau[j].salle.nom,
                            capacite: this.universite.listeCours[i].creneau[j].nombreEleve
                        };
                        // On l'ajoute au tableau
                        CapaciteSalles.push(NouvellePersonne);
                    }
                }
            }
            return CapaciteSalles;
        }

        async menuClassementSalleParCapaciteDoccupation(){
            //on récupère le tableau des salles et des capacités
            let CapaciteSalles = this.CreationTableauCapacite();
            //le tableau est modifié et trié par ordre croissant
            CapaciteSalles.sort(function (a, b) {
                return b.capacite - a.capacite;
              });
            console.log("Tableau des salles et de leurs capacités, triés par ordre croissant :");
            console.log(CapaciteSalles);
        }
    


        // Méthode pour afficher la capacité d'une salle donnée :
        async menuCapaciteSalle() {
            // on stock le tableau des salles et de leurs capacité dans la variable CapaciteSalles
            let CapaciteSalles = this.CreationTableauCapacite();
            const SalleDemander = await this.questionAsync("Écrire le nom de la salle : ");
            let trouve = false;
            //on parcourt le tableau
            CapaciteSalles.forEach(CapaciteSalle => {
                //si le nom de la salle correspond au nom de la salle demandée on affiche sa capacité
                if (CapaciteSalle.nom === SalleDemander) {
                    console.log(`La capacité maximum de la salle ${SalleDemander} est de ${CapaciteSalle.capacite}`);
                    trouve = true;
                }
            });
            //si la salle n'a pas été trouvé dans le tableau
            if (!trouve){
                console.log("Cette salle n'existe pas.");
                this.menuCapaciteSalle();
            }
        }

        // Méthode pour créer un tableau avec la capacité et les salles données :
        CreationTableauCapacite() {
            let maxCapacite = 0;
            let CapaciteSalles = [];

            // On parcourt les différents cours de l'université
            for (let i in this.universite.listeCours) {
                // On parcourt les différents créneaux du cours
                for (let j in this.universite.listeCours[i].creneau) {
                    // On récupère le nom de la salle
                    let NomSalle = this.universite.listeCours[i].creneau[j].salle.nom;
                    let SalleExistante = false;

                    // On parcourt le tableau des salles et des capacités
                    CapaciteSalles.forEach(CapaciteSalle => {
                        // Si la salle existe déjà
                        if (CapaciteSalle.nom === NomSalle) {
                            SalleExistante = true;
                            // On met à jour la capacité du tableau si elle est inférieure
                            if (CapaciteSalle.capacite < this.universite.listeCours[i].creneau[j].nombreEleve) {
                                CapaciteSalle.capacite = this.universite.listeCours[i].creneau[j].nombreEleve;
                            }
                        }
                    });

                    // Si la salle n'existe pas
                    if (!SalleExistante) {
                        // On crée une nouvelle ligne avec la salle et sa capacité
                        let NouvellePersonne = {
                            nom: this.universite.listeCours[i].creneau[j].salle.nom,
                            capacite: this.universite.listeCours[i].creneau[j].nombreEleve
                        };
                        // On l'ajoute au tableau
                        CapaciteSalles.push(NouvellePersonne);
                    }
                }
            }
            return CapaciteSalles;
        }

        async menuClassementSalleParCapaciteDoccupation(){
            //on récupère le tableau des salles et des capacités
            let CapaciteSalles = this.CreationTableauCapacite();
            //le tableau est modifié et trié par ordre croissant
            CapaciteSalles.sort(function (a, b) {
                return b.capacite - a.capacite;
              });
            console.log("Tableau des salles et de leurs capacités, triés par ordre croissant :");
            console.log(CapaciteSalles);
        }
    
}

const main = new Main();


module.exports = Main;