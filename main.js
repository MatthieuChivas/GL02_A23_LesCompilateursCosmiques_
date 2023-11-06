const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });


class Main{
    universite;
    //je sais pas pourquoi mais j'arrive pas à acceder à l'universite avec le main genre Main.universite.getCours(); dans une autre classe genre fichier ça marche pas....

    constructor(){
        console.log("**************************************************");
        console.log("Bienvenue sur ce programme de gestion d'universite");
        console.log("")
        
    }

    afficherMenu(){
        rl.question('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \nChoix --> ', (answer) => {
            if(answer=='1'){
                Main.menuClasseAssocieCours();
            }
            else if(answer=='2'){
                Main.menuCapaciteSalle();
            }
            else if(answer=='3'){
                Main.menuDisponibiliteDuneSalle();
            }
            else if(answer=='4'){
                Main.menuSalleLibrePourUnCreaneau();
            }
            else if(answer=='5'){
                Main.menuExportEmploiDuTemps();
            }
            else if(answer=='6'){
                Main.menuVisualisationTauxOccupationSalles();
            }else if(answer=='7'){
                Main.menuClassementSalleParCapaciteDoccupation();
            }
            rl.close();
          });
    }

    importationDonneEtCreationObjets(){
        const fichier = new Fichier('./Data/data.txt');
        this.universite = fichier.creationEcole();
        

    }

    static menuClasseAssocieCours(){
        
    }
}

const main = new Main();
//main.afficherMenu();
main.importationDonneEtCreationObjets();

module.exports = Main;