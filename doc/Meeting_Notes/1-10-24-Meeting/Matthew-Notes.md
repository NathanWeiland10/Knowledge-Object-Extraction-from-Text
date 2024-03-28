The Matador Project
Jeremy Wightman - Aerospace Engineer Supervisor for Wright-Patterson AFB

Main Goal: Development of a "Knowledge Database"
The view should be similar to Mendeley with an added Likelihood/Confidence/Precision.

Main Set of Steps for Program 1:

1. Acquire document to add to "Database"
	a. This Document should contain Metadata such as Publisher/Author/Publish-Date/etc.
2. Highlight pertinent data
3. Each highlight is labeled with some kind of subset. Ex: Quote, Measurement, Statement, Time-Frame, Fact, Image
4. Some way for the user to define Likelihood/Confidence/Precision Ex: TBD
	a. Should be Flexible/Changeable
	b. Contains metadata Ex: a quote should have who said it
	c. Some way to link back to the original document.
	d. Domain/use case (Possibly User defined? suggest clarification)
	e. He also mentioned "Overall Credibility" which could go here if Likelihood/Confidence/Precision does not already cover that
5. Export the full document and the highlighted pertinent data as one of the three following formats based on user request: Neo4j, CSV, XML
	a. Full Original Document
	b. Each Tagged/Highlighted Text/Image/Label
	c. All associated Metadata

Main Set of Steps for Program 2:
1. Takes in the earlier supplied formats 
2. Create a Tree/multiple Trees from the given data and filter it via a Domain(Job title/What kind of user)
3. Generate/Measure how Likely/Confident/Precise something/or multiple things is/are based on the Likelihood/Confidence/Precision of the given data.
4. filter these down based on the given keywords in a search

		[Example of Program 2]
							Domain
____________
							 __________
							(CEO is Bad)
							 ----------
							      |
							      |
							      |
	___________________________________________________________
	|			|				|
	|		      	|                		|
	|		      	|               		|
	|		      	|                		|
	(ETC) (Destroys Amazon Rainforest)   (On the Epstein List)
						|	|	|
						|	|	|
						|	|	|
						(X1)   (X2)    (X3)


If each X has a Likelihood/Confidence/Precision we can use those to calculate how accurate the parent node is to be Likely/Confident/Precise.
Each Domain would have Multiple of these Trees under them (based on the given search and Domain data.)


If we need to contact the Client:
1st: Discord either message or server chat
2nd/Emergency: Texting for either time-sensitive information or if 2-3 days of no contact via discord messages
