const query = window.location.search;
const urlParams = new URLSearchParams(query);
const filePath = urlParams.get('filepath');

document.addEventListener('DOMContentLoaded', function () {
    const fileDataString = sessionStorage.getItem('fileData');
    console.log('File Data:', fileDataString); // Log file data string to console

    if (fileDataString) {
        const arrayBuffer = stringToArrayBuffer(fileDataString); // Convert the string back to ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

        const blobUrl = URL.createObjectURL(blob);
        const embed = document.createElement('embed');
        embed.setAttribute('src', blobUrl);
        embed.setAttribute('width', '100%');
        embed.setAttribute('height', '100%');
        embed.setAttribute('type', 'application/pdf');
        const container = document.querySelector('.embed-container');
        container.appendChild(embed);
    }
});

function stringToArrayBuffer(str) {
    const buffer = new ArrayBuffer(str.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
        bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
}
