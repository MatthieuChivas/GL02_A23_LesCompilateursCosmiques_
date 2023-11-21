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
        
        
        //on parcours le fichier ligne par ligne avec la boucle while (car for ça marche pas comme je veux avec le while et les incrémentations ...)
        //-1 car on commence par augmenter (on peut pas finir par incrémenter la position car si passe dans les conditions il va s'incrémenter 2 fois)
        let indiceCurrentPosition=-1;
        //pour avoir les horaires sont la bonne forme
        let horaireNvobj; 
        let premiersTour=true;
        while(indiceCurrentPosition<tableauLecture.length){
            //on s'arrête pour chaque cours
            if(premiersTour){
                indiceCurrentPosition++;
            }
            
            
            if(tableauLecture[indiceCurrentPosition][0]=='+'){
                premiersTour=false;

                let cours = new Cours(tableauLecture[indiceCurrentPosition].slice(1,5));
                indiceCurrentPosition++;
                
                //il faut pas que ça dépasse la longueur du fichier!!
                while(!(indiceCurrentPosition>=tableauLecture.length) && tableauLecture[indiceCurrentPosition][0]!='+'){
                   
                    //analyse cours:
                    ligneDescriptionCours = tableauLecture[indiceCurrentPosition].split(',');
                    typeCreneau = ligneDescriptionCours[1];
                    capacite = ligneDescriptionCours[2].slice(2,5);
                    horaire = ligneDescriptionCours[3];
                    salleNom = ligneDescriptionCours[5].slice(2,6);

                    //il faut faire une fonction pour voir si il contient bien la salle
                    // il faut absolument pouvoir mettre les salles dans le tableau car je veux pouvoir mettre la même référence dans le créneau
                    if(!ecole.isLaSalleEstCreeAPartirDunNom(salleNom)){
                        salle = new Salle(salleNom);
                        //H=V 9:00-12:00
                        let horaireDetaille = horaire.split(' ');
                        let heureDetaille = horaireDetaille[1].split('-');
                        
                        horaireNvobj = new Horaire(horaireDetaille[0].slice(2,4),heureDetaille[0],heureDetaille[1]);
                        creneau = new Creneau(typeCreneau,salle,horaireNvobj,capacite);
                        
                        
                        ecole.addSalle(salle);
                        cours.ajouterCreneau(creneau);
                        

                    }else{
                        //jarrivais pas a trouver comment renvoyer l'objet salle à partir d'ecole...
                        let salleDjacree = ecole.getSalle().filter((salleEcole)=>{salleEcole.nom==salleNom});
                        
                        let horaireDetaille = horaire.split(' ');
                        
                        horaireNvobj = new Horaire(horaireDetaille[0].slice(2,4),horaireDetaille[1].slice(0,4),horaireDetaille[1].slice(5,10));
                        creneau = new Creneau(typeCreneau,salleDjacree,horaireNvobj,capacite);
                        cours.ajouterCreneau(creneau);
                        
                    }
                    
                    
                    indiceCurrentPosition++;
                }
            ecole.addCours(cours);
        }}
        return ecole;
    }
    
}

module.exports = GestionFichier;