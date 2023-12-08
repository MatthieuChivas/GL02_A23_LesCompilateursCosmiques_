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
    
    addSalle(salle){
        this.listeSalle.push(salle);
    }

    isLaSalleEstCreeAPartirDunNom(salleNom){
        let checkSalleDejaCree=false;
        this.listeSalle.forEach((salleDejaCree)=>{
            if(salleDejaCree.nom==salleNom){
                return(checkSalleDejaCree);
            }
        });

        return(checkSalleDejaCree);
    }

    afficherEcole(){
        this.listeCours.forEach((cours)=>{
            console.log(`Le cours ${cours.nom} a autant de creneau :`);
            cours.getCreneaux().forEach((creneau)=>{
                console.log(`Le creneau ${creneau.type} est a ${creneau.salle.nom} a ${creneau.horaire.dateDebut.heure} : ${creneau.horaire.dateDebut.minute}  jusque ${creneau.horaire.dateFin.heure} : ${creneau.horaire.dateFin.minute} le ${creneau.horaire.jour} capacite : ${creneau.nombreEleve}`);
            })
        })
    }

}

module.exports = Ecole;