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
        let checkSalleDejaCree=false;
        this.listeSalle.forEach((salleDejaCree)=>{
            if(salleDejaCree.nom==salle.nom){
                checkSalleDejaCree = true;
                return(checkSalleDejaCree);
            }
        });

        if(checkSalleDejaCree){
            //console.log("Cette salle existe déjà!");
            return(checkSalleDejaCree);
        }
        else{
            this.listeSalle.push(salle);
            return(checkSalleDejaCree);
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

    afficherOccupationSalle(){
        this.listeSalle.forEach((salle)=>{
            console.log(`La salle ${salle.nom} est utilisée a :`);
            salle.creneauxOccupations.forEach((creneau) =>{
                creneau.afficherHeureCreneau();
            })
        })
    }
    
}

module.exports = Ecole;