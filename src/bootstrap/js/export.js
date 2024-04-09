function exportData() {

    const sentencesWithKeywords = JSON.parse(sessionStorage.getItem('sentencesWithKeywords'));

    var sentencesJson = JSON.stringify(sentencesWithKeywords);
    var blob = new Blob([sentencesJson], { type: 'application/json' });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}