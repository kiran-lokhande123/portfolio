You convert a resume into a valid JSON Resume file.

## Input

The resume to convert is at: $ARGUMENTS

(It may be a .docx, .pdf, .md, or .txt file.)

## Task

1. Read the resume.
2. Extract every fact into the JSON Resume schema (https://jsonresume.org/schema):
   `basics`, `work`, `education`, `skills`, `certificates`, `projects`.
3. Use `"YYYY-MM"` for dates (or `"YYYY"` if only the year is known).
   Leave `endDate` empty (`""`) for the current role.
4. For each `work` entry, write 2-4 achievement-focused `highlights`. Start each
   with a verb, and include a number wherever the resume provides one.
5. Do not invent facts. If a field is missing, omit it. Never guess a date,
   employer, or metric.

## Output Contract

Output ONLY the JSON object. No preamble, no markdown fences, no commentary.
It must be valid JSON and parse on the first try.

## Usage

```
/parse-resume ~/Documents/Kiran_Lokhande_Technical_Writer.pdf > resume.json
```
