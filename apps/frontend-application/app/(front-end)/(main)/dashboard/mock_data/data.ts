import { calculateYoYChanges } from "../utils";

export const energyData = [
    { year: '2019', energy: 5413228, unit: 'kWh' },
    { year: '2020', energy: 3786304, unit: 'kWh' },
    { year: '2021', energy: 3228497, unit: 'kWh' },
    { year: '2022', energy: 4831306, unit: 'kWh' },
    { year: '2023', energy: 4251449, unit: 'kWh' }
];

export const scopeData = [
    { year: '2019', scope1: 1200, scope2: 3800, scope3: 3000, unit: 'tCO2e' },
    { year: '2020', scope1: 1000, scope2: 3600, scope3: 2800, unit: 'tCO2e' },
    { year: '2021', scope1: 900, scope2: 3500, scope3: 2400, unit: 'tCO2e' },
    { year: '2022', scope1: 850, scope2: 3400, scope3: 2200, unit: 'tCO2e' },
    { year: '2023', scope1: 800, scope2: 3300, scope3: 2000, unit: 'tCO2e' }
];

export const energyWithChanges = calculateYoYChanges(energyData);


export const consumptionData = [
    {
        year: '2021',
        employeeTravel: 800000, // km traveled
        foodWaste: 600000, // kg
        purchasedGoods: 1000000, // kg
        water: 400000, // m³
        energy: 500000, // kWh
        units: {
            employeeTravel: 'km',
            foodWaste: 'kg',
            purchasedGoods: 'kg',
            water: 'm³',
            energy: 'kWh'
        }
    },
    {
        year: '2022',
        employeeTravel: 700000,
        foodWaste: 500000,
        purchasedGoods: 900000,
        water: 350000,
        energy: 450000,
        units: {
            employeeTravel: 'km',
            foodWaste: 'kg',
            purchasedGoods: 'kg',
            water: 'm³',
            energy: 'kWh'
        }
    },
    {
        year: '2023',
        employeeTravel: 600000,
        foodWaste: 400000,
        purchasedGoods: 800000,
        water: 300000,
        energy: 400000,
        units: {
            employeeTravel: 'km',
            foodWaste: 'kg',
            purchasedGoods: 'kg',
            water: 'm³',
            energy: 'kWh'
        }
    }
];


export const currentYearBreakdown = [
    { name: 'Scope 1', value: scopeData[scopeData.length - 1].scope1, unit: 'tCO2e' },
    { name: 'Scope 2', value: scopeData[scopeData.length - 1].scope2, unit: 'tCO2e' },
    { name: 'Scope 3', value: scopeData[scopeData.length - 1].scope3, unit: 'tCO2e' }
];
