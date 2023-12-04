const Ecole = require('./ecole.js');
const Fichier = require('./gestionFichier.js');

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const Creneau = require('./creneau.js');

const rl = readline.createInterface({ input, output });


class Main{
    universite;

    constructor(){
        this.importationDonneEtCreationObjets();
        this.afficherMenu();
    }

    afficherMenu(){
        console.log("**************************************************");
        console.log("Bienvenue sur ce programme de gestion d'universite");
        console.log("");
        rl.question('1 - Recherche de classe associée à un cours\n2 - Recherche de capacite dune salle\n3- Recherche disponibilite dune salle \n4- Recherche de salle libre pour un creneau \n5- Export de lemploi du temps \n6 - Visualisation des taux des salles \n7 - Generer le classement des salles par capacite daccueil \nChoix --> ', (answer) => {
            if(answer=='1'){
                this.menuClasseAssocieCours();
            }
            else if(answer=='2'){
                this.menuCapaciteSalle();
            }
            else if(answer=='3'){
                this.menuDisponibiliteDuneSalle();
            }
            else if(answer=='4'){
                this.menuSalleLibrePourUnCreaneau();
            }
            else if(answer=='5'){
                this.menuExportEmploiDuTemps();
            }
            else if(answer=='6'){
                this.menuVisualisationTauxOccupationSalles();
            }else if(answer=='7'){
                this.menuClassementSalleParCapaciteDoccupation();
            }

            rl.question('\n\nVeux tu continuer? \nChoix --> ', (answer) => {
                console.log(`${answer}`);
                if(answer=="oui"){
                    console.clear();
                    this.afficherMenu();
                }else{
                    rl.close();
                }
            });
            
          });
    }

    importationDonneEtCreationObjets(){
        const fichier = new Fichier('./Data/data.txt');
        this.universite = fichier.creationEcoleParLectureFichier();
        this.universite.afficherEcole();

    }

    static menuClasseAssocieCours(){
        //Fichier.ouvrirLeFichier('./Data/data.txt');
        const fichier = new Fichier('./Data/data.txt');
        //console.log("Affichage du menu de recherche d'une classe avec un cours...");
        
    }
    questionAsync(prompt) {
        return new Promise((resolve) => {
        rl.question(prompt, resolve);
         });     
        }
    // Méthode pour vérifier la disponibilité pour une salle donnée
async menuDisponibiliteDuneSalle() {
    const SalleDemande = await this.questionAsync("Ecrire le nom de la salle : ");
    const dictionnaireCreneaux = this.estLibre(SalleDemande);
    console.log(dictionnaireCreneaux);
    // Dictionnaire des heures disponibles de 8h à 18h par pas de 30 minutes
    const heuresDisponibles = {};
    for (let heure = 8; heure < 18; heure++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const heureMinute = `${heure}:${minute.toString().padStart(2, "0")}`;
        heuresDisponibles[heureMinute] = true; // Initialise chaque heure comme disponible
      }
    }
    // Utilisation de la fonction pour obtenir les créneaux libres par jour
    const creneauxLibresParJour = this.trouverCreneauxLibres(heuresDisponibles, dictionnaireCreneaux);
  
    // Affichage des créneaux libres par jour
    console.log("Créneaux libres par jour :");
    console.log(creneauxLibresParJour);
  }
  // Fonction pour trouver les créneaux libres 
  // Fonction pour obtenir les créneaux libres par jour
trouverCreneauxLibres(heuresDisponibles, dictionnaireCreneaux) {
    const creneauxLibresParJour = {};
  
    // Parcours de chaque jour de la semaine dans le dictionnaire de créneaux
    Object.keys(dictionnaireCreneaux).forEach((jour) => {
      creneauxLibresParJour[jour] = [];
  
      // Récupération des créneaux occupés pour ce jour
      const creneauxOccupes = dictionnaireCreneaux[jour];
  
      // Parcours des heures disponibles
      Object.keys(heuresDisponibles).forEach((heureDisponible) => {
        // Convertir l'heure disponible en nombre pour la comparaison
        const heureDisponibleNum = parseInt(heureDisponible.split(':')[0]);
  
        // Vérification si l'heure disponible est dans un créneau occupé
        const estOccupee = creneauxOccupes.some((creneauOccupe) => {
          const [debutOccupe, finOccupe] = creneauOccupe.split('-');
          const debutOccupeNum = parseInt(debutOccupe.split(':')[0]);
          const finOccupeNum = parseInt(finOccupe.split(':')[0]);
  
          // Si l'heure disponible est comprise dans un créneau occupé
          return heureDisponibleNum >= debutOccupeNum && heureDisponibleNum < finOccupeNum;
        });
  
        // Si l'heure disponible n'est pas occupée, on l'ajoute aux créneaux libres
        if (!estOccupee) {
          creneauxLibresParJour[jour].push(heureDisponible);
        }
      });
    });
  
    return creneauxLibresParJour;
  }
  
  
  // Fonction estLibre pour récupérer les créneaux occupés pour une salle donnée
  estLibre(SalleChercher) {
    const dictionnaireSemaine = {
      "L": [],
      "M": [],
      "Me": [],
      "J": [],
      "V": [],
    };
  
    // Remplir dictionnaireSemaine avec les créneaux occupés pour la salle spécifiée
    this.universite.getCours().forEach((cours) => {
      cours.getCreneaux().forEach((creneau) => {
        if (creneau.salle.nom === SalleChercher && dictionnaireSemaine[creneau.horaire.jour]) {
          dictionnaireSemaine[creneau.horaire.jour].push(`${creneau.horaire.heureDebut}-${creneau.horaire.heureFin}`);
        }
      });
    });
  
    return dictionnaireSemaine;
  }
  async menuVisualisationTauxOccupationSalles(){
    const SalleCherchee = await this.questionAsync("Ecrire le nom de la salle : ");
    console.log(SalleCherchee);
    const heuresOccupation = {};
    const heuresTotales = {};
  
    // Initialisation des dictionnaires pour chaque jour de la semaine
    ['L', 'M', 'Me', 'J', 'V'].forEach((jour) => {
      heuresOccupation[jour] = 0;
      heuresTotales[jour] = 0;
    });
  
    // Parcours de chaque cours pour la salle spécifiée
    this.universite.getCours().forEach((cours) => {
      cours.getCreneaux().forEach((creneau) => {
        if (creneau.salle.nom === SalleCherchee) {
          const jour = creneau.horaire.jour;
          const debut = parseInt(creneau.horaire.heureDebut.split(':')[0]);
          const fin = parseInt(creneau.horaire.heureFin.split(':')[0]);
  
          // Calcul du nombre d'heures occupées pour chaque jour
          heuresOccupation[jour] += fin - debut;
        }
      });
    });
  
    // Calcul du nombre total d'heures disponibles pour chaque jour
    Object.keys(heuresTotales).forEach((jour) => {
      heuresTotales[jour] = 10; // (18h - 8h) * 5 jours par semaine = 50 heures
    });
  
    // Calcul du taux d'occupation pour chaque jour
    const tauxOccupationParJour = {};
    Object.keys(heuresOccupation).forEach((jour) => {
      tauxOccupationParJour[jour] = (heuresOccupation[jour] / heuresTotales[jour]) * 100;
    });
  
    return tauxOccupationParJour;
  }

    }

const main = new Main();


module.exports = Main;
