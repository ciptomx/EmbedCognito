// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Make tool cards clickable to show/hide content
    const toolCards = document.querySelectorAll('.tool-card h3');
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolCard = this.closest('.tool-card');
            toolCard.classList.toggle('active');
        });
    });

    // File upload handling for Word to HTML converter
    const wordFileInput = document.getElementById('word-file');
    if (wordFileInput) {
        wordFileInput.addEventListener('change', handleWordFileUpload);
    }

    // Auto-expand textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoResize);
    });
});

// Auto-resize textareas
function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

// Handle Word file upload
function handleWordFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('word-input').value = content;
        autoResize.call(document.getElementById('word-input'));
    };
    reader.readAsText(file);
}

// Word to HTML Converter
function convertWordToHtml() {
    const input = document.getElementById('word-input').value.trim();
    if (!input) {
        showMessage('Please enter some text to convert', 'error');
        return;
    }

    const btn = event.target;
    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate processing time
    setTimeout(() => {
        try {
            let html = input
                // Convert line breaks to paragraphs
                .split('\n\n')
                .filter(paragraph => paragraph.trim())
                .map(paragraph => `<p>${paragraph.trim()}</p>`)
                .join('\n');

            // Convert single line breaks to <br> tags
            html = html.replace(/\n/g, '<br>');

            // Convert basic formatting
            html = html
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                .replace(/__(.*?)__/g, '<u>$1</u>') // Underline
                .replace(/~~(.*?)~~/g, '<del>$1</del>'); // Strikethrough

            // Convert headers
            html = html
                .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                .replace(/^# (.*?)$/gm, '<h1>$1</h1>');

            // Convert lists
            html = html
                .replace(/^\- (.*?)$/gm, '<li>$1</li>')
                .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>');

            // Wrap consecutive list items in ul/ol tags
            html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
                if (match.includes('<li>')) {
                    return `<ul>${match}</ul>`;
                }
                return match;
            });

            document.getElementById('html-output').value = html;
            showMessage('Successfully converted to HTML!', 'success');
        } catch (error) {
            showMessage('Error converting to HTML: ' + error.message, 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }, 500);
}

// HTML to Markdown Converter
function convertHtmlToMarkdown() {
    const input = document.getElementById('html-input').value.trim();
    if (!input) {
        showMessage('Please enter HTML code to convert', 'error');
        return;
    }

    const btn = event.target;
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        try {
            // Create a temporary DOM element to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = input;

            let markdown = '';

            // Convert HTML elements to Markdown
            const elements = tempDiv.childNodes;
            elements.forEach(element => {
                markdown += convertElementToMarkdown(element);
            });

            // Clean up the markdown
            markdown = markdown
                .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
                .replace(/^\s+|\s+$/g, ''); // Trim whitespace

            document.getElementById('markdown-output').value = markdown;
            showMessage('Successfully converted to Markdown!', 'success');
        } catch (error) {
            showMessage('Error converting to Markdown: ' + error.message, 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }, 500);
}

// Helper function to convert HTML elements to Markdown
function convertElementToMarkdown(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        return element.textContent;
    }

    if (element.nodeType === Node.ELEMENT_NODE) {
        const tagName = element.tagName.toLowerCase();
        const content = element.textContent || '';

        switch (tagName) {
            case 'h1':
                return `# ${content}\n\n`;
            case 'h2':
                return `## ${content}\n\n`;
            case 'h3':
                return `### ${content}\n\n`;
            case 'h4':
                return `#### ${content}\n\n`;
            case 'h5':
                return `##### ${content}\n\n`;
            case 'h6':
                return `###### ${content}\n\n`;
            case 'p':
                return `${content}\n\n`;
            case 'br':
                return '\n';
            case 'strong':
            case 'b':
                return `**${content}**`;
            case 'em':
            case 'i':
                return `*${content}*`;
            case 'u':
                return `__${content}__`;
            case 'del':
            case 's':
                return `~~${content}~~`;
            case 'code':
                return `\`${content}\``;
            case 'pre':
                return `\`\`\`\n${content}\n\`\`\`\n\n`;
            case 'blockquote':
                return `> ${content}\n\n`;
            case 'ul':
                const ulItems = Array.from(element.querySelectorAll('li'));
                return ulItems.map(item => `- ${item.textContent}`).join('\n') + '\n\n';
            case 'ol':
                const olItems = Array.from(element.querySelectorAll('li'));
                return olItems.map((item, index) => `${index + 1}. ${item.textContent}`).join('\n') + '\n\n';
            case 'li':
                return element.textContent;
            case 'a':
                const href = element.getAttribute('href') || '';
                return `[${content}](${href})`;
            case 'img':
                const src = element.getAttribute('src') || '';
                const alt = element.getAttribute('alt') || '';
                return `![${alt}](${src})`;
            default:
                return content;
        }
    }

    return '';
}

// HTML to BBCode Converter
function convertHtmlToBBCode() {
    const input = document.getElementById('html-bbcode-input').value.trim();
    if (!input) {
        showMessage('Please enter HTML code to convert', 'error');
        return;
    }

    const btn = event.target;
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        try {
            // Create a temporary DOM element to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = input;

            let bbcode = '';

            // Convert HTML elements to BBCode
            const elements = tempDiv.childNodes;
            elements.forEach(element => {
                bbcode += convertElementToBBCode(element);
            });

            // Clean up the BBCode
            bbcode = bbcode
                .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
                .replace(/^\s+|\s+$/g, ''); // Trim whitespace

            document.getElementById('bbcode-output').value = bbcode;
            showMessage('Successfully converted to BBCode!', 'success');
        } catch (error) {
            showMessage('Error converting to BBCode: ' + error.message, 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }, 500);
}

