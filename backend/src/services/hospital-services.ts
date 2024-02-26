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
    action: string;
    is_static: boolean;
    contains: Item[];

    constructor(name: string, description: string, action: string, is_static: boolean = true) {
        this.name = name;
        this.description = description;
        this.action = action;
        this.is_static = is_static;
        this.contains = [];
    }

    add_desc(desc: string): void {
        this.description += desc;
    }

    describe(): string {
        let obs = `${this.description}. `;
        let items = this.contains.map(i => i.name);
        if (this.contains.length) {
            obs += `It contains: ${items.join(', ')}. `;
        }
        return obs;
    }

    add_item(item: Item): void {
        this.contains.push(item)
    }

    remove_item(item_name: string): Item | null {
        for (let i = 0; i < this.contains.length; i++) {
            if (this.contains[i].name === item_name) {
                return this.contains.splice(i, 1)[0];
            }
        }
        return null;
    }
}

/*
class Room:
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.connected_rooms = []
        self.items = []
        self.item_names = {}
        self.actions = []
        self.connected_room_names = {}
        self.act_space = ["inventory"]
        

    def connect_room(self, room):
        if room not in self.connected_rooms:
            self.connected_rooms.append(room)
            room.connected_rooms.append(self)  # Bidirectional connection
            self.connected_room_names[room.name] = room

    def get_details(self):
        obs = self.description
        rooms = [i.name for i in self.connected_rooms]
        obs += f"The rooms that we can go from here are : {', '.join(rooms)}. "
        items = [i.name for i in self.items]
        obs += f"The room contains : {', '.join(items)}."
        return obs
    
    def remove_item(self, item_name):
        # First, try to remove the item directly from the room
        for item in self.items:
            if item.name == item_name:
                self.items.remove(item)
                return item
            # If not found, check if the item is nested within another item
            else:
                nested_item = item.remove_item(item_name)
                if nested_item:
                    return nested_item
        return None

    def add_item(self, item):
        self.items.append(item)
        self.item_names[item.name] = item

    def add_action(self, action_name):
        self.actions.append(action_name)

    def get_actions(self):
        for action in self.actions:
            if action == "examine":
                for item in self.items:
                    self.act_space.append(f"examine {item.name}")
            elif action == "go to":
                for room in self.connected_rooms:
                    self.act_space.append(f"go to {room.name}")
            elif action == "collect":
                for item in self.items:
                    if item.is_static==False:  # Check for movable objects
                        self.act_space.append(f"collect {item.name}")
            else:
                self.act_space.append(action)
        return self.act_space
        
        

    def perform_action(self, action_name, game):
        if action_name in self.actions:
            self.actions[action_name](game)
        else:
            print("Action not available.")
*/

class Room {
    name: string;
    description: string;
    items: Item[];
    item_names: Map<string, Item>;
    connected_rooms: Room[];
    connected_room_names: Map<string, Room>;
    actions: string[];
    act_space: string[];

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.items = [];
        this.item_names = new Map();
        this.connected_rooms = [];
        this.connected_room_names = new Map();
        this.actions = [];
        this.act_space = ["inventory"];
    }

    connect_room(room: Room): void {
        if (!this.connected_rooms.includes(room)) {
            this.connected_rooms.push(room);
            room.connected_rooms.push(this);  // Bidirectional connection
            this.connected_room_names.set(room.name, room);
        }
    }

    get_details(): string {
        let obs = this.description;
        let rooms = Array.from(this.connected_room_names.keys());
        obs += `The rooms that we can go from here are : ${rooms.join(', ')}. `;
        let items = this.items.map(i => i.name);
        obs += `The room contains : ${items.join(', ')}.`;
        return obs;
    }

    remove_item(item_name: string): Item | null {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === item_name) {
                return this.items.splice(i, 1)[0];
            }
            else {
                let nested_item = this.items[i].remove_item(item_name);
                if (nested_item) {
                    return nested_item;
                }
            }
        }
        return null;
    }

    add_item(item: Item): void {
        this.items.push(item);
        this.item_names.set(item.name, item);
    }

    add_action(action_name: string): void {
        this.actions.push(action_name);
    }

    get_actions(): string[] {
        for (let action of this.actions) {
            if (action === "examine") {
                for (let item of this.items) {
                    this.act_space.push(`examine ${item.name}`);
                }
            }
            else if (action === "go to") {
                for (let room of this.connected_rooms) {
                    this.act_space.push(`go to ${room.name}`);
                }
            }
            else if (action === "collect") {
                for (let item of this.items) {
                    if (!item.is_static) {
                        this.act_space.push(`collect ${item.name}`);
                    }
                }
            }
            else {
                this.act_space.push(action);
            }
        }
        return this.act_space;
    }

    perform_action(action_name: string, game: Game): void {
        if (this.actions.includes(action_name)) {
            this.actions[action_name](game);
        }
        else {
            console.log("Action not available.");
        }
    }
}


