// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.converter-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTool = this.getAttribute('data-tool');
            
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active');
            document.getElementById(targetTool).classList.add('active');
        });
    });

    // Add real-time preview for blockquote generator
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteSource = document.getElementById('quote-source');
    const quoteStyle = document.getElementById('quote-style');

    [quoteText, quoteAuthor, quoteSource, quoteStyle].forEach(element => {
        if (element) {
            element.addEventListener('input', updateBlockquotePreview);
        }
    });
});

// Word to HTML Converter
function convertWordToHtml() {
    const input = document.getElementById('word-input').value;
    const output = document.getElementById('word-output');
    
    if (!input.trim()) {
        showMessage('Please enter some text to convert.', 'error');
        return;
    }

    try {
        // Clean up Word-specific formatting and convert to HTML
        let html = input
            // Replace line breaks with paragraphs
            .split('\n\n')
            .filter(para => para.trim())
            .map(para => {
                para = para.trim();
                
                // Handle headers (lines that are all caps or start with numbers/bullets)
                if (para.match(/^[A-Z\s]+$/) && para.length < 100) {
                    return `<h2>${para}</h2>`;
                }
                
                // Handle numbered lists
                if (para.match(/^\d+\./)) {
                    return `<li>${para.replace(/^\d+\.\s*/, '')}</li>`;
                }
                
                // Handle bullet points
                if (para.match(/^[•·\-\*]/)) {
                    return `<li>${para.replace(/^[•·\-\*]\s*/, '')}</li>`;
                }
                
                // Regular paragraphs
                return `<p>${para}</p>`;
            })
            .join('\n');

        // Wrap consecutive list items in appropriate list tags
        html = html.replace(/(<li>.*<\/li>\n?)+/g, match => {
            const items = match.trim();
            // Check if it's a numbered list (contains numbers)
            if (items.includes('1.') || items.includes('2.')) {
                return `<ol>\n${items}\n</ol>`;
            } else {
                return `<ul>\n${items}\n</ul>`;
            }
        });

        // Handle bold text (words in CAPS or **text**)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\b[A-Z]{2,}\b/g, '<strong>$&</strong>');
        
        // Handle italic text (*text*)
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle links
        html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Clean up extra whitespace
        html = html.replace(/\n\s*\n/g, '\n');
        
        output.value = html;
        showMessage('Successfully converted to HTML!', 'success');
    } catch (error) {
        showMessage('Error converting text: ' + error.message, 'error');
    }
}

// HTML to Markdown Converter
function convertHtmlToMarkdown() {
    const input = document.getElementById('html-input').value;
    const output = document.getElementById('markdown-output');
    
    if (!input.trim()) {
        showMessage('Please enter some HTML to convert.', 'error');
        return;
    }

    try {
        let markdown = input
            // Headers
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
            .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
            .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
            .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
            
            // Bold and italic
            .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**')
            .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*')
            
            // Links
            .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
            
            // Images
            .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
            .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, '![$1]($2)')
            .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
            
            // Code blocks
            .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
            .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
            
            // Blockquotes
            .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
                return content.split('\n').map(line => '> ' + line.trim()).join('\n') + '\n\n';
            })
            
            // Lists
            .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
                return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
            })
            .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
                let counter = 1;
                return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
            })
            
            // Paragraphs
            .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
            
            // Line breaks
            .replace(/<br\s*\/?>/gi, '\n')
            
            // Horizontal rules
            .replace(/<hr[^>]*>/gi, '---\n\n')
            
            // Remove remaining HTML tags
            .replace(/<[^>]*>/g, '')
            
            // Clean up HTML entities
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            
            // Clean up extra whitespace
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();

        output.value = markdown;
        showMessage('Successfully converted to Markdown!', 'success');
    } catch (error) {
        showMessage('Error converting HTML: ' + error.message, 'error');
    }
}

// HTML to BBCode Converter
function convertHtmlToBbcode() {
    const input = document.getElementById('html-bbcode-input').value;
    const output = document.getElementById('bbcode-output');
    
    if (!input.trim()) {
        showMessage('Please enter some HTML to convert.', 'error');
        return;
    }

    try {
        let bbcode = input
            // Headers
            .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '[size=large][b]$1[/b][/size]\n\n')
            
            // Bold and italic
            .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '[b]$2[/b]')
            .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '[i]$2[/i]')
            
            // Underline
            .replace(/<u[^>]*>(.*?)<\/u>/gi, '[u]$1[/u]')
            
            // Strike through
            .replace(/<(s|strike|del)[^>]*>(.*?)<\/(s|strike|del)>/gi, '[s]$2[/s]')
            
            // Links
            .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[url=$1]$2[/url]')
            
            // Images
            .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '[img]$1[/img]')
            
            // Code
            .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '[code]$1[/code]')
            .replace(/<code[^>]*>(.*?)<\/code>/gi, '[code]$1[/code]')
            
            // Blockquotes
            .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '[quote]$1[/quote]')
            
            // Font colors
            .replace(/<span[^>]*color:\s*([^;"]*)[^>]*>(.*?)<\/span>/gi, '[color=$1]$2[/color]')
            .replace(/<font[^>]*color="([^"]*)"[^>]*>(.*?)<\/font>/gi, '[color=$1]$2[/color]')
            
            // Font sizes
            .replace(/<span[^>]*font-size:\s*(\d+)px[^>]*>(.*?)<\/span>/gi, '[size=$1]$2[/size]')
            
            // Lists
            .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '[list]$1[/list]')
            .replace(/<ol[^>]*>(.*?)<\/ol>/gis, '[list=1]$1[/list]')
            .replace(/<li[^>]*>(.*?)<\/li>/gi, '[*]$1\n')
            
            // Paragraphs
            .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
            
            // Line breaks
            .replace(/<br\s*\/?>/gi, '\n')
            
            // Center alignment
            .replace(/<center[^>]*>(.*?)<\/center>/gi, '[center]$1[/center]')
            .replace(/<div[^>]*text-align:\s*center[^>]*>(.*?)<\/div>/gi, '[center]$1[/center]')
            
            // Remove remaining HTML tags
            .replace(/<[^>]*>/g, '')
            
            // Clean up HTML entities
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            
            // Clean up extra whitespace
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();

        output.value = bbcode;
        showMessage('Successfully converted to BBCode!', 'success');
    } catch (error) {
        showMessage('Error converting HTML: ' + error.message, 'error');
    }
}

