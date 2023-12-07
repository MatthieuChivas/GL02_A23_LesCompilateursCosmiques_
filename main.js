const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });


class Main{
    universite;
    isReadlineClose;

    constructor(){
        this.importationDonneEtCreationObjets();
        this.afficherMenu();
    }

    async afficherMenu(){
        let choixUtilisateur; //= await this.questionAsync('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \n8 - Quitter le logiciel\nChoix --> ');
        while(choixUtilisateur !='8'){
            console.log("**************************************************");
            console.log("Bienvenue sur ce programme de gestion d'universite");
            console.log("");
            choixUtilisateur = await this.questionAsync('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \n8 - Quitter le logiciel\nChoix --> ');
            this.isReadlineClose=false;
            switch(choixUtilisateur){
                case '1' : await this.menuClasseAssocieCours(); break;
                case '2' : await this.menuCapaciteSalle(); break;
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
        const choix = await this.questionAsync("Veux tu continuer (oui/non) : ");

        switch(choix){
            case 'oui' : break;
            case 'non' : rl.close();this.isReadlineClose=true;console.log("Quitter");break;
        }
        console.clear();
    }

    questionAsync(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    }
    
}

const main = new Main();


module.exports = Main;
