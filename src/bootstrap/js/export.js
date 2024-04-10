function exportData() {

    const annotationsHTML = document.getElementById('annotations');
    const keywordsHTML = document.getElementById('textOutput');

    const annotations = Array.from(annotationsHTML.children).map(item => item.textContent.trim());
    const nonEmptyAnnotations = annotations.filter(text => text !== "");

    const keywords = Array.from(keywordsHTML.children).map(item => item.textContent.trim());

    // Creating nodes
    let str = "";
    str += createDocNode() + "\n"; // id = 0
    str += createHeadKeyTermsNode() + "\n"; // id = 1
    str += createHeadAnnotationsNode() + "\n"; // id = 2

    let id = 3;
    keywords.forEach(keyword => {
        str += createKeyTermNode(id, keyword) + "\n";
        id++;
    });

    let annotateId = 1;
    nonEmptyAnnotations.forEach(annotation => {
        str += createAnnotationNode(id, annotateId, annotation) + "\n";
        id++;
        annotateId++;
    });

    // Creating relationships
    str += createHeadKeyTermsRelation() + "\n";
    str += createHeadAnnotationsRelation() + "\n";

    let relId = 2;
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

function createHeadKeyTermsNode() {
    const headKeyTermsNode = {type: "node",
        id: "1",
        labels: ["Node"],
        properties: { name: "Key Terms Host Node", id: "KTHostNode", type: "HostNode"}
    };
    return JSON.stringify(headKeyTermsNode);
}

function createHeadAnnotationsNode() {
    const headAnnotationsNode = {
        type: "node",
        id: "2",
        labels: ["Node"],
        properties: { name: "Annotating Host Node", id: "AHostNode", type: "HostNode"}
    };
    return JSON.stringify(headAnnotationsNode);
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

function createAnnotationNode(id, annotateId, annotation) {
    const annotationNode = {
        type: "node",
        id: `${id}`,
        labels: ["Node"],
        properties: { name: "Annotation Node", data: annotation, id: `S${annotateId}`, type: "Annotation"}
    };
    return JSON.stringify(annotationNode);
}

function createHeadKeyTermsRelation() {
    const headKeyTermsRelation = {
        id: "0",
        type: "relationship",
        label: "Document Key Terms",
        start: { id: "1", labels: ["Node"] },
        end: { id: "0", labels: ["Node"] }
    };
    return JSON.stringify(headKeyTermsRelation);
}

function createHeadAnnotationsRelation() {
    const headAnnotationsRelation = {
        id: "1",
        type: "relationship",
        label: "Document Annotations",
        start: { id: "2", labels: ["Node"] },
        end: { id: "0", labels: ["Node"] }
    };
    return JSON.stringify(headAnnotationsRelation);
}

function createKeyTermRelation(id) {
    const keyTermRelation = {
        id: `${id}`,
        type: "relationship",
        label: "Key Term",
        start: { id: `${id+1}`, labels: ["Node"] },
        end: { id: "1", labels: ["Node"] }
    };
    return JSON.stringify(keyTermRelation);
}

function createAnnotationRelation(id) {
    const keyTermRelation = {
        id: `${id}`,
        type: "relationship",
        label: "Annotation",
        start: { id: `${id+1}`, labels: ["Node"] },
        end: { id: "2", labels: ["Node"] }
    };
    return JSON.stringify(keyTermRelation);
}