/*
#### GAME CLASS ####
class Game:
    def __init__(self, starting_room):
        self.current_room = starting_room
        obs = f"You are in the {self.current_room.name}. "
        obs += self.current_room.get_details()
        print(f"ACTION : initialize and OBSERVATION : {obs}")
        self.inventory = []
    
    #### Action Functions ####
    
    def add_to_inventory(self, item_name):
        # Attempt to add an item to the inventory from the current room
        item = self.current_room.remove_item(item_name)
        if item:
            if item.is_static==True:
                obs = f"{item_name} cannot be collected. "
            elif item.is_static == False:
                self.inventory.append(item)
                obs = f"{item_name} added to inventory. "
        else:
            obs = f"{item_name} not found in the room. "
        return obs

    def put_item(self, item_name, target_name):
        # Use an item from the inventory on a target item in the room
        if item_name in [item.name for item in self.inventory]:
            for item in self.current_room.items:
                if item.name == target_name:
                    target_item = item
            if target_item:
                target_item.add_item(self.remove_from_inventory(item_name))
                self.current_room.add_item(target_item)
                obs = f"{item_name} placed on {target_name}."
            else:
                obs = f"{target_name} not found in the room."
        else:
            obs = f"{item_name} is not in your inventory."
        return obs

    def remove_from_inventory(self, item_name):
        # Remove and return an item from the inventory
        item = next(item for item in self.inventory if item.name == item_name)
        self.inventory.remove(item)
        return item

   
    #### Game Loop ####
    
    def start(self):
        while True:
            
            print(f"Current Location : {self.current_room.name}")
            print(f"Action Space : {self.current_room.get_actions()}")
            
            choice = input("\nAction choice (human or random) >>>").lower()
            if choice == "human":
                command = input("Action >>>").lower()
            elif choice == "random":
                command = random.choice(self.current_room.get_actions())
            else : 
                print("Invalid Command. Try again!")
                continue


            if command.startswith("go to"):
                room_name = command[len("go to "):]
                self.current_room = self.current_room.connected_room_names[room_name]
                obs = self.current_room.get_details()
                print(f"ACTION : {command} and OBSERVATION : {obs}")
            
            elif command.startswith("collect"):
                item_name = command[len("collect "):]
                obs = self.add_to_inventory(item_name) 
                self.current_room.act_space.remove(f"collect {item_name}")
                print(f"ACTION : {command} and OBSERVATION : {obs}")
            
            elif command.startswith("put"):
                pattern = r"^put\s+(.*?)\s+on\s+(.*)$"
                match = re.search(pattern, command)
                if match:
                    item_name = match.group(1)  # The first capturing group (item name)
                    target_name = match.group(2)
                obs = self.put_item(item_name, target_name)
                print(f"ACTION : {command} and OBSERVATION : {obs}")
            
            elif command.startswith("examine"):
                item_name = command[len("examine "):]
                item = self.current_room.item_names[item_name]
                obs = item.describe()
                if item.contains:
                    for i in item.contains:
                        if i.is_static==False and f"collect {i.name}" not in self.current_room.act_space:
                           self.current_room.act_space.append(f"collect {i.name}") 
                print(f"ACTION : {command} and OBSERVATION : {obs}")

            elif command == "inventory":
                items = [i.name for i in self.inventory]
                obs = f"Your inventory includes : {','.join(items)}. "
                print(f"ACTION : {command} and OBSERVATION : {obs}")
            
            else:
                print("Invalid action.")

*/
class Game {
    current_room: Room;
    inventory: Item[];

