function exportData() {

    const annotationsHTML = document.getElementById('annotations');
    const keywordsHTML = document.getElementById('textOutput');

    const annotations = Array.from(annotationsHTML.children).map(item => item.textContent.trim());
    const nonEmptyAnnotations = annotations.filter(text => text !== "");

    const keywords = Array.from(keywordsHTML.children).map(item => item.textContent.trim());

    let str = ""; // Used to store all data that will be exported

    // Creating nodes
    str += createDocNode() + "\n";

    let id = 1;
    let neo4jImportId = 1;
    keywords.forEach(keyword => {
        str += createKeyTermNode(id, keyword, neo4jImportId) + "\n";
        id++;
        neo4jImportId++;
    });

    let annotateId = 1;
    nonEmptyAnnotations.forEach(annotation => {

        const listItem = Array.from(annotationsHTML.children)[annotateId - 1];
        const confSlider = listItem.querySelector('input[type="range"]');
        const likeSlider = listItem.querySelectorAll('input[type="range"]')[1];

        const confScore = parseInt(confSlider.value, 10);
        const likeScore = parseInt(likeSlider.value, 10);
        let annotationText = listItem.querySelector('.editable').textContent;

        annotationText = annotationText.replace(/\s+/g, ' ').trim();

        str += createAnnotationNode(id, annotateId, annotationText, confScore, likeScore, neo4jImportId) + "\n";
        id++;
        annotateId++;
        neo4jImportId++;
    });

    // Creating relationships
    let relId = 0;
    keywords.forEach(keyword => {
        str += createKeyTermRelation(relId, neo4jImportId) + "\n";
        relId++;
        neo4jImportId++;
    });

    nonEmptyAnnotations.forEach(annotation => {
        str += createAnnotationRelation(relId, neo4jImportId) + "\n";
        relId++;
        neo4jImportId++;
    });

    // Creating download link
    var blob = new Blob([str], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function createDocNode() {
    const docNode = {
        type: "node",
        id: "0",
        // neo4jImportId: "0",
        labels: ["Node"],
        properties: { name: "Document Node", id: "DocNode", type: "document" }
    };
    return JSON.stringify(docNode);
}

function createKeyTermNode(id, keyword, neo4jImportId) {
    const keyTermNode = {
        type: "node",
        id: `${id}`,
        // neo4jImportId: `${neo4jImportId}`,
        labels: ["Node"],
        properties: { name: "Key Term Node", id: keyword, type: "Key Term"}
    };
    return JSON.stringify(keyTermNode);
}

function createAnnotationNode(id, annotateId, annotation, confidenceVal, likelihoodVal, neo4jImportId) {
    const annotationNode = {
        type: "node",
        id: `${id}`,
        // neo4jImportId: `${neo4jImportId}`,
        labels: ["Node"],
        properties: { name: "Annotation Node", data: annotation, id: `S${annotateId}`, confidence: confidenceVal, likelihood: likelihoodVal, type: "Annotation"}
    };
    return JSON.stringify(annotationNode);
}

function createKeyTermRelation(id, neo4jImportId) {
    const keyTermRelation = {
        type: "relationship",
        id: `${id}`,
        // neo4jImportId: `${neo4jImportId}`,
        label: "Key Term",
        start: { id: `${id+1}`, labels: ["Node"] },
        end: { id: "0", labels: ["Node"] }
    };
    return JSON.stringify(keyTermRelation);
}

function createAnnotationRelation(id, neo4jImportId) {
    const keyTermRelation = {
        type: "relationship",
        id: `${id}`,
        // neo4jImportId: `${neo4jImportId}`,
        label: "Annotation",
        start: { id: `${id+1}`, labels: ["Node"] },
        end: { id: "0", labels: ["Node"] }
    };
    return JSON.stringify(keyTermRelation);
}
