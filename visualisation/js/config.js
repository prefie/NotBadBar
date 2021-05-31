import {Liquid, Topping} from "../../logic/Ingredient";

export const colors = {
    'Absinthe': 'green',
    'Aperol': 'orange',
    'Blue-Curasao': 'blue',
    'Bombay-Sapphire': 'lightskyblue',
    'Campari': 'red'
};

export const glasses = [
    "water-glass",
    "short-glass",
    "tall-glass",
    "round-glass"
];

export const liquids = [
    new Liquid("Absinthe", 4),
    new Liquid("Aperol", 5),
    new Liquid('Blue-Curasao', 7),
    new Liquid('Bombay-Sapphire', 9),
    new Liquid("Campari", 7)
];

export const toppings = [
    new Topping("Lime", 10),
    new Topping("Cherry", 10),
    new Topping("Olive", 5),
    new Topping("Strawberry", 8)
];