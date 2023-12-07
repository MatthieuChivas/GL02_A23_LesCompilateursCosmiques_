const Heure = require('./heure.js');

class Horaire{
    constructor(jour,heureDeb,heureFin){
        this.jour=jour;
        this.dateDebut= new Heure(heureDeb[0],heureDeb[1]);
        this.dateFin=new Heure(heureFin[0],heureFin[1]);
    }
    toString(){
        console.log(`La date de debut est : ${this.dateDebut}`);
        console.log(`La date de fin est : ${this.dateFin}`);
        console.log("FINDELHORAIRE")
    }
}
// Modifier car on a modifier dans le main les heures : heureDebut = DateDebut donc il faut changer l'accès aux heures dans le programme 
module.exports = Horaire;