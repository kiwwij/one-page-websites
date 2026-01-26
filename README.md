# 📂 Kiwwij's Project Hub

Welcome to my personal project archive. This is a dynamic "One-Page" portfolio that serves as a central hub for all my development work, experiments, and creative coding projects.

Instead of a static list, this site uses the **GitHub REST API** to automatically fetch, categorize, and display my repositories in real-time.

## ✨ Key Features

* **🚀 Dynamic Project Fetching:** The site connects to my GitHub repository (`my-projects`) to pull the latest `.html` projects automatically.
* **📊 Tech Stack Analytics:** Scans project configurations to generate a live "Skill Meter," allowing users to filter projects by technologies (Python, JavaScript, React, etc.).
* **🔍 Instant Search:** Real-time search functionality to find specific projects by name.
* **🌗 Dark/Light Mode:** Fully responsive theme toggling with system preference detection.
* **🎮 Steam Integration:** Displays my current Steam avatar using a custom fetch implementation.

## 🛠️ How It Works

The core logic lies in `index.js`:
1.  **API Call:** It fetches the file list from the `html/` directory of the repository.
2.  **Configuration:** It cross-references files with `projects.json` to get metadata (custom images, descriptions, and tech stacks).
3.  **Rendering:** DOM elements are generated on the fly, creating cards for each project.
4.  **Statistics:** The script calculates the usage percentage of each programming language across all projects.

## 🚀 Technologies Used

* **Frontend:** HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript (ES6+).
* **Icons:** [Boxicons](https://boxicons.com/).
* **Data Source:** GitHub REST API.
* **Hosting:** GitHub Pages.

---

### 📬 Connect with me
[social links](https://kiwwij.github.io/kiwwij-social-links/)