const fs = require('fs');
const main = require('./main.js');
const Ecole = require('./ecole.js');
const Cours = require('./cours.js');

class GestionFichier{
    
    constructor(path){
        this.content = fs.readFileSync(path,{encoding:'utf-8'});
        
    }
    
    creationEcole(){
        //on peut lire grâce au content !
        const ecole= new Ecole();
        const cours1 = new Cours("MT01","11h");
        const salle1 = new Cours("P201","66");
        ecole.addCours(cours1);
        ecole.addSalle(salle1);
        return ecole;
    }
    
}

//return Ecole
//avec cours
//et salle!

module.exports = GestionFichier;