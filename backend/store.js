// store.js
const Store = require("electron-store").default;

const schema = {
  settings: {
    default: {
        showInformationButton: false,    // Information Button is visible or not.
        gestationDays: 280,             // Insemination Date + gestationDays = Birth Date
        dryOffDays: 220,                // Insemination Date + dryOffDays = DryDate
        calfReduceToTwoLiterDays: 80,   // Calf Birth Date + this value
        calfReduceToOneLiterDays: 85,   // Calf Birth Date + this value
        calfWeaningDays: 90,           // Calf Birth Date + this value
        calfToAdultDays: 365            // For Data Auto Update
    },
  },

  Animals: {
    default: [] // uygulama ilk açıldığında boş olacak
  },

  Cows: {
    default: []
  },

  Heifers: {
    default: []
  },

  Calves: {
    default: []
  },

  Bulls: {
    default: []
  },

  Vaccines: {
    default: []
  },

  updatedDatas: {
    default: []
  }
};

const store = new Store({ schema });

module.exports = store;
