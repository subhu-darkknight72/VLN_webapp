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

// class Room:
//     def __init__(self, name, description):
//         self.name = name
//         self.description = description
//         self.connected_rooms = []
//         self.items = []
//         self.item_names = {}
//         self.actions = []
//         self.connected_room_names = {}
//         self.act_space = ["inventory"]
        

//     def connect_room(self, room):
//         if room not in self.connected_rooms:
//             self.connected_rooms.append(room)
//             room.connected_rooms.append(self)  # Bidirectional connection
//             self.connected_room_names[room.name] = room

//     def get_details(self):
//         obs = self.description
//         rooms = [i.name for i in self.connected_rooms]
//         obs += f"The rooms that we can go from here are : {', '.join(rooms)}. "
//         items = [i.name for i in self.items]
//         obs += f"The room contains : {', '.join(items)}."
//         return obs
    
//     def remove_item(self, item_name):
//         # First, try to remove the item directly from the room
//         for item in self.items:
//             if item.name == item_name:
//                 self.items.remove(item)
//                 return item
//             # If not found, check if the item is nested within another item
//             else:
//                 nested_item = item.remove_item(item_name)
//                 if nested_item:
//                     return nested_item
//         return None

//     def add_item(self, item):
//         self.items.append(item)
//         self.item_names[item.name] = item

//     def add_action(self, action_name):
//         self.actions.append(action_name)

//     def get_actions(self):
//         for action in self.actions:
//             if action == "examine":
//                 for item in self.items:
//                     self.act_space.append(f"examine {item.name}")
//             elif action == "go to":
//                 for room in self.connected_rooms:
//                     self.act_space.append(f"go to {room.name}")
//             elif action == "collect":
//                 for item in self.items:
//                     if item.is_static==False:  # Check for movable objects
//                         self.act_space.append(f"collect {item.name}")
//             else:
//                 self.act_space.append(action)
//         return self.act_space
        
        

//     def perform_action(self, action_name, game):
//         if action_name in self.actions:
//             self.actions[action_name](game)
//         else:
//             print("Action not available.")

class Room {
    name: string;
    description: string;
    items: Item[];
    item_names: Map<string, Item>;
    connected_rooms: Room[];
    connected_room_names: Map<string, Room>;
        
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