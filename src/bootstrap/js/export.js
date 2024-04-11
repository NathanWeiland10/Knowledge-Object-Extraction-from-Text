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
    keywords.forEach(keyword => {
        str += createKeyTermNode(id, keyword) + "\n";
        id++;
    });

    let annotateId = 1;
    nonEmptyAnnotations.forEach(annotation => {
        str += createAnnotationNode(id, annotateId, annotation, 100, 100) + "\n"; // TODO
        id++;
        annotateId++;
    });

    // Creating relationships
    let relId = 0;
    keywords.forEach(keyword => {
        str += createKeyTermRelation(relId) + "\n";
        relId++;
    });

    nonEmptyAnnotations.forEach(annotation => {
        str += createAnnotationRelation(relId) + "\n";
        relId++;
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
        labels: ["Node"],
        properties: { name: "Document Node", id: "DocNode", type: "document" }
    };
    return JSON.stringify(docNode);
}

function createKeyTermNode(id, keyword) {
    const keyTermNode = {
        type: "node",
        id: `${id}`,
        labels: ["Node"],
        properties: { name: "Key Term Node", id: keyword, type: "Key Term"}
    };
    return JSON.stringify(keyTermNode);
}

function createAnnotationNode(id, annotateId, annotation, confidenceVal, likelihoodVal) {
    const annotationNode = {
        type: "node",
        id: `${id}`,
        labels: ["Node"],
        properties: { name: "Annotation Node", data: annotation, confidence: confidenceVal, likelihood: likelihoodVal, id: `S${annotateId}`, type: "Annotation"}
    };
    return JSON.stringify(annotationNode);
}

function createKeyTermRelation(id) {
    const keyTermRelation = {
        id: `${id}`,
        type: "relationship",
        label: "Key Term",
        start: { id: `${id+1}`, labels: ["Node"] },
        end: { id: "0", labels: ["Node"] }
    };
    return JSON.stringify(keyTermRelation);
}

function createAnnotationRelation(id) {
    const keyTermRelation = {
        id: `${id}`,
        type: "relationship",
        label: "Annotation",
        start: { id: `${id+1}`, labels: ["Node"] },
        end: { id: "0", labels: ["Node"] }
    };
    return JSON.stringify(keyTermRelation);
}
