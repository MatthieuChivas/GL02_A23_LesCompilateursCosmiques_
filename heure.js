class Heure {
    constructor(heure,minute){
        this.heure=heure;
        this.minute=minute;
        
    }
    convertionStringToInt(){
        let HeuresInt = parseInt(this.heure)+this.dictionnnaireStringToInt[this.minute].minute;
        console.log(HeuresInt)
        return HeuresInt
    }

    getAll(){
        return this.heure + ":" + this.minute

    }
    
    dictionnnaireStringToInt = {
        "00" : {minute : 0},
        "30" : {minute : 0.5},
    }

   
}

module.exports = Heure;