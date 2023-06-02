import { Message, MessageEmbed } from 'discord.js';
import { CommandArgs, iCommand } from 'flavus';

const ResumeCommand: iCommand = {
  name: 'resume',
  aliases: ['rs'],
  voiceRequired: true,
  playerRequired: true,
  sameChannelRequired: true,
  visible: true,
  description: 'Resumes music if paused',
  usage: '<prefix>resume',
  async execute({ client, message, player }: CommandArgs) {
    if (player.playing) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.config.embed.color)
            .setTitle('I am not paused!')
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
    }
    player.pause(false);
    message.react('⏯').catch((e) => {
      client.logger.error(e);
    });
  }
};

export default ResumeCommand;
