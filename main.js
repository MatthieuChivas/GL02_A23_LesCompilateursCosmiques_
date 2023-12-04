const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');

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

    afficherMenu(){
        console.log("**************************************************");
        console.log("Bienvenue sur ce programme de gestion d'universite");
        console.log("");
        rl.question('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \nChoix --> ', (answer) => {
            if(answer=='1'){
                this.menuClasseAssocieCours();
            }
            else if(answer=='2'){
                this.menuCapaciteSalle();
            }
            else if(answer=='3'){
                this.menuDisponibiliteDuneSalle();
            }
            else if(answer=='4'){
                this.menuSalleLibrePourUnCreaneau();
            }
            else if(answer=='5'){
                this.menuExportEmploiDuTemps();
            }
            else if(answer=='6'){
                this.menuVisualisationTauxOccupationSalles();
            }else if(answer=='7'){
                this.menuClassementSalleParCapaciteDoccupation();
            }

            rl.question('\n\nVeux tu continuer? \nChoix --> ', (answer) => {
                console.log(`${answer}`);
                if(answer=="oui"){
                    console.clear();
                    this.afficherMenu();
                }else{
                    rl.close();
                }
            });
            
          });
    }

    menuDisponibiliteDuneSalle(){
        
        
    }

    menuVisualisationTauxOccupationSalles(){
    }

    importationDonneEtCreationObjets(){
        const fichier = new Fichier('./Data/data.txt');
        this.universite = fichier.creationEcoleParLectureFichier();
    }

    
    menuClasseAssocieCours(){
        
        
    }
    // Méthode pour vérifier la disponibilité pour une salle donnée 
    async menuDisponibiliteDuneSalle(){
        const SalleDemander = await this.questionAsync("ecrire le nom de la salle !")
         console.log(SalleDemander);
         // On compare les crénaux occupé de la salle avec le crénaux test
         // On retourne faux si correspondance sinon vrai  
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
}

const main = new Main();


module.exports = Main;
