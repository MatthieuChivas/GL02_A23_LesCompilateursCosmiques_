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
        if(this.listeSalle.includes(salle)){
            console.log("Cette salle existe déjà!");
        }{
            this.listeSalle.push(salle);
        }
    }
    
}

module.exports = Ecole;