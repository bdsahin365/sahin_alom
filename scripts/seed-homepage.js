// const fetch = require('node-fetch'); // Using native fetch


const REPO_NAME = 'sahin-alom'; // Your repository name

// The content we want to push (Matches your mocks)
const documentPayload = {
    title: 'Homepage',
    type: 'homepage',
    uid: 'home',
    lang: 'en-us',
    data: {
        slices: [
            {
                slice_type: 'hero',
                variation: 'default',
                primary: {
                    eyebrow: 'UX • Systems • AI',
                    name: 'Sahin Alom',
                    headline: [{ type: 'heading1', text: 'UX Designer with Engineering Systems Thinking', spans: [] }],
                    description: [{ type: 'paragraph', text: 'I combine design thinking with systems engineering principles to create intuitive, scalable digital experiences.', spans: [] }],
                    primaryCtaLabel: 'Get in Touch',
                    primaryCtaLink: '#contact',
                    secondaryCtaLabel: 'Linkedin',
                    secondaryCtaLink: { link_type: 'Web', url: 'https://www.linkedin.com' },
                    showSocialIcons: true
                },
                items: []
            },
            {
                slice_type: 'about',
                variation: 'default',
                primary: {
                    sectionTitle: 'About',
                    headline: [{ type: 'heading2', text: 'Architecting systems, not just screens.', spans: [] }],
                    description: [
                        { type: 'paragraph', text: 'Bridging the gap between vision and execution.', spans: [{ start: 0, end: 46, type: 'strong' }] },
                        { type: 'paragraph', text: 'I bring an engineering mindset to creative problems. With a background in Electrical Engineering and hands-on experience building SaaS products, I don\'t just make things look good—I ensure they work, scale, and drive specific business outcomes.', spans: [] }
                    ],
                    // Image note: We cannot upload images via Migration API easily without an asset ID. 
                    // You will need to upload the image manually in the dashboard after running this.
                },
                items: [
                    { title: 'SYSTEMIC', description: 'Scalable design systems over one-off artifacts.' },
                    { title: 'TECHNICAL', description: 'Deep understanding of the code that powers the design.' },
                    { title: 'STRATEGIC', description: 'Focus on metrics, conversion, and user retention.' }
                ]
            }
        ]
    }
};

async function createHomepage(token) {
    if (!token) {
        console.error('❌ Error: Please provide a Prismic Migration API Token.');
        console.log('Usage: node scripts/seed-homepage.js <YOUR_TOKEN>');
        return;
    }

    console.log(`🚀 Creating Homepage document in ${REPO_NAME}...`);

    try {
        const response = await fetch(`https://migration.prismic.io/repositories/${REPO_NAME}/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-api-key': token // Sometimes required depending on endpoint version
            },
            body: JSON.stringify(documentPayload)
        });

        if (response.ok) {
            const json = await response.json();
            console.log('✅ Success! Document created.');
            console.log('👉 Go to your dashboard and PUBLISH the new document.');
            console.log(json);
        } else {
            const text = await response.text();
            console.error('❌ Failed to create document:', response.status, text);
            console.log('Hint: Ensure you have the correct "Migration API" token from Settings > API & Security.');
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}

// Get token from command line argument
const token = process.argv[2];
createHomepage(token);
