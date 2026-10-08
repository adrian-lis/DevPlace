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


async function loadGitHub() {

    try {

        /*
         * User
         */

        const userResponse =
            await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}`
            );

        const user =
            await userResponse.json();


        followersElement.textContent =
            user.followers;


        /*
         * Repositories
         */

        const repositoriesResponse =
            await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
            );

        const repositories =
            await repositoriesResponse.json();


        repositoriesElement.textContent =
            repositories.length;


        /*
         * Stars
         */

        let stars = 0;

        for (const repository of repositories) {

            stars +=
                repository.stargazers_count;

        }

        starsElement.textContent =
            stars;


        /*
         * Latest activity
         */

        if (repositories.length > 0) {

            const latest =
                repositories
                    .sort(
                        (a, b) =>
                            new Date(b.pushed_at) -
                            new Date(a.pushed_at)
                    )[0];


            const date =
                new Date(latest.pushed_at);


            const formattedDate =
                new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).format(date);


            activityElement.innerHTML = `
                <strong>
                    Latest activity
                </strong>

                <a
                    href="${latest.html_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${latest.name}
                </a>

                <span>
                    Updated ${formattedDate}
                </span>
            `;

        } else {

            activityElement.textContent =
                "No public repositories.";

        }


        /*
         * Contributors
         */

        const contributorsResponse =
            await fetch(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contributors`
            );

        const contributors =
            await contributorsResponse.json();


        if (
            Array.isArray(contributors) &&
            contributors.length > 0
        ) {

            contributorsElement.innerHTML =
                contributors
                    .map(
                        contributor => `
                            <a
                                href="${contributor.html_url}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${contributor.login}
                            </a>
                        `
                    )
                    .join(", ");

        } else {

            contributorsElement.textContent =
                "No contributors found.";

        }


        /*
         * Languages
         */

        const languagesResponse =
            await fetch(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/languages`
            );

        const languages =
            await languagesResponse.json();


        const languageEntries =
            Object.entries(languages);


        if (languageEntries.length > 0) {

            const total =
                languageEntries.reduce(
                    (sum, [, bytes]) =>
                        sum + bytes,
                    0
                );


            languagesElement.innerHTML =
                languageEntries
                    .sort(
                        (a, b) =>
                            b[1] - a[1]
                    )
                    .map(
                        ([language, bytes]) => {

                            const percentage =
                                (bytes / total) * 100;


                            return `
                                <div class="language-item">
                                    <span>
                                        ${language}
                                    </span>

                                    <span>
                                        ${percentage.toFixed(1)}%
                                    </span>
                                </div>
                            `;
                        }
                    )
                    .join("");

        } else {

            languagesElement.textContent =
                "No language data available.";

        }

    } catch (error) {

        console.error(
            "GitHub API error:",
            error
        );

    }
}


loadGitHub();