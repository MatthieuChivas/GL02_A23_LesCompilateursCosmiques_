class Cours {
    constructor(nom){
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
    toString(){
        console.log(`Le cours ${this.nom} a ${this.creneau.length} creneau`);
        this.creneau.forEach((creneau)=>creneau.toString());
    }
}

module.exports = Cours;
