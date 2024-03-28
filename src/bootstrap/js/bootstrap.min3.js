
const sentenceList = document.getElementById('sentencelist');
const sentenceButton = document.getElementById('sentencebutton');
const jsonButton = document.getElementById('jsonbutton');

const sentencesWithKeywords = JSON.parse(sessionStorage.getItem('sentencesWithKeywords'));

// Load sentenceList from sessionStorage after loading the page
window.onload = function () {
    if (sentencesWithKeywords) {
        for (const sentence of sentencesWithKeywords) {
            sentenceList.insertAdjacentHTML(
                'beforeend',
                `<p>- ${sentence}</p>`,
            );
        }
    } else {
        console.log('No data available.');
    }
};

// Toggle for the display of sentenceList
document.addEventListener('DOMContentLoaded', function () {
    sentenceButton.addEventListener('click', function () {
        if (sentenceList.style.display === 'none') {
            sentenceList.style.display = 'block';
        } else {
            sentenceList.style.display = 'none';
        }
    });
});

// Add click event listener to the Export to JSON button
jsonButton.addEventListener('click', function () {

    // Convert the content of sentencelist to JSON format
    var sentencesJson = JSON.stringify(sentencesWithKeywords);
    var blob = new Blob([sentencesJson], { type: 'application/json' });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'keywords-sentences.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
});