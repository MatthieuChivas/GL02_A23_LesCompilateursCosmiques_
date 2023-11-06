class Ecole{
    constructor(){
        this.listeCours = new Array();
        this.listeSalle = new Array();
    }

    addCours(cours){
        this.listeCours.push(cours);
    }

    getCours(){
        return this.listeCours;
    }
    
    addSalle(salle){
        this.listeSalle.push(salle);
    }
    
}

module.exports = Ecole;