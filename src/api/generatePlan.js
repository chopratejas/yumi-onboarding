const OpenAI = require("openai").default;

module.exports = async (req, res) => {
    const { companyName, newHireName, jobDescription, teamsInteraction, managementAndProjects } = req.body;
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const prompt = `Generate a 30-60-90 day onboarding plan for ${newHireName} based on the following details:
                        Job Description: ${jobDescription}
                        Teams Interaction: ${teamsInteraction}
                        Management and Projects: ${managementAndProjects}
                        Add information of the company: ${companyName}.
                        Include some basic document links and resources for the new hire, initially.
                        Explain the company vision, mission, products, teams, orgs, etc. initially.
                        Feel free to prepare a very well structured onboarding document.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role: "user",
                    content: "Generate the onboarding plan."
                }
            ],
            max_tokens: 600  // Increased max_tokens to allow for more detailed content
        });


        response.choices.forEach(choice => {
            console.log(`Completion: ${choice.message.content}`);
        });


        const text = response.choices[0].message.content.trim().split('\n');

        // Constructing the final onboarding document
        const plan = [
            `Welcome to ${companyName}, ${newHireName}!`,
            "We are thrilled to have you join our team. Below is your personalized onboarding plan designed to help you get started and progressively take on responsibilities.",
            ...text
        ];

        console.log(plan
        )
        res.json({ success: true, plan: plan });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ success: false, message: "Failed to generate the plan" });
    }
};