// Blockquote Generator
function generateBlockquote() {
    const text = document.getElementById('quote-text').value;
    const author = document.getElementById('quote-author').value;
    const source = document.getElementById('quote-source').value;
    const style = document.getElementById('quote-style').value;
    const output = document.getElementById('blockquote-output');
    
    if (!text.trim()) {
        showMessage('Please enter some quote text.', 'error');
        return;
    }

    let result = '';
    
    try {
        switch (style) {
            case 'html':
                result = '<blockquote>\n';
                result += `  <p>${text}</p>\n`;
                if (author || source) {
                    result += '  <cite>';
                    if (author) result += author;
                    if (author && source) result += ', ';
                    if (source) result += `<em>${source}</em>`;
                    result += '</cite>\n';
                }
                result += '</blockquote>';
                break;
                
            case 'markdown':
                result = text.split('\n').map(line => '> ' + line).join('\n');
                if (author || source) {
                    result += '\n>\n> — ';
                    if (author) result += author;
                    if (author && source) result += ', ';
                    if (source) result += `*${source}*`;
                }
                break;
                
            case 'bbcode':
                result = `[quote]${text}`;
                if (author || source) {
                    result += '\n\n— ';
                    if (author) result += author;
                    if (author && source) result += ', ';
                    if (source) result += `[i]${source}[/i]`;
                }
                result += '[/quote]';
                break;
                
            case 'plain':
                result = `"${text}"`;
                if (author || source) {
                    result += '\n\n— ';
                    if (author) result += author;
                    if (author && source) result += ', ';
                    if (source) result += source;
                }
                break;
        }
        
        output.value = result;
        updateBlockquotePreview();
        showMessage('Blockquote generated successfully!', 'success');
    } catch (error) {
        showMessage('Error generating blockquote: ' + error.message, 'error');
    }
}

// Update blockquote preview
function updateBlockquotePreview() {
    const text = document.getElementById('quote-text').value;
    const author = document.getElementById('quote-author').value;
    const source = document.getElementById('quote-source').value;
    const preview = document.getElementById('blockquote-preview');
    
    if (!text.trim()) {
        preview.innerHTML = '<p style="color: #999; font-style: italic;">Enter quote text to see preview</p>';
        return;
    }
    
    let html = '<blockquote>';
    html += `<p>${text}</p>`;
    if (author || source) {
        html += '<cite>';
        if (author) html += author;
        if (author && source) html += ', ';
        if (source) html += `<em>${source}</em>`;
        html += '</cite>';
    }
    html += '</blockquote>';
    
    preview.innerHTML = html;
}

// Utility Functions
function clearInput(inputId) {
    document.getElementById(inputId).value = '';
    if (inputId === 'quote-text') {
        updateBlockquotePreview();
    }
}

function clearQuoteInputs() {
    document.getElementById('quote-text').value = '';
    document.getElementById('quote-author').value = '';
    document.getElementById('quote-source').value = '';
    document.getElementById('blockquote-output').value = '';
    updateBlockquotePreview();
}

async function pasteFromClipboard(inputId) {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById(inputId).value = text;
        showMessage('Text pasted from clipboard!', 'success');
    } catch (error) {
        showMessage('Unable to access clipboard. Please paste manually.', 'error');
    }
}

async function copyToClipboard(outputId) {
    const output = document.getElementById(outputId);
    
    if (!output.value.trim()) {
        showMessage('Nothing to copy!', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(output.value);
        showMessage('Copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        output.select();
        document.execCommand('copy');
        showMessage('Copied to clipboard!', 'success');
    }
}

function downloadResult(outputId, filename) {
    const output = document.getElementById(outputId);
    
    if (!output.value.trim()) {
        showMessage('Nothing to download!', 'error');
        return;
    }
    
    try {
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showMessage('File downloaded successfully!', 'success');
    } catch (error) {
        showMessage('Error downloading file: ' + error.message, 'error');
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the active section
    const activeSection = document.querySelector('.converter-section.active .converter-content');
    if (activeSection) {
        activeSection.insertBefore(messageDiv, activeSection.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to convert
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeSection = document.querySelector('.converter-section.active');
        if (activeSection) {
            const convertBtn = activeSection.querySelector('.convert-btn');
            if (convertBtn) {
                convertBtn.click();
            }
        }
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const activeSection = document.querySelector('.converter-section.active');
        if (activeSection) {
            const clearBtn = activeSection.querySelector('.input-actions button[onclick*="clear"]');
            if (clearBtn) {
                clearBtn.click();
            }
        }
    }
});