// Helper function to convert HTML elements to BBCode
function convertElementToBBCode(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        return element.textContent;
    }

    if (element.nodeType === Node.ELEMENT_NODE) {
        const tagName = element.tagName.toLowerCase();
        const content = element.textContent || '';

        switch (tagName) {
            case 'h1':
                return `[size=6]${content}[/size]\n\n`;
            case 'h2':
                return `[size=5]${content}[/size]\n\n`;
            case 'h3':
                return `[size=4]${content}[/size]\n\n`;
            case 'h4':
                return `[size=3]${content}[/size]\n\n`;
            case 'h5':
                return `[size=2]${content}[/size]\n\n`;
            case 'h6':
                return `[size=1]${content}[/size]\n\n`;
            case 'p':
                return `${content}\n\n`;
            case 'br':
                return '\n';
            case 'strong':
            case 'b':
                return `[b]${content}[/b]`;
            case 'em':
            case 'i':
                return `[i]${content}[/i]`;
            case 'u':
                return `[u]${content}[/u]`;
            case 'del':
            case 's':
                return `[s]${content}[/s]`;
            case 'code':
                return `[code]${content}[/code]`;
            case 'pre':
                return `[code]${content}[/code]\n\n`;
            case 'blockquote':
                return `[quote]${content}[/quote]\n\n`;
            case 'ul':
                const ulItems = Array.from(element.querySelectorAll('li'));
                return ulItems.map(item => `[*]${item.textContent}`).join('\n') + '\n\n';
            case 'ol':
                const olItems = Array.from(element.querySelectorAll('li'));
                return olItems.map((item, index) => `[${index + 1}]${item.textContent}`).join('\n') + '\n\n';
            case 'li':
                return element.textContent;
            case 'a':
                const href = element.getAttribute('href') || '';
                return `[url=${href}]${content}[/url]`;
            case 'img':
                const src = element.getAttribute('src') || '';
                const alt = element.getAttribute('alt') || '';
                return `[img]${src}[/img]`;
            case 'color':
                const color = element.getAttribute('color') || 'black';
                return `[color=${color}]${content}[/color]`;
            case 'center':
                return `[center]${content}[/center]`;
            case 'right':
                return `[right]${content}[/right]`;
            default:
                return content;
        }
    }

    return '';
}

// Blockquote Generator
function generateBlockquote() {
    const quote = document.getElementById('quote-input').value.trim();
    const author = document.getElementById('quote-author').value.trim();
    const source = document.getElementById('quote-source').value.trim();

    if (!quote) {
        showMessage('Please enter a quote', 'error');
        return;
    }

    const btn = event.target;
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        try {
            let html = '<blockquote class="custom-blockquote">\n';
            html += `  <p class="quote-text">${escapeHtml(quote)}</p>\n`;
            
            if (author || source) {
                html += '  <footer class="quote-footer">\n';
                if (author) {
                    html += `    <cite class="quote-author">— ${escapeHtml(author)}</cite>\n`;
                }
                if (source) {
                    html += `    <span class="quote-source">, ${escapeHtml(source)}</span>\n`;
                }
                html += '  </footer>\n';
            }
            
            html += '</blockquote>';

            // Update preview
            const preview = document.getElementById('blockquote-preview');
            preview.innerHTML = quote;
            if (author) {
                preview.innerHTML += `<br><small>— ${author}</small>`;
            }
            if (source) {
                preview.innerHTML += `<br><small>${source}</small>`;
            }

            // Update output
            document.getElementById('blockquote-output').value = html;
            showMessage('Blockquote generated successfully!', 'success');
        } catch (error) {
            showMessage('Error generating blockquote: ' + error.message, 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }, 500);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;

    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showMessage('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy function
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showMessage('Copied to clipboard!', 'success');
    } catch (err) {
        showMessage('Failed to copy to clipboard', 'error');
    }

    document.body.removeChild(textArea);
}

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            messageDiv.style.background = '#27ae60';
            break;
        case 'error':
            messageDiv.style.background = '#e74c3c';
            break;
        case 'warning':
            messageDiv.style.background = '#f39c12';
            break;
        default:
            messageDiv.style.background = '#3498db';
    }

    // Add to page
    document.body.appendChild(messageDiv);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add some sample data for demonstration
function loadSampleData() {
    // Sample Word content
    const sampleWord = `# Sample Document

This is a **sample document** that demonstrates the Word to HTML converter.

## Features
- Easy conversion
- Multiple formats supported
- Clean output

## How to use
1. Paste your content
2. Click convert
3. Copy the HTML

*Simple and effective!*`;

    // Sample HTML
    const sampleHtml = `<h1>Sample HTML</h1>
<p>This is a <strong>sample HTML</strong> document.</p>
<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>
<blockquote>This is a quote</blockquote>`;

    // Sample quote
    const sampleQuote = "The only way to do great work is to love what you do.";

    // Load samples if fields are empty
    if (!document.getElementById('word-input').value) {
        document.getElementById('word-input').value = sampleWord;
    }
    if (!document.getElementById('html-input').value) {
        document.getElementById('html-input').value = sampleHtml;
    }
    if (!document.getElementById('html-bbcode-input').value) {
        document.getElementById('html-bbcode-input').value = sampleHtml;
    }
    if (!document.getElementById('quote-input').value) {
        document.getElementById('quote-input').value = sampleQuote;
    }
    if (!document.getElementById('quote-author').value) {
        document.getElementById('quote-author').value = "Steve Jobs";
    }
}

// Load sample data when page loads
document.addEventListener('DOMContentLoaded', loadSampleData);