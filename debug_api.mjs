import fs from 'fs';

async function testModels() {
    // We'll try to get the API key from the frontend's localStorage if we were in the browser, 
    // but here we have to ask the user or try to find it.
    // Actually, I can't easily get the user's API key here.
    // I will just try to guess the correct URL based on common mistakes.

    // Mistake 1: v1beta might be restricted or have mapping issues.
    // Mistake 2: Model name might need -latest.

    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-2.0-flash'
    ];

    console.log("Common Gemini API URIs:");
    models.forEach(m => {
        console.log(`v1: https://generativelanguage.googleapis.com/v1/models/${m}:generateContent`);
        console.log(`v1beta: https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`);
    });
}

testModels();
