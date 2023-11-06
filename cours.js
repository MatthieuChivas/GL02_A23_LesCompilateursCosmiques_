class Cours {
    constructor(nom,creaneau){
        this.creneau= new Array();
        this.nom = nom;
    }
    afficherCour(){
        console.log("J'ai cours");    
    }
    ajouterCreneau(creneau){
        this.creneau.push(creneau);
    }
    getCreneaux(){
        return this.creneau;
    }
}

module.exports = Cours;
