"use strict";

const GITHUB_USERNAME = "adrian-lis";
const GITHUB_REPOSITORY = "DevPlace";


const repositoriesElement =
    document.getElementById("github-repositories");

const starsElement =
    document.getElementById("github-stars");

const followersElement =
    document.getElementById("github-followers");

const activityElement =
    document.getElementById("github-activity");

const contributorsElement =
    document.getElementById("devplace-contributors");

const languagesElement =
    document.getElementById("devplace-languages");


async function githubRequest(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `GitHub API returned ${response.status}`
        );
    }

    return response.json();
}


async function loadGitHub() {

    /*
     * GitHub profile
     */

    try {

        const user =
            await githubRequest(
                `https://api.github.com/users/${GITHUB_USERNAME}`
            );

        followersElement.textContent =
            user.followers ?? 0;

    } catch (error) {

        console.error(
            "GitHub profile error:",
            error
        );

        followersElement.textContent = "—";
    }


    /*
     * Public repositories
     */

    try {

        const repositories =
            await githubRequest(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&direction=desc`
            );


        /*
         * Repository count
         */

        repositoriesElement.textContent =
            repositories.length;


        /*
         * Stars
         */

        let stars = 0;

        for (const repository of repositories) {

            stars +=
                repository.stargazers_count ?? 0;

        }

        starsElement.textContent =
            stars;


        /*
         * Latest activity
         */

        if (repositories.length === 0) {

            activityElement.textContent =
                "No public repositories.";

        } else {

            const latest =
                repositories[0];

            const date =
                new Date(latest.pushed_at);

            const formattedDate =
                new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).format(date);


            activityElement.innerHTML = `
                <strong>Latest activity</strong>

                <a
                    href="${escapeHtml(latest.html_url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHtml(latest.name)}
                </a>

                <span>
                    Updated ${escapeHtml(formattedDate)}
                </span>
            `;
        }

    } catch (error) {

        console.error(
            "GitHub repositories error:",
            error
        );

        repositoriesElement.textContent = "—";
        starsElement.textContent = "—";

        activityElement.textContent =
            "GitHub activity is currently unavailable.";
    }


    /*
     * Contributors
     */

    try {

        const contributors =
            await githubRequest(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contributors?per_page=100`
            );


        if (
            !Array.isArray(contributors) ||
            contributors.length === 0
        ) {

            contributorsElement.textContent =
                "No contributors found.";

        } else {

            contributorsElement.innerHTML =
                contributors
                    .map(contributor => {

                        return `
                            <a
                                href="${escapeHtml(contributor.html_url)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${escapeHtml(contributor.login)}
                            </a>
                        `;

                    })
                    .join(", ");
        }

    } catch (error) {

        console.error(
            "GitHub contributors error:",
            error
        );

        contributorsElement.textContent =
            "Contributor information is currently unavailable.";
    }


    /*
     * Languages
     */

    try {

        const languages =
            await githubRequest(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/languages`
            );


        const languageEntries =
            Object.entries(languages);


        if (languageEntries.length === 0) {

            languagesElement.textContent =
                "No language data available.";

        } else {

            const totalBytes =
                languageEntries.reduce(
                    (total, [, bytes]) =>
                        total + bytes,
                    0
                );


            languagesElement.innerHTML =
                languageEntries
                    .sort((a, b) => b[1] - a[1])
                    .map(([language, bytes]) => {

                        const percentage =
                            totalBytes > 0
                                ? (bytes / totalBytes) * 100
                                : 0;


                        return `
                            <div class="language-item">

                                <span>
                                    ${escapeHtml(language)}
                                </span>

                                <span>
                                    ${percentage.toFixed(1)}%
                                </span>

                            </div>
                        `;

                    })
                    .join("");
        }

    } catch (error) {

        console.error(
            "GitHub languages error:",
            error
        );

        languagesElement.textContent =
            "Language information is currently unavailable.";
    }
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


loadGitHub();