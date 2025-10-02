# davidezanchetta
Personal webpage, mostly research- and career-themed.

## Features

- **Dynamic Publications**: Publications are automatically loaded from a BibTeX file (`publications.bib`)
- **BibTeX Support**: Add or update publications by editing the `publications.bib` file
- **Automatic Rendering**: Publications are parsed and displayed automatically on page load
- **Responsive Design**: Clean, academic styling suitable for personal academic webpages
- **Personal Profile Box**: Customizable profile section with picture, bio, and contact information

## How to Customize Your Personal Information

The personal profile box on the homepage displays your picture, bio, and contact information. To customize it:

### 1. Update Your Profile Picture

Replace the `profile.svg` file in the root directory with your own image:
- Supported formats: JPG, PNG, SVG, or any web-compatible image format
- Recommended size: 200x200 pixels (will be displayed as a circle)
- Name your file `profile.svg`, `profile.jpg`, or `profile.png`
- Update the image reference in `index.html` if using a different file name:
  ```html
  <img src="profile.jpg" alt="Your Name">
  ```

### 2. Update Your Bio and Contact Information

Edit the `index.html` file and modify the profile box section:

```html
<section class="profile-box">
    <div class="profile-image">
        <img src="profile.svg" alt="Your Name">
    </div>
    <div class="profile-info">
        <h2>Your Name</h2>
        <p class="profile-title">Your Title/Position</p>
        <p class="profile-bio">Your bio text here...</p>
        <p class="profile-email"><strong>Email:</strong> <a href="mailto:your.email@example.com">your.email@example.com</a></p>
        <div class="profile-links">
            <a href="cv.pdf" target="_blank">CV</a>
            <a href="https://github.com/yourusername" target="_blank">GitHub</a>
        </div>
    </div>
</section>
```

**Fields you can customize:**
- **Name** (`<h2>` tag): Your full name
- **Title** (`profile-title` class): Your professional title or position
- **Bio** (`profile-bio` class): A brief description of your research interests or background
- **Email** (`profile-email` class): Your contact email address
- **Links** (`profile-links` div): Add or modify links to your CV, GitHub, or other profiles

### 3. Add Additional Links or Information

You can add more links to the profile box by adding additional `<a>` tags inside the `profile-links` div:

```html
<div class="profile-links">
    <a href="cv.pdf" target="_blank">CV</a>
    <a href="https://github.com/yourusername" target="_blank">GitHub</a>
    <a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a>
    <a href="https://scholar.google.com/yourprofile" target="_blank">Google Scholar</a>
</div>
```

## How to Update Publications

1. Edit the `publications.bib` file
2. Add or modify BibTeX entries following the standard BibTeX format
3. The publications page will automatically update to reflect changes

**Note**: The BibTeX parser supports flexible formatting. Entries can have closing braces on the same line as the last field or on a new line.

### Supported BibTeX Entry Types
- `@article`: Journal articles
- `@inproceedings`: Conference papers
- Any other standard BibTeX entry type

### Required/Supported Fields
- `author`: List of authors
- `title`: Publication title
- `journal` or `booktitle`: Venue name
- `year`: Publication year
- `abstract`: Brief description (optional)