    constructor(starting_room: Room) {
        this.current_room = starting_room;
        let obs = `You are in the ${this.current_room.name}. `;
        obs += this.current_room.get_details();
        console.log(`ACTION : initialize and OBSERVATION : ${obs}`);
        this.inventory = [];
    }

    add_to_inventory(item_name: string): string {
        let item = this.current_room.remove_item(item_name);
        if (item) {
            if (item.is_static) {
                return `${item_name} cannot be collected. `;
            }
            else {
                this.inventory.push(item);
                return `${item_name} added to inventory. `;
            }
        }
        else {
            return `${item_name} not found in the room. `;
        }
    }

    put_item(item_name: string, target_name: string): string {
        if (this.inventory.some(i => i.name === item_name)) {
            let target_item = this.current_room.item_names.get(target_name);
            if (target_item) {
                target_item.add_item(this.remove_from_inventory(item_name));
                this.current_room.add_item(target_item);
                return `${item_name} placed on ${target_name}.`;
            }
            else {
                return `${target_name} not found in the room.`;
            }
        }
        else {
            return `${item_name} is not in your inventory.`;
        }
    }

    remove_from_inventory(item_name: string): Item {
        let item = this.inventory.find(i => i.name === item_name);
        this.inventory = this.inventory.filter(i => i.name !== item_name);
        return item;
    }

    start(): void {
        while (true) {
            console.log(`Current Location : ${this.current_room.name}`);
            console.log(`Action Space : ${this.current_room.get_actions()}`);
            let choice = 'human';
            let command = '';
            if (choice === "human") {
                command = 'go to';
            }
            else if (choice === "random") {
                command = 'go to';
            }
            else {
                console.log("Invalid Command. Try again!");
                continue;
            }

            if (command.startsWith("go to")) {
                let room_name = command.slice("go to ".length);
                this.current_room = this.current_room.connected_room_names.get(room_name);
                let obs = this.current_room.get_details();
                console
                console.log(`ACTION : ${command} and OBSERVATION : ${obs}`);
            }

            else if (command.startsWith("collect")) {
                let item_name = command.slice("collect ".length);
                let obs = this.add_to_inventory(item_name);
                this.current_room.act_space = this.current_room.act_space.filter(a => a !== `collect ${item_name}`);
                console.log(`ACTION : ${command} and OBSERVATION : ${obs}`);
            }

            else if (command.startsWith("put")) {
                let pattern = /^put\s+(.*?)\s+on\s+(.*)$/;
                let match = command.match(pattern);
                if (match) {
                    let item_name = match[1];
                    let target_name = match[2];
                    let obs = this.put_item(item_name, target_name);
                    console.log(`ACTION : ${command} and OBSERVATION : ${obs}`);
                }
            }

            else if (command.startsWith("examine")) {
                let item_name = command.slice("examine ".length);
                let item = this.current_room.item_names.get(item_name);
                let obs = item.describe();
                if (item.contains) {
                    for (let i of item.contains) {
                        if (!i.is_static && !this.current_room.act_space.includes(`collect ${i.name}`)) {
                            this.current_room.act_space.push(`collect ${i.name}`);
                        }
                    }
                }
                console.log(`ACTION : ${command} and OBSERVATION : ${obs}`);
            }

            else if (command === "inventory") {
                let items = this.inventory.map(i => i.name);
                let obs = `Your inventory includes : ${items.join(',')}. `;
                console.log(`ACTION : ${command} and OBSERVATION : ${obs}`);
            }

            else {
                console.log("Invalid action.");
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