import { MessageEmbed } from 'discord.js';
import { CommandArgs, Command } from 'flavus';

const SkipCommand: Command = {
  name: 'skip',
  aliases: ['s'],
  description: 'Skips to next or specific track',
  usage: "`<prefix>skip` or `<prefix>s <position in queue>`",
  requirements: {
    voiceRequired: true,
    playerRequired: true,
    sameChannelRequired: true
  },

  async execute({ client, message, args, player }: CommandArgs) {
    //if queue is empty, it will be handled by the playerManager queueEnd event, so no need to handle it here
    if (args[0] && !isNaN(Number(args[0]))) {
      if (Number(args[0]) > player.queue.size || Number(args[0]) < 1) {
        //if the user wants to skip more tracks than are in the queue
        await message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Can't skip there!")
              .setColor(client.config.embed.color)
          ]
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              client.logger.error(e);
            });
            message.delete().catch((e) => {
              client.logger.error(e);
            });
          }, 5000);
        });
        return;
      } else {
        if (Number(args[0]) !== 1) player.queue.remove(0, Number(args[0]) - 1); //remove tracks from queue
      }
    }
    console.log("playerstop")
    player.stop(); // skip the track
    return message.react('⏭').catch((e) => {
      client.logger.error(e);
    });
  }
};

export default SkipCommand;
