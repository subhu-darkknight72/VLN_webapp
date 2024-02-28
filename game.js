"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require("readline-sync");
var Item = /** @class */ (function () {
    function Item(name, description, isStatic) {
        if (isStatic === void 0) { isStatic = true; }
        this.name = name;
        this.description = description;
        this.isStatic = isStatic;
        this.contains = [];
    }
    Item.prototype.addDesc = function (desc) {
        this.description += desc;
    };
    Item.prototype.describe = function () {
        var obs = "".concat(this.description, ". ");
        var items = this.contains.map(function (item) { return item.name; });
        if (this.contains.length > 0) {
            obs += "It contains: ".concat(items.join(', '), ". ");
        }
        return obs;
    };
    Item.prototype.addItem = function (item) {
        this.contains.push(item);
    };
    Item.prototype.removeItem = function (itemName) {
        var index = this.contains.findIndex(function (item) { return item.name === itemName; });
        if (index !== -1) {
            return this.contains.splice(index, 1)[0];
        }
        return undefined;
    };
    return Item;
}());
var Room = /** @class */ (function () {
    function Room(name, description) {
        this.name = name;
        this.description = description;
        this.connectedRooms = [];
        this.items = [];
        this.itemNames = {};
        this.actions = [];
        this.connectedRoomNames = {};
        this.actSpace = ["inventory"];
    }
    Room.prototype.connectRoom = function (room) {
        if (!this.connectedRooms.includes(room)) {
            this.connectedRooms.push(room);
            room.connectedRooms.push(this); // Bidirectional connection
            this.connectedRoomNames[room.name] = room;
        }
    };
    Room.prototype.getDetails = function () {
        var obs = this.description;
        var rooms = this.connectedRooms.map(function (room) { return room.name; });
        obs += "The rooms that we can go from here are : ".concat(rooms.join(', '), ". ");
        var items = this.items.map(function (item) { return item.name; });
        obs += "The room contains : ".concat(items.join(', '), ".");
        return obs;
    };
    Room.prototype.removeItem = function (itemName) {
        var index = this.items.findIndex(function (item) { return item.name === itemName; });
        if (index !== -1) {
            var removedItem = this.items.splice(index, 1)[0];
            delete this.itemNames[itemName];
            return removedItem;
        }
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var nestedItem = item.removeItem(itemName);
            if (nestedItem) {
                return nestedItem;
            }
        }
        return undefined;
    };
    Room.prototype.addItem = function (item) {
        this.items.push(item);
        this.itemNames[item.name] = item;
    };
    Room.prototype.addAction = function (actionName) {
        this.actions.push(actionName);
    };
    Room.prototype.getActions = function () {
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            if (action === "examine") {
                for (var _b = 0, _c = this.items; _b < _c.length; _b++) {
                    var item = _c[_b];
                    this.actSpace.push("examine ".concat(item.name));
                }
            }
            else if (action === "go to") {
                for (var _d = 0, _e = this.connectedRooms; _d < _e.length; _d++) {
                    var room = _e[_d];
                    this.actSpace.push("go to ".concat(room.name));
                }
            }
            else if (action === "collect") {
                for (var _f = 0, _g = this.items; _f < _g.length; _f++) {
                    var item = _g[_f];
                    if (!item.isStatic) {
                        this.actSpace.push("collect ".concat(item.name));
                    }
                }
            }
            else {
                this.actSpace.push(action);
            }
        }
        return this.actSpace;
    };
    return Room;
}());
var Game = /** @class */ (function () {
    function Game(startingRoom) {
        this.currentRoom = startingRoom;
        var obs = "You are in the ".concat(this.currentRoom.name, ". ");
        obs += this.currentRoom.getDetails();
        console.log("ACTION: initialize and OBSERVATION: ".concat(obs));
        this.inventory = [];
    }
    Game.prototype.addToInventory = function (itemName) {
        // Attempt to add an item to the inventory from the current room
        var item = this.currentRoom.removeItem(itemName);
        if (item) {
            if (item.isStatic) {
                return "".concat(itemName, " cannot be collected. ");
            }
            else {
                this.inventory.push(item);
                return "".concat(itemName, " added to inventory. ");
            }
        }
        else {
            return "".concat(itemName, " not found in the room. ");
        }
    };
    Game.prototype.putItem = function (itemName, targetName) {
        // Use an item from the inventory on a target item in the room
        if (this.inventory.some(function (item) { return item.name === itemName; })) {
            var targetItem = this.currentRoom.itemNames[targetName];
            if (targetItem) {
                targetItem.addItem(this.removeFromInventory(itemName));
                this.currentRoom.addItem(targetItem);
                return "".concat(itemName, " placed on ").concat(targetName, ".");
            }
            else {
                return "".concat(targetName, " not found in the room.");
            }
        }
        else {
            return "".concat(itemName, " is not in your inventory.");
        }
    };
    Game.prototype.removeFromInventory = function (itemName) {
        // Remove and return an item from the inventory
        var index = this.inventory.findIndex(function (item) { return item.name === itemName; });
        var item = this.inventory.splice(index, 1)[0];
        return item;
    };
    Game.prototype.start = function () {
        while (true) {
            console.log("Current Location : ".concat(this.currentRoom.name));
            console.log("Action Space : ".concat(this.currentRoom.getActions()));
            var choice = readlineSync.question("\nAction choice (human or random) >>> ").toLowerCase();
            var command = void 0;
            if (choice === "human") {
                command = readlineSync.question("Action >>> ").toLowerCase();
            }
            else if (choice === "random") {
                command = this.currentRoom.actSpace[Math.floor(Math.random() * this.currentRoom.actSpace.length)];
            }
            else {
                console.log("Invalid Command . Try again!");
                continue;
            }
        }
    };
    return Game;
}());
var hall = new Room("hallway", "This room is called the hallway. This is the main corridor in the ground floor from which we can go to other rooms. ");
var ch1 = new Room("doctor chamber #1", "This is the doctor chamber #1. Doctors in OPD diagnose patients here. ");
var ch2 = new Room("doctor chamber #2", "This is the doctor chamber #2. Doctors in OPD diagnose patients here. ");
var gen_ward = new Room("general ward", "This is the general ward. There are a total of 5 beds with a nurse station who carries the information of the patients. ");
var icu_ward = new Room("icu ward", "This is the general ward. There are a total of 5 beds with a common toilet and a nurse station who carries the information of the patients. ");
var comm_toilet = new Room("common toilet", "This is the common toilet in the hallway. This has single occupancy. ");
var nurse_station1 = new Room("Nurse Station", "This is the nurse station. You see nurses at work here. You can get information from the nurse station.");
var nurse_station2 = new Room("Nurse Station", "This is the nurse station. You see nurses at work here. You can get information from the nurse station.");
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
var poster = new Item("wall poster", "This is a poster comprising a picture of a baby boy smiling. ");
var doctor1 = new Item("doctor #1", "He is doctor Ram specializes in orthopedics. ");
var agent = new Item("agent", "You are the agent. Your job is to complete the tasks. ");
hall.addItem(poster);
hall.addItem(doctor1);
hall.addItem(agent);
hall.addAction("examine");
hall.getActions(); // Create the Action-Observation Space
var doctor_table1 = new Item("doctor table", "This table belongs to the doctor who keeps his belongings. ");
var doc_chair1 = new Item("doctor chair", "This chair belongs to the doctor. It is near the doctor table. ");
var doc_bed1 = new Item("patient bed", "This bed in the doctor chamber is used to diagnose OPD patients by the doctor. ");
var doc_bedtable1 = new Item("patient bed table", "This bed table is beside the patient bed. ");
var bin1 = new Item("dustbin", "A dustbin for disposing waste materials");
var book1 = new Item("book", "An old leather-bound book.", false);
var lamp1 = new Item("lamp", "A small electric lamp.", false);
var waste_paper1 = new Item("waste paper", "A paper to be thrown", false);
var note_pad1 = new Item("note pad", "A notebook for the doctor to write notes", false);
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
var doctor_table2 = new Item("doctor table", "This table belongs to the doctor who keeps his belongings. ");
var doc_chair2 = new Item("doctor chair", "This chair belongs to the doctor. It is near the doctor table. ");
var doc_bed2 = new Item("patient bed", "This bed in the doctor chamber is used to diagnose OPD patients by the doctor. ");
var doc_bedtable2 = new Item("patient bed table", "This bed table is beside the patient bed. ");
var peel = new Item("banana peel", "A banana peel is lying on the ground of the room", false);
var bin2 = new Item("dustbin", "A dustbin for disposing waste materials");
var book2 = new Item("book", "An old leather-bound book.", false);
var lamp2 = new Item("lamp", "A small electric lamp.", false);
var note_pad2 = new Item("note pad", "A notebook for the doctor to write notes", false);
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
var nurse1 = new Item("Nurse", "This is a nurse. This nurse have information about where to collect waste information. ");
var pat_bed1 = new Item("Patient bed", "This bed belongs to patient #1. ");
var pat_bed2 = new Item("Patient bed", "This bed belongs to patient #2. ");
var pat_bed3 = new Item("Patient bed", "This bed belongs to patient #3. ");
var pat_bed4 = new Item("Patient bed", "This bed belongs to patient #4. ");
var pat_bed5 = new Item("Patient bed", "This bed belongs to patient #5. ");
gen_ward.addItem(pat_bed1);
gen_ward.addItem(pat_bed2);
gen_ward.addItem(pat_bed3);
gen_ward.addItem(pat_bed4);
gen_ward.addItem(pat_bed5);
gen_ward.addItem(nurse1);
gen_ward.addAction("examine");
gen_ward.getActions();
var comp_station = new Item("Computer Station", "This is a computer station comprising of 3 computers. These are used for extracting information and registration. Can only be accessed by the nurses. ");
var files = new Item("Filing cabinet", "This is the filing cabinet comprising of different patient files used during treatment by the doctors and nurses. ");
nurse_station1.addItem(comp_station);
nurse_station1.addItem(files);
nurse_station1.addAction("examine");
nurse_station1.getActions();
var game = new Game(hall);
game.start();
