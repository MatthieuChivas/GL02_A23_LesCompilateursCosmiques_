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
    getSalle(){
        return this.listeSalle;
    }
    
    addOnlyNewSalle(salle){
        if(this.listeSalle.includes(salle)){
            console.log("Cette salle existe déjà!");
        }{
            this.listeSalle.push(salle);
        }
    }

    afficherEcole(){
        this.listeCours.forEach((cours)=>{
            console.log(`Le cours ${cours.nom} a autant de creneau :`);
            cours.getCreneaux().forEach((creneau)=>{
                console.log(`Le creneau ${creneau.type} est a ${creneau.salle} a ${creneau.horaire}`);
            })
        })
    }
    
}

module.exports = Ecole;