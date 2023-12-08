const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');
const ExcelJS = require('exceljs');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { transferableAbortSignal } = require('node:util');
const { Console } = require('node:console');

const rl = readline.createInterface({ input, output });


class Main{
    universite;
    //permet d'empêcher des bugs de s'appuyer sur le readline alors qu'il est fermé
    isReadlineClose;

    constructor(){
        this.importationDonneEtCreationObjets();
        this.afficherMenu();
    }

    questionAsync(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });     
    }

    async afficherMenu(){
        let choixUtilisateur; 
        while(choixUtilisateur !='8'){
            console.log("**************************************************");
            console.log("Bienvenue sur ce programme de gestion d'universite");
            console.log("");
            choixUtilisateur = await this.questionAsync("1 - Recherche de classe associée à un cours\n2 - Recherche de capacite d'une salle\n3 - Recherche disponibilite d'une salle \n4 - Recherche de salle libre pour un creneau \n5 - Export de l'emploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite d'accueil \n8 - Quitter le logiciel\nChoix --> ");
            this.isReadlineClose=false;
            switch(choixUtilisateur){
                case '1' : await this.menuClasseAssocieCours();break;
                case '2' : await this.menuCapaciteSalle();break;
                case '3' : await this.menuDisponibiliteDuneSalle();break;
                case '4' : await this.menuSalleLibrePourUnCreaneau();break;
                case '5' : await this.menuExportEmploiDuTemps();break;
                case '6' : await this.menuVisualisationTauxOccupationSalles();break;
                case '7' : await this.menuClassementSalleParCapaciteDoccupation();break;
                case '8' : console.log('Quitter');rl.close();this.isReadlineClose=true;break;
                default : console.log('Veuillez rentrer un choix valide');
            }
            if(this.isReadlineClose){
                break;
            }
        }
    }

    async menuExportEmploiDuTemps(){
        console.clear();
        const ICalendar = require('./iCalendar.js');
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