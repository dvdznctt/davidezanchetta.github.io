// Simple conference data parser and renderer
class ConferenceParser {
    constructor() {
        this.entries = [];
    }

    // Parse conference data content (simple key: value format)
    parse(content) {
        this.entries = [];
        
        // Split by double newlines to separate entries
        const entryBlocks = content.trim().split(/\n\s*\n/);
        
        entryBlocks.forEach(block => {
            if (block.trim()) {
                const entry = this.parseEntry(block);
                if (entry.name) { // name is mandatory
                    this.entries.push(entry);
                }
            }
        });
        
        return this.entries;
    }

    // Parse individual conference entry
    parseEntry(block) {
        const entry = {
            name: '',
            date: '',
            contributionType: '',
            contributionTitle: '',
            url: ''
        };
        
        const lines = block.split('\n');
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim().toLowerCase();
                const value = line.substring(colonIndex + 1).trim();
                
                if (key === 'name') {
                    entry.name = value;
                } else if (key === 'date') {
                    entry.date = value;
                } else if (key === 'contribution type') {
                    entry.contributionType = value;
                } else if (key === 'contribution title') {
                    entry.contributionTitle = value;
                } else if (key === 'url') {
                    entry.url = value;
                }
            }
        });
        
        return entry;
    }

    // Render entries as HTML
    renderHTML(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        container.innerHTML = '';

        if (this.entries.length === 0) {
            container.innerHTML = '<p>No conferences found.</p>';
            return;
        }

        // Sort entries by date (descending) if dates are present
        const sortedEntries = this.entries.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            
            // Try to parse dates for comparison
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            if (isNaN(dateA) || isNaN(dateB)) {
                return b.date.localeCompare(a.date);
            }
            
            return dateB - dateA;
        });

        sortedEntries.forEach(entry => {
            const conferenceDiv = document.createElement('div');
            conferenceDiv.className = 'publication-item'; // Reuse publication styling

            // Name (mandatory)
            const nameElement = document.createElement('h3');
            if (entry.url) {
                const link = document.createElement('a');
                link.href = entry.url;
                link.target = '_blank';
                link.textContent = entry.name;
                nameElement.appendChild(link);
            } else {
                nameElement.textContent = entry.name;
            }
            conferenceDiv.appendChild(nameElement);

            // Date
            if (entry.date) {
                const dateP = document.createElement('p');
                dateP.className = 'venue';
                dateP.textContent = entry.date;
                conferenceDiv.appendChild(dateP);
            }

            // Contribution Type
            if (entry.contributionType) {
                const typeP = document.createElement('p');
                typeP.className = 'authors';
                typeP.textContent = entry.contributionType;
                conferenceDiv.appendChild(typeP);
            }

            // Contribution Title
            if (entry.contributionTitle) {
                const titleP = document.createElement('p');
                titleP.textContent = entry.contributionTitle;
                conferenceDiv.appendChild(titleP);
            }

            container.appendChild(conferenceDiv);
        });
    }

    // Load and parse conference file
    async loadFromFile(filepath) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`Failed to load conference file: ${response.statusText}`);
            }
            const content = await response.text();
            this.parse(content);
            return this.entries;
        } catch (error) {
            console.error('Error loading conference file:', error);
            throw error;
        }
    }

    // Load all conference files from a directory
    async loadFromDirectory(directory, files) {
        this.entries = [];
        
        for (const file of files) {
            try {
                const filepath = `${directory}/${file}`;
                await this.loadFromFile(filepath);
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
        
        return this.entries;
    }
}

// Initialize and load conferences when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const parser = new ConferenceParser();
    
    try {
        // Load conferences from a single file for simplicity
        await parser.loadFromFile('conferences.txt');
        parser.renderHTML('conferences-container');
    } catch (error) {
        console.error('Error loading conferences:', error);
        // Display error message to user
        const container = document.getElementById('conferences-container');
        if (container) {
            container.innerHTML = '<p style="color: red;">Error loading conferences. Please check the console for details.</p>';
        }
    }
});
