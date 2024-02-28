import * as readlineSync from 'readline-sync';

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


const hall = new Room("hallway", "This room is called the hallway. This is the main corridor in the ground floor from which we can go to other rooms. ");
const ch1 = new Room("doctor chamber #1", "This is the doctor chamber #1. Doctors in OPD diagnose patients here. ");
const ch2 = new Room("doctor chamber #2", "This is the doctor chamber #2. Doctors in OPD diagnose patients here. ");
const gen_ward = new Room("general ward", "This is the general ward. There are a total of 5 beds with a nurse station who carries the information of the patients. ");
const icu_ward = new Room("icu ward", "This is the general ward. There are a total of 5 beds with a common toilet and a nurse station who carries the information of the patients. ");
const comm_toilet = new Room("common toilet", "This is the common toilet in the hallway. This has single occupancy. ");
const nurse_station1 = new Room("Nurse Station", "This is the nurse station. You see nurses at work here. You can get information from the nurse station.");
const nurse_station2 = new Room("Nurse Station", "This is the nurse station. You see nurses at work here. You can get information from the nurse station.");

hall.connectRoom(ch1);
hall.connectRoom(ch2);
hall.connectRoom(gen_ward);
hall.connectRoom(icu_ward);
hall.connectRoom(comm_toilet);
hall.connectRoom(nurse_station1);
ch2.connectRoom(nurse_station2);

hall.addAction("go to");
ch1.addAction("go to");
ch2.addAction("go to");
gen_ward.addAction("go to");
icu_ward.addAction("go to");
comm_toilet.addAction("go to");
nurse_station1.addAction("go to");
nurse_station2.addAction("go to");

const poster = new Item("wall poster", "This is a poster comprising a picture of a baby boy smiling. ");
const doctor1 = new Item("doctor #1", "He is doctor Ram specializes in orthopedics. ");
const agent = new Item("agent", "You are the agent. Your job is to complete the tasks. ");

hall.addItem(poster);
hall.addItem(doctor1);
hall.addItem(agent);

hall.addAction("examine");
hall.getActions();  // Create the Action-Observation Space


let doctor_table1 = new Item("doctor table", "This table belongs to the doctor who keeps his belongings. ");
let doc_chair1 = new Item("doctor chair", "This chair belongs to the doctor. It is near the doctor table. ");
let doc_bed1 = new Item("patient bed", "This bed in the doctor chamber is used to diagnose OPD patients by the doctor. ");
let doc_bedtable1 = new Item("patient bed table", "This bed table is beside the patient bed. ");
let bin1 = new Item("dustbin", "A dustbin for disposing waste materials");

let book1 = new Item("book", "An old leather-bound book.", false);
let lamp1 = new Item("lamp", "A small electric lamp.", false);
let waste_paper1 = new Item("waste paper", "A paper to be thrown", false);
let note_pad1 = new Item("note pad", "A notebook for the doctor to write notes", false);

doctor_table1.addItem(book1);
doctor_table1.addItem(lamp1);
doctor_table1.addItem(waste_paper1);
doctor_table1.addItem(note_pad1);

ch1.addItem(doctor_table1);
ch1.addItem(doc_chair1);
ch1.addItem(doc_bed1);
ch1.addItem(doc_bedtable1);
ch1.addItem(bin1);

ch1.addAction("examine");
ch1.addAction("collect");
ch1.getActions();

let doctor_table2 = new Item("doctor table", "This table belongs to the doctor who keeps his belongings. ");
let doc_chair2 = new Item("doctor chair", "This chair belongs to the doctor. It is near the doctor table. ");
let doc_bed2 = new Item("patient bed", "This bed in the doctor chamber is used to diagnose OPD patients by the doctor. ");
let doc_bedtable2 = new Item("patient bed table", "This bed table is beside the patient bed. ");
let peel = new Item("banana peel", "A banana peel is lying on the ground of the room", false);
let bin2 = new Item("dustbin", "A dustbin for disposing waste materials");

let book2 = new Item("book", "An old leather-bound book.", false);
let lamp2 = new Item("lamp", "A small electric lamp.", false);
let note_pad2 = new Item("note pad", "A notebook for the doctor to write notes", false);

doctor_table2.addItem(book2);
doctor_table2.addItem(lamp2);
doctor_table2.addItem(note_pad2);

ch2.addItem(doctor_table2);
ch2.addItem(doc_chair2);
ch2.addItem(doc_bed2);
ch2.addItem(doc_bedtable2);
ch2.addItem(peel);
ch2.addItem(bin2);

ch2.addAction("examine");
ch2.addAction("collect");
ch2.getActions();

let nurse1 = new Item("Nurse", "This is a nurse. This nurse have information about where to collect waste information. ");
let pat_bed1 = new Item("Patient bed", "This bed belongs to patient #1. ");
let pat_bed2 = new Item("Patient bed", "This bed belongs to patient #2. ");
let pat_bed3 = new Item("Patient bed", "This bed belongs to patient #3. ");
let pat_bed4 = new Item("Patient bed", "This bed belongs to patient #4. ");
let pat_bed5 = new Item("Patient bed", "This bed belongs to patient #5. ");

gen_ward.addItem(pat_bed1);
gen_ward.addItem(pat_bed2);
gen_ward.addItem(pat_bed3);
gen_ward.addItem(pat_bed4);
gen_ward.addItem(pat_bed5);
gen_ward.addItem(nurse1);

gen_ward.addAction("examine");
gen_ward.getActions();

let comp_station = new Item("Computer Station", "This is a computer station comprising of 3 computers. These are used for extracting information and registration. Can only be accessed by the nurses. ");
let files = new Item("Filing cabinet", "This is the filing cabinet comprising of different patient files used during treatment by the doctors and nurses. ");

nurse_station1.addItem(comp_station);
nurse_station1.addItem(files);

nurse_station1.addAction("examine");
nurse_station1.getActions();

const game = new Game(hall);

game.start();