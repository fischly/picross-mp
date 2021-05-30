
export function handleCreateRoomMessage(message) {
    let userId = message.userId;
    let seed = (message.seed === undefined) ? Date.now() : message.seed;

    console.log(`[CreateRoom] got CreateRoom message (userId = ${userId}, seed = ${seed})`);

    
}