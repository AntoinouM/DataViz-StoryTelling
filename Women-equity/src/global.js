const QuestionMap = new Map();

QuestionMap
    .set(
        "MOBILITY", [
            "Can a woman choose where to live in the same way as a man?",
            "Can a woman travel outside her home in the same way as a man?",
            "Can a women get a passport in the same way as a man?",
            "Can a woman travel outside the country in the same way as a man?"
        ])
    .set(
        "WORKPLACE", [
            "Can a woman get a job in the same way as a man?",
            "Does the law prohibit discrimination in employment based on gender?",
            "Is there legislation on sexual harassment in employment?",
            "Are there criminal penalties or civil remedies for sexual harassment in employment?"
        ])
    .set(
        "PAY", [
            "Does the law mandate equal remuneration for work of equal value?",
            "Can a woman work at night in the same way as a man?",
            "Can a woman work in a job deemed dangerous in the same way as a man?",
            "Can a woman work in an industrial job in the same way as a man?"
        ])
    .set(
        "MARRIAGE", [
            "Is the law free of legal provisions that require a married woman to obey her husband?",
            "Can a woman be head of household in the same way as a man?",
            "Is there legislation specifically addressing domestic violence?",
            "Can a woman obtain a judgment of divorce in the same way as a man?",
            "Does a woman have the same rights to remarry as a man?"]
    )
    .set(
        "PARENTHOOD", [
            "Is paid leave of at least 14 weeks available to mothers?",
            "Length of paid maternity leave;Does the government administer 100% of maternity leave benefits?",
            "Is there paid leave available to fathers?;Length of paid paternity leave?",
            "Is there paid parental leave?",
            "Shared days",
            "Days for the mother",
            "Days for the father",
            "Is dismissal of pregnant workers prohibited?"]
    )
    .set(
        "ENTREPRENEURSHIP", [
            "Does the law prohibit discrimination in access to credit based on gender?",
            "Can a woman sign a contract in the same way as a mam?",
            "Can a woman register a business in the same way as a man?",
            "Can a woman open a bank account in the same way as a man?"]
    )
    .set(
        "ASSETS", [
            "Do men and women have equal ownership rights to immovable property?",
            "Do sons and daughters have equal rights to inherit assets from their parents?",
            "Do male and female surviving spouses have equal rights to inherit assets?",
            "Does the law grant spouses equal administrative authority over assets during marriage?",
            "Does the law provide for the valuation of nonmonetary contributions?"]
    )
    .set(
        "PENSION", [
            "Is the age at which men and women can retire with full pension benefits the same?",
            "Is the age at which men and women can retire with partial pension benefits the same?",
            "Is the mandatory retirement age for men and women the same?",
            "Are periods of absence due to childcare accounted for in pension benefits?"]
    )

    export { QuestionMap };