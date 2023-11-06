class Cours {
    constructor(nom,creaneau){
        this.creneau=creaneau;
        this.nom = nom;
    }
    afficherCour(){
        console.log("J'ai cours");    
    }
}

module.exports = Cours;