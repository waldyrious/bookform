// Handle form submission
function handleFormSubmit(event) {
    // Stop form submission from refreshing the page
    // (and therefore allow JavaScript to handle the form data)
    event.preventDefault();

    // Collect form data
    const formFields = {
        title: document.getElementById('title').value.trim(),
        authorName: document.getElementById('author-name').value.trim(),
        year: document.getElementById('year').value.trim(),
        isbn: document.getElementById('isbn').value.trim(),
        publisher: document.getElementById('publisher').value.trim(),
        language: document.getElementById('language').value.trim(),
    };

    // Generate QuickStatements from the form data
    const quickStatements = generateQuickStatements(formFields);

    // Place the generated commands into the text area
    const commandsContainer = document.getElementById('quickstatements-commands');
    commandsContainer.innerHTML = quickStatements;

    // Unhide the results section and scroll it into view
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Generate QuickStatements to create the relevant Wikidata items
function generateQuickStatements(formFields) {
    let statements = [];

    // First, the author item
    statements.push('CREATE');
    statements.push(`LAST|Len|"${formFields.authorName}"`); // Label in English
    statements.push(`LAST|Den|"Writer"`); // Description in English
    statements.push(`LAST|P31|Q5`); // Instance of human
    statements.push(`LAST|P106|Q36180`); // Occupation: writer

    // Second, the work item
    statements.push('');
    statements.push('CREATE');
    statements.push(`LAST|Len|"${formFields.title}"`); // Label in English
    statements.push(`LAST|Den|"Book by ${formFields.authorName}"`); // Description in English
    statements.push(`LAST|P31|Q47461344`); // Instance of written work
    statements.push(`LAST|P1476|en:"${formFields.title}"`); // Title statement
    statements.push(`LAST|P50|LAST2`); // Author (the item created above — NOT YET SUPPORTED BY QS3!)

    // Finally, the edition item
    statements.push('');
    statements.push('CREATE');
    statements.push(`LAST|Len|"${formFields.title}" (Edition)`); // Label in English
    statements.push(`LAST|Den|"Edition of ${formFields.title}"`); // Description in English
    statements.push(`LAST|P31|Q3331189`); // Instance of version, edition or translation
    statements.push(`LAST|P629|LAST2`); // Edition of the work item created above (NOT YET SUPPORTED BY QS3!)
    if (formFields.year) statements.push(`LAST|P577|+${formFields.year}-00-00T00:00:00Z/9`); // Publication date with precision to year
    if (formFields.isbn) statements.push(`LAST|P212|"${formFields.isbn}"`); // ISBN-13

    return statements.join('\n');
}

// Copy generated QuickStatements to clipboard
function copyToClipboard() {
    const contentDiv = document.getElementById('result');
    const quickStatements = contentDiv.querySelector('pre').textContent;

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(quickStatements)
        .then(() => {
            // Show a temporary "Copied!" message
            const copyButton = document.getElementById('copy-button');
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';

            // Reset button text after 2 seconds
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        })
}
