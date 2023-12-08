const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');
//const readlineSync = require('readline-sync');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

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

// -----------------------------------------------------------------------------------------------------

    // node .\main.js

    async menuSalleLibrePourUnCreaneau(){

        let sallesDispo = new Array(6).fill(null).map(() => 
        new Array(24).fill(null).map(() => new Array(200).fill(null))
        );
        
        let listeCreneaux;
        let cChoix;
        let hdChoix;
        let hfChoix;
        let salle;
        
        
        for (i=0;i<this.universite.listeCours.length;i++){
            for (j=0;j<this.universite.cours.creneau.horaire.length;j++){
                //sallesDispo[i][j][k]=this.universite.cours.creneau.salle
                listeJours.listeCreneaux.salle=
            }
        }
        
        cours.jour.creneau.salle
        
        
        
        for (i=hdChoix;i<hfChoix;i++){
            while (k!=null){
                if (==sallesDispo[])
            }
            
        }

// -----------------------------------------------------------------------------------------------------

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
}
const main = new Main();


module.exports = Main;

