// Get elements from the HTML
const summarizeBtn = document.getElementById('summarize-btn');
const textInput = document.getElementById('text-input');
const summaryOutput = document.getElementById('summary-output');

// The Hugging Face API URL for the summarization model
const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

summarizeBtn.addEventListener('click', async () => {
    const textToSummarize = textInput.value;

    if (textToSummarize.length < 200) {
        alert("Please enter a bit more text to summarize!");
        return;
    }

    // Ask the user for their API key (or you enter yours when testing!)
    const API_TOKEN = prompt("Please enter your Hugging Face API Key to use this service:");
    
    if (!API_TOKEN) {
        alert("An API key is required to summarize text.");
        return;
    }

    summarizeBtn.textContent = "Summarizing...";
    summarizeBtn.disabled = true;
    summaryOutput.value = "";

    try {
       
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: textToSummarize })
        });

        const data = await response.json();

        // Check if the API returned an error (like an invalid key)
        if (data.error) {
            summaryOutput.value = `Error: ${data.error}`;
        } else {
            summaryOutput.value = data[0].summary_text;
        }

    } catch (error) {
        console.error("Error:", error);
        summaryOutput.value = "An error occurred while summarizing. Please try again.";
    } finally {
        summarizeBtn.textContent = "Summarize Text";
        summarizeBtn.disabled = false;
    }
});
