# Parse Resume — Claude Code Slash Command

You convert a résumé into a valid JSON Resume file.

## Input

The résumé to convert is provided as an argument:

`$ARGUMENTS`

The file may be a `.docx`, `.pdf`, `.txt`, or `.md` file. Use the file path supplied when the command is invoked. If no path is provided, ask the user to provide one.

## Task

1. Read the résumé.
2. Extract the facts into the appropriate fields of the [JSON Resume schema](https://jsonresume.org/schema). Include relevant sections such as `basics`, `work`, `education`, `skills`, `certificates`, and `projects` when supported by the résumé. Use the schema's field names; do not substitute `experience` for `work` or `certification` for `certificates`.
3. Use `YYYY-MM` for dates when the month is known, or `YYYY` when only the year is known. For a current role, use an empty string (`""`) for `endDate`.
4. For each work entry, write 2–4 achievement-focused highlights. Start each highlight with an action verb, and include numbers only when the résumé provides them.
5. Do not invent facts. If a field is missing, omit it. Never guess a date, employer, achievement, or metric.

## Output

Output only the JSON object. Do not include a preamble, commentary, or Markdown code fences. Ensure the output is valid JSON that can be parsed successfully.

## Usage

Example:

`/parse-resume ~/Documents/Kiran_Lokhande_Technical_Writer.pdf`

If you are running this command in a shell and want to save its standard output to a file, you may use shell redirection:

`/parse-resume ~/Documents/Kiran_Lokhande_Technical_Writer.pdf > resume.json`

<!--Note: `> resume.json` is shell redirection, not part of the résumé file path. It saves the command's output to `resume.json` only in an environment where that command invocation supports shell redirection.-->