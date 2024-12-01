const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generatesecretsanta')
        .setDescription('Assign Secret Santa pairs for a role and DM each participant.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to assign Secret Santa for.')
                .setRequired(true)
        ),
    async execute(interaction) {
		if(interaction.user.id === "362542194072092673" ) {
			await interaction.reply('Processing Secret Santa pairs...');

        try {
            const role = interaction.options.getRole('role');
			await interaction.guild.members.fetch();
			const members = role.members.map(member => member);

            
            if (members.length < 2) {
                await interaction.editReply('Not enough participants in this role to assign Secret Santa!');
                return;
            }

			// used gpt to code this part :skull:
            const shuffled = [...members];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            const pairs = shuffled.map((giver, index) => ({
                giver,
                recipient: shuffled[(index + 1) % shuffled.length],
            }));
			//

            for (const pair of pairs) {
                try {
                    await pair.giver.send(
                        `Hello, you are the Secret Santa for **${pair.recipient.user.tag}**!`
                    );
                } catch (err) {
                    console.error(`Failed to DM ${pair.giver.user.tag}:`, err);
                }
            }

            await interaction.editReply('DMs sent!');
        } catch (error) {
            console.error('Error processing Secret Santa command:', error);
            await interaction.editReply('An error occurred while processing the Secret Santa command.');
        }
		} else {
			await interaction.reply("You are not BlueOrcaZ!");
		}

        
    },
};
