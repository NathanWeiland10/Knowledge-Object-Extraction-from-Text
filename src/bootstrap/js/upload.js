const formData = new FormData();

let filePath = "";

const form = document.querySelector('form');
const statusMessage = document.getElementById('statusMessage');
const fileInput = document.querySelector('input');
const progressBar = document.querySelector('progress');
const fileNum = document.getElementById('fileNum');
const fileListMetadata = document.getElementById('fileListMetadata');

const continueButton = document.getElementById('continuebutton');

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    const file = fileInput.files[0];

    if (file) {
        filePath = URL.createObjectURL(file);
        handleSubmit();

        const reader = new FileReader();
        reader.onload = function (event) {
            const arrayBuffer = event.target.result; // Obtained ArrayBuffer
            const arrayBufferString = arrayBufferToString(arrayBuffer); // Convert ArrayBuffer to string
            sessionStorage.setItem('fileData', arrayBufferString); // Store the ArrayBuffer in sessionStorage
        };
        reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    } else {
        console.log("Error: File not selected");
    }
}

function arrayBufferToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function arrayBufferToString(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

function stringToArrayBuffer(str) {
    const buffer = new ArrayBuffer(str.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
        bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
}

function handleSubmit() {
    const file = fileInput.files[0];

    showPendingState();

    uploadFiles(file);
}

function handleInputChange() {
    resetFormState();

    try {
        assertFilesValid(fileInput.files);
    } catch (err) {
        updateStatusMessage(err.message);
        return;
    }
}

function uploadFiles(file) {
    const url = 'https://httpbin.org/post';
    const method = 'post';

    const xhr = new XMLHttpRequest();

    const data = new FormData();
    data.append('user-file', file, 'user-file.pdf');

    xhr.upload.addEventListener('progress', (event) => {
        updateStatusMessage(`⏳ Uploaded ${event.loaded} bytes of ${event.total}`);
        updateProgressBar(event.loaded / event.total);
    });

    xhr.addEventListener('loadend', () => {
        if (xhr.status === 200) {
            updateStatusMessage('✅ Success');
            renderFilesMetadata([file]);
            continueButton.style.display = 'block';
            // readPDF(file);
        } else {
            updateStatusMessage('❌ Error');
        }

        updateProgressBar(0);
    });

    xhr.open(method, url);
    xhr.send(data);
}

function updateStatusMessage(text) {
    statusMessage.textContent = text;
}

function showPendingState() {
    updateStatusMessage('⏳ Pending...');
}

function resetFormState() {
    updateStatusMessage(`Nothing's uploaded`);

    fileListMetadata.textContent = '';
    fileNum.textContent = '0';
}

function updateProgressBar(value) {
    const percent = value * 100;
    progressBar.value = Math.round(percent);
}

function renderFilesMetadata(fileList) {
    fileNum.textContent = fileList.length;

    fileListMetadata.textContent = '';

    for (const file of fileList) {
        const name = file.name;
        const type = file.type;
        const size = file.size;

        fileListMetadata.insertAdjacentHTML(
            'beforeend',
            `
        <li>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Size:</strong> ${size} bytes</p>
        </li>`,
        );
    }
}

function assertFilesValid(fileList) {
    const allowedTypes = ['application/pdf'];
    const sizeLimit = (1024 * 1024) * 5; // 5 megabyte

    for (const file of fileList) {
        const { name: fileName, size: fileSize } = file;

        if (!allowedTypes.includes(file.type)) {
            throw new Error(
                `❌ File "${fileName}" could not be uploaded. Only PDFs are allowed`,
            );
        }

        if (fileSize > sizeLimit) {
            throw new Error(
                `❌ File "${fileName}" could not be uploaded. Only images up to 1 MB are allowed.`,
            );
        }
    }
}

// exportButton.addEventListener('click', function () {
//     sessionStorage.setItem('sentencesWithKeywords', JSON.stringify(sentencesWithKeywords));
//     window.location.href = 'export.html';
// });

continueButton.addEventListener('click', function () {
    // sessionStorage.setItem('sentencesWithKeywords', JSON.stringify(sentencesWithKeywords));
    // window.location.href = "upload.html?text=";
    window.location.href = 'keywords.html?filepath=' + encodeURIComponent(filePath);
});