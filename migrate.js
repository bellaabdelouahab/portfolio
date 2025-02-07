const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./portfolio-d0eff-firebase-adminsdk-m2qoy-aeb5920ad6.json');
// Initialize admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'portfolio-d0eff'
});

const db = admin.firestore();

// Read JSON file
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Import data
async function importData() {
    const projects = data.data;
    console.log('Data:', projects);
    
    for (const project of projects) {
        await db.collection('certificates').doc(project._id).set(project);
    }
}

importData();