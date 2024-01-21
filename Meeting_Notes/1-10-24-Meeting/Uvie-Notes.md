Project Overview: Matador Intelligence

Client: Jeremy Whiteman - Aerospace Engineer, Supervisor for Wright-Patterson AFB

Main Goal: Accelerate the extraction of "knowledge objects" from documents, enabling users to analyze and organize relevant information efficiently. This involves categorizing data types such as quotes, measurements, facts, and images, assigning confidence and likelihood values, and exporting the data for integration into a knowledge graph.

Program 1 - Document Ingestion and Labeling:
* Acquire documents with metadata (e.g., publisher, author, publish date).
* Allow users to highlight and label pertinent data as quotes, measurements, etc.
* Enable user-defined Likelihood/Confidence/Precision for each labeled item.
* Export the full document and highlighted data in Neo4j, CSV, or XML formats.

Program 2 - Knowledge Graph Integration:
* Process data from Program 1, creating a tree structure for analysis.
* Filter data based on user-defined domains (e.g., job title or user type).
* Evaluate the likelihood, confidence, and precision of data points.
* Implement keyword-based filtering and searching.
