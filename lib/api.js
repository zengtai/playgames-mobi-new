import fs from "fs";
import path from "path";

import {
  SELECTED_GAMES,
  EXCLUDED_GAMES,
  ICON_PATH,
  GAME_PATH,
  MODE,
} from "./constants";

function toTitle(name) {
  return name
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/3 D/g, " 3D")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2");
}

function toSlug(name) {
  return name.replace(/\s+/g, "-").toLowerCase();
}

function toFixCategoryName(name) {
  let fixedName = name.toLowerCase() == "puzzles" ? "Puzzle" : name;

  return fixedName
    .trim()
    .toLowerCase()
    .replace(/^\S/, (s) => s.toUpperCase());
}

function formatData(data) {
  console.log(`Format data start`);
  let sourceData = data.slice();

  let fullData = [];
  let basicData = [];
  let categories = new Set();

  sourceData.sort((a, b) => (new Date(a.time) < new Date(b.time) ? 1 : -1));

  if (SELECTED_GAMES.length) {
    sourceData = sourceData.filter((game) =>
      SELECTED_GAMES.includes(game.name)
    );
  }

  if (EXCLUDED_GAMES.length) {
    sourceData = sourceData.filter((game) =>
      EXCLUDED_GAMES.includes(game.name)
    );
  }

  sourceData.map((game) => {
    let basicItem = {
      id: game.id,
      title: toTitle(game.name),
      slug: toSlug(toTitle(game.name)),
      category: toFixCategoryName(game.category),
      thumbnailUrl: `${ICON_PATH}webp/${game.name}.webp`,
    };
    basicData.push(basicItem);

    let fullItem = Object.assign({}, basicItem);
    fullItem.description = game.description;
    fullItem.creation_date = new Date(game.time).toISOString();
    fullItem.url = `${GAME_PATH}${game.name}`;
    fullData.push(fullItem);

    categories.add(toFixCategoryName(game.category));
    let categories = [...categories];
    categories.sort();

    categories.forEach((category) => {
      let gamesByCategory = basicData
        .filter((game) => game.category == category)
        .map((game) => game.slug);
      let tmp = {
        category: category,
        total: gamesByCategory.length,
        data: gamesByCategory.slice(0, 6),
      };

      dataForHome.push(tmp);
    });

    return {
      dataForHome,
      fullData,
      basicData,
      categories,
    };
  });
}

export async function getRemoteData() {
  const remoteData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`).then(
    async (res) => ({
      data: await res.json().then((res) => formatData(res.gamelist)),
      contentLength: res.headers.get(`content-length`),
    })
  );
  console.log(`Get remote data`);
  return remoteData;
}

export async function getRemoteContentLength() {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}`).then((res) =>
    res.headers.get(`content-length`)
  );
}

export const getLocalData = async (type, slug) => {
  const localDataPath = path.join(process.cwd(), `data`, `games.json`);
  try {
    if (!fs.existsSync(localDataPath)) {
      console.log(`no local data`);
      let remoteData = await getRemoteData();

      fs.writeFileSync(localDataPath, JSON.stringify(remoteData));
    } else {
      if (MODE && MODE == `renew`) {
        let remoteData = await getRemoteData();

        console.log(`renew data`);
        fs.writeFileSync(localDataPath, JSON.stringify(remoteData));
      }
      // let remoteContentLength = await getRemoteContentLength();
      // if (
      //   JSON.parse(fs.readFileSync(localDataPath)).contentLength !==
      //   remoteContentLength
      // ) {
      //   let remoteData = await getRemoteData();
      //   console.log(
      //     `renew now: remote -`,
      //     remoteContentLength,
      //     ` vs local - `,
      //     JSON.parse(fs.readFileSync(localDataPath)).contentLength
      //   );
      //   console.log(`renew data`);
      //   fs.writeFileSync(localDataPath, JSON.stringify(remoteData));
      // }
    }
    let localData = JSON.parse(fs.readFileSync(localDataPath));
    switch (type) {
      case `category`:
        return slug
          ? {
              category: localData.data.categories.find(
                (item) => item.slug === slug
              ).name,
              data: localData.data.basicData
                .filter((item) => item.category.slug === slug)
                .map((item) => {
                  let tmp = Object.assign({}, item);
                  delete tmp.category;
                  return tmp;
                }),
            }
          : localData.data.categories;
      case `game`:
        let slugs = localData.data.basicData.map((item) => item.slug);
        return slug
          ? {
              data: localData.data.fullData.find((item) => item.slug === slug),
              related: localData.data.basicData
                .filter((item) => item.slug !== slug)
                .slice(0, 56),
            }
          : slugs;
      default:
        return localData;
    }
    // return data;
  } catch (error) {
    console.error(error);
  }
};

export const getTitleBySlug = (slug) => {
  let words = slug.replace(/3d/g, "3D").split("-");
  return words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const getPathByTypeAndSlug = (type, slug) => {
  switch (type) {
    case `category`:
      return `/category/${slug}`;
    default:
    case `game`:
      return `/game/${slug}`;
  }
};

export const getThumbnaiUrlBySlug = (slug) => {
  return `${ICON_PATH}webp/${slug}.webp`;
};

export const getListDataBySlugs = (slugs) => {
  let data = [];

  slugs.map((slug) => {
    let tmp = {
      title: getTitleBySlug(slug),
      slug: slug,
      thumbnailUrl: getThumbnaiUrlBySlug(slug),
    };
    data.push(tmp);
  });

  return data;
};

export const getGameUrlBySlug = (slug) => {
  return `${GAME_PATH}${slug}`;
};
