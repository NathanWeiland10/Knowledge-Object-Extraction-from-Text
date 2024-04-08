var keywordList = [];

function updateKeywords() {
    var textOutput = document.getElementById("textOutput");
    var textInput = document.getElementById("textInput").value;
    var textArray = textInput.split(',');

    textArray.forEach(function (word, index) {
        textArray[index] = word.replace(/,/g, '').trim(); // Removing excess commas and spaces
    });

    // Add new words to the keywordList
    textArray.forEach(function (word) {
        if (word !== '' && !keywordList.includes(word)) {
            keywordList.push(word);
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

        var itemText = document.createElement("span");
        itemText.textContent = word;
        itemText.classList.add("clickable");
        listItem.appendChild(itemText);

        listItem.addEventListener("click", function () {
            this.remove();
            keywordList = keywordList.filter(item => item !== word);
        });

        container.appendChild(listItem);
    });
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


                if (keywordList.some(keyword => normalizedSentence.toLowerCase().includes(keyword.toLowerCase()))) {
                    sentenceList.insertAdjacentHTML(
                        'beforeend',
                        `<p>- ${sentence}</p>`,
                    );
                }
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