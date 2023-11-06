class Cours {
    constructor(nom){
        this.nom = nom;
        this.creneau= new Array();
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