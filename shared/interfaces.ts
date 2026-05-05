// This file include interfaces for both electron or react.

export interface Animal {
  Id: number,
  EarringNo: string,
  Name: string,
  BirthDate: string,
  MotherEarringNo: string,
  MotherName: string,
  Type: string,
  Breed: string,
  Note: string,
  IsDeleted: boolean,
  user_id: string,
}

export interface Cow {
    Id: number,
    EarringNo: string,
    Name: string,
    InseminationDate: string,
    ExpectedBirthDate: Date,
    LeftDay: number,
    PassDay: number,
    DryOffDate: Date,
    BullName: string,
    CheckedDate: string,
    LastBirthDate: string,
    user_id: string,
    Animals: {
        Breed: string,
        Note: string
    }
}

export interface Calf {
    Id: number,
    EarringNo: string,
    Name: string,
    BirthDate: string,
    Gender: boolean,
    AgeDay: number,
    CutMilkDay: number,
    CutMilkDate: Date,
    user_id: string,
    Animals: {
        Breed: string,
        MotherEarringNo: string,
        MotherName: string,
        Note: string
    }
}

export interface Heifer {
    Id: number,
    EarringNo: string,
    Name: string,
    LastBirthDate: string,
    EmptyDay: number
    user_id: string,
    Animals: {
        Breed: string,
        Note: string
    }
}

export interface Bull {
    Id: number,
    EarringNo: string,
    Name: string,
    MotherEarringNo: string,
    MotherName: string,
    BirthDate: string,
    Breed: string,
    Note: string,
    Age: string,
    user_id: string,
}

export interface Vaccine {
    Id: number;
    VaccineName: string,
    VaccineDate: string,
    AnimalId: number,
    user_id: string,
    Animals: {
        EarringNo: string,
        Name: string,
    }
}

export interface SettingsData {
    gestationDays: number,
    dryOffDays: number,
    calfWeaningDays: number,
    calfToAdultDays: number,
    email: string
}