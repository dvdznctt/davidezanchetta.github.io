// Simple BibTeX parser and renderer
class BibtexParser {
    constructor() {
        this.entries = [];
    }

    // Parse BibTeX content
    parse(bibtexContent) {
        this.entries = [];
        
        // Regular expression to match BibTeX entries
        // Matches from @ to } that's followed by whitespace and either @ or end of string
        const entryRegex = /@(\w+)\{([^,]+),\s*([\s\S]*?)\}(?=\s*(?:@|$))/g;
        let match;

        while ((match = entryRegex.exec(bibtexContent)) !== null) {
            const entryType = match[1];
            const citationKey = match[2];
            const fields = match[3];
            
            const entry = {
                type: entryType,
                key: citationKey,
                fields: this.parseFields(fields)
            };
            
            this.entries.push(entry);
        }
        
        return this.entries;
    }

    // Parse individual fields from BibTeX entry
    parseFields(fieldsText) {
        const fields = {};
        const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
        let match;

        while ((match = fieldRegex.exec(fieldsText)) !== null) {
            const fieldName = match[1].toLowerCase();
            const fieldValue = match[2].trim();
            fields[fieldName] = fieldValue;
        }

        return fields;
    }

    // Render entries as HTML
    renderHTML(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        container.innerHTML = '';

        // Sort entries by year (descending)
        const sortedEntries = this.entries.sort((a, b) => {
            const yearA = parseInt(a.fields.year) || 0;
            const yearB = parseInt(b.fields.year) || 0;
            return yearB - yearA;
        });

        sortedEntries.forEach(entry => {
            const publicationDiv = document.createElement('div');
            publicationDiv.className = 'publication-item';

            // Title
            const title = document.createElement('h3');
            title.textContent = entry.fields.title || 'Untitled';
            publicationDiv.appendChild(title);

            // Authors
            if (entry.fields.author) {
                const authorsP = document.createElement('p');
                authorsP.className = 'authors';
                authorsP.textContent = entry.fields.author;
                publicationDiv.appendChild(authorsP);
            }

            // Venue (journal or booktitle) and year
            const venueP = document.createElement('p');
            venueP.className = 'venue';
            const venue = entry.fields.journal || entry.fields.booktitle || 'Unknown Venue';
            const year = entry.fields.year || 'Unknown Year';
            venueP.textContent = `${venue}, ${year}`;
            publicationDiv.appendChild(venueP);

            // Abstract
            if (entry.fields.abstract) {
                const abstractP = document.createElement('p');
                abstractP.textContent = entry.fields.abstract;
                publicationDiv.appendChild(abstractP);
            }

            container.appendChild(publicationDiv);
        });
    }

    // Load and parse BibTeX file
    async loadFromFile(filepath) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`Failed to load BibTeX file: ${response.statusText}`);
            }
            const bibtexContent = await response.text();
            this.parse(bibtexContent);
            return this.entries;
        } catch (error) {
            console.error('Error loading BibTeX file:', error);
            throw error;
        }
    }
}

// Initialize and load publications when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const parser = new BibtexParser();
    
    try {
        await parser.loadFromFile('publications.bib');
        parser.renderHTML('publications-container');
    } catch (error) {
        console.error('Error loading publications:', error);
        // Display error message to user
        const container = document.getElementById('publications-container');
        if (container) {
            container.innerHTML = '<p style="color: red;">Error loading publications. Please check the console for details.</p>';
        }
    }
});
