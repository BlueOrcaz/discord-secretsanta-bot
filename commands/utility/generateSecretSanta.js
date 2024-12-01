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
            // Fetch the role from the interaction
            const role = interaction.options.getRole('role');
			//console.log(role);

			await interaction.guild.members.fetch();
			

            // Get all members of the role
			const members = role.members.map(member => member);
			//console.log(members);


            // Ensure there are enough participants
            if (members.length < 2) {
                await interaction.editReply('Not enough participants in this role to assign Secret Santa!');
                return;
            }

            // Shuffle the members to randomize pairs
            const shuffled = [...members];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Assign each member the next member in the list as their recipient
            const pairs = shuffled.map((giver, index) => ({
                giver,
                recipient: shuffled[(index + 1) % shuffled.length],
            }));

            // DM each member their Secret Santa recipient
            for (const pair of pairs) {
                try {
                    await pair.giver.send(
                        `Hello blud u are the Secret Santa for **${pair.recipient.user.tag}**! 🎁`
                    );
                } catch (err) {
                    console.error(`Failed to DM ${pair.giver.user.tag}:`, err);
                }
            }

            // Confirm completion
            await interaction.editReply('Secret Santa pairs have been assigned and DMs sent!');
        } catch (error) {
            console.error('Error processing Secret Santa command:', error);
            await interaction.editReply('An error occurred while processing the Secret Santa command.');
        }
		} else {
			await interaction.reply("You are not bum minh tran");
		}

        // Acknowledge the command
        
    },
};
