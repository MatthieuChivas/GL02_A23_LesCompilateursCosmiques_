const fs = require('fs');
const Salle = require('./salle.js');
const Ecole = require('./ecole.js');
const Cours = require('./cours.js');
const Creneau = require('./creneau.js');
const Horaire = require('./horaire.js');

class GestionFichier{
    
    constructor(path){
        this.content = fs.readFileSync(path,{encoding:'utf-8'});
    }
    
    //Retourne une école avec les informations contenue dans le fichier
    //On pourrait faire du parsin à la place mais j'ai fais le choix 
    //de lire le fichier sans respecter une grammaire précise 
    creationEcoleParLectureFichier(){ 

        //ligne du fichier qui décris le créneau
        let ligneDescriptionCreneau;
        
        let typeCreneau;
        let capacite;
        let horaire;
        let salleNom; 

        let creneau;
        let salle;

        const ecole= new Ecole();
        
        //création d'un tableau ligne = ligne du fichier et fin \\
        let tableauLecture = this.content.trim().split('\r\n');

        
        
        let indiceCurrentPosition=0;

        //pour avoir les horaires sont la bonne forme
        let horaireNvObj; 
        //permet d'éviter l'entête des fichiers 
        let isPremiersTour=true;

        //On veut faire des opérations en restant dans le fichier
        while(indiceCurrentPosition<tableauLecture.length){
            
            //+ => Nouveau cours
            if(tableauLecture[indiceCurrentPosition][0]=='+'){
                isPremiersTour=false;

                let cours = new Cours(tableauLecture[indiceCurrentPosition].slice(1,5));
                
                //on regarde ses créneaux
                indiceCurrentPosition++;
                //l'analyse s'arrête s'il détecte un nouveau cours (+), il faut pas que ça dépasse pas la longueur du fichier et 
                while(!(indiceCurrentPosition>=tableauLecture.length) && tableauLecture[indiceCurrentPosition][0]!='+'){
                   
                    //analyse cours:
                    ligneDescriptionCreneau = tableauLecture[indiceCurrentPosition].split(',');
                    typeCreneau = ligneDescriptionCreneau[1];
                    capacite = ligneDescriptionCreneau[2].slice(2,5);
                    horaire = ligneDescriptionCreneau[3];
                    salleNom = ligneDescriptionCreneau[5].slice(2,6);

                    
                    //si la salle n'est pas déjà crée on la crée et on l'ajoute
                    if(!ecole.isLaSalleEstCreeAPartirDunNom(salleNom)){
                        salle = new Salle(salleNom);
                        ecole.addSalle(salle);
                    }
                    //sinon on la récupère
                    else{
                        //jarrivais pas a trouver comment renvoyer l'objet salle à partir d'ecole...
                        salle = ecole.getSalle().filter((salleEcole)=>{salleEcole.nom==salleNom});    
                    }
                    //ensuite on crée les horaires,créneau et le cours
                    let horaireDetaille = horaire.split(' ');
                    let heureDetaille = horaireDetaille[1].split('-');
                
                    horaireNvObj = new Horaire(horaireDetaille[0].slice(2,4),heureDetaille[0],heureDetaille[1]);
                    creneau = new Creneau(typeCreneau,salle,horaireNvObj,capacite);  
                    cours.ajouterCreneau(creneau);
            
                    indiceCurrentPosition++;
                }

            //enfin on ajoute le cours à l'école après avoir eu tout les créneaux!  
            ecole.addCours(cours);
            }
            
        else if(isPremiersTour){
            indiceCurrentPosition++;
        }

    }

    return ecole;
    }
    
}

module.exports = GestionFichier;