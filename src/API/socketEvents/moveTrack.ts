import { SocketEvent } from 'flavus-api';
import { Player } from 'erela.js';
import { getPlayer } from '../player';

interface IMooveIndex {
  removedIndex: number;
  addedIndex: number;
}

const PauseEvent: SocketEvent = {
  name: 'moveTrack',
  async execute(client, socket, data: IMooveIndex): Promise<any> {
    if (
      !data ||
      !data.removedIndex && data.removedIndex !== 0||
      !data.addedIndex && data.addedIndex !== 0 ||
      typeof data.addedIndex !== 'number' ||
      typeof data.removedIndex !== 'number'
    )
    //if data.removedIndex is missing return error
    
      return socket.emit('playerError', 'Move data is corrupted!');
    const voiceCache = client.APICache.voice.get(
      socket.request.session.user.id
    );
    if (!voiceCache)
      return socket.emit('playerError', "I can't see you connected!");

    const player: Player = client.manager.players.get(
      client.APICache.voice.get(socket.request.session.user.id).voiceChannel
        .guild.id
    );

    if (!player)
      return socket.emit(
        'playerError',
        'Cant moove track, there is no player!'
      );

    if (player.queue.size === 0 || data.addedIndex < 0 || data.removedIndex < 0 || data.removedIndex > player.queue.size || data.addedIndex > player.queue.size)
      return socket.emit('playerError', `Corrupted track index`);
    //remove track from queue according to removedIndex, and add it to the queue according to addedIndex
    const track = player.queue[data.removedIndex];
    player.queue.remove(data.removedIndex);
    player.queue.add(track, data.addedIndex);
    getPlayer(client, socket);
  }
};

export default PauseEvent;
