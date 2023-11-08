const fs = require('fs');
const Salle = require('./salle.js');
const Ecole = require('./ecole.js');
const Cours = require('./cours.js');
const Creneau = require('./creneau.js');

class GestionFichier{
    
    constructor(path){
        this.content = fs.readFileSync(path,{encoding:'utf-8'});
        
        
    }
    
    creationEcole(){
        let ligneDescriptionCours;
        let typeCreneau;
        let capacite;
        let horaire;
        let salleNom; 

        let checkSalleDejaCree;
        let creneau;
        let salle;


        const ecole= new Ecole();
        //je pars du principe qu'il y a tjr 4 caractère qui vont faire le nom de la matière
        let tableauLecture = this.content.trim().split('\r');
        //console.log(tableauLecture);
        //je pars du principe qu'il y a tjr 2 ligne après un cours pour leur créneau... (pas tjr vrai je pense)
        for(let i=0; i<tableauLecture.length;i+=3){
            //cours directement 
            let coursNom=0;
            if(i==0){
                coursNom = tableauLecture[i].slice(1,5);
            }
            else{
                coursNom= tableauLecture[i].slice(2,7);
            }
            
            
            
            const cours = new Cours(coursNom);
            
            //c'est ici qu'il faut modifier aussi s'il y a plusieurs ligne après les cours!!
            for(let j=0; j<2; j++){
                ligneDescriptionCours = tableauLecture[j+i+1].split(',');
                typeCreneau = ligneDescriptionCours[1];
                capacite = ligneDescriptionCours[2].slice(2,5);
                horaire = ligneDescriptionCours[3];
                salleNom = ligneDescriptionCours[5].slice(2,6);
                
                //console.log(typeCreneau);
                //console.log(capacite);
                //console.log(horaire);
                //console.log(salle);
                
                salle = new Salle(salleNom,capacite);
                
                checkSalleDejaCree = ecole.addOnlyNewSalle(salle);

                creneau = new Creneau(typeCreneau,salleNom,horaire);

                if(checkSalleDejaCree){
                    //jarrivais pas a trouver comment renvoyer l'objet salle à partir d'ecole...
                    ecole.getSalle().forEach((salleEcole)=>{
                        if(salleEcole.nom==salleNom){
                            salleEcole.ajouterCreneau(creneau);
                        }
                    })
                }
                else{
                    salle.ajouterCreneau(creneau);
                }
                
                cours.ajouterCreneau(creneau);
            }
            ecole.addCours(cours);
        }
        
        return ecole;
    }
    
}

//return Ecole
//avec cours
//et salle!

module.exports = GestionFichier;