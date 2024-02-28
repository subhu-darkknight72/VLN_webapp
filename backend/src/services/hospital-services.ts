import * as readlineSync from 'readline-sync';
import {
    getObservationId
} from '../models/observations.model';

import {
    getActions,
    getNextObservation
} from '../models/actions.model';


class Item {
    name: string;
    description: string;
    action?: any;
    isStatic: boolean;
    contains: Item[];

    constructor(name: string, description: string, isStatic = true) {
        this.name = name;
        this.description = description;
        this.isStatic = isStatic;
        this.contains = [];
    }

    addDesc(desc: string): void {
        this.description += desc;
    }

    describe(): string {
        let obs = `${this.description}. `;
        const items = this.contains.map(item => item.name);
        if (this.contains.length > 0) {
            obs += `It contains: ${items.join(', ')}. `;
        }
        return obs;
    }

    addItem(item: Item): void {
        this.contains.push(item);
    }

    removeItem(itemName: string): Item | undefined {
        const index = this.contains.findIndex(item => item.name === itemName);
        if (index !== -1) {
            return this.contains.splice(index, 1)[0];
        }
        return undefined;
    }
}

class Room {
    name: string;
    description: string;
    connectedRooms: Room[];
    items: Item[];
    itemNames: { [key: string]: Item };
    actions: string[];
    connectedRoomNames: { [key: string]: Room };
    actSpace: string[];

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.connectedRooms = [];
        this.items = [];
        this.itemNames = {};
        this.actions = [];
        this.connectedRoomNames = {};
        this.actSpace = ["inventory"];
    }

    connectRoom(room: Room): void {
        if (!this.connectedRooms.includes(room)) {
            this.connectedRooms.push(room);
            room.connectedRooms.push(this); // Bidirectional connection
            this.connectedRoomNames[room.name] = room;
        }
    }

    getDetails(): string {
        let obs = this.description;
        const rooms = this.connectedRooms.map(room => room.name);
        obs += `The rooms that we can go from here are : ${rooms.join(', ')}. `;
        const items = this.items.map(item => item.name);
        obs += `The room contains : ${items.join(', ')}.`;
        return obs;
    }

    removeItem(itemName: string): Item | undefined {
        const index = this.items.findIndex(item => item.name === itemName);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            delete this.itemNames[itemName];
            return removedItem;
        }
        for (const item of this.items) {
            const nestedItem = item.removeItem(itemName);
            if (nestedItem) {
                return nestedItem;
            }
        }
        return undefined;
    }

    addItem(item: Item): void {
        this.items.push(item);
        this.itemNames[item.name] = item;
    }

    addAction(actionName: string): void {
        this.actions.push(actionName);
    }

    getActions(): string[] {
        for (const action of this.actions) {
            if (action === "examine") {
                for (const item of this.items) {
                    this.actSpace.push(`examine ${item.name}`);
                }
            } else if (action === "go to") {
                for (const room of this.connectedRooms) {
                    this.actSpace.push(`go to ${room.name}`);
                }
            } else if (action === "collect") {
                for (const item of this.items) {
                    if (!item.isStatic) {
                        this.actSpace.push(`collect ${item.name}`);
                    }
                }
            }
            else {
                this.actSpace.push(action);
            }
        }
        return this.actSpace;
    }
}

class Game {
    currentRoom: Room;
    inventory: Item[];

    constructor(startingRoom: Room) {
        this.currentRoom = startingRoom;
        let obs = `You are in the ${this.currentRoom.name}. `;
        obs += this.currentRoom.getDetails();
        console.log(`ACTION: initialize and OBSERVATION: ${obs}`);
        this.inventory = [];
    }

    addToInventory(itemName: string): string {
        // Attempt to add an item to the inventory from the current room
        const item = this.currentRoom.removeItem(itemName);
        if (item) {
            if (item.isStatic) {
                return `${itemName} cannot be collected. `;
            } else {
                this.inventory.push(item);
                return `${itemName} added to inventory. `;
            }
        } else {
            return `${itemName} not found in the room. `;
        }
    }

    putItem(itemName: string, targetName: string): string {
        // Use an item from the inventory on a target item in the room
        if (this.inventory.some(item => item.name === itemName)) {
            const targetItem = this.currentRoom.itemNames[targetName];
            if (targetItem) {
                targetItem.addItem(this.removeFromInventory(itemName));
                this.currentRoom.addItem(targetItem);
                return `${itemName} placed on ${targetName}.`;
            } else {
                return `${targetName} not found in the room.`;
            }
        } else {
            return `${itemName} is not in your inventory.`;
        }
    }

    removeFromInventory(itemName: string): Item {
        // Remove and return an item from the inventory
        const index = this.inventory.findIndex(item => item.name === itemName);
        const item = this.inventory.splice(index, 1)[0];
        return item;
    }

    start(): void {
        while (true) {
            console.log(`Current Location : ${this.currentRoom.name}`);
            console.log(`Action Space : ${this.currentRoom.getActions()}`);

            const choice: string = readlineSync.question("\nAction choice (human or random) >>> ").toLowerCase();
            let command: string;

            if (choice === "human") {
                command = readlineSync.question("Action >>> ").toLowerCase();
            } else if (choice === "random") {
                command = this.currentRoom.actSpace[Math.floor(Math.random() * this.currentRoom.actSpace.length)];
            } else {
                console.log("Invalid Command . Try again!");
                continue;
            }
        }
    }
}



class HospitalServices {
    async addHospitalAction(): Promise<any>{
        // return json response 
        return {
            message: 'Hospital added successfully'
        };
    }

    async getInitialObservation(): Promise<any>{
        try {
            const observation = 'initial observation';
            const action = 'initialize';
            const nextObservation = await getNextObservation(observation, action);
            return nextObservation;
        }
        catch (err) {
            throw err;
        }
    }

    async getActions(observation: string): Promise<any>{
        try {
            const observationId = await getObservationId(observation);
            if (!observationId) {
                throw new Error('Invalid observation');
            }
            
            const actions = await getActions(observation);
            return actions;
        }
        catch (err) {
            throw err;
        }
    }
    
    async getNextObservation(obv_from: string, action: string): Promise<any>{
        try {
            const obv_from_id = await getObservationId(obv_from);
            if (!obv_from_id) {
                throw new Error('Invalid observation');
            }
            
            const nextObservation = await getNextObservation(obv_from, action);
            return nextObservation.observation;
        }
        catch (err) {
            throw err;
        }
    }
}

export default new HospitalServices();