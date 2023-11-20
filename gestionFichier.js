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
        let tableauLecture = this.content.trim().split('\r\n');
        console.log(tableauLecture);
        
        //on parcours le fichier ligne par ligne avec la boucle while (car for ça marche pas comme je veux avec le while et les incrémentations ...)
        //-1 car on commence par augmenter (on peut pas finir par incrémenter la position car si passe dans les conditions il va s'incrémenter 2 fois)
        let indiceCurrentPosition=-1;
        let salleDejaCree=[];
        //pour avoir les horaires sont la bonne forme
        let horaireNvobj; 
        while(indiceCurrentPosition<tableauLecture.length){
            //on s'arrête pour chaque cours
            indiceCurrentPosition++;
            if(tableauLecture[indiceCurrentPosition][0]=='+'){
                //cours crée
                let cours = new Cours(tableauLecture[indiceCurrentPosition].slice(1,5));
                indiceCurrentPosition++;
                while(tableauLecture[indiceCurrentPosition][0]!='+'){
                    //analyse cours:
                    ligneDescriptionCours = tableauLecture[indiceCurrentPosition].split(',');
                    typeCreneau = ligneDescriptionCours[1];
                    capacite = ligneDescriptionCours[2].slice(2,5);
                    horaire = ligneDescriptionCours[3];
                    salleNom = ligneDescriptionCours[5].slice(2,6);

                    //il faut faire une fonction pour voir si il contient bien la salle
                    // il faut absolument pouvoir mettre les salles dans le tableau car je veux pouvoir mettre la même référence dans le créneau
                    if(!salleDejaCree.includes() === salleNom){
                        salle = new Salle(salleNom);
                        //H=V 9:00-12:00
                        let horaireDetaille = horaire.split(' ');
                        
                        horaireNvobj = new Horaire(horaireDetaille[0].slice(2,4),horaireDetaille[1].slice(0,4),horaireDetaille[1].slice(5,10));
                        creneau = new Creneau(typeCreneau,salle,horaireNvobj,capacite);
                        console.log(typeCreneau,salle,horaireNvobj,capacite);
                        salleDejaCree.push(salle);
                    }else{
                        let horaireDetaille = horaire.split(' ');
                        
                        horaireNvobj = new Horaire(horaireDetaille[0].slice(2,4),horaireDetaille[1].slice(0,4),horaireDetaille[1].slice(5,10));
                        creneau = new Creneau(typeCreneau,salleDejaCree.find,horaireNvobj,capacite);
                    }
                    
                    indiceCurrentPosition++;
                }
        }}
        
            
            

        for(indiceCurrentPosition; indiceCurrentPosition<tableauLecture.length;indiceCurrentPosition+=3){
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

                creneau = new Creneau(typeCreneau,salle,horaire);

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

module.exports = GestionFichier;