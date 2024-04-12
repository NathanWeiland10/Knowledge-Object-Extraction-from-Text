var keywordList = [];
var matchedSentences = [];
const sentenceList = document.getElementById('annotations');

function updateKeywords() {
    var textOutput = document.getElementById("textOutput");
    var textInput = document.getElementById("textInput").value;
    var textArray = textInput.split(',');

    textArray.forEach(function (word, index) {
        textArray[index] = word.replace(/,/g, '').trim(); // Removing excess commas and spaces
    });

    // Add new words to the keywordList
    textArray.forEach(function (word) {
        if (word !== '' && !keywordList.includes(word.toLowerCase())) {
            keywordList.push(word.toLowerCase());
        }
    });

    renderKeywordList(textOutput);
}

function renderKeywordList(container) {
    // Reset the HTML of the list
    container.innerHTML = "";
    keywordList.forEach(function (word) {
        var listItem = document.createElement("li");
        listItem.className = "list-item";

        // Create trashcan icon
        var trashIcon = document.createElement("i");
        trashIcon.className = "fas fa-trash-alt";
        trashIcon.style.marginRight = "5px";
        trashIcon.style.color = "red";
        trashIcon.addEventListener("click", function () {
            listItem.remove();
            keywordList = keywordList.filter(item => item !== word);
        });

        var itemText = document.createElement("span");
        itemText.textContent = word;
        itemText.classList.add("clickable");
        listItem.appendChild(trashIcon);
        listItem.appendChild(itemText);

        container.appendChild(listItem);
    });
}

function addBlankAnnotation() {
    var listItem = document.createElement("li");
    listItem.className = "list-item";

    // Create trashcan icon
    var trashIcon = document.createElement("i");
    trashIcon.className = "fas fa-trash-alt";
    trashIcon.style.marginRight = "5px";
    trashIcon.style.color = "red";
    trashIcon.addEventListener("click", function () {
        listItem.remove();
    });

    var itemText = document.createElement("div");
    itemText.textContent = "(Enter annotation here)";
    itemText.classList.add("editable");
    itemText.contentEditable = true;
    listItem.appendChild(trashIcon);
    listItem.appendChild(itemText);

    var sentenceList = document.getElementById('annotations');
    sentenceList.appendChild(listItem);
}

function readPDF() {
    const fileDataString = sessionStorage.getItem('fileData');
    const arrayBuffer = stringToArrayBuffer(fileDataString); // Convert the string back to ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    const reader = new FileReader();
    const textContent = [];

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

            // Filter sentences containing keywords
            const filteredSentences = sentences.filter((sentence) => {
                const normalizedSentence = sentence.replace(/\s+/g, ' ').trim();
                return keywordList.some(keyword => normalizedSentence.toLowerCase().includes(keyword.toLowerCase()));
            });

            filteredSentences.forEach((sentence) => {
                if (!matchedSentences.includes(sentence.toLowerCase())) {
                    matchedSentences.push(sentence.toLowerCase());
            
                    var listItem = document.createElement("li");
                    listItem.className = "list-item";
            
                    // Create trashcan icon
                    var trashIcon = document.createElement("i");
                    trashIcon.className = "fas fa-trash-alt";
                    trashIcon.style.marginRight = "5px";
                    trashIcon.style.color = "red";
                    trashIcon.addEventListener("click", function () {
                        listItem.remove();
                        matchedSentences = matchedSentences.filter(item => item !== sentence.toLowerCase());
                    });
            
                    var itemText = document.createElement("div");
                    itemText.textContent = sentence;
                    itemText.classList.add("editable");
                    itemText.contentEditable = true;
                    listItem.appendChild(trashIcon);
                    listItem.appendChild(itemText);            
                    sentenceList.appendChild(listItem);
                }
            });
            
        }).catch((error) => {
            console.error('Error reading PDF:', error);
        });
    };

    reader.readAsArrayBuffer(blob);
}