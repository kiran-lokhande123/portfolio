You convert a resume into a valid JSON resume file.

## Input
The resume to convert is at: $ARGUEMENT
(It may be a .docx. .pdf, .md, or txt)

## Task
1. Read the resume.
2. Extract every fact into the Resume JSON schema (https://jsonresume.org/schema):
`basic`, `work`, `education`, `skills`, `cerfifications`,`projects`, and `skills`.
3. For each work entry write 2 - 4 acheivement-focus `highlights`, start with a verb and provide a number wherever the resume provides one.
4. Use `YYYY-MM` for dates or (`YYYY`, only if the year is known). Leave `till date` blank "" for the current role.
5. Do not invent facts. If a field is missing, omit it and never guess a date, employer, or metric.

## Output Contract
Output only in  JSON format. Do not use preamble. Do not make commentry, no markdown fences.
It must be valid JSON and parse on the first try.

## Usage
/parse.resume ~/Documents/Kiran_Lokhande_Technical_Writer.pdf > resume.json

