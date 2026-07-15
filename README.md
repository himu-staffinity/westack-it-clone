# README on Astro based WeStack-Website

Content:
- GitFiles 
    - GitIgnore
- WebsiteFiles
    - See structure below
- Prompt Templates for assistance when adding new products
    - description_short
    - keywords *(tags)*
    - faq
    - challenge_solution *(extensive product description)*
    - en_de *(Translation prompt EN => DE, including context information on akronym translation)*

## Spelling
### The correct spelling of the company name is:
| Usecase        | Spelling                    |
|----------------|-----------------------------|
| Short          | "WeStack"                   |
| Full           | "WeStack Information Technologies" |
| Full - legal   | "WeStack Information Technologies GmbH" |
| Domain         | "westack-it.eu"             |


## SEO Feedback by Google 

Can be watched [here](https://search.google.com/search-console/index?resource_id=sc-domain%3Awestack-it.eu&hl=en) (Google Console Login for *westack-it.eu* required)


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
