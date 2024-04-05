const formData = new FormData();

// document.getElementById('form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     const userFile = document.getElementById('file').files[0];

//     formData.append('user-file', userFile, 'user-file.pdf');

//     fetch('https://httpbin.org/post', {
//         method: "POST",
//         body: formData,
//     })
//         .then(res => res.json())
//         .then(data => console.log(data))
//         .catch(err => console.log(err));
// })

let filePath = "";

const form = document.querySelector('form');
const statusMessage = document.getElementById('statusMessage');
// const submitButton = document.getElementById('submitButton');
const fileInput = document.querySelector('input');
const progressBar = document.querySelector('progress');
const fileNum = document.getElementById('fileNum');
const fileListMetadata = document.getElementById('fileListMetadata');
const sentencesWithKeywords = [];

// const exportButton = document.getElementById('exportbutton');

const continueButton = document.getElementById('continuebutton');

// form.addEventListener('submit', handleSubmit);
fileInput.addEventListener('change', handleFileSelect);

// Get the text from the URL query parameter
// var queryString = window.location.search;
// var urlParams = new URLSearchParams(queryString);
// var text = urlParams.get('text');

// var textCleanedDots = text.replace(/•/g, '');
// var textArray = textCleanedDots.split(',,');

// textArray.forEach(function (word, index) {
//     textArray[index] = word.replace(/,/g, ''); // Removing excess commas
// });

// textArray.forEach(function (word, index) {
//     textArray[index] = word.replace(/ \s+/g, ' '); // Removing excess spaces
// });

// textArray.forEach(function (word, index) {
//     textArray[index] = word.trim(); // Trimming each keyword / keyphrase
// });

// Populate the list with each word
// var userList = document.getElementById("userText");
// textArray.forEach(function (word) {
//     var listItem = document.createElement("li");
//     listItem.textContent = word;
//     userList.appendChild(listItem);
// });

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

    // submitButton.disabled = false;
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
            readPDF(file);
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
    // submitButton.disabled = true;
    updateStatusMessage('⏳ Pending...');
}

function resetFormState() {
    // submitButton.disabled = true;
    updateStatusMessage(`🤷‍♂ Nothing's uploaded`);

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
    const sizeLimit = 1024 * 1024; // 1 megabyte

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

function readPDF(file) {
    console.log("filePath" + filePath);
    const reader = new FileReader();
    const textContent = [];
    // const keywordList = textArray;

    reader.onload = function (event) {
        const pdfData = event.target.result;

        // Using PDF.js to load and parse the PDF data
        Promise.resolve().then(() => {
            return pdfjsLib.getDocument({ data: pdfData }).promise;
        }).then((pdf) => {
            const numPages = pdf.numPages;

            // Loop through each page to extract text content
            const promises = [];
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                promises.push(pdf.getPage(pageNum).then(function (page) {
                    return page.getTextContent();
                }).then(function (content) {
                    textContent.push(content.items.map(function (item) {
                        return item.str;
                    }).join(' '));
                }));
            }

            // Wait for all promises to resolve
            return Promise.all(promises);
        }).then(() => {
            // Combine text content from all pages into a single string
            const fullText = textContent.join(' ');

            // Split the text into sentences
            // Updated to prevent issues from abbreviations, such as Mr. and Mrs.
            // Updated to split on · and • for bullet pointed lists
            const sentences = fullText.split(/(?<!\b(?:Mr|Mrs|Ms|Dr)\.)\s*[\.\?!•·](?=\s*[A-Z])/g);

            // console.log(keywordList);

            // Filter sentences containing keywords
            sentences.forEach((sentence) => {
                const normalizedSentence = sentence.replace(/\s+/g, ' ').trim();


                // if (keywordList.some(keyword => normalizedSentence.toLowerCase().includes(keyword.toLowerCase()))) {
                //     sentencesWithKeywords.push(normalizedSentence);
                // }
            });

            // console.log('Sentences with Keywords:', sentencesWithKeywords);

            // Output how many sentences were found containing keywords
        //     fileListMetadata.insertAdjacentHTML(
        //         'beforeend',
        //         `
        //   <li>
        //     <p><strong>Keyword Matches:</strong> ${sentencesWithKeywords.length} sentences found containing the provided keywords</p>
        //   </li>`,
        //     );

        }).catch((error) => {
            console.error('Error reading PDF:', error);
        });
    };

    reader.readAsArrayBuffer(file);
}

// exportButton.addEventListener('click', function () {
//     sessionStorage.setItem('sentencesWithKeywords', JSON.stringify(sentencesWithKeywords));
//     window.location.href = 'export.html';
// });

continueButton.addEventListener('click', function () {
    // sessionStorage.setItem('sentencesWithKeywords', JSON.stringify(sentencesWithKeywords));
    // window.location.href = "upload.html?text=";
    window.location.href = 'test.html?filepath=' + encodeURIComponent(filePath);
});