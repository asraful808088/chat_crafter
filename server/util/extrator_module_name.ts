export default function findNames(text) {
    const taskRegex = /(?:import|from)\s+task\.(\w+)\./g;
    const entitiesBoxRegex = /(?:import|from)\s+entities_box\.(\w+)\./g;

    let taskItems = [];
    let entitiesBoxItems = [];
    let match;

    while ((match = taskRegex.exec(text)) !== null) {
        taskItems.push(match[1]);
    }
    while ((match = entitiesBoxRegex.exec(text)) !== null) {
        entitiesBoxItems.push(match[1]);
    }
    return { task: taskItems, entities: entitiesBoxItems };
}