# Agent Prompt — Replace Placeholder TA Names with Report Names

Update the Time Stats import feature so the UI displays the **actual TA names contained in the uploaded Time Stats Excel report** instead of placeholder/fake names.

## Requirements

* Read `ta_name` from the imported Excel report.
* When an imported row is successfully matched to a TA using `i_number`, display the name from the report in the appropriate Time Stats UI.
* Replace any current placeholder names used during development.
* Continue using `i_number` as the primary identifier for matching records. **Do not match records by name.**
* Keep the TA name associated with the same `i_number` across all imported sheets.
* Do not modify hours, percentages, statuses, dates, or other KPI calculations.
* Do not create duplicate TA records.
* If a TA cannot be matched, display the name from the report in the **Unmatched TAs** section so the supervisor can identify the record.
* Do not automatically create a new TA from an unmatched report entry.

Example:

```text
Report:
i_number: 123456789
ta_name: John Smith

Database:
i_number: 123456789

Result:
John Smith → matched TA record
```

Review the existing Time Stats importer before making changes and reuse the current parsing, matching, and database architecture. This update should only replace development placeholder names with the real names provided by the imported report